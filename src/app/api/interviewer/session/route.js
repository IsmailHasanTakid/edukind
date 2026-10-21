import { NextResponse } from "next/server";
import { normalizeInterviewConfig } from "@/lib/interview";
import {
    InterviewStoreError,
    createInterview,
    listInterviews,
    toSessionView,
} from "@/lib/interview-store";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

function errorResponse(message, status, extra = {}) {
    return NextResponse.json(
        { error: message, ...extra },
        { status, headers: NO_STORE_HEADERS }
    );
}

export async function POST(request) {
    try {
        let body;

        try {
            body = await request.json();
        } catch {
            return errorResponse("Invalid JSON request body.", 400);
        }

        let config;

        try {
            config = normalizeInterviewConfig(body?.config);
        } catch (error) {
            return errorResponse(error.message, 400);
        }

        const record = await createInterview(config);

        return NextResponse.json(
            {
                success: true,
                session: toSessionView(record),
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error(
            "Interview session creation error:",
            error?.message || error
        );

        if (error instanceof InterviewStoreError) {
            return errorResponse(error.message, error.status, {
                code: error.code,
            });
        }

        return errorResponse("Could not start the interview session.", 500);
    }
}

export async function GET(request) {
    try {
        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit") || 20);
        const interviews = await listInterviews(limit);

        return NextResponse.json(
            { success: true, interviews },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error("Interview history error:", error?.message || error);

        if (error instanceof InterviewStoreError) {
            return errorResponse(error.message, error.status, {
                code: error.code,
            });
        }

        return errorResponse("Could not load interview history.", 500);
    }
}
