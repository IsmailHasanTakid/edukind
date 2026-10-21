import { NextResponse } from "next/server";
import { completeInterview } from "@/lib/interview-completion";
import { toPublicInterview, toSessionView } from "@/lib/interview-store";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

export async function POST(_request, { params }) {
    const { id } = await params;
    const outcome = await completeInterview(id);

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
