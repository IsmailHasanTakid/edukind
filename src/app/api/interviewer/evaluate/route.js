import { NextResponse } from "next/server";
import { completeInterview } from "@/lib/interview-completion";
import { toPublicInterview, toSessionView } from "@/lib/interview-store";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

/**
 * Backwards-compatible alias for the persisted interview completion flow.
 *
 * The old prototype accepted a config and an answer array from the browser.
 * That is intentionally no longer supported: a report must be generated from
 * the server-persisted question history, otherwise data can be combined from
 * different interviews.
 */
export async function POST(request) {
    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON request body." },
            { status: 400, headers: NO_STORE_HEADERS }
        );
    }

    const interviewId = body?.interviewId || body?.id;

    if (typeof interviewId !== "string" || !interviewId.trim()) {
        return NextResponse.json(
            {
                error: "An interviewId is required. Start a persisted interview session first.",
                code: "INTERVIEW_ID_REQUIRED",
            },
            { status: 400, headers: NO_STORE_HEADERS }
        );
    }

    const outcome = await completeInterview(interviewId.trim());

    if (outcome.ok) {
        return NextResponse.json(
            {
                success: true,
                reused: outcome.reused,
                status: "completed",
                result: toPublicInterview(outcome.record),
            },
            { headers: NO_STORE_HEADERS }
        );
    }

    if (outcome.code === "EVALUATING") {
        return NextResponse.json(
            {
                success: true,
                status: "evaluating",
                retryAfter: outcome.retryAfter || 2,
                message: outcome.message,
            },
            {
                status: 202,
                headers: {
                    ...NO_STORE_HEADERS,
                    "Retry-After": String(outcome.retryAfter || 2),
                },
            }
        );
    }

    return NextResponse.json(
        {
            success: false,
            error: outcome.message,
            code: outcome.code,
            ...(outcome.record
                ? { session: toSessionView(outcome.record) }
                : {}),
        },
        { status: outcome.statusCode || 500, headers: NO_STORE_HEADERS }
    );
}
