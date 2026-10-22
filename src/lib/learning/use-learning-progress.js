"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourseLessons } from "./courses";
import {
    LEARNING_PROGRESS_KEY,
    createEmptyProgress,
    hasPassedLessonQuiz,
    isLessonComplete,
    isLessonUnlocked,
    readLearningProgress,
    writeLearningProgress,
} from "./progress";

function activityId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function withActivity(progress, entry) {
    const now = new Date().toISOString();
    const item = {
        id: activityId(),
        at: now,
        ...entry,
    };

    const activity = progress.activity.filter((existing) => {
        if (existing.type !== entry.type) return true;
        if (entry.type === "quran-read") {
            return Number(existing.surahNumber) !== Number(entry.surahNumber);
        }

        return !(
            existing.courseId === entry.courseId &&
            existing.lessonId === entry.lessonId
        );
    });

    return {
        ...progress,
        activity: [item, ...activity].slice(0, 60),
    };
}

function emptyCourseRecord(firstLessonId) {
    const now = new Date().toISOString();

    return {
        enrolledAt: now,
        updatedAt: now,
        paused: false,
        currentLessonId: firstLessonId,
        completedLessons: {},
        quizAttempts: {},
    };
}

export function useLearningProgress() {
    const [progress, setProgress] = useState(createEmptyProgress);
    const [ready, setReady] = useState(false);
    const [storageError, setStorageError] = useState(false);

    useEffect(() => {
        const load = () => {
            setProgress(readLearningProgress());
            setReady(true);
        };

        load();

        const handleStorage = (event) => {
            if (!event.key || event.key === LEARNING_PROGRESS_KEY) {
                load();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    const commit = useCallback((update) => {
        setProgress((previous) => {
            const next = update(previous);
            if (next === previous) return previous;

            if (!writeLearningProgress(next)) {
                setStorageError(true);
            }

            return next;
        });
    }, []);

    const enrollCourse = useCallback(
        (course) => {
            const firstLesson = getCourseLessons(course)[0];
            if (!firstLesson) return;

            commit((previous) => {
                if (previous.courses[course.id]) return previous;

                const record = emptyCourseRecord(firstLesson.id);
                const withCourse = {
                    ...previous,
                    courses: {
                        ...previous.courses,
                        [course.id]: record,
                    },
                };

                return withActivity(withCourse, {
                    type: "course-enrolled",
                    courseId: course.id,
                    label: `Started ${course.title}`,
                });
            });
        },
        [commit]
    );

    const openLesson = useCallback(
        (course, lesson) => {
            if (!course || !lesson) return;

            commit((previous) => {
                const record = previous.courses[course.id];
                if (!record) return previous;

                const now = new Date().toISOString();
                const nextRecord = {
                    ...record,
                    currentLessonId: lesson.id,
                    paused: false,
                    updatedAt: now,
                };

                const withCourse = {
                    ...previous,
                    courses: {
                        ...previous.courses,
                        [course.id]: nextRecord,
                    },
                };

                return withActivity(withCourse, {
                    type: "lesson-opened",
                    courseId: course.id,
                    lessonId: lesson.id,
                    label: `Opened ${lesson.title}`,
                });
            });
        },
        [commit]
    );

    const saveQuizAttempt = useCallback(
        (course, lesson, attempt) => {
            if (!course || !lesson || !attempt) return;

            commit((previous) => {
                const record = previous.courses[course.id];
                if (!record) return previous;

                const previousAttempts =
                    record.quizAttempts?.[lesson.id] || [];
                const nextAttempt = {
                    at: new Date().toISOString(),
                    score: Number(attempt.score) || 0,
                    total: Number(attempt.total) || 0,
                    percentage: Number(attempt.percentage) || 0,
                    passed: Boolean(attempt.passed),
                    answers: Array.isArray(attempt.answers)
                        ? attempt.answers
                        : [],
                };

                const nextRecord = {
                    ...record,
                    updatedAt: nextAttempt.at,
                    quizAttempts: {
                        ...record.quizAttempts,
                        [lesson.id]: [
                            ...previousAttempts,
                            nextAttempt,
                        ].slice(-10),
                    },
                };

                const withCourse = {
                    ...previous,
                    courses: {
                        ...previous.courses,
                        [course.id]: nextRecord,
                    },
                };

                return withActivity(withCourse, {
                    type: "quiz-attempt",
                    courseId: course.id,
                    lessonId: lesson.id,
                    label: `Knowledge check: ${lesson.title} (${nextAttempt.percentage}%)`,
                });
            });
        },
        [commit]
    );

    const completeLesson = useCallback(
        (course, lesson) => {
            if (!course || !lesson) return;

            commit((previous) => {
                const existing = previous.courses[course.id];
                const firstLesson = getCourseLessons(course)[0];
                if (!firstLesson) return previous;

                const record = existing || emptyCourseRecord(firstLesson.id);

                if (isLessonComplete(record, lesson.id)) return previous;
                if (!isLessonUnlocked(course, record, lesson.id)) {
                    return previous;
                }
                if (!hasPassedLessonQuiz(record, lesson)) return previous;

                const now = new Date().toISOString();
                const completedLessons = {
                    ...record.completedLessons,
                    [lesson.id]: {
                        completedAt: now,
                        quizPercentage: (() => {
                            const attempts =
                                record.quizAttempts?.[lesson.id] || [];
                            if (attempts.length === 0) return null;

                            return Math.max(
                                ...attempts.map((item) => item.percentage)
                            );
                        })(),
                    },
                };

                const remaining = getCourseLessons(course).find(
                    (item) => !completedLessons[item.id]
                );

                const nextRecord = {
                    ...record,
                    enrolledAt: record.enrolledAt || now,
                    updatedAt: now,
                    paused: false,
                    completedLessons,
                    currentLessonId: remaining?.id || lesson.id,
                };

                const withCourse = {
                    ...previous,
                    courses: {
                        ...previous.courses,
                        [course.id]: nextRecord,
                    },
                };

                if (!remaining) {
                    return withActivity(withCourse, {
                        type: "course-completed",
                        courseId: course.id,
                        lessonId: lesson.id,
                        label: `Completed ${course.title}`,
                    });
                }

                return withActivity(withCourse, {
                    type: "lesson-completed",
                    courseId: course.id,
                    lessonId: lesson.id,
                    label: `Completed ${lesson.title}`,
                });
            });
        },
        [commit]
    );

    const togglePauseCourse = useCallback(
        (course) => {
            if (!course) return;

            commit((previous) => {
                const record = previous.courses[course.id];
                if (!record) return previous;

                return {
                    ...previous,
                    courses: {
                        ...previous.courses,
                        [course.id]: {
                            ...record,
                            paused: !record.paused,
                            updatedAt: new Date().toISOString(),
                        },
                    },
                };
            });
        },
        [commit]
    );

    const recordQuranPosition = useCallback(
        ({ surahNumber, surahName, ayahNumber = 1 }) => {
            const number = Number(surahNumber);
            if (!Number.isInteger(number) || number < 1 || number > 114) {
                return;
            }

            commit((previous) => {
                const now = new Date().toISOString();
                const withQuran = {
                    ...previous,
                    quran: {
                        surahNumber: number,
                        surahName: surahName || `Surah ${number}`,
                        ayahNumber: Number(ayahNumber) || 1,
                        updatedAt: now,
                    },
                };

                return withActivity(withQuran, {
                    type: "quran-read",
                    surahNumber: number,
                    label: `Read ${surahName || `Surah ${number}`}`,
                });
            });
        },
        [commit]
    );

    const resetProgress = useCallback(() => {
        commit(() => createEmptyProgress());
    }, [commit]);

    return {
        progress,
        ready,
        storageError,
        enrollCourse,
        openLesson,
        saveQuizAttempt,
        completeLesson,
        togglePauseCourse,
        recordQuranPosition,
        resetProgress,
    };
}
