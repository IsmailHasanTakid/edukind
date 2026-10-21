import Groq from "groq-sdk";

export const INTERVIEW_MODEL =
    process.env.GROQ_MODEL || "openai/gpt-oss-120b";

let groqClient = null;

export function getGroqClient() {
    if (!process.env.GROQ_API_KEY) return null;

    if (!groqClient) {
        groqClient = new Groq({
            apiKey: process.env.GROQ_API_KEY,
            timeout: 90000,
            maxRetries: 0,
        });
    }

    return groqClient;
}

export function parseJsonContent(content) {
    if (typeof content !== "string" || !content.trim()) {
        throw new Error("AI returned an empty response.");
    }

    let text = content.trim();

    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        text = fenced[1].trim();
    }

    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");

        if (start !== -1 && end > start) {
            return JSON.parse(text.slice(start, end + 1));
        }

        throw new Error("AI returned malformed JSON.");
    }
}

function headerValue(headers, name) {
    if (!headers) return null;

    if (typeof headers.get === "function") {
        return headers.get(name);
    }

    return headers[name] ?? headers[name.toLowerCase()] ?? null;
}

/**
 * Groq reports the wait time for a rate limit in `retry-after`. Free tier
 * tokens-per-minute limits are easy to hit while grading a multi-question
 * report, so a short wait is much better than losing the report.
 */
function retryDelayMs(error) {
    const seconds = Number(headerValue(error?.headers, "retry-after"));

    if (Number.isFinite(seconds) && seconds > 0) {
        return Math.min(seconds * 1000 + 1000, 30000);
    }

    return 4000;
}

export async function createJsonCompletion({
    messages,
    temperature = 0.7,
    maxCompletionTokens = 1600,
    attempts = 2,
}) {
    const groq = getGroqClient();

    if (!groq) {
        const error = new Error("GROQ_API_KEY is not configured.");
        error.status = 500;
        throw error;
    }

    let lastError = null;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const completion = await groq.chat.completions.create({
                model: INTERVIEW_MODEL,
                messages,
                temperature,
                max_completion_tokens: maxCompletionTokens,
                response_format: { type: "json_object" },
            });

            const content = completion.choices?.[0]?.message?.content;
            return parseJsonContent(content);
        } catch (error) {
            lastError = error;

            if (error?.status === 429 && attempt < attempts) {
                // Honour the server-provided cooldown, then try once more.
                await new Promise((resolve) =>
                    setTimeout(resolve, retryDelayMs(error))
                );
                continue;
            }

            // Authentication and hard client errors should not be retried.
            if (
                error?.status === 401 ||
                error?.status === 403 ||
                error?.status === 429
            ) {
                break;
            }
        }
    }

    throw lastError || new Error("AI request failed.");
}

export function groqErrorStatus(error) {
    const status = Number(error?.status);

    if (status === 401 || status === 403) return 401;
    if (status === 429) return 429;
    if (status === 400) return 502;

    return 500;
}

export function groqErrorMessage(status) {
    if (status === 401) return "Groq API authentication failed.";
    if (status === 429) return "AI usage limit reached. Please try again later.";
    if (status === 502) return "AI returned an invalid response. Please try again.";

    return "AI service is temporarily unavailable. Please try again.";
}
