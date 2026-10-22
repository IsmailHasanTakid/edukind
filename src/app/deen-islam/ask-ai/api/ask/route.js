import { NextResponse } from "next/server";
import {
    detectLanguage,
    generateGroundedAnswer,
} from "../../services/answer";
import { retrieveEvidence } from "../../services/retrieval";
import {
    MAX_REQUEST_BYTES,
    validateAskRequest,
} from "../../utils/validation";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateLimitStore = new Map();

function clientKey(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();

    return (
        request.headers.get("x-real-ip")?.trim() ||
        request.headers.get("cf-connecting-ip")?.trim() ||
        "local"
    );
}

function isRateLimited(request) {
    const key = clientKey(request);
    const now = Date.now();
    const recent = (rateLimitStore.get(key) || []).filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );

    if (recent.length >= RATE_LIMIT_MAX) {
        rateLimitStore.set(key, recent);
        return true;
    }

    recent.push(now);
    rateLimitStore.set(key, recent);

    if (rateLimitStore.size > 500) {
        for (const [storedKey, timestamps] of rateLimitStore) {
            if (
                !timestamps.length ||
                now - timestamps[timestamps.length - 1] >
                    RATE_LIMIT_WINDOW_MS * 2
            ) {
                rateLimitStore.delete(storedKey);
            }
        }
    }

    return false;
}

function jsonError(message, status, code) {
    return NextResponse.json(
        {
            ok: false,
            error: message,
            code,
        },
        {
            status,
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}

function providerErrorMessage(error) {
    if (error?.code === "AI_NOT_CONFIGURED" || error?.status === 503) {
        return {
            status: 503,
            code: "AI_NOT_CONFIGURED",
            message:
                "AI সেবাটি এখনো কনফিগার করা হয়নি। সার্ভারে GROQ_API_KEY যোগ করার পর আবার চেষ্টা করুন।",
        };
    }

    if (
        error?.status === 429 ||
        /rate limit|quota/i.test(error?.message || "")
    ) {
        return {
            status: 429,
            code: "AI_RATE_LIMITED",
            message:
                "AI সেবার অনুরোধের সীমা পূর্ণ হয়েছে। একটু অপেক্ষা করে আবার চেষ্টা করুন।",
        };
    }

    if (
        error?.name === "AbortError" ||
        error?.code === "ETIMEDOUT" ||
        /timed? ?out/i.test(error?.message || "")
    ) {
        return {
            status: 504,
            code: "AI_TIMEOUT",
            message:
                "AI সেবা সময়মতো উত্তর দিতে পারেনি। আবার চেষ্টা করুন।",
        };
    }

    if (error?.status === 401 || error?.status === 403) {
        return {
            status: 502,
            code: "AI_AUTH_FAILED",
            message:
                "AI সেবার অনুমোদন ব্যর্থ হয়েছে। সার্ভার কনফিগারেশন পরীক্ষা করুন।",
        };
    }

    return {
        status: 502,
        code: "AI_UNAVAILABLE",
        message:
            "AI উত্তর তৈরি করতে পারেনি। আপনার প্রশ্নটি আবার পাঠানোর চেষ্টা করুন।",
    };
}

function retrievalSummary(evidence) {
    return {
        quran: {
            status: evidence.quran.status,
            count: evidence.quran.references.length,
            note: evidence.quran.note,
        },
        hadith: {
            status: evidence.hadith.status,
            count: evidence.hadith.references.length,
            note: evidence.hadith.note,
        },
    };
}

export async function GET() {
    return NextResponse.json(
        {
            ok: true,
            configured: Boolean(process.env.GROQ_API_KEY),
            provider: "Groq",
            quranSource: "AlQuran Cloud",
            hadithSource: "Local verified Hadith dataset",
        },
        {
            headers: {
                "Cache-Control": "no-store",
            },
        }
    );
}

export async function POST(request) {
    if (isRateLimited(request)) {
        return NextResponse.json(
            {
                ok: false,
                error:
                    "অনেক বেশি অনুরোধ পাঠানো হয়েছে। এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।",
                code: "RATE_LIMITED",
            },
            {
                status: 429,
                headers: {
                    "Cache-Control": "no-store",
                    "Retry-After": "60",
                },
            }
        );
    }

    const contentLengthHeader = request.headers.get("content-length");
    const contentLength = contentLengthHeader
        ? Number.parseInt(contentLengthHeader, 10)
        : null;

    if (
        Number.isFinite(contentLength) &&
        contentLength > MAX_REQUEST_BYTES
    ) {
        return jsonError(
            "অনুরোধটি অনুমোদিত আকারের চেয়ে বড়।",
            413,
            "REQUEST_TOO_LARGE"
        );
    }

    let payload;

    try {
        payload = await request.json();
    } catch {
        return jsonError(
            "অনুরোধের JSON বিন্যাস সঠিক নয়।",
            400,
            "INVALID_JSON"
        );
    }

    const validation = validateAskRequest(payload, contentLength);

    if (!validation.ok) {
        return jsonError(validation.message, 400, validation.code);
    }

    if (!process.env.GROQ_API_KEY) {
        return jsonError(
            "AI সেবাটি এখনো কনফিগার করা হয়নি। সার্ভারে GROQ_API_KEY যোগ করুন।",
            503,
            "AI_NOT_CONFIGURED"
        );
    }

    try {
        const question = validation.question;
        const history = validation.history;
        const lastUserMessage = [...history]
            .reverse()
            .find((item) => item.role === "user");

        // A short follow-up such as "আরও বুঝিয়ে দিন" needs the previous
        // question for useful retrieval. Do not use account data.
        const retrievalQuestion =
            question.split(/\s+/).filter(Boolean).length <= 4 &&
            lastUserMessage
                ? `${lastUserMessage.content} ${question}`
                : question;

        const evidence = await retrieveEvidence(retrievalQuestion);

        const answer = await generateGroundedAnswer({
            question,
            history,
            evidence,
        });

        return NextResponse.json(
            {
                ok: true,
                ...answer,
                language: answer.language || detectLanguage(question),
                retrieval: retrievalSummary(evidence),
                disclaimer:
                    "এটি একটি শিক্ষামূলক AI সহায়ক। এটি ফতোয়া, ব্যক্তিগত ধর্মীয় রায় বা ইসলামি আইনি পরামর্শ নয়। গুরুত্বপূর্ণ বা ব্যক্তিগত মাসআলায় যোগ্য আলেমের সঙ্গে পরামর্শ করুন।",
            },
            {
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("Ask AI request failed:", {
            name: error?.name || "Error",
            status: error?.status || null,
            code: error?.code || null,
        });

        const mapped = providerErrorMessage(error);
        return jsonError(mapped.message, mapped.status, mapped.code);
    }
}
