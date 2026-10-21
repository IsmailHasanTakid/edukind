import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import {
    EVALUATION_DISCLAIMER,
    INTERVIEW_STATUSES,
    computeAnswerCounts,
    getEvaluationRubric,
    getScoreStatus,
    hasSubmittedAnswer,
} from "./interview";

const DATA_DIRECTORY = process.env.INTERVIEW_STORE_DIR
    ? path.resolve(process.env.INTERVIEW_STORE_DIR)
    : path.join(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIRECTORY, "interviews.json");
const LOCK_FILE = path.join(DATA_DIRECTORY, "interviews.lock");
const MAX_STORED_INTERVIEWS = 100;
const ID_PATTERN = /^[a-zA-Z0-9-]{8,64}$/;
const LOCK_TIMEOUT_MS = 8000;
const LOCK_STALE_MS = 30000;
const QUESTION_PENDING_MS = 60000;
const EVALUATION_LOCK_MS = 15 * 60 * 1000;

let writeQueue = Promise.resolve();

export class InterviewStoreError extends Error {
    constructor(message, code, status = 500) {
        super(message);
        this.name = "InterviewStoreError";
        this.code = code;
        this.status = status;
    }
}

function nowIso() {
    return new Date().toISOString();
}

function enqueueWrite(operation) {
    const next = writeQueue.then(operation, operation);
    writeQueue = next.catch(() => {});
    return next;
}

async function acquireLock() {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });

    const token = `${process.pid}-${Date.now()}-${crypto.randomUUID()}`;
    const deadline = Date.now() + LOCK_TIMEOUT_MS;

    while (true) {
        try {
            const handle = await fs.open(LOCK_FILE, "wx");
            await handle.writeFile(
                JSON.stringify({ token, pid: process.pid, createdAt: nowIso() }),
                "utf8"
            );
            await handle.close();

            return async () => {
                try {
                    const raw = await fs.readFile(LOCK_FILE, "utf8");
                    const parsed = JSON.parse(raw);
                    if (parsed?.token === token) {
                        await fs.unlink(LOCK_FILE);
                    }
                } catch {
                    // The lock was already released or taken over.
                }
            };
        } catch (error) {
            if (error?.code !== "EEXIST") throw error;

            try {
                const stats = await fs.stat(LOCK_FILE);
                if (Date.now() - stats.mtimeMs > LOCK_STALE_MS) {
                    await fs.unlink(LOCK_FILE).catch(() => {});
                    continue;
                }
            } catch {
                // Lock disappeared between stat and read; retry immediately.
                continue;
            }

            if (Date.now() > deadline) {
                throw new InterviewStoreError(
                    "The interview store is busy. Please try again.",
                    "STORE_BUSY",
                    503
                );
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 40 + Math.floor(Math.random() * 60))
            );
        }
    }
}

async function withStoreLock(operation) {
    return enqueueWrite(async () => {
        const release = await acquireLock();

        try {
            return await operation();
        } finally {
            await release();
        }
    });
}

function normalizeEvaluation(raw, fallback = {}) {
    if (!raw || typeof raw !== "object") return null;

    const score = Number.isFinite(Number(raw.score))
        ? Math.min(100, Math.max(0, Math.round(Number(raw.score))))
        : Number.isFinite(Number(fallback.score))
          ? Math.min(100, Math.max(0, Math.round(Number(fallback.score))))
          : 0;
    const status = ["correct", "partially_correct", "incorrect", "not_answered"].includes(
        raw.status
    )
        ? raw.status
        : getScoreStatus(score);

    return {
        score,
        status,
        criteria:
            raw.criteria && typeof raw.criteria === "object"
                ? raw.criteria
                : fallback.criteria || null,
        strengths: Array.isArray(raw.strengths) ? raw.strengths : [],
        missingConcepts: Array.isArray(raw.missingConcepts)
            ? raw.missingConcepts
            : [],
        idealAnswer:
            typeof raw.idealAnswer === "string" ? raw.idealAnswer : null,
        whyGood: typeof raw.whyGood === "string" ? raw.whyGood : "",
        improvements: Array.isArray(raw.improvements) ? raw.improvements : [],
        learningTips: Array.isArray(raw.learningTips)
            ? raw.learningTips
            : [],
    };
}

function nullableScore(value) {
    if (value === null || value === undefined || value === "") return null;

    const numeric = Number(value);

    return Number.isFinite(numeric)
        ? Math.min(100, Math.max(0, Math.round(numeric)))
        : null;
}

/**
 * Supports records written by the earlier prototype (flat score/status on a
 * question) as well as the current nested evaluation schema.
 */
function normalizeRecord(record) {
    if (!record || typeof record !== "object" || !record.id) return null;

    const createdAt = record.createdAt || nowIso();

    const questions = Array.isArray(record.questions)
        ? record.questions.map((item, index) => {
              const flatEvaluation =
                  item?.evaluation ||
                  (item && typeof item.score === "number"
                      ? {
                            score: item.score,
                            status: item.status,
                            criteria: item.criteria || null,
                            strengths: item.strengths || [],
                            missingConcepts: item.missingConcepts || [],
                            idealAnswer: item.idealAnswer || null,
                            whyGood: item.whyGood || "",
                            improvements: item.improvements || [],
                            learningTips: item.learningTips || [],
                        }
                      : null);

              return {
                  index:
                      Number.isInteger(Number(item?.index)) && Number(item.index) > 0
                          ? Number(item.index)
                          : index + 1,
                  category:
                      typeof item?.category === "string" && item.category.trim()
                          ? item.category.trim().slice(0, 100)
                          : "General",
                  difficulty:
                      typeof item?.difficulty === "string" && item.difficulty.trim()
                          ? item.difficulty.trim().slice(0, 50)
                          : record.config?.difficulty || "Intermediate",
                  question:
                      typeof item?.question === "string" ? item.question : "",
                  hint: typeof item?.hint === "string" ? item.hint : "",
                  askedAt: item?.askedAt || createdAt,
                  answer:
                      typeof item?.answer === "string" ? item.answer : null,
                  answeredAt: item?.answeredAt || null,
                  evaluation: normalizeEvaluation(flatEvaluation),
              };
          })
        : [];

    return {
        schemaVersion: record.schemaVersion || 2,
        id: record.id,
        status: INTERVIEW_STATUSES.includes(record.status)
            ? record.status
            : Number.isFinite(Number(record.overallScore)) && questions.length
              ? "completed"
              : "in_progress",
        createdAt,
        updatedAt: record.updatedAt || createdAt,
        completedAt: record.completedAt || null,
        evaluatedAt: record.evaluatedAt || null,
        evaluationStartedAt: record.evaluationStartedAt || null,
        evaluationError: record.evaluationError || null,
        failedAt: record.failedAt || null,
        pendingQuestionAt: record.pendingQuestionAt || null,
        config: record.config || {},
        questions,
        overallScore: nullableScore(record.overallScore),
        percentage: nullableScore(record.percentage),
        grade: record.grade || null,
        gradeLabel: record.gradeLabel || null,
        performanceGrade: record.performanceGrade || null,
        summary: record.summary || null,
        summarySource: record.summarySource || null,
        topicPerformance: Array.isArray(record.topicPerformance)
            ? record.topicPerformance
            : [],
        strongestTopic: record.strongestTopic || null,
        weakestTopic: record.weakestTopic || null,
        strengths: Array.isArray(record.strengths) ? record.strengths : [],
        weaknesses: Array.isArray(record.weaknesses) ? record.weaknesses : [],
        recommendations: Array.isArray(record.recommendations)
            ? record.recommendations
            : [],
        learningTips: Array.isArray(record.learningTips)
            ? record.learningTips
            : [],
        evaluationRubric:
            record.evaluationRubric ||
            getEvaluationRubric(record.config?.interviewType),
        disclaimer: record.disclaimer || EVALUATION_DISCLAIMER,
    };
}

async function readAll() {
    try {
        const raw = await fs.readFile(STORE_FILE, "utf8");
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            throw new InterviewStoreError(
                "The interview store is corrupted.",
                "STORE_CORRUPT",
                500
            );
        }

        return parsed.map(normalizeRecord).filter(Boolean);
    } catch (error) {
        if (error?.code === "ENOENT") return [];
        if (error instanceof InterviewStoreError) throw error;
        throw new InterviewStoreError(
            "The interview store could not be read.",
            "STORE_READ_FAILED",
            500
        );
    }
}

async function writeAll(records) {
    await fs.mkdir(DATA_DIRECTORY, { recursive: true });

    const temporaryFile = `${STORE_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(records, null, 2), "utf8");

    try {
        await fs.rename(temporaryFile, STORE_FILE);
    } catch (error) {
        if (error?.code === "EEXIST" || error?.code === "EPERM") {
            await fs.unlink(STORE_FILE).catch(() => {});
            await fs.rename(temporaryFile, STORE_FILE);
            return;
        }

        await fs.unlink(temporaryFile).catch(() => {});
        throw error;
    }
}

function pruneRecords(records) {
    if (records.length <= MAX_STORED_INTERVIEWS) return records;

    const next = records.slice();

    while (next.length > MAX_STORED_INTERVIEWS) {
        let removableIndex = -1;

        for (let index = next.length - 1; index >= 0; index -= 1) {
            if (
                next[index].status === "completed" ||
                next[index].status === "failed"
            ) {
                removableIndex = index;
                break;
            }
        }

        if (removableIndex === -1) removableIndex = next.length - 1;

        next.splice(removableIndex, 1);
    }

    return next;
}

function isReportComplete(record) {
    if (!record || record.status !== "completed") return false;
    if (!Number.isFinite(Number(record.overallScore))) return false;

    return record.questions.every(
        (question) =>
            !hasSubmittedAnswer(question) || Boolean(question.evaluation)
    );
}

function assertId(id) {
    if (typeof id !== "string" || !ID_PATTERN.test(id)) {
        throw new InterviewStoreError(
            "Invalid interview id.",
            "INVALID_ID",
            400
        );
    }
}

function findRecord(records, id) {
    return records.find((record) => record.id === id) || null;
}

export function questionOrNull(record) {
    if (!record) return null;

    const last = record.questions[record.questions.length - 1];

    if (last && !hasSubmittedAnswer(last)) {
        return toRoomQuestion(last);
    }

    return null;
}

function toRoomQuestion(question) {
    return {
        index: question.index,
        category: question.category,
        difficulty: question.difficulty,
        question: question.question,
        hint: question.hint,
    };
}

export async function createInterview(config) {
    return withStoreLock(async () => {
        const records = await readAll();
        const createdAt = nowIso();

        const record = {
            schemaVersion: 2,
            id: crypto.randomUUID(),
            status: "in_progress",
            createdAt,
            updatedAt: createdAt,
            completedAt: null,
            evaluatedAt: null,
            evaluationStartedAt: null,
            evaluationError: null,
            failedAt: null,
            pendingQuestionAt: null,
            config,
            questions: [],
            overallScore: null,
            percentage: null,
            grade: null,
            gradeLabel: null,
            performanceGrade: null,
            summary: null,
            summarySource: null,
            topicPerformance: [],
            strongestTopic: null,
            weakestTopic: null,
            strengths: [],
            weaknesses: [],
            recommendations: [],
            learningTips: [],
            evaluationRubric: getEvaluationRubric(config.interviewType),
            disclaimer: EVALUATION_DISCLAIMER,
        };

        const next = pruneRecords([record, ...records]);
        await writeAll(next);

        return record;
    });
}

export async function getInterview(id) {
    if (typeof id !== "string" || !ID_PATTERN.test(id)) return null;

    const records = await readAll();
    return findRecord(records, id);
}

export async function listInterviews(limit = 20) {
    const records = await readAll();
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    return records
        .filter((record) => record.status === "completed")
        .slice()
        .sort(
            (a, b) =>
                new Date(b.completedAt || b.createdAt).getTime() -
                new Date(a.completedAt || a.createdAt).getTime()
        )
        .slice(0, safeLimit)
        .map(toSummary);
}

export async function beginQuestion(id) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) return { state: "not_found" };
        if (record.status !== "in_progress") {
            return { state: "not_in_progress", record };
        }

        const last = record.questions[record.questions.length - 1];

        if (last && !hasSubmittedAnswer(last)) {
            return { state: "existing", record, question: toRoomQuestion(last) };
        }

        if (record.questions.length >= record.config.questionCount) {
            return { state: "finished", record };
        }

        if (record.pendingQuestionAt) {
            const started = new Date(record.pendingQuestionAt).getTime();

            if (
                Number.isFinite(started) &&
                Date.now() - started < QUESTION_PENDING_MS
            ) {
                return { state: "busy", record };
            }
        }

        record.pendingQuestionAt = nowIso();
        record.updatedAt = nowIso();
        await writeAll(records);

        return { state: "proceed", record };
    });
}

export async function appendQuestion(id, question) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) return { state: "not_found" };
        if (record.status !== "in_progress") {
            return { state: "not_in_progress", record };
        }

        const last = record.questions[record.questions.length - 1];

        if (last && !hasSubmittedAnswer(last)) {
            record.pendingQuestionAt = null;
            record.updatedAt = nowIso();
            await writeAll(records);

            return { state: "existing", record, question: toRoomQuestion(last) };
        }

        if (record.questions.length >= record.config.questionCount) {
            record.pendingQuestionAt = null;
            record.updatedAt = nowIso();
            await writeAll(records);

            return { state: "finished", record };
        }

        const nextQuestion = {
            index: record.questions.length + 1,
            category: question.category,
            difficulty: question.difficulty,
            question: question.question,
            hint: question.hint || "",
            askedAt: nowIso(),
            answer: null,
            answeredAt: null,
            evaluation: null,
        };

        record.questions.push(nextQuestion);
        record.pendingQuestionAt = null;
        record.updatedAt = nowIso();
        await writeAll(records);

        return {
            state: "appended",
            record,
            question: toRoomQuestion(nextQuestion),
        };
    });
}

export async function clearQuestionPending(id) {
    if (typeof id !== "string" || !ID_PATTERN.test(id)) return;

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record || !record.pendingQuestionAt) return;

        record.pendingQuestionAt = null;
        record.updatedAt = nowIso();
        await writeAll(records);
    });
}

export async function submitAnswer(id, questionIndex, answer) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) return { state: "not_found" };
        if (record.status !== "in_progress") {
            return { state: "not_in_progress", record };
        }

        const index = Number(questionIndex);
        const question = record.questions.find((item) => item.index === index);

        if (!question) return { state: "invalid_question", record };

        if (hasSubmittedAnswer(question)) {
            return { state: "already_answered", record, question };
        }

        const last = record.questions[record.questions.length - 1];

        if (!last || last.index !== index) {
            return { state: "not_current", record };
        }

        // The raw submitted string is stored exactly as submitted. Only
        // validation uses trim(); the stored value is never rewritten.
        question.answer = answer;
        question.answeredAt = nowIso();
        record.updatedAt = question.answeredAt;
        await writeAll(records);

        return { state: "saved", record };
    });
}

export async function claimEvaluation(id) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) return { state: "not_found" };

        if (isReportComplete(record)) {
            return { state: "completed", record };
        }

        if (record.status === "evaluating") {
            const started = new Date(record.evaluationStartedAt || 0).getTime();

            if (
                Number.isFinite(started) &&
                Date.now() - started < EVALUATION_LOCK_MS
            ) {
                return { state: "evaluating", record };
            }
            // A stale evaluation (crashed process) may be taken over.
        }

        const counts = computeAnswerCounts(record.questions);

        if (counts.answered === 0) {
            return { state: "no_answers", record, counts };
        }

        record.status = "evaluating";
        record.evaluationStartedAt = nowIso();
        record.evaluationError = null;
        record.failedAt = null;
        record.updatedAt = nowIso();
        await writeAll(records);

        return { state: "claimed", record, counts };
    });
}

export async function saveCompletedReport(id, report) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) {
            throw new InterviewStoreError(
                "Interview result was not found.",
                "NOT_FOUND",
                404
            );
        }

        if (!report || !Array.isArray(report.questions)) {
            throw new InterviewStoreError(
                "The generated report is invalid.",
                "INVALID_REPORT",
                500
            );
        }

        const evaluations = new Map(
            report.questions.map((item) => [Number(item.index), item])
        );

        if (evaluations.size !== record.questions.length) {
            throw new InterviewStoreError(
                "The generated report does not cover every question.",
                "INVALID_REPORT",
                500
            );
        }

        // Only evaluations are merged. The original question text and the
        // exact submitted answer always remain untouched.
        record.questions = record.questions.map((question) => {
            const evaluated = evaluations.get(question.index);

            if (!evaluated || !evaluated.evaluation) {
                throw new InterviewStoreError(
                    "The generated report is missing a question evaluation.",
                    "INVALID_REPORT",
                    500
                );
            }

            return {
                ...question,
                evaluation: evaluated.evaluation,
            };
        });

        const counts = computeAnswerCounts(record.questions);

        if (counts.total !== Number(report.counts?.total)) {
            throw new InterviewStoreError(
                "The generated report has inconsistent question counts.",
                "INVALID_REPORT",
                500
            );
        }

        record.status = "completed";
        record.overallScore = report.overallScore;
        record.percentage = report.percentage;
        record.grade = report.grade;
        record.gradeLabel = report.gradeLabel;
        record.performanceGrade = report.performanceGrade;
        record.summary = report.summary;
        record.summarySource = report.summarySource;
        record.topicPerformance = report.topicPerformance;
        record.strongestTopic = report.strongestTopic;
        record.weakestTopic = report.weakestTopic;
        record.strengths = report.strengths;
        record.weaknesses = report.weaknesses;
        record.recommendations = report.recommendations;
        record.learningTips = report.learningTips;
        record.evaluationRubric = report.evaluationRubric;
        record.disclaimer = report.disclaimer || EVALUATION_DISCLAIMER;
        record.completedAt = nowIso();
        record.evaluatedAt = record.completedAt;
        record.evaluationStartedAt = null;
        record.evaluationError = null;
        record.failedAt = null;
        record.pendingQuestionAt = null;
        record.updatedAt = record.completedAt;

        await writeAll(records);

        return record;
    });
}

export async function failEvaluation(id, message) {
    assertId(id);

    return withStoreLock(async () => {
        const records = await readAll();
        const record = findRecord(records, id);

        if (!record) return null;
        if (isReportComplete(record)) return record;

        record.status = "failed";
        record.evaluationError = String(message || "Report generation failed.")
            .trim()
            .slice(0, 500);
        record.failedAt = nowIso();
        record.evaluationStartedAt = null;
        record.pendingQuestionAt = null;
        record.updatedAt = record.failedAt;

        await writeAll(records);

        return record;
    });
}

export function toSessionView(record) {
    if (!record) return null;

    return {
        id: record.id,
        status: record.status,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        completedAt: record.completedAt,
        failedAt: record.failedAt,
        evaluationError: record.evaluationError,
        config: record.config,
        counts: computeAnswerCounts(record.questions),
        questions: record.questions.map((question) => ({
            index: question.index,
            category: question.category,
            difficulty: question.difficulty,
            question: question.question,
            hint: question.hint,
            answer: question.answer,
            answered: hasSubmittedAnswer(question),
            answeredAt: question.answeredAt,
        })),
    };
}

export function toPublicInterview(record) {
    if (!record) return null;

    return {
        id: record.id,
        status: record.status,
        createdAt: record.createdAt,
        completedAt: record.completedAt,
        evaluatedAt: record.evaluatedAt,
        config: record.config,
        counts: computeAnswerCounts(record.questions),
        questionCount: record.questions.length,
        plannedQuestionCount: record.config?.questionCount || 0,
        overallScore: record.overallScore,
        percentage: record.percentage,
        grade: record.grade,
        gradeLabel: record.gradeLabel,
        performanceGrade: record.performanceGrade,
        summary: record.summary,
        summarySource: record.summarySource,
        topicPerformance: record.topicPerformance,
        strongestTopic: record.strongestTopic,
        weakestTopic: record.weakestTopic,
        strengths: record.strengths,
        weaknesses: record.weaknesses,
        recommendations: record.recommendations,
        learningTips: record.learningTips,
        evaluationRubric: record.evaluationRubric,
        disclaimer: record.disclaimer || EVALUATION_DISCLAIMER,
        questions: record.questions.map((question) => {
            const evaluation = question.evaluation || {};
            const answered = hasSubmittedAnswer(question);

            return {
                index: question.index,
                category: question.category,
                difficulty: question.difficulty,
                question: question.question,
                hint: question.hint,
                answer: answered ? question.answer : null,
                answered,
                answeredAt: question.answeredAt,
                score: answered ? evaluation.score ?? 0 : 0,
                status: answered
                    ? evaluation.status || "incorrect"
                    : "not_answered",
                criteria: answered ? evaluation.criteria || null : null,
                strengths: answered ? evaluation.strengths || [] : [],
                missingConcepts: answered
                    ? evaluation.missingConcepts || []
                    : [],
                idealAnswer: answered ? evaluation.idealAnswer || null : null,
                whyGood: answered ? evaluation.whyGood || "" : "",
                improvements: answered ? evaluation.improvements || [] : [],
                learningTips: answered ? evaluation.learningTips || [] : [],
            };
        }),
    };
}

function toSummary(record) {
    const counts = computeAnswerCounts(record.questions);

    return {
        id: record.id,
        status: record.status,
        createdAt: record.createdAt,
        completedAt: record.completedAt,
        config: record.config,
        overallScore: record.overallScore,
        percentage: record.percentage,
        grade: record.grade,
        gradeLabel: record.gradeLabel,
        performanceGrade: record.performanceGrade,
        summary: record.summary,
        summarySource: record.summarySource,
        questionCount: record.questions.length,
        plannedQuestionCount: record.config?.questionCount || 0,
        counts,
        topicPerformance: record.topicPerformance,
        strongestTopic: record.strongestTopic,
        weakestTopic: record.weakestTopic,
    };
}
