import { NextResponse } from "next/server";
import {
    getGroqClient,
    groqErrorMessage,
    groqErrorStatus,
} from "@/lib/groq";
import {
    DIFFICULTIES,
    INTERVIEW_TYPES,
    LANGUAGES,
    MAX_QUESTIONS,
} from "@/lib/interview";
import {
    generateInterviewQuestion,
    normalizeQuestionHistory,
} from "@/lib/interview-questions";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store, max-age=0",
};

function errorResponse(message, status) {
    return NextResponse.json(
        { error: message },
        { status, headers: NO_STORE_HEADERS }
    );
}

/**
 * Legacy stateless question endpoint.
 *
 * The Interview Room now uses /api/interviewer/session/[id]/question so that
 * every question is persisted before the browser sees it. This endpoint is
 * kept for backwards compatibility, but it performs the same validation and
 * prompt handling through the shared question library.
 */
export async function POST(request) {
    try {
        if (!getGroqClient()) {
            return errorResponse("GROQ_API_KEY is not configured.", 500);
        }

        let body;

        try {
            body = await request.json();
        } catch {
            return errorResponse("Invalid JSON request body.", 400);
        }

        const {
            action = "start",
            interviewType = "Technical",
            subject,
            topic,
            difficulty = "Intermediate",
            language = "English",
            questionCount = 10,
            questionNumber = 1,
            history = [],
        } = body || {};

        if (
            typeof subject !== "string" ||
            !subject.trim() ||
            typeof topic !== "string" ||
            !topic.trim()
        ) {
            return errorResponse("Subject and topic are required.", 400);
        }

        if (!["start", "answer"].includes(action)) {
            return errorResponse("Invalid interview action.", 400);
        }

        if (!INTERVIEW_TYPES.includes(interviewType)) {
            return errorResponse("Invalid interview type.", 400);
        }

        if (!DIFFICULTIES.includes(difficulty)) {
            return errorResponse("Invalid difficulty level.", 400);
        }

        if (!LANGUAGES.includes(language)) {
            return errorResponse("Invalid interview language.", 400);
        }

        const count = Number(questionCount);
        const currentNumber = Number(questionNumber);

        if (
            !Number.isInteger(count) ||
            count < 1 ||
            count > MAX_QUESTIONS
        ) {
            return errorResponse(
                `Question count must be between 1 and ${MAX_QUESTIONS}.`,
                400
            );
        }

        if (
            !Number.isInteger(currentNumber) ||
            currentNumber < 1 ||
            currentNumber > count + 1
        ) {
            return errorResponse("Invalid question number.", 400);
        }

        if (action === "start" && currentNumber !== 1) {
            return errorResponse("An interview must start at question 1.", 400);
        }

        const safeHistory = normalizeQuestionHistory(history);

        if (
            action === "answer" &&
            (safeHistory.length === 0 ||
                !safeHistory[safeHistory.length - 1]?.question ||
                !safeHistory[safeHistory.length - 1]?.answer)
        ) {
            return errorResponse(
                "The latest question and answer are required.",
                400
            );
        }

        if (currentNumber > count) {
            return NextResponse.json(
                {
                    success: true,
                    finished: true,
                    question: null,
                    progress: {
                        questionNumber: currentNumber,
                        questionCount: count,
                    },
                },
                { headers: NO_STORE_HEADERS }
            );
        }

        const question = await generateInterviewQuestion({
            config: {
                interviewType,
                subject: subject.trim().slice(0, 150),
                topicMode: "custom",
                topics: [topic.trim().slice(0, 1000)],
                difficulty,
                language,
                mode: "Text",
                duration: 15,
                questionCount: count,
            },
            history: safeHistory,
            questionNumber: currentNumber,
            action,
        });

        if (!question) {
            return NextResponse.json(
                {
                    success: true,
                    finished: true,
                    question: null,
                    progress: {
                        questionNumber: currentNumber,
                        questionCount: count,
                    },
                },
                { headers: NO_STORE_HEADERS }
            );
        }

        return NextResponse.json(
            {
                success: true,
                finished: false,
                question,
                progress: {
                    questionNumber: currentNumber,
                    questionCount: count,
                },
            },
            { headers: NO_STORE_HEADERS }
        );
    } catch (error) {
        console.error("Interview generation error:", error?.message || error);

        const status = groqErrorStatus(error);

        return errorResponse(groqErrorMessage(status), status);
    }
}
