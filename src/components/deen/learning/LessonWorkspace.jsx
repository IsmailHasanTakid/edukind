"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BookOpenText,
    CheckCircle2,
    ChevronRight,
    Circle,
    Clock3,
    ExternalLink,
    FileText,
    Layers3,
    Lightbulb,
    ListChecks,
    LockKeyhole,
    Play,
    Target,
} from "lucide-react";
import LessonAssistant from "./LessonAssistant";
import LessonQuiz from "./LessonQuiz";
import {
    LearningFooter,
    LevelBadge,
    ProgressBar,
    formatMinutes,
} from "./learning-ui";
import {
    getCourseHref,
    getCourseLessons,
    getNextCourseLesson,
} from "@/lib/learning/courses";
import {
    getCourseCompletion,
    getCurrentCourseLesson,
    getLatestQuizAttempt,
    hasPassedLessonQuiz,
    isLessonComplete,
    isLessonUnlocked,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

function WorkspaceSkeleton() {
    return (
        <main className="min-h-full bg-[#F5F8F6]">
            <div className="mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10">
                <div className="h-4 w-44 animate-pulse rounded bg-[#E3EBE5]" />
                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        <div className="h-8 w-2/3 animate-pulse rounded bg-[#E3EBE5]" />
                        <div className="h-4 w-1/2 animate-pulse rounded bg-[#EDF2EE]" />
                        <div className="h-72 animate-pulse rounded-2xl bg-white" />
                    </div>
                    <div className="h-96 animate-pulse rounded-2xl bg-white" />
                </div>
            </div>
        </main>
    );
}

function StartGate({ course, onStart, disabled }) {
    return (
        <main className="min-h-full bg-[#F5F8F6]">
            <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
                <div className="rounded-3xl border border-[#DCE8DF] bg-white p-6 text-center shadow-[0_20px_50px_-35px_rgba(20,60,45,0.45)] sm:p-9">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]">
                        <LockKeyhole size={24} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8A978F]">
                        Course access
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-[#12362B] sm:text-3xl">
                        Start {course.title} first
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A887F]">
                        Lessons unlock in sequence. Start the course from the
                        beginning, then complete each lesson to open the next
                        one. You can always revisit completed lessons.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={onStart}
                            disabled={disabled}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B] disabled:opacity-50"
                        >
                            <Play size={13} aria-hidden="true" />
                            Start course
                        </button>
                        <Link
                            href={getCourseHref(course.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            View roadmap
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

function LockedGate({ course, record }) {
    const current = getCurrentCourseLesson(course, record);
    const currentHref = current
        ? `/deen-islam/learning/courses/${course.id}/lessons/${current.id}`
        : getCourseHref(course.id);

    return (
        <main className="min-h-full bg-[#F5F8F6]">
            <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
                <div className="rounded-3xl border border-[#DCE8DF] bg-white p-6 text-center shadow-[0_20px_50px_-35px_rgba(20,60,45,0.45)] sm:p-9">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E5EBE6] bg-[#F5F8F6] text-[#8A978F]">
                        <LockKeyhole size={24} aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8A978F]">
                        Lesson locked
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-[#12362B] sm:text-3xl">
                        Complete the previous lesson first
                    </h1>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A887F]">
                        This course follows a required sequence so that each
                        lesson builds on the one before it. Completed lessons
                        remain available for review.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href={currentHref}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                        >
                            Go to current lesson
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                        <Link
                            href={getCourseHref(course.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            View roadmap
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function LessonWorkspace({ course, lesson }) {
    const router = useRouter();
    const {
        progress,
        ready,
        storageError,
        enrollCourse,
        openLesson,
        completeLesson,
        saveQuizAttempt,
    } = useLearningProgress();
    const [pendingCompletion, setPendingCompletion] = useState(false);

    const record = progress.courses[course.id];
    const enrolled = Boolean(record);
    const completion = getCourseCompletion(course, record);
    const lessons = useMemo(() => getCourseLessons(course), [course]);
    const currentLesson = getCurrentCourseLesson(course, record);
    const lessonIndex = lessons.findIndex((item) => item.id === lesson.id);
    const previousLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
    const nextLesson = getNextCourseLesson(course, lesson.id);
    const nextLessonId = nextLesson?.id || null;
    const completed = isLessonComplete(record, lesson.id);
    const unlocked =
        enrolled && isLessonUnlocked(course, record, lesson.id);
    const quizPassed = hasPassedLessonQuiz(record, lesson);
    const requiresQuiz = Boolean(lesson.quiz?.length);
    const latestAttempt = getLatestQuizAttempt(record, lesson.id);
    const canCompleteNow =
        enrolled && unlocked && !completed && (!requiresQuiz || quizPassed);

    useEffect(() => {
        if (!ready || !enrolled) return;
        if (!isLessonUnlocked(course, record, lesson.id)) return;

        openLesson(course, lesson);
        // Only run when the route or enrollment state changes. The progress
        // update from openLesson must not retrigger this effect.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, enrolled, course.id, lesson.id]);

    useEffect(() => {
        if (!pendingCompletion || !completed) return;

        if (nextLessonId) {
            router.push(
                `/deen-islam/learning/courses/${course.id}/lessons/${nextLessonId}`
            );
        } else {
            router.push(getCourseHref(course.id));
        }
        // The completion record is written before this effect observes it.
    }, [pendingCompletion, completed, nextLessonId, course.id, router]);

    if (!ready) return <WorkspaceSkeleton />;

    if (!enrolled) {
        return (
            <StartGate
                course={course}
                disabled={false}
                onStart={() => enrollCourse(course)}
            />
        );
    }

    if (!unlocked) {
        return <LockedGate course={course} record={record} />;
    }

    function markComplete() {
        if (!canCompleteNow || pendingCompletion) return;
        setPendingCompletion(true);
        completeLesson(course, lesson);
    }

    const nextHref = nextLesson
        ? `/deen-islam/learning/courses/${course.id}/lessons/${nextLesson.id}`
        : getCourseHref(course.id);

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[280px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(31,138,91,0.07), transparent 66%)",
                }}
            />

            <div className="relative mx-auto max-w-[1280px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#8A978F]"
                >
                    <Link
                        href="/deen-islam/learning/courses"
                        className="transition hover:text-[#1B7A53]"
                    >
                        Explore Courses
                    </Link>
                    <ChevronRight size={11} aria-hidden="true" />
                    <Link
                        href={getCourseHref(course.id)}
                        className="transition hover:text-[#1B7A53]"
                    >
                        {course.title}
                    </Link>
                    <ChevronRight size={11} aria-hidden="true" />
                    <span className="font-medium text-[#5F6F66]">
                        {lesson.title}
                    </span>
                </nav>

                <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_310px] xl:items-start">
                    <div className="min-w-0">
                        <header className="rounded-2xl border border-[#E0E9E3] bg-white p-5 sm:p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <LevelBadge level={course.level} />
                                <span className="rounded-full border border-[#DCE5DF] bg-[#F8FBF9] px-2.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#5F6F66]">
                                    {lesson.moduleTitle}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#DCE5DF] bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#5F6F66]">
                                    <Clock3 size={10} aria-hidden="true" />
                                    {formatMinutes(lesson.estimatedMinutes)}
                                </span>
                                {completed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[#CFE6D8] bg-[#EAF4EE] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#1B7A53]">
                                        <CheckCircle2
                                            size={10}
                                            aria-hidden="true"
                                        />
                                        Completed
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#12362B] sm:text-3xl lg:text-4xl">
                                {lesson.title}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm sm:text-base leading-6 text-[#64756C]">
                                {lesson.summary}
                            </p>

                            <div className="mt-4 border-t border-[#EDF2EE] pt-4">
                                <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                                    <span className="font-medium text-[#7A887F]">
                                        Course progress
                                    </span>
                                    <span className="font-semibold text-[#1B6B4B]">
                                        {completion.completedLessons}/
                                        {completion.totalLessons} lessons ·{" "}
                                        {completion.percentage}%
                                    </span>
                                </div>
                                <ProgressBar
                                    value={completion.percentage}
                                    label={`${course.title} course progress`}
                                    className="mt-2"
                                />
                            </div>
                        </header>

                        {storageError ? (
                            <p
                                role="alert"
                                className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm leading-5 text-amber-800"
                            >
                                Progress could not be saved in this browser.
                                Complete the lesson before leaving so you do
                                not lose your place.
                            </p>
                        ) : null}

                        <div className="mt-4 space-y-4">
                            <section className="rounded-2xl border border-[#E0E9E3] bg-white p-5 sm:p-6">
                                <div className="flex items-center gap-2">
                                    <Target
                                        size={16}
                                        aria-hidden="true"
                                        className="text-[#1B7A53]"
                                    />
                                    <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                        Learning objectives
                                    </h2>
                                </div>
                                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {lesson.objectives.map((objective) => (
                                        <li
                                            key={objective}
                                            className="flex gap-2 rounded-xl bg-[#F8FBF9] px-3 py-2.5 text-xs sm:text-sm leading-5 text-[#5F6F66]"
                                        >
                                            <CheckCircle2
                                                size={13}
                                                aria-hidden="true"
                                                className="mt-0.5 shrink-0 text-[#1B7A53]"
                                            />
                                            {objective}
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {lesson.sections.map((section, index) => (
                                <section
                                    key={`${section.heading}-${index}`}
                                    className="rounded-2xl border border-[#E0E9E3] bg-white p-5 sm:p-6"
                                >
                                    <h2 className="text-base sm:text-lg font-semibold text-[#173B2D]">
                                        {section.heading}
                                    </h2>

                                    {section.paragraphs?.map((paragraph) => (
                                        <p
                                            key={paragraph}
                                            className="mt-2.5 text-sm sm:text-base leading-7 text-[#5F6F66]"
                                        >
                                            {paragraph}
                                        </p>
                                    ))}

                                    {section.points?.length ? (
                                        <ul className="mt-3 space-y-2">
                                            {section.points.map((point) => (
                                                <li
                                                    key={point}
                                                    className="flex gap-2 text-xs sm:text-sm leading-6 text-[#5F6F66]"
                                                >
                                                    <Circle
                                                        size={5}
                                                        aria-hidden="true"
                                                        className="mt-2.5 shrink-0 fill-[#1B7A53] text-[#1B7A53]"
                                                    />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : null}
                                </section>
                            ))}

                            {lesson.completionNote ? (
                                <p className="rounded-2xl border border-[#EADFC8] bg-[#FBF7EC] px-4 py-3 text-xs sm:text-sm leading-6 text-[#8A6418]">
                                    {lesson.completionNote}
                                </p>
                            ) : null}

                            {lesson.exercise ? (
                                <section className="rounded-2xl border border-[#DCE8DF] bg-[#F2F9F5] p-5 sm:p-6">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb
                                            size={16}
                                            aria-hidden="true"
                                            className="text-[#1B7A53]"
                                        />
                                        <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                            Exercise: {lesson.exercise.title}
                                        </h2>
                                    </div>
                                    <p className="mt-2 text-xs sm:text-sm leading-6 text-[#4E6B5A]">
                                        {lesson.exercise.instructions}
                                    </p>
                                </section>
                            ) : null}

                            {lesson.resources?.length ? (
                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-5 sm:p-6">
                                    <div className="flex items-center gap-2">
                                        <BookOpenText
                                            size={16}
                                            aria-hidden="true"
                                            className="text-[#1B7A53]"
                                        />
                                        <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                            Lesson resources
                                        </h2>
                                    </div>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                        {lesson.resources.map((resource) => {
                                            const external =
                                                resource.href.startsWith(
                                                    "http"
                                                );

                                            return (
                                                <a
                                                    key={`${resource.label}-${resource.href}`}
                                                    href={resource.href}
                                                    {...(external
                                                        ? {
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                        }
                                                        : {})}
                                                    className="group rounded-xl border border-[#E7EEE9] bg-[#FBFDFB] px-3.5 py-3 transition hover:border-[#BFD9C9] hover:bg-[#F5FAF7]"
                                                >
                                                    <span className="flex items-start justify-between gap-2">
                                                        <span className="text-xs sm:text-sm font-semibold text-[#294B3A]">
                                                            {resource.label}
                                                        </span>
                                                        {external ? (
                                                            <ExternalLink
                                                                size={12}
                                                                aria-hidden="true"
                                                                className="mt-0.5 shrink-0 text-[#8A978F] group-hover:text-[#1B7A53]"
                                                            />
                                                        ) : (
                                                            <ArrowRight
                                                                size={12}
                                                                aria-hidden="true"
                                                                className="mt-0.5 shrink-0 text-[#8A978F] transition group-hover:translate-x-0.5 group-hover:text-[#1B7A53]"
                                                            />
                                                        )}
                                                    </span>
                                                    {resource.note ? (
                                                        <span className="mt-1 block text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                                                            {resource.note}
                                                        </span>
                                                    ) : null}
                                                </a>
                                            );
                                        })}
                                    </div>
                                </section>
                            ) : null}

                            <LessonQuiz
                                lesson={lesson}
                                record={record}
                                onAttempt={(attempt) =>
                                    saveQuizAttempt(course, lesson, attempt)
                                }
                            />

                            <section
                                aria-labelledby="completion-heading"
                                className="rounded-2xl border border-[#E0E9E3] bg-white p-5 sm:p-6"
                            >
                                <div className="flex items-center gap-2">
                                    <ListChecks
                                        size={16}
                                        aria-hidden="true"
                                        className="text-[#1B7A53]"
                                    />
                                    <h2
                                        id="completion-heading"
                                        className="text-sm sm:text-base font-semibold text-[#173B2D]"
                                    >
                                        Lesson completion
                                    </h2>
                                </div>

                                {completed ? (
                                    <div className="mt-3 rounded-xl border border-[#CFE6D8] bg-[#F2F9F5] px-4 py-3">
                                        <p className="flex items-center gap-2 text-sm sm:text-base font-semibold text-[#1B6B4B]">
                                            <CheckCircle2
                                                size={14}
                                                aria-hidden="true"
                                            />
                                            This lesson is complete
                                        </p>
                                        <p className="mt-1 text-xs sm:text-sm leading-5 text-[#5F6F66]">
                                            You can revise this lesson at any
                                            time, or continue with the next
                                            unlocked lesson.
                                        </p>
                                        <Link
                                            href={nextHref}
                                            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                                        >
                                            {nextLesson
                                                ? "Continue to next lesson"
                                                : "Back to course roadmap"}
                                            <ArrowRight
                                                size={13}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <p className="mt-2 text-xs sm:text-sm leading-6 text-[#7A887F]">
                                            Opening a lesson does not mark it
                                            complete.{" "}
                                            {requiresQuiz
                                                ? `Pass the knowledge check with ${lesson.passingScore || 70}% or higher, then mark the lesson complete.`
                                                : "Finish the reading and practice, then mark the lesson complete."}
                                        </p>

                                        {requiresQuiz && !quizPassed ? (
                                            <p className="mt-3 rounded-xl border border-[#EADFC8] bg-[#FCF8EF] px-3 py-2.5 text-xs sm:text-sm leading-5 text-[#8A6418]">
                                                {latestAttempt
                                                    ? `Your latest score is ${latestAttempt.percentage}%. Review the explanations and retake the check to unlock completion.`
                                                    : "Complete the knowledge check above to unlock the completion button."}
                                            </p>
                                        ) : null}

                                        <div className="mt-4 flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={markComplete}
                                                disabled={
                                                    !canCompleteNow ||
                                                    pendingCompletion
                                                }
                                                className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B] disabled:cursor-not-allowed disabled:opacity-45"
                                            >
                                                {pendingCompletion ? (
                                                    <>
                                                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2
                                                            size={13}
                                                            aria-hidden="true"
                                                        />
                                                        Mark lesson complete
                                                    </>
                                                )}
                                            </button>

                                            {previousLesson ? (
                                                <Link
                                                    href={`/deen-islam/learning/courses/${course.id}/lessons/${previousLesson.id}`}
                                                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                                                >
                                                    <ArrowLeft
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                    Previous
                                                </Link>
                                            ) : null}

                                            <span
                                                aria-disabled="true"
                                                className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-[#E5EBE6] bg-[#F7FAF8] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#A0ABA3]"
                                            >
                                                Next
                                                <ArrowRight
                                                    size={13}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        </div>
                                    </>
                                )}
                            </section>

                            <LessonAssistant
                                course={course}
                                lesson={lesson}
                            />
                        </div>

                        {completed && previousLesson ? (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#E0E9E3] bg-white px-4 py-3">
                                <Link
                                    href={`/deen-islam/learning/courses/${course.id}/lessons/${previousLesson.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5F6F66] transition hover:text-[#1B7A53]"
                                >
                                    <ArrowLeft size={12} aria-hidden="true" />
                                    Previous: {previousLesson.title}
                                </Link>
                                <Link
                                    href={nextHref}
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                                >
                                    {nextLesson ? "Next lesson" : "Course roadmap"}
                                    <ArrowRight size={12} aria-hidden="true" />
                                </Link>
                            </div>
                        ) : null}
                    </div>

                    <aside className="space-y-4 xl:sticky xl:top-5">
                        <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                    Course roadmap
                                </h2>
                                <Link
                                    href={getCourseHref(course.id)}
                                    className="text-[11px] sm:text-xs font-semibold text-[#1B7A53] hover:text-[#14563B]"
                                >
                                    Full view
                                </Link>
                            </div>

                            <div className="mt-3 space-y-3">
                                {course.modules.map((module, moduleIndex) => (
                                    <div key={module.id}>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#9AA69D]">
                                            Module {moduleIndex + 1}
                                        </p>
                                        <p className="mt-0.5 text-xs sm:text-sm font-medium leading-4 text-[#5F6F66]">
                                            {module.title}
                                        </p>

                                        <div className="mt-1.5 space-y-0.5">
                                            {module.lessons.map(
                                                (moduleLesson, index) => {
                                                    const moduleRecord =
                                                        progress.courses[
                                                            course.id
                                                        ];
                                                    const done =
                                                        moduleRecord
                                                            ?.completedLessons?.[
                                                            moduleLesson.id
                                                        ];
                                                    const lessonUnlocked =
                                                        isLessonUnlocked(
                                                            course,
                                                            moduleRecord,
                                                            moduleLesson.id
                                                        );
                                                    const isCurrent =
                                                        moduleLesson.id ===
                                                        lesson.id;
                                                    const href = `/deen-islam/learning/courses/${course.id}/lessons/${moduleLesson.id}`;

                                                    return lessonUnlocked ? (
                                                        <Link
                                                            key={moduleLesson.id}
                                                            href={href}
                                                            aria-current={
                                                                isCurrent
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                            className={`flex items-start gap-2 rounded-lg px-2 py-1.5 transition ${
                                                                isCurrent
                                                                    ? "bg-[#ECF7F2] text-[#12755A]"
                                                                    : "text-[#6A7A70] hover:bg-[#F5F9F6]"
                                                            }`}
                                                        >
                                                            <span className="mt-0.5 shrink-0">
                                                                {done ? (
                                                                    <CheckCircle2
                                                                        size={
                                                                            11
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="text-[#1B7A53]"
                                                                    />
                                                                ) : isCurrent ? (
                                                                    <Play
                                                                        size={
                                                                            10
                                                                        }
                                                                        aria-hidden="true"
                                                                        className="fill-[#12755A]"
                                                                    />
                                                                ) : (
                                                                    <Circle
                                                                        size={
                                                                            9
                                                                        }
                                                                        aria-hidden="true"
                                                                    />
                                                                )}
                                                            </span>
                                                            <span className="text-[11px] sm:text-xs font-medium leading-4">
                                                                {index + 1}.{" "}
                                                                {
                                                                    moduleLesson.title
                                                                }
                                                            </span>
                                                        </Link>
                                                    ) : (
                                                        <div
                                                            key={moduleLesson.id}
                                                            aria-disabled="true"
                                                            className="flex items-start gap-2 px-2 py-1.5 text-[#A0ABA3]"
                                                        >
                                                            <LockKeyhole
                                                                size={10}
                                                                aria-hidden="true"
                                                                className="mt-0.5 shrink-0"
                                                            />
                                                            <span className="text-[11px] sm:text-xs font-medium leading-4">
                                                                {index + 1}.{" "}
                                                                {
                                                                    moduleLesson.title
                                                                }
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-4 text-white">
                            <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-[#E7CE93]">
                                <FileText size={13} aria-hidden="true" />
                                Lesson type
                            </p>
                            <p className="mt-2 text-sm sm:text-base font-semibold">
                                {lesson.type === "assessment"
                                    ? "Final knowledge check"
                                    : lesson.quiz?.length
                                        ? "Reading, practice, and knowledge check"
                                        : "Reading and guided practice"}
                            </p>
                            <p className="mt-1.5 text-xs sm:text-sm leading-5 text-emerald-50/55">
                                {lesson.type === "assessment"
                                    ? "This is an educational check, not a certificate or ijazah."
                                    : "Complete the exercise and any knowledge check honestly before marking the lesson complete."}
                            </p>
                            <Link
                                href="/deen-islam/learning/progress"
                                className="mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#E7CE93] transition hover:text-white"
                            >
                                View My Progress
                                <ArrowRight size={11} aria-hidden="true" />
                            </Link>
                        </section>

                        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                            <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294B3A]">
                                <Layers3
                                    size={13}
                                    aria-hidden="true"
                                    className="text-[#1B7A53]"
                                />
                                {course.modules.length} modules ·{" "}
                                {lessons.length} lessons
                            </p>
                            <p className="mt-2 text-[11px] sm:text-xs leading-5 text-[#8A978F]">
                                Current module:{" "}
                                <span className="font-medium text-[#5F6F66]">
                                    {currentLesson?.moduleTitle ||
                                        lesson.moduleTitle}
                                </span>
                            </p>
                            <Link
                                href="/deen-islam/learning/courses"
                                className="mt-3 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-[#1B7A53] hover:text-[#14563B]"
                            >
                                Explore all courses
                                <ArrowRight size={10} aria-hidden="true" />
                            </Link>
                        </div>
                    </aside>
                </div>

                <LearningFooter />
            </div>
        </main>
    );
}
