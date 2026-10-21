import { NextResponse } from "next/server";
import { MAX_ANSWER_LENGTH, computeAnswerCounts } from "@/lib/interview";
import { submitAnswer } from "@/lib/interview-store";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

function errorResponse(message, status, extra = {}) {
    return NextResponse.json(
        { error: message, ...extra },
        { status, headers: NO_STORE_HEADERS }
    );
}

export async function POST(request, { params }) {
    const { id } = await params;
    let body;

    try {
        body = await request.json();
    } catch {
        return errorResponse("Invalid JSON request body.", 400);
    }

    const questionIndex = Number(body?.questionIndex);
    const answer = body?.answer;

    if (!Number.isInteger(questionIndex) || questionIndex < 1) {
        return errorResponse("A valid question index is required.", 400);
    }

    if (typeof answer !== "string") {
        return errorResponse("The answer must be a string.", 400);
    }

    if (!answer.trim()) {
        return errorResponse("The answer cannot be empty.", 400);
    }

    if (answer.length > MAX_ANSWER_LENGTH) {
        return errorResponse(
            `The answer is too long. Maximum length is ${MAX_ANSWER_LENGTH} characters.`,
            400
        );
    }

    try {
        const result = await submitAnswer(id, questionIndex, answer);

        if (result.state === "not_found") {
            return errorResponse("Interview session was not found.", 404, {
                code: "NOT_FOUND",
            });
        }

        if (result.state === "not_in_progress") {
            return errorResponse(
                "This interview is no longer accepting answers.",
                409,
                {
                    code: "NOT_IN_PROGRESS",
                    status: result.record.status,
                }
            );
        }

        if (result.state === "invalid_question") {
            return errorResponse("Question was not found.", 404, {
                code: "QUESTION_NOT_FOUND",
            });
        }

        if (result.state === "already_answered") {
            return errorResponse(
                "This question has already been answered. Submitted answers cannot be changed.",
                409,
                { code: "ALREADY_ANSWERED" }
            );
        }

        if (result.state === "not_current") {
            return errorResponse(
                "Only the current unanswered question can be submitted.",
                409,
                { code: "QUESTION_NOT_CURRENT" }
            );
        }

        const counts = computeAnswerCounts(result.record.questions);

        return NextResponse.json(
            {
                success: true,
                answeredCount: counts.answered,
                totalQuestions: result.record.config.questionCount,
                questionIndex,
                status: result.record.status,
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error(
            "Interview answer storage error:",
            error?.message || error
        );

        return errorResponse(
            "Could not save the answer.",
            error?.status || 500,
            { code: error?.code || "STORE_ERROR" }
        );
    }
}
