import {
    getCourseById,
    getCourseLesson,
    getCourseLessons,
} from "./courses";

export const LEARNING_PROGRESS_KEY = "edukind-learning-progress-v1";
export const PROGRESS_VERSION = 1;

export function createEmptyProgress() {
    return {
        version: PROGRESS_VERSION,
        courses: {},
        activity: [],
        quran: null,
    };
}

function isObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeLessonCompletions(value) {
    if (Array.isArray(value)) {
        return Object.fromEntries(
            value
                .filter((lessonId) => typeof lessonId === "string")
                .map((lessonId) => [lessonId, { completedAt: null }])
        );
    }

    if (!isObject(value)) return {};

    return Object.fromEntries(
        Object.entries(value)
            .filter(([lessonId]) => typeof lessonId === "string")
            .map(([lessonId, completion]) => [
                lessonId,
                isObject(completion) ? completion : { completedAt: null },
            ])
    );
}

function normalizeQuizAttempts(value) {
    if (!isObject(value)) return {};

    return Object.fromEntries(
        Object.entries(value)
            .filter(([lessonId, attempts]) => {
                return typeof lessonId === "string" && Array.isArray(attempts);
            })
            .map(([lessonId, attempts]) => [
                lessonId,
                attempts
                    .filter(isObject)
                    .slice(-10)
                    .map((attempt) => ({
                        at: attempt.at || null,
                        score: Number(attempt.score) || 0,
                        total: Number(attempt.total) || 0,
                        percentage: Math.min(
                            100,
                            Math.max(0, Number(attempt.percentage) || 0)
                        ),
                        passed: Boolean(attempt.passed),
                        answers: Array.isArray(attempt.answers)
                            ? attempt.answers
                            : [],
                    })),
            ])
    );
}

function normalizeRecord(record) {
    if (!isObject(record)) return null;

    return {
        enrolledAt: record.enrolledAt || null,
        updatedAt: record.updatedAt || record.enrolledAt || null,
        paused: Boolean(record.paused),
        currentLessonId:
            typeof record.currentLessonId === "string"
                ? record.currentLessonId
                : null,
        completedLessons: normalizeLessonCompletions(
            record.completedLessons
        ),
        quizAttempts: normalizeQuizAttempts(record.quizAttempts),
    };
}

export function normalizeLearningProgress(raw) {
    if (!isObject(raw)) return createEmptyProgress();

    const courses = {};

    if (isObject(raw.courses)) {
        for (const [courseId, record] of Object.entries(raw.courses)) {
            const normalized = normalizeRecord(record);

            if (normalized) courses[courseId] = normalized;
        }
    }

    return {
        version: PROGRESS_VERSION,
        courses,
        activity: Array.isArray(raw.activity)
            ? raw.activity.filter(isObject).slice(0, 60)
            : [],
        quran: isObject(raw.quran) ? raw.quran : null,
    };
}

export function readLearningProgress() {
    if (typeof window === "undefined") return createEmptyProgress();

    try {
        const raw = window.localStorage.getItem(LEARNING_PROGRESS_KEY);
        if (!raw) return createEmptyProgress();

        return normalizeLearningProgress(JSON.parse(raw));
    } catch {
        return createEmptyProgress();
    }
}

export function writeLearningProgress(progress) {
    if (typeof window === "undefined") return false;

    try {
        window.localStorage.setItem(
            LEARNING_PROGRESS_KEY,
            JSON.stringify(progress)
        );
        return true;
    } catch {
        return false;
    }
}

export function getCourseRecord(progress, courseId) {
    return progress?.courses?.[courseId] || null;
}

export function isLessonComplete(record, lessonId) {
    return Boolean(record?.completedLessons?.[lessonId]);
}

export function getCourseCompletion(course, record) {
    const lessons = getCourseLessons(course);
    const completedLessons = lessons.filter((lesson) =>
        isLessonComplete(record, lesson.id)
    );

    return {
        totalLessons: lessons.length,
        completedLessons: completedLessons.length,
        percentage:
            lessons.length > 0
                ? Math.round(
                    (completedLessons.length / lessons.length) * 100
                )
                : 0,
        completedLessonIds: completedLessons.map((lesson) => lesson.id),
    };
}

export function getCourseStatus(course, record) {
    if (!record) return "not-started";

    const completion = getCourseCompletion(course, record);

    if (
        completion.totalLessons > 0 &&
        completion.completedLessons >= completion.totalLessons
    ) {
        return "completed";
    }

    if (record.paused) return "paused";

    return "in-progress";
}

export function getCurrentCourseLesson(course, record) {
    const lessons = getCourseLessons(course);

    if (lessons.length === 0) return null;

    if (record?.currentLessonId) {
        const current = getCourseLesson(course, record.currentLessonId);

        if (current) return current;
    }

    return lessons.find((lesson) => !isLessonComplete(record, lesson.id)) || lessons[0];
}

export function getNextUnfinishedLesson(course, record) {
    return (
        getCourseLessons(course).find(
            (lesson) => !isLessonComplete(record, lesson.id)
        ) || null
    );
}

export function isLessonUnlocked(course, record, lessonId) {
    if (!record) return false;

    const lessons = getCourseLessons(course);
    const index = lessons.findIndex((lesson) => lesson.id === lessonId);

    if (index === -1) return false;
    if (isLessonComplete(record, lessonId)) return true;
    if (!course.sequential) return true;
    if (index === 0) return true;

    return lessons
        .slice(0, index)
        .every((lesson) => isLessonComplete(record, lesson.id));
}

export function getLessonStatus(course, record, lessonId) {
    if (!record) return "not-enrolled";
    if (isLessonComplete(record, lessonId)) return "completed";
    if (!isLessonUnlocked(course, record, lessonId)) return "locked";
    if (record.currentLessonId === lessonId) return "current";

    return "available";
}

export function getLatestQuizAttempt(record, lessonId) {
    const attempts = record?.quizAttempts?.[lessonId];

    if (!Array.isArray(attempts) || attempts.length === 0) return null;

    return attempts[attempts.length - 1];
}

export function getBestQuizAttempt(record, lessonId) {
    const attempts = record?.quizAttempts?.[lessonId];

    if (!Array.isArray(attempts) || attempts.length === 0) return null;

    return attempts.reduce((best, attempt) =>
        attempt.percentage > best.percentage ? attempt : best
    );
}

export function hasPassedLessonQuiz(record, lesson) {
    if (!lesson?.quiz?.length) return true;

    const best = getBestQuizAttempt(record, lesson.id);
    const passingScore = Number(lesson.passingScore) || 70;

    return Boolean(best && best.percentage >= passingScore);
}

export function canCompleteLesson(course, record, lesson) {
    if (!record || !course || !lesson) return false;
    if (isLessonComplete(record, lesson.id)) return true;
    if (!isLessonUnlocked(course, record, lesson.id)) return false;

    return hasPassedLessonQuiz(record, lesson);
}

export function getEnrollmentSummaries(progress) {
    if (!progress?.courses) return [];

    return Object.entries(progress.courses)
        .map(([courseId, record]) => {
            const course = getCourseById(courseId);
            if (!course) return null;

            return {
                course,
                record,
                status: getCourseStatus(course, record),
                completion: getCourseCompletion(course, record),
                currentLesson: getCurrentCourseLesson(course, record),
            };
        })
        .filter(Boolean);
}

export function getLearningStats(progress) {
    const enrollments = getEnrollmentSummaries(progress);
    const activeCourses = enrollments.filter(
        (item) => item.status === "in-progress"
    );
    const pausedCourses = enrollments.filter(
        (item) => item.status === "paused"
    );
    const completedCourses = enrollments.filter(
        (item) => item.status === "completed"
    );
    const totalLessons = enrollments.reduce(
        (total, item) => total + item.completion.totalLessons,
        0
    );
    const completedLessons = enrollments.reduce(
        (total, item) => total + item.completion.completedLessons,
        0
    );

    const quizAttempts = getQuizAttemptHistory(progress);
    const averageQuizScore =
        quizAttempts.length > 0
            ? Math.round(
                quizAttempts.reduce(
                    (total, attempt) => total + attempt.percentage,
                    0
                ) / quizAttempts.length
            )
            : null;

    return {
        enrolledCount: enrollments.length,
        activeCount: activeCourses.length,
        pausedCount: pausedCourses.length,
        completedCount: completedCourses.length,
        totalLessons,
        completedLessons,
        overallPercentage:
            totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0,
        quizAttemptCount: quizAttempts.length,
        averageQuizScore,
        activeCourses,
        pausedCourses,
        completedCourses,
        enrollments,
    };
}

export function getQuizAttemptHistory(progress) {
    const results = [];

    for (const { course, record } of getEnrollmentSummaries(progress)) {
        const lessons = getCourseLessons(course);

        for (const lesson of lessons) {
            const attempts = record.quizAttempts?.[lesson.id];

            if (!Array.isArray(attempts)) continue;

            for (const attempt of attempts) {
                results.push({
                    ...attempt,
                    courseId: course.id,
                    courseTitle: course.title,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    moduleTitle: lesson.moduleTitle,
                    href: `/deen-islam/learning/courses/${course.id}/lessons/${lesson.id}`,
                });
            }
        }
    }

    return results.sort(
        (a, b) =>
            new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime()
    );
}

export function getRevisionTopics(progress) {
    const topics = [];

    for (const { course, record } of getEnrollmentSummaries(progress)) {
        for (const lesson of getCourseLessons(course)) {
            if (!lesson.quiz?.length) continue;

            const latest = getLatestQuizAttempt(record, lesson.id);
            const passingScore = Number(lesson.passingScore) || 70;

            if (latest && latest.percentage < passingScore) {
                topics.push({
                    courseId: course.id,
                    courseTitle: course.title,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                    moduleTitle: lesson.moduleTitle,
                    percentage: latest.percentage,
                    passingScore,
                    attemptedAt: latest.at,
                    href: `/deen-islam/learning/courses/${course.id}/lessons/${lesson.id}`,
                });
            }
        }
    }

    return topics.sort(
        (a, b) =>
            new Date(b.attemptedAt || 0).getTime() -
            new Date(a.attemptedAt || 0).getTime()
    );
}

export function getRecentLearningActivity(progress, limit = 8) {
    const activity = Array.isArray(progress?.activity)
        ? progress.activity
        : [];

    return activity
        .slice()
        .sort((a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime())
        .slice(0, limit)
        .map((item) => {
            const course = item.courseId ? getCourseById(item.courseId) : null;
            const lesson =
                course && item.lessonId
                    ? getCourseLesson(course, item.lessonId)
                    : null;

            return {
                ...item,
                courseTitle: course?.title || null,
                lessonTitle: lesson?.title || null,
                href:
                    course && lesson
                        ? `/deen-islam/learning/courses/${course.id}/lessons/${lesson.id}`
                        : course
                            ? `/deen-islam/learning/courses/${course.id}`
                            : null,
            };
        });
}

export function getRecentlyStudiedLessons(progress, limit = 4) {
    const seen = new Set();
    const lessons = [];

    for (const item of getRecentLearningActivity(progress, 30)) {
        if (!item.courseId || !item.lessonId || !item.href) continue;

        const key = `${item.courseId}:${item.lessonId}`;
        if (seen.has(key)) continue;

        seen.add(key);
        lessons.push(item);

        if (lessons.length >= limit) break;
    }

    return lessons;
}

export function getResumeHref(course, record) {
    const current = getCurrentCourseLesson(course, record);

    if (!current) return `/deen-islam/learning/courses/${course.id}`;

    return `/deen-islam/learning/courses/${course.id}/lessons/${current.id}`;
}

export function getQuranProgress(progress) {
    return progress?.quran || null;
}
