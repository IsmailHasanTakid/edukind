"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
    ArrowRight,
    BookOpen,
    BookOpenText,
    Clock3,
    Compass,
    Layers3,
    Play,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react";
import {
    LearningFooter,
    LearningPageHeader,
    LevelBadge,
    ProgressBar,
    StatusBadge,
    formatMinutes,
    formatWhen,
} from "./learning-ui";
import {
    LEARNING_COURSES,
    getCourseHref,
    getCourseMinutes,
} from "@/lib/learning/courses";
import {
    getEnrollmentSummaries,
    getLearningStats,
    getRecentlyStudiedLessons,
    getResumeHref,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

const QUICK_LINKS = [
    {
        label: "Explore Courses",
        description: "Browse the predefined curriculum",
        href: "/deen-islam/learning/courses",
        icon: Compass,
        tile: "bg-[#EAF4EE] text-[#1B7A53] border-[#CFE6D8]",
    },
    {
        label: "My Courses",
        description: "Resume what you have started",
        href: "/deen-islam/learning/my-courses",
        icon: BookOpenText,
        tile: "bg-[#E8F3F2] text-[#0F766E] border-[#CDE6E2]",
    },
    {
        label: "Read Quran",
        description: "Verified Arabic and Bengali translation",
        href: "/deen-islam/learning/quran",
        icon: BookOpen,
        tile: "bg-[#FBF4E6] text-[#9A6B1F] border-[#EADFC8]",
    },
    {
        label: "My Progress",
        description: "See lessons, quizzes, and revision",
        href: "/deen-islam/learning/progress",
        icon: Target,
        tile: "bg-[#F1EEF8] text-[#6B5A9A] border-[#DED6EE]",
    },
];

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

function FocusCard({ enrollment }) {
    if (!enrollment) {
        const beginner = LEARNING_COURSES.find(
            (course) => course.level === "Beginner"
        );

        return (
            <section className="relative overflow-hidden rounded-3xl border border-[#DCE8DF] bg-[#0C2E24] p-6 text-white sm:p-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-white/10"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-16 right-10 h-52 w-52 rounded-full border border-[#E7CE93]/10"
                />
                <div className="relative">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7CE93]/25 bg-[#E7CE93]/10 px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#E7CE93]">
                        <Sparkles size={12} aria-hidden="true" />
                        Start your journey
                    </span>
                    <h2 className="mt-4 max-w-lg text-2xl font-semibold leading-tight sm:text-3xl">
                        Learn Quran reading step by step, with a clear path.
                    </h2>
                    <p className="mt-2 max-w-xl text-xs sm:text-sm leading-6 text-emerald-50/60">
                        Four predefined courses cover foundations, fluency and
                        tajweed, advanced recitation, and understanding. AI
                        supports each lesson without replacing the curriculum.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <Link
                            href={
                                beginner
                                    ? getCourseHref(beginner.id)
                                    : "/deen-islam/learning/courses"
                            }
                            className="inline-flex items-center gap-2 rounded-full bg-[#E7CE93] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#173B2D] transition hover:bg-[#F0DCA8]"
                        >
                            <Play size={13} aria-hidden="true" />
                            {beginner ? `Start ${beginner.title}` : "Start learning"}
                        </Link>
                        <Link
                            href="/deen-islam/learning/courses"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                        >
                            Explore all courses
                            <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                    </div>

                    <p className="mt-4 text-[11px] sm:text-xs text-emerald-50/40">
                        No fabricated progress. Your course list starts empty
                        until you begin a course.
                    </p>
                </div>
            </section>
        );
    }

    const { course, record, status, completion, currentLesson } = enrollment;
    const resumeHref = getResumeHref(course, record);
    const completed = status === "completed";

    return (
        <section className="relative overflow-hidden rounded-3xl border border-[#DCE8DF] bg-[#0C2E24] p-6 text-white sm:p-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 right-14 h-56 w-56 rounded-full border border-[#E7CE93]/10"
            />

            <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={status} />
                    <LevelBadge level={course.level} />
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-50/60">
                        {course.category}
                    </span>
                </div>

                <p className="mt-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#E7CE93]/75">
                    {status === "paused"
                        ? "Paused course"
                        : completed
                            ? "Completed course"
                            : "Continue learning"}
                </p>
                <h2 className="mt-1.5 max-w-xl text-2xl font-semibold leading-tight sm:text-3xl">
                    {course.title}
                </h2>

                {currentLesson ? (
                    <p className="mt-2 max-w-xl text-xs sm:text-sm leading-6 text-emerald-50/60">
                        <span className="text-emerald-50/40">
                            {currentLesson.moduleTitle} ·{" "}
                        </span>
                        {currentLesson.title}
                    </p>
                ) : null}

                <div className="mt-5 max-w-lg">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-emerald-50/50">
                            {completion.completedLessons} of{" "}
                            {completion.totalLessons} lessons completed
                        </span>
                        <span className="font-semibold text-[#E7CE93]">
                            {completion.percentage}%
                        </span>
                    </div>
                    <ProgressBar
                        value={completion.percentage}
                        label={`${course.title} progress`}
                        tone="from-[#E7CE93] to-[#C9A14A]"
                        className="mt-2 bg-white/10"
                    />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                        href={completed ? getCourseHref(course.id) : resumeHref}
                        className="inline-flex items-center gap-2 rounded-full bg-[#E7CE93] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#173B2D] transition hover:bg-[#F0DCA8]"
                    >
                        {completed ? "Review course" : "Continue Learning"}
                        <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                    <Link
                        href={getCourseHref(course.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                    >
                        View roadmap
                    </Link>
                    {record.updatedAt ? (
                        <span className="text-[11px] sm:text-xs text-emerald-50/35">
                            Last studied {formatWhen(record.updatedAt)}
                        </span>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function ActiveCourseRow({ enrollment }) {
    const { course, record, completion, currentLesson } = enrollment;
    const resumeHref = getResumeHref(course, record);

    return (
        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#8A978F]">
                        {course.level} · {course.category}
                    </p>
                    <h3 className="mt-1 truncate text-sm sm:text-base font-semibold text-[#294B3A]">
                        {course.title}
                    </h3>
                    {currentLesson ? (
                        <p className="mt-1 line-clamp-2 text-xs sm:text-sm leading-5 text-[#7A887F]">
                            {currentLesson.moduleTitle} ·{" "}
                            {currentLesson.title}
                        </p>
                    ) : null}
                </div>
                <span className="shrink-0 text-xs sm:text-sm font-semibold text-[#1B6B4B]">
                    {completion.percentage}%
                </span>
            </div>

            <ProgressBar
                value={completion.percentage}
                label={`${course.title} progress`}
                className="mt-3"
            />

            <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs text-[#9AA69D]">
                    {completion.completedLessons}/{completion.totalLessons}{" "}
                    lessons
                </span>
                <Link
                    href={resumeHref}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                >
                    Resume
                    <ArrowRight size={11} aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}

function AvailableCourseRow({ course, record }) {
    const status = record
        ? record.paused
            ? "paused"
            : "started"
        : "not-started";
    const href = record
        ? getResumeHref(course, record)
        : getCourseHref(course.id);

    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-[#E0E9E3] hover:bg-white"
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#DCE8DF] bg-[#F8FBF9] text-[#1B7A53]">
                <BookOpenText size={15} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-[#294B3A]">
                        {course.title}
                    </span>
                    <LevelBadge level={course.level} />
                </span>
                <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] sm:text-xs text-[#8A978F]">
                    <span>{course.modules.length} modules</span>
                    <span>·</span>
                    <span>{formatMinutes(getCourseMinutes(course))}</span>
                    {status === "started" ? (
                        <>
                            <span>·</span>
                            <span className="text-[#1B7A53]">Started</span>
                        </>
                    ) : status === "paused" ? (
                        <>
                            <span>·</span>
                            <span className="text-[#8A6418]">Paused</span>
                        </>
                    ) : null}
                </span>
            </span>
            <ArrowRight
                size={13}
                aria-hidden="true"
                className="shrink-0 text-[#B8C5BC] transition group-hover:translate-x-0.5 group-hover:text-[#1B7A53]"
            />
        </Link>
    );
}

function OverviewSkeleton() {
    return (
        <div className="mt-8 space-y-4">
            <div className="h-[250px] animate-pulse rounded-3xl bg-white" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="h-[110px] animate-pulse rounded-2xl bg-white"
                    />
                ))}
            </div>
        </div>
    );
}

export default function LearningOverviewView() {
    const { progress, ready, storageError } = useLearningProgress();
    const stats = useMemo(() => getLearningStats(progress), [progress]);
    const enrollments = useMemo(() => {
        return getEnrollmentSummaries(progress).sort((a, b) => {
            const aTime = new Date(a.record.updatedAt || 0).getTime();
            const bTime = new Date(b.record.updatedAt || 0).getTime();
            return bTime - aTime;
        });
    }, [progress]);
    const recentlyStudied = useMemo(
        () => getRecentlyStudiedLessons(progress, 4),
        [progress]
    );
    const focus = enrollments[0] || null;

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[320px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(31,138,91,0.08), transparent 66%)",
                }}
            />

            <div className="relative mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <LearningPageHeader
                    title="Your Learning Space"
                    description="A structured Quran learning path with predefined courses, saved lesson progress, and AI support inside each lesson."
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
                            href="/deen-islam/learning/quran"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            <BookOpen size={13} aria-hidden="true" />
                            Read Quran
                        </Link>
                    </div>
                </LearningPageHeader>

                {storageError ? (
                    <p
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        Progress could not be saved in this browser. Lessons
                        still work, but progress may reset after refresh.
                    </p>
                ) : null}

                {!ready ? (
                    <OverviewSkeleton />
                ) : (
                    <>
                        <div className="mt-7">
                            <FocusCard enrollment={focus} />
                        </div>

                        <section
                            aria-label="Quick links"
                            className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            {QUICK_LINKS.map((link) => {
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group flex items-center gap-3 rounded-2xl border border-[#E0E9E3] bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-[#BFD9C9] hover:shadow-[0_12px_24px_-20px_rgba(20,60,45,0.4)]"
                                    >
                                        <span
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${link.tile}`}
                                        >
                                            <Icon
                                                size={15}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-xs sm:text-sm font-semibold text-[#294B3A]">
                                                {link.label}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[11px] sm:text-xs text-[#8A978F]">
                                                {link.description}
                                            </span>
                                        </span>
                                        <ArrowRight
                                            size={12}
                                            aria-hidden="true"
                                            className="shrink-0 text-[#B8C5BC] transition group-hover:translate-x-0.5 group-hover:text-[#1B7A53]"
                                        />
                                    </Link>
                                );
                            })}
                        </section>

                        <section
                            aria-label="Learning summary"
                            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <StatCard
                                label="Courses started"
                                value={stats.enrolledCount}
                                hint={`${LEARNING_COURSES.length} predefined courses available`}
                                icon={Layers3}
                                tone="border-[#D7E4DC] bg-[#EEF6F0] text-[#1B7A53]"
                            />
                            <StatCard
                                label="Lessons completed"
                                value={stats.completedLessons}
                                hint={`${stats.totalLessons} lessons in your started courses`}
                                icon={BookOpenText}
                                tone="border-[#CDE6E2] bg-[#E8F3F2] text-[#0F766E]"
                            />
                            <StatCard
                                label="Overall completion"
                                value={`${stats.overallPercentage}%`}
                                hint="Across all started courses"
                                icon={Trophy}
                                tone="border-[#EADFC8] bg-[#FBF4E6] text-[#9A6B1F]"
                            />
                            <StatCard
                                label="Quiz average"
                                value={
                                    stats.averageQuizScore === null
                                        ? "—"
                                        : `${stats.averageQuizScore}%`
                                }
                                hint={`${stats.quizAttemptCount} knowledge check ${
                                    stats.quizAttemptCount === 1
                                        ? "attempt"
                                        : "attempts"
                                }`}
                                icon={Target}
                                tone="border-[#DED6EE] bg-[#F1EEF8] text-[#6B5A9A]"
                            />
                        </section>

                        <div className="mt-7 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                            <section className="rounded-2xl border border-[#E0E9E3] bg-white p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                            Pick up where you left off
                                        </p>
                                        <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                            Active courses
                                        </h2>
                                    </div>
                                    <Link
                                        href="/deen-islam/learning/my-courses"
                                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                                    >
                                        My Courses
                                        <ArrowRight
                                            size={11}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>

                                {stats.activeCourses.length > 0 ? (
                                    <div className="mt-3 space-y-2.5">
                                        {stats.activeCourses.map((item) => (
                                            <ActiveCourseRow
                                                key={item.course.id}
                                                enrollment={item}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-dashed border-[#D7E4DC] bg-[#FBFDFB] px-4 py-7 text-center">
                                        <Clock3
                                            size={22}
                                            aria-hidden="true"
                                            className="mx-auto text-[#9AA69D]"
                                        />
                                        <p className="mt-2 text-xs sm:text-sm font-semibold text-[#5F6F66]">
                                            No active course
                                        </p>
                                        <p className="mx-auto mt-1 max-w-xs text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                                            {stats.pausedCount > 0
                                                ? "Resume a paused course from My Courses, or start a new one."
                                                : "Start a course from Explore Courses and it will appear here."}
                                        </p>
                                        <Link
                                            href={
                                                stats.pausedCount > 0
                                                    ? "/deen-islam/learning/my-courses"
                                                    : "/deen-islam/learning/courses"
                                            }
                                            className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] hover:text-[#14563B]"
                                        >
                                            {stats.pausedCount > 0
                                                ? "View paused courses"
                                                : "Explore courses"}
                                            <ArrowRight
                                                size={10}
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    </div>
                                )}
                            </section>

                            <section className="rounded-2xl border border-[#E0E9E3] bg-white p-5">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                            Recent activity
                                        </p>
                                        <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                            Recently accessed lessons
                                        </h2>
                                    </div>
                                    <Link
                                        href="/deen-islam/learning/progress"
                                        className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                                    >
                                        Progress
                                        <ArrowRight
                                            size={11}
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>

                                {recentlyStudied.length > 0 ? (
                                    <div className="mt-3 space-y-1">
                                        {recentlyStudied.map((item) => (
                                            <Link
                                                key={`${item.courseId}-${item.lessonId}`}
                                                href={item.href}
                                                className="group flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 transition hover:bg-[#F8FBF9]"
                                            >
                                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E0E9E3] bg-[#FBFDFB] text-[#1B7A53]">
                                                    <Play
                                                        size={11}
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-xs sm:text-sm font-semibold text-[#3E5B4C]">
                                                        {item.lessonTitle}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-[11px] sm:text-xs text-[#8A978F]">
                                                        {item.courseTitle} ·{" "}
                                                        {formatWhen(item.at)}
                                                    </span>
                                                </span>
                                                <ArrowRight
                                                    size={11}
                                                    aria-hidden="true"
                                                    className="mt-1 shrink-0 text-[#C2CEC6] transition group-hover:translate-x-0.5 group-hover:text-[#1B7A53]"
                                                />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mt-3 rounded-xl border border-dashed border-[#D7E4DC] bg-[#FBFDFB] px-4 py-7 text-center">
                                        <BookOpenText
                                            size={22}
                                            aria-hidden="true"
                                            className="mx-auto text-[#9AA69D]"
                                        />
                                        <p className="mt-2 text-xs sm:text-sm font-semibold text-[#5F6F66]">
                                            No lesson activity yet
                                        </p>
                                        <p className="mx-auto mt-1 max-w-xs text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                                            Open a course lesson and your recent
                                            study activity will appear here.
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>

                        <section className="mt-7 rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
                            <div className="flex flex-wrap items-end justify-between gap-2 px-1">
                                <div>
                                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                        Predefined curriculum
                                    </p>
                                    <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                        Available learning courses
                                    </h2>
                                </div>
                                <Link
                                    href="/deen-islam/learning/courses"
                                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                                >
                                    View catalog
                                    <ArrowRight size={11} aria-hidden="true" />
                                </Link>
                            </div>

                            <div className="mt-2 grid gap-0.5 sm:grid-cols-2">
                                {LEARNING_COURSES.map((course) => (
                                    <AvailableCourseRow
                                        key={course.id}
                                        course={course}
                                        record={progress.courses[course.id]}
                                    />
                                ))}
                            </div>
                        </section>
                    </>
                )}

                <LearningFooter />
            </div>
        </main>
    );
}
