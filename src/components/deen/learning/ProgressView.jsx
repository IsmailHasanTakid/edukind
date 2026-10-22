"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
    ArrowRight,
    BookOpen,
    BookOpenText,
    CheckCircle2,
    Clock3,
    Compass,
    Layers3,
    ListChecks,
    Play,
    RotateCcw,
    Target,
    Trophy,
} from "lucide-react";
import {
    LearningFooter,
    LearningPageHeader,
    ProgressBar,
    StatusBadge,
    formatWhen,
} from "./learning-ui";
import { getCourseHref } from "@/lib/learning/courses";
import {
    getEnrollmentSummaries,
    getLearningStats,
    getQuranProgress,
    getQuizAttemptHistory,
    getRecentLearningActivity,
    getRevisionTopics,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

const ACTIVITY_LABELS = {
    "course-enrolled": "Course started",
    "lesson-opened": "Lesson opened",
    "lesson-completed": "Lesson completed",
    "course-completed": "Course completed",
    "quiz-attempt": "Knowledge check",
    "quran-read": "Quran reading",
};

function StatCard({ label, value, hint, icon: Icon, tone }) {
    return (
        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8A978F]">
                        {label}
                    </p>
                    <p className="mt-1.5 text-2xl font-bold text-[#173B2D]">
                        {value}
                    </p>
                </div>
                <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tone}`}
                >
                    <Icon size={16} aria-hidden="true" />
                </span>
            </div>
            <p className="mt-1.5 text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                {hint}
            </p>
        </div>
    );
}

function EmptyPanel({ icon: Icon, title, description, action }) {
    return (
        <div className="rounded-xl border border-dashed border-[#D7E4DC] bg-[#FBFDFB] px-4 py-7 text-center">
            <Icon
                size={22}
                aria-hidden="true"
                className="mx-auto text-[#9AA69D]"
            />
            <p className="mt-2 text-xs sm:text-sm font-semibold text-[#5F6F66]">
                {title}
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                {description}
            </p>
            {action ? <div className="mt-3">{action}</div> : null}
        </div>
    );
}

function CourseProgressRow({ enrollment }) {
    const { course, record, status, completion, currentLesson } = enrollment;
    const completeModules = course.modules.filter((module) =>
        module.lessons.every(
            (lesson) => record.completedLessons?.[lesson.id]
        )
    ).length;
    const href =
        status === "completed"
            ? getCourseHref(course.id)
            : currentLesson
                ? `/deen-islam/learning/courses/${course.id}/lessons/${currentLesson.id}`
                : getCourseHref(course.id);

    return (
        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={status} />
                        <span className="rounded-full border border-[#E0E9E3] bg-[#F8FBF9] px-2 py-0.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#8A978F]">
                            {course.level}
                        </span>
                    </div>
                    <h3 className="mt-2 text-sm sm:text-base font-semibold text-[#294B3A]">
                        {course.title}
                    </h3>
                    {currentLesson ? (
                        <p className="mt-1 text-xs sm:text-sm leading-5 text-[#7A887F]">
                            Current: {currentLesson.moduleTitle} ·{" "}
                            {currentLesson.title}
                        </p>
                    ) : null}
                </div>
                <span className="text-sm sm:text-base font-bold text-[#1B6B4B]">
                    {completion.percentage}%
                </span>
            </div>

            <ProgressBar
                value={completion.percentage}
                label={`${course.title} progress`}
                className="mt-3"
            />

            <div className="mt-3 grid gap-2 text-[11px] sm:text-xs text-[#8A978F] sm:grid-cols-3">
                <span>
                    <span className="font-semibold text-[#5F6F66]">
                        {completion.completedLessons}
                    </span>{" "}
                    / {completion.totalLessons} lessons
                </span>
                <span>
                    <span className="font-semibold text-[#5F6F66]">
                        {completeModules}
                    </span>{" "}
                    / {course.modules.length} modules
                </span>
                <span>
                    {record.updatedAt
                        ? `Last studied ${formatWhen(record.updatedAt)}`
                        : "Not studied yet"}
                </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                    href={href}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                >
                    {status === "completed" ? "Review course" : "Continue"}
                    <ArrowRight size={11} aria-hidden="true" />
                </Link>
                <Link
                    href={getCourseHref(course.id)}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#8A978F] transition hover:text-[#5F6F66]"
                >
                    Roadmap
                </Link>
            </div>
        </div>
    );
}

export default function ProgressView() {
    const { progress, ready, storageError } = useLearningProgress();
    const stats = useMemo(() => getLearningStats(progress), [progress]);
    const enrollments = useMemo(() => {
        return getEnrollmentSummaries(progress).sort((a, b) => {
            const aTime = new Date(a.record.updatedAt || 0).getTime();
            const bTime = new Date(b.record.updatedAt || 0).getTime();
            return bTime - aTime;
        });
    }, [progress]);
    const moduleCounts = useMemo(() => {
        return enrollments.reduce(
            (totals, item) => {
                for (const courseModule of item.course.modules) {
                    totals.total += 1;
                    if (
                        courseModule.lessons.every(
                            (lesson) =>
                                item.record.completedLessons?.[lesson.id]
                        )
                    ) {
                        totals.completed += 1;
                    }
                }

                return totals;
            },
            { total: 0, completed: 0 }
        );
    }, [enrollments]);
    const quizAttempts = useMemo(
        () => getQuizAttemptHistory(progress),
        [progress]
    );
    const revisionTopics = useMemo(
        () => getRevisionTopics(progress),
        [progress]
    );
    const activity = useMemo(
        () => getRecentLearningActivity(progress, 10),
        [progress]
    );
    const quran = getQuranProgress(progress);

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(31,138,91,0.075), transparent 66%)",
                }}
            />

            <div className="relative mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <LearningPageHeader
                    title="My Progress"
                    description="Every number here comes from lessons you completed and knowledge checks you submitted in this browser. Nothing is estimated."
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/deen-islam/learning/courses"
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                        >
                            <Compass size={13} aria-hidden="true" />
                            Explore Courses
                        </Link>
                        <Link
                            href="/deen-islam/learning/my-courses"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            My Courses
                            <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                    </div>
                </LearningPageHeader>

                {storageError ? (
                    <p
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        Progress could not be saved in this browser. The records
                        below may reset after refresh.
                    </p>
                ) : null}

                {!ready ? (
                    <div className="mt-8 space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {[0, 1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-[110px] animate-pulse rounded-2xl bg-white"
                                />
                            ))}
                        </div>
                        <div className="h-72 animate-pulse rounded-2xl bg-white" />
                    </div>
                ) : (
                    <>
                        <section
                            aria-label="Progress summary"
                            className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <StatCard
                                label="Courses started"
                                value={stats.enrolledCount}
                                hint={`${stats.completedCount} completed · ${stats.activeCount} active`}
                                icon={Layers3}
                                tone="border-[#D7E4DC] bg-[#EEF6F0] text-[#1B7A53]"
                            />
                            <StatCard
                                label="Lessons completed"
                                value={stats.completedLessons}
                                hint={`${stats.totalLessons} lessons across started courses`}
                                icon={BookOpenText}
                                tone="border-[#CDE6E2] bg-[#E8F3F2] text-[#0F766E]"
                            />
                            <StatCard
                                label="Modules completed"
                                value={moduleCounts.completed}
                                hint={`${moduleCounts.total} modules across started courses`}
                                icon={CheckCircle2}
                                tone="border-[#EADFC8] bg-[#FBF4E6] text-[#9A6B1F]"
                            />
                            <StatCard
                                label="Quiz attempts"
                                value={stats.quizAttemptCount}
                                hint={
                                    stats.averageQuizScore === null
                                        ? "No knowledge checks submitted"
                                        : `${stats.averageQuizScore}% average score`
                                }
                                icon={Target}
                                tone="border-[#DED6EE] bg-[#F1EEF8] text-[#6B5A9A]"
                            />
                        </section>

                        <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr] xl:items-start">
                            <div className="space-y-5">
                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                                Course completion
                                            </p>
                                            <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                                Started courses
                                            </h2>
                                        </div>
                                        <Link
                                            href="/deen-islam/learning/my-courses"
                                            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B7A53] hover:text-[#14563B]"
                                        >
                                            Manage courses
                                            <ArrowRight
                                                size={11}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </div>

                                    {enrollments.length > 0 ? (
                                        <div className="mt-3 space-y-2.5">
                                            {enrollments.map((item) => (
                                                <CourseProgressRow
                                                    key={item.course.id}
                                                    enrollment={item}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <EmptyPanel
                                                icon={Compass}
                                                title="No course progress yet"
                                                description="Start a predefined course to create real lesson and module records."
                                                action={
                                                    <Link
                                                        href="/deen-islam/learning/courses"
                                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1B6B4B] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                                                    >
                                                        Explore courses
                                                        <ArrowRight
                                                            size={10}
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                }
                                            />
                                        </div>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                                Knowledge checks
                                            </p>
                                            <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                                Quiz attempts and results
                                            </h2>
                                        </div>
                                        <span className="rounded-full border border-[#E0E9E3] bg-[#F8FBF9] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#5F6F66]">
                                            {quizAttempts.length} total
                                        </span>
                                    </div>

                                    {quizAttempts.length > 0 ? (
                                        <div className="mt-3 overflow-x-auto">
                                            <table className="w-full min-w-[570px] border-collapse text-left">
                                                <caption className="sr-only">
                                                    Knowledge check attempt history
                                                </caption>
                                                <thead>
                                                    <tr className="border-b border-[#EDF2EE] text-[11px] sm:text-xs uppercase tracking-[0.1em] text-[#9AA69D]">
                                                        <th
                                                            scope="col"
                                                            className="py-2 pr-3 font-semibold"
                                                        >
                                                            Lesson
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-2 font-semibold"
                                                        >
                                                            Result
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-2 font-semibold"
                                                        >
                                                            Status
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="py-2 pl-3 text-right font-semibold"
                                                        >
                                                            When
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {quizAttempts
                                                        .slice(0, 8)
                                                        .map(
                                                            (
                                                                attempt,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={`${attempt.courseId}-${attempt.lessonId}-${attempt.at}-${index}`}
                                                                    className="border-b border-[#F2F6F3] last:border-0"
                                                                >
                                                                    <td className="py-2.5 pr-3">
                                                                        <Link
                                                                            href={
                                                                                attempt.href
                                                                            }
                                                                            className="block max-w-[260px] truncate text-xs sm:text-sm font-medium text-[#3E5B4C] hover:text-[#1B7A53]"
                                                                        >
                                                                            {
                                                                                attempt.lessonTitle
                                                                            }
                                                                        </Link>
                                                                        <span className="mt-0.5 block max-w-[260px] truncate text-[11px] sm:text-xs text-[#9AA69D]">
                                                                            {
                                                                                attempt.courseTitle
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-3 py-2.5 text-xs sm:text-sm font-semibold text-[#294B3A]">
                                                                        {
                                                                            attempt.score
                                                                        }
                                                                        /
                                                                        {
                                                                            attempt.total
                                                                        }{" "}
                                                                        <span
                                                                            className={`ml-1 ${
                                                                                attempt.percentage >=
                                                                                70
                                                                                    ? "text-[#1B7A53]"
                                                                                    : "text-[#A5621E]"
                                                                            }`}
                                                                        >
                                                                            (
                                                                            {
                                                                                attempt.percentage
                                                                            }
                                                                            %)
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-3 py-2.5">
                                                                        <span
                                                                            className={`rounded-full border px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${
                                                                                attempt.passed
                                                                                    ? "border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]"
                                                                                    : "border-[#EADFC8] bg-[#FCF8EF] text-[#8A6418]"
                                                                            }`}
                                                                        >
                                                                            {attempt.passed
                                                                                ? "Passed"
                                                                                : "Needs revision"}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-2.5 pl-3 text-right text-[11px] sm:text-xs whitespace-nowrap text-[#9AA69D]">
                                                                        {formatWhen(
                                                                            attempt.at
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <EmptyPanel
                                                icon={ListChecks}
                                                title="No quiz attempts yet"
                                                description="Knowledge check results appear here after you submit a lesson quiz."
                                            />
                                        </div>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
                                    <div>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                            Revision
                                        </p>
                                        <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                            Topics that need revision
                                        </h2>
                                    </div>

                                    {revisionTopics.length > 0 ? (
                                        <div className="mt-3 space-y-2">
                                            {revisionTopics.map((topic) => (
                                                <div
                                                    key={`${topic.courseId}-${topic.lessonId}`}
                                                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EADFC8] bg-[#FCF8EF] px-3.5 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="text-xs sm:text-sm font-semibold text-[#5F4A1E]">
                                                            {topic.lessonTitle}
                                                        </p>
                                                        <p className="mt-0.5 text-[11px] sm:text-xs text-[#9A7B3C]">
                                                            {topic.courseTitle}{" "}
                                                            · Latest score{" "}
                                                            {topic.percentage}%
                                                            · Pass mark{" "}
                                                            {topic.passingScore}%
                                                        </p>
                                                    </div>
                                                    <Link
                                                        href={topic.href}
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E2CFA6] bg-white px-3 py-1.5 text-[11px] sm:text-xs font-semibold text-[#8A6418] transition hover:bg-[#FBF4E6]"
                                                    >
                                                        <RotateCcw
                                                            size={10}
                                                            aria-hidden="true"
                                                        />
                                                        Revise lesson
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            <EmptyPanel
                                                icon={CheckCircle2}
                                                title="No failed checks to revise"
                                                description="When a submitted knowledge check is below its pass mark, the lesson appears here."
                                            />
                                        </div>
                                    )}
                                </section>
                            </div>

                            <aside className="space-y-4">
                                <section className="rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-4 text-white">
                                    <p className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#E7CE93]">
                                        <BookOpen size={13} aria-hidden="true" />
                                        Quran reading
                                    </p>

                                    {quran ? (
                                        <>
                                            <h2 className="mt-2 text-base font-semibold">
                                                {quran.surahName}
                                            </h2>
                                            <p className="mt-1 text-xs sm:text-sm leading-5 text-emerald-50/55">
                                                Last read: Ayah{" "}
                                                {Number(
                                                    quran.ayahNumber
                                                ).toLocaleString("en-BD")}{" "}
                                                ·{" "}
                                                {formatWhen(quran.updatedAt)}
                                            </p>
                                            <Link
                                                href={`/deen-islam/learning/quran/${quran.surahNumber}`}
                                                className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#E7CE93] px-4 py-2 text-xs sm:text-sm font-semibold text-[#173B2D] transition hover:bg-[#F0DCA8]"
                                            >
                                                <Play
                                                    size={11}
                                                    aria-hidden="true"
                                                />
                                                Continue reading
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="mt-2 text-sm sm:text-base font-semibold">
                                                No saved Quran reading yet
                                            </h2>
                                            <p className="mt-1 text-xs sm:text-sm leading-5 text-emerald-50/55">
                                                Open a surah in the Academy
                                                reader. Your last-read surah and
                                                ayah will be saved here.
                                            </p>
                                            <Link
                                                href="/deen-islam/learning/quran"
                                                className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                                            >
                                                Read Quran
                                                <ArrowRight
                                                    size={11}
                                                    aria-hidden="true"
                                                />
                                            </Link>
                                        </>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                            Recent activity
                                        </h2>
                                        <Clock3
                                            size={13}
                                            aria-hidden="true"
                                            className="text-[#9AA69D]"
                                        />
                                    </div>

                                    {activity.length > 0 ? (
                                        <ol className="mt-3 space-y-2.5">
                                            {activity.map((item) => {
                                                const href =
                                                    item.type ===
                                                        "quran-read" &&
                                                    item.surahNumber
                                                        ? `/deen-islam/learning/quran/${item.surahNumber}`
                                                        : item.href;
                                                const content = (
                                                    <>
                                                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E0E9E3] bg-[#F8FBF9]">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-[#1B7A53]" />
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[#9AA69D]">
                                                                {ACTIVITY_LABELS[
                                                                    item.type
                                                                ] ||
                                                                    "Activity"}
                                                            </span>
                                                            <span className="mt-0.5 block text-xs sm:text-sm leading-4 text-[#5F6F66]">
                                                                {item.label}
                                                            </span>
                                                            <span className="mt-0.5 block text-[11px] sm:text-xs text-[#A0ABA3]">
                                                                {formatWhen(
                                                                    item.at
                                                                )}
                                                            </span>
                                                        </span>
                                                    </>
                                                );

                                                return (
                                                    <li key={item.id}>
                                                        {href ? (
                                                            <Link
                                                                href={href}
                                                                className="flex gap-2.5 rounded-lg px-1 py-0.5 transition hover:bg-[#F8FBF9]"
                                                            >
                                                                {content}
                                                            </Link>
                                                        ) : (
                                                            <div className="flex gap-2.5 px-1 py-0.5">
                                                                {content}
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    ) : (
                                        <div className="mt-3">
                                            <EmptyPanel
                                                icon={Clock3}
                                                title="No activity yet"
                                                description="Course starts, lessons, quizzes, and Quran reading will appear here."
                                            />
                                        </div>
                                    )}
                                </section>

                                <section className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                                    <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294B3A]">
                                        <Trophy
                                            size={13}
                                            aria-hidden="true"
                                            className="text-[#9A6B1F]"
                                        />
                                        Progress source
                                    </p>
                                    <p className="mt-2 text-[11px] sm:text-xs leading-5 text-[#8A978F]">
                                        Records are stored in this browser
                                        because the project does not yet have
                                        authentication or a server-side
                                        enrollment database. Clearing browser
                                        data removes them.
                                    </p>
                                </section>
                            </aside>
                        </div>
                    </>
                )}

                <LearningFooter />
            </div>
        </main>
    );
}
