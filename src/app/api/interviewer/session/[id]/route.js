import { NextResponse } from "next/server";
import {
    InterviewStoreError,
    getInterview,
    toPublicInterview,
    toSessionView,
} from "@/lib/interview-store";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

export async function GET(_request, { params }) {
    try {
        const { id } = await params;
        const record = await getInterview(id);

        if (!record) {
            return NextResponse.json(
                {
                    error: "Interview result was not found.",
                    code: "NOT_FOUND",
                },
                { status: 404, headers: NO_STORE_HEADERS }
            );
        }

        if (record.status === "completed") {
            return NextResponse.json(
                {
                    success: true,
                    status: "completed",
                    result: toPublicInterview(record),
                },
                { headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            {
                success: true,
                status: record.status,
                session: toSessionView(record),
                error:
                    record.status === "failed"
                        ? record.evaluationError ||
                          "Report generation failed."
                        : null,
            },
            {
                status: 200,
                headers: {
                    ...NO_STORE_HEADERS,
                    ...(record.status === "evaluating"
                        ? { "Retry-After": "2" }
                        : {}),
                },
            }
        );
    } catch (error) {
        console.error("Interview result error:", error?.message || error);

        if (error instanceof InterviewStoreError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.status, headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            { error: "Could not load the interview result." },
            { status: 500, headers: NO_STORE_HEADERS }
        );
    }
}
