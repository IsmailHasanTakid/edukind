import { evaluateInterview } from "./interview-evaluation";
import {
    getGroqClient,
    groqErrorMessage,
    groqErrorStatus,
} from "./groq";
import {
    InterviewStoreError,
    claimEvaluation,
    failEvaluation,
    saveCompletedReport,
} from "./interview-store";

function publicErrorMessage(error, status) {
    if (error instanceof InterviewStoreError) {
        return error.message;
    }

    if (error?.status === 401 || error?.status === 403 || error?.status === 429) {
        return groqErrorMessage(groqErrorStatus(error));
    }

    if (error?.name === "EvaluationValidationError") {
        return "AI returned an evaluation that could not be validated. Please retry the report.";
    }

    return groqErrorMessage(status);
}

export async function completeInterview(id) {
    let claim;

    try {
        claim = await claimEvaluation(id);
    } catch (error) {
        console.error(
            "Interview evaluation claim error:",
            error?.message || error
        );

        return {
            ok: false,
            statusCode: error?.status || 500,
            code: error?.code || "STORE_ERROR",
            message:
                error instanceof InterviewStoreError
                    ? error.message
                    : "The interview result could not be loaded.",
        };
    }

    if (claim.state === "not_found") {
        return {
            ok: false,
            statusCode: 404,
            code: "NOT_FOUND",
            message: "Interview result was not found.",
        };
    }

    if (claim.state === "completed") {
        return {
            ok: true,
            reused: true,
            record: claim.record,
        };
    }

    if (claim.state === "evaluating") {
        return {
            ok: false,
            statusCode: 202,
            code: "EVALUATING",
            retryAfter: 2,
            message:
                "The final report is already being generated. This page will update automatically.",
        };
    }

    if (claim.state === "no_answers") {
        return {
            ok: false,
            statusCode: 400,
            code: "NO_ANSWERS",
            message:
                "At least one answer is required before a report can be generated.",
        };
    }

    const record = claim.record;

    try {
        if (!getGroqClient()) {
            throw new Error("GROQ_API_KEY is not configured.");
        }

        const report = await evaluateInterview(record.config, record.questions);
        const saved = await saveCompletedReport(id, report);

        return {
            ok: true,
            reused: false,
            record: saved,
        };
    } catch (error) {
        console.error(
            "Interview evaluation error:",
            error?.message || error
        );

        const status = groqErrorStatus(error);
        const message = publicErrorMessage(error, status);

        try {
            await failEvaluation(id, message);
        } catch (storeError) {
            console.error(
                "Could not mark interview as failed:",
                storeError?.message || storeError
            );
        }

        return {
            ok: false,
            statusCode: status,
            code: "EVALUATION_FAILED",
            message,
        };
    }
}
