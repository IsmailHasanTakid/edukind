export const MAX_QUESTION_LENGTH = 1200;
export const MAX_HISTORY_ITEMS = 8;
export const MAX_HISTORY_MESSAGE_LENGTH = 2500;
export const MAX_REQUEST_BYTES = 24_000;

function fail(message, code) {
    return { ok: false, message, code };
}

export function validateAskRequest(payload, contentLength = null) {
    if (
        contentLength !== null &&
        Number.isFinite(contentLength) &&
        contentLength > MAX_REQUEST_BYTES
    ) {
        return fail("অনুরোধটি অনুমোদিত আকারের চেয়ে বড়।", "REQUEST_TOO_LARGE");
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        return fail("অনুরোধের বিন্যাস সঠিক নয়।", "INVALID_BODY");
    }

    if (typeof payload.question !== "string") {
        return fail("একটি প্রশ্ন লিখুন।", "QUESTION_REQUIRED");
    }

    const question = payload.question
        .replace(/\u0000/g, "")
        .trim();

    if (question.length < 2) {
        return fail("অন্তত দুটি অক্ষরের একটি প্রশ্ন লিখুন।", "QUESTION_TOO_SHORT");
    }

    if (question.length > MAX_QUESTION_LENGTH) {
        return fail(
            `প্রশ্ন ${MAX_QUESTION_LENGTH} অক্ষরের মধ্যে রাখুন।`,
            "QUESTION_TOO_LONG"
        );
    }

    const rawHistory = payload.history ?? [];

    if (!Array.isArray(rawHistory)) {
        return fail("কথোপকথনের ইতিহাস সঠিক নয়।", "INVALID_HISTORY");
    }

    if (rawHistory.length > MAX_HISTORY_ITEMS) {
        return fail(
            "কথোপকথনের ইতিহাস অনুমোদিত সীমার চেয়ে বড়।",
            "HISTORY_TOO_LONG"
        );
    }

    const history = [];

    for (const item of rawHistory) {
        if (
            !item ||
            typeof item !== "object" ||
            !["user", "assistant"].includes(item.role) ||
            typeof item.content !== "string"
        ) {
            return fail("কথোপকথনের ইতিহাসে অসমর্থিত বার্তা আছে।", "INVALID_HISTORY");
        }

        const content = item.content
            .replace(/\u0000/g, "")
            .trim();

        if (!content) {
            return fail("কথোপকথনের ইতিহাসে খালি বার্তা আছে।", "INVALID_HISTORY");
        }

        if (content.length > MAX_HISTORY_MESSAGE_LENGTH) {
            return fail(
                "কথোপকথনের একটি বার্তা অনুমোদিত সীমার চেয়ে বড়।",
                "HISTORY_MESSAGE_TOO_LONG"
            );
        }

        history.push({
            role: item.role,
            content,
        });
    }

    return {
        ok: true,
        question,
        history,
    };
}
