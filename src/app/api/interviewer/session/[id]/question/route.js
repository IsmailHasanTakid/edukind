import { NextResponse } from "next/server";
import {
    appendQuestion,
    beginQuestion,
    clearQuestionPending,
} from "@/lib/interview-store";
import { generateInterviewQuestion } from "@/lib/interview-questions";
import { groqErrorMessage, groqErrorStatus } from "@/lib/groq";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

function errorResponse(message, status, extra = {}) {
    return NextResponse.json(
        { error: message, ...extra },
        { status, headers: NO_STORE_HEADERS }
    );
}

function answeredHistory(record) {
    return record.questions
        .filter(
            (question) =>
                typeof question.answer === "string" &&
                question.answer.trim().length > 0
        )
        .slice(-10)
        .map((question) => ({
            category: question.category,
            question: question.question,
            answer: question.answer,
        }));
}

export async function POST(_request, { params }) {
    const { id } = await params;
    let claim;

    try {
        claim = await beginQuestion(id);
    } catch (error) {
        console.error(
            "Interview question claim error:",
            error?.message || error
        );

        return errorResponse(
            "Could not prepare the next question.",
            error?.status || 500,
            { code: error?.code || "STORE_ERROR" }
        );
    }

    if (claim.state === "not_found") {
        return errorResponse("Interview session was not found.", 404, {
            code: "NOT_FOUND",
        });
    }

    if (claim.state === "not_in_progress") {
        return errorResponse(
            "This interview is no longer accepting new questions.",
            409,
            {
                code: "NOT_IN_PROGRESS",
                status: claim.record.status,
            }
        );
    }

    if (claim.state === "existing") {
        return NextResponse.json(
            {
                success: true,
                finished: false,
                resumed: true,
                question: {
                    ...claim.question,
                    questionNumber: claim.question.index,
                },
                progress: {
                    questionNumber: claim.question.index,
                    questionCount: claim.record.config.questionCount,
                },
            },
            { headers: NO_STORE_HEADERS }
        );
    }

    if (claim.state === "finished") {
        return NextResponse.json(
            {
                success: true,
                finished: true,
                question: null,
                progress: {
                    questionNumber: claim.record.questions.length + 1,
                    questionCount: claim.record.config.questionCount,
                },
            },
            { headers: NO_STORE_HEADERS }
        );
    }

    if (claim.state === "busy") {
        return errorResponse(
            "The next question is already being generated. Please wait a moment.",
            409,
            {
                code: "QUESTION_IN_PROGRESS",
                retryAfter: 2,
            }
        );
    }

    const record = claim.record;
    const history = answeredHistory(record);
    const questionNumber = record.questions.length + 1;
    const action = history.length > 0 ? "answer" : "start";

    try {
        const generated = await generateInterviewQuestion({
            config: record.config,
            history,
            questionNumber,
            action,
        });

        if (!generated) {
            await clearQuestionPending(id);

            return NextResponse.json(
                {
                    success: true,
                    finished: true,
                    question: null,
                    progress: {
                        questionNumber,
                        questionCount: record.config.questionCount,
                    },
                },
                { headers: NO_STORE_HEADERS }
            );
        }

        const appended = await appendQuestion(id, generated);

        if (appended.state === "not_found") {
            return errorResponse("Interview session was not found.", 404, {
                code: "NOT_FOUND",
            });
        }

        if (appended.state === "not_in_progress") {
            return errorResponse(
                "This interview is no longer accepting new questions.",
                409,
                {
                    code: "NOT_IN_PROGRESS",
                    status: appended.record.status,
                }
            );
        }

        if (appended.state === "finished") {
            return NextResponse.json(
                {
                    success: true,
                    finished: true,
                    question: null,
                    progress: {
                        questionNumber,
                        questionCount: appended.record.config.questionCount,
                    },
                },
                { headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            {
                success: true,
                finished: false,
                resumed: appended.state === "existing",
                question: {
                    ...appended.question,
                    questionNumber: appended.question.index,
                },
                progress: {
                    questionNumber: appended.question.index,
                    questionCount: appended.record.config.questionCount,
                },
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error(
            "Interview question generation error:",
            error?.message || error
        );

        try {
            await clearQuestionPending(id);
        } catch {
            // The pending marker will expire on its own.
        }

        const status = groqErrorStatus(error);
        const message =
            status === 401 || status === 429
                ? groqErrorMessage(status)
                : "AI could not generate the next question. Please try again.";

        return errorResponse(message, status, {
            code: "QUESTION_GENERATION_FAILED",
        });
    }
}
