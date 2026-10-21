export const MAX_QUESTIONS = 20;
export const MIN_QUESTIONS = 1;
export const MAX_ANSWER_LENGTH = 4000;

export const INTERVIEW_TYPES = ["Technical", "Coding", "HR", "Mixed"];
export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
export const LANGUAGES = ["বাংলা", "English", "Bangla + English"];
export const INTERVIEW_MODES = ["Voice", "Text"];

export const INTERVIEW_STATUSES = [
    "in_progress",
    "evaluating",
    "completed",
    "failed",
];

export const STATUS_LABELS = {
    correct: "Correct",
    partially_correct: "Partially correct",
    incorrect: "Incorrect",
    not_answered: "Not answered",
};

/**
 * The evaluation rubric is applied on the server. The model returns a 0-100
 * score for each criterion; the server calculates the final question score
 * from these weights. The model never controls the final score directly.
 */
export const EVALUATION_RUBRICS = {
    Technical: {
        label: "Technical correctness focused",
        criteria: [
            {
                key: "correctness",
                label: "Technical correctness",
                weight: 40,
                description:
                    "Factual and technical accuracy of the answer. Incorrect statements must lower this score.",
            },
            {
                key: "completeness",
                label: "Completeness",
                weight: 20,
                description:
                    "Whether the answer covers the important parts of the question.",
            },
            {
                key: "depth",
                label: "Depth and reasoning",
                weight: 15,
                description:
                    "Quality of reasoning, trade-offs, edge cases and examples.",
            },
            {
                key: "relevance",
                label: "Relevance",
                weight: 15,
                description:
                    "Whether the answer actually addresses the question asked.",
            },
            {
                key: "clarity",
                label: "Clarity",
                weight: 10,
                description:
                    "How clearly and coherently the answer is explained.",
            },
        ],
    },
    Coding: {
        label: "Coding and problem solving focused",
        criteria: [
            {
                key: "correctness",
                label: "Algorithm / code correctness",
                weight: 40,
                description:
                    "Logical correctness of the approach, code or algorithm.",
            },
            {
                key: "completeness",
                label: "Completeness",
                weight: 20,
                description:
                    "Handling of required cases, including edge cases and constraints.",
            },
            {
                key: "depth",
                label: "Complexity and reasoning",
                weight: 15,
                description:
                    "Reasoning about complexity, trade-offs and alternative approaches.",
            },
            {
                key: "relevance",
                label: "Relevance",
                weight: 15,
                description:
                    "Whether the solution addresses the exact problem asked.",
            },
            {
                key: "clarity",
                label: "Explanation clarity",
                weight: 10,
                description:
                    "How clearly the approach and code are explained.",
            },
        ],
    },
    HR: {
        label: "Communication and behaviour focused",
        criteria: [
            {
                key: "relevance",
                label: "Relevance",
                weight: 30,
                description:
                    "Whether the answer directly addresses the HR question.",
            },
            {
                key: "completeness",
                label: "Completeness",
                weight: 25,
                description:
                    "Whether a complete, well-structured answer is given.",
            },
            {
                key: "communication",
                label: "Communication",
                weight: 25,
                description:
                    "Clarity, professionalism and coherence of the response.",
            },
            {
                key: "selfAwareness",
                label: "Self-awareness",
                weight: 10,
                description:
                    "Honest reflection, ownership and awareness of strengths or gaps.",
            },
            {
                key: "examples",
                label: "Examples",
                weight: 10,
                description:
                    "Use of concrete, relevant examples or experience.",
            },
        ],
    },
    Mixed: {
        label: "Balanced technical and communication rubric",
        criteria: [
            {
                key: "correctness",
                label: "Technical correctness",
                weight: 30,
                description:
                    "Accuracy of any technical content in the answer.",
            },
            {
                key: "completeness",
                label: "Completeness",
                weight: 20,
                description:
                    "Coverage of the important parts of the question.",
            },
            {
                key: "relevance",
                label: "Relevance",
                weight: 20,
                description:
                    "Whether the answer addresses the question asked.",
            },
            {
                key: "communication",
                label: "Communication",
                weight: 15,
                description:
                    "Clarity, structure and professionalism of the response.",
            },
            {
                key: "depth",
                label: "Depth and examples",
                weight: 15,
                description:
                    "Reasoning, trade-offs and concrete examples where relevant.",
            },
        ],
    },
};

export function getEvaluationRubric(interviewType) {
    return (
        EVALUATION_RUBRICS[interviewType] || EVALUATION_RUBRICS.Technical
    );
}

export function clampScore(value) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) return null;

    return Math.min(100, Math.max(0, Math.round(numeric)));
}

export function getScoreStatus(score) {
    const value = clampScore(score);

    if (value === null) return "incorrect";
    if (value >= 75) return "correct";
    if (value >= 40) return "partially_correct";
    return "incorrect";
}

export function hasSubmittedAnswer(question) {
    return (
        typeof question?.answer === "string" &&
        question.answer.trim().length > 0
    );
}

export function computeAnswerCounts(questions) {
    const list = Array.isArray(questions) ? questions : [];
    const counts = {
        total: list.length,
        answered: 0,
        unanswered: 0,
        correct: 0,
        partiallyCorrect: 0,
        incorrect: 0,
        notAnswered: 0,
    };

    for (const question of list) {
        if (!hasSubmittedAnswer(question)) {
            counts.unanswered += 1;
            counts.notAnswered += 1;
            continue;
        }

        counts.answered += 1;

        const status = question?.evaluation?.status || question?.status;

        if (status === "correct") counts.correct += 1;
        else if (status === "partially_correct") {
            counts.partiallyCorrect += 1;
        } else if (status === "incorrect") counts.incorrect += 1;
    }

    return counts;
}

export const EVALUATION_DISCLAIMER =
    "Scores are approximate AI assessments based on the stated rubric. They are not an official certification or a substitute for a human interviewer.";

function asCleanString(value, maxLength) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
}

export function buildTopicText(config) {
    if (!config) return "";

    if (config.topicMode === "all") {
        return `All relevant topics within ${config.subject}. Cover a balanced range of important concepts.`;
    }

    const topics = Array.isArray(config.topics)
        ? config.topics.map((topic) => asCleanString(topic, 120)).filter(Boolean)
        : [];

    return topics.join(", ").slice(0, 1000);
}

export function normalizeInterviewConfig(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) {
        throw new Error("Interview configuration পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।");
    }

    const subject = asCleanString(input.subject, 150);

    if (!subject) {
        throw new Error("Interview subject পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।");
    }

    const topics = Array.isArray(input.topics)
        ? input.topics
              .map((topic) => asCleanString(topic, 120))
              .filter(Boolean)
              .slice(0, MAX_QUESTIONS)
        : [];

    let topicMode = input.topicMode;
    if (!["all", "suggested", "custom"].includes(topicMode)) {
        topicMode = topics.length ? "custom" : "all";
    }
    if (topicMode !== "all" && topics.length === 0) {
        throw new Error("কমপক্ষে একটি topic নির্বাচন করো অথবা All topics বেছে নাও।");
    }

    const questionCount = Number(input.questionCount);
    if (
        !Number.isInteger(questionCount) ||
        questionCount < MIN_QUESTIONS ||
        questionCount > MAX_QUESTIONS
    ) {
        throw new Error(`Question count অবশ্যই ${MIN_QUESTIONS} থেকে ${MAX_QUESTIONS}-এর মধ্যে হতে হবে।`);
    }

    const interviewType = INTERVIEW_TYPES.includes(input.interviewType)
        ? input.interviewType
        : "Technical";
    const difficulty = DIFFICULTIES.includes(input.difficulty)
        ? input.difficulty
        : "Intermediate";
    const language = LANGUAGES.includes(input.language)
        ? input.language
        : "English";
    const mode = INTERVIEW_MODES.includes(input.mode) ? input.mode : "Text";

    const duration = Number(input.duration);
    const safeDuration =
        Number.isFinite(duration) && duration > 0 && duration <= 180
            ? Math.round(duration)
            : 15;

    return {
        interviewType,
        subject,
        topicMode,
        topics,
        difficulty,
        language,
        mode,
        duration: safeDuration,
        questionCount,
    };
}

export function getGrade(score) {
    const value = Number(score);

    if (!Number.isFinite(value)) {
        return {
            grade: "N/A",
            label: "Not available",
            performanceGrade: "Not available",
        };
    }

    if (value >= 90) {
        return {
            grade: "A+",
            label: "Outstanding",
            performanceGrade: "Excellent",
        };
    }
    if (value >= 80) {
        return {
            grade: "A",
            label: "Excellent",
            performanceGrade: "Excellent",
        };
    }
    if (value >= 70) {
        return {
            grade: "B",
            label: "Good",
            performanceGrade: "Good",
        };
    }
    if (value >= 60) {
        return {
            grade: "C",
            label: "Fair",
            performanceGrade: "Average",
        };
    }
    if (value >= 50) {
        return {
            grade: "D",
            label: "Needs improvement",
            performanceGrade: "Average",
        };
    }

    return {
        grade: "F",
        label: "Significant improvement needed",
        performanceGrade: "Needs Improvement",
    };
}

export function containsBengali(text) {
    return /[\u0980-\u09FF]/.test(String(text || ""));
}

export function speechLanguageFor(language) {
    if (language === "বাংলা" || language === "Bangla + English") {
        return "bn-BD";
    }
    return "en-US";
}

export function languageDisplayName(language) {
    if (language === "বাংলা") return "বাংলা";
    if (language === "Bangla + English") return "Bangla + English";
    return "English";
}
