"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
    ArrowRight,
    BookOpenText,
    CheckCircle2,
    Clock3,
    Compass,
    Layers3,
    Pause,
    PauseCircle,
    Trophy,
} from "lucide-react";
import LearningCourseCard from "./LearningCourseCard";
import {
    LearningFooter,
    LearningPageHeader,
    formatMinutes,
} from "./learning-ui";
import {
    LEARNING_COURSES,
    getCourseHref,
    getCourseMinutes,
} from "@/lib/learning/courses";
import {
    getEnrollmentSummaries,
    getLearningStats,
    getResumeHref,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

const FILTERS = [
    { id: "all", label: "All Courses" },
    { id: "in-progress", label: "In Progress" },
    { id: "paused", label: "Paused" },
    { id: "completed", label: "Completed" },
];

const EMPTY_HIGHLIGHTS = [
    {
        title: "Beginner foundations",
        description: "Letters, harakat, joined words, and short verses.",
        icon: BookOpenText,
    },
    {
        title: "Tajweed and fluency",
        description: "Accuracy, madd, noon rules, and guided practice.",
        icon: Layers3,
    },
    {
        title: "Quran understanding",
        description: "Verified translation, context, and reliable sources.",
        icon: Compass,
    },
];

function SummaryCard({ label, value, hint, icon: Icon, tone }) {
    return (
        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8A978F]">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-[#173B2D]">
                        {value}
                    </p>
                </div>
                <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tone}`}
                >
                    <Icon size={16} aria-hidden="true" />
                </span>
            </div>
            <p className="mt-2 text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                {hint}
            </p>
        </div>
    );
}

function EmptyState() {
    const totalMinutes = LEARNING_COURSES.reduce(
        (total, course) => total + getCourseMinutes(course),
        0
    );

    return (
        <div className="overflow-hidden rounded-3xl border border-[#DCE8DF] bg-white">
            <div className="relative px-5 py-10 text-center sm:px-10 sm:py-12">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse at top, rgba(31,138,91,0.07), transparent 65%)",
                    }}
                />
                <div className="relative">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]">
                        <Compass size={28} aria-hidden="true" />
                    </span>
                    <p className="mt-5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8A978F]">
                        Your learning space
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[#12362B]">
                        No courses started yet
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#7A887F]">
                        Choose a predefined course from the catalog. Once you
                        start, it appears here with your current module,
                        current lesson, and saved progress.
                    </p>

                    <div className="mx-auto mt-6 grid max-w-3xl gap-2.5 text-left sm:grid-cols-3">
                        {EMPTY_HIGHLIGHTS.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-xl border border-[#E7EEE9] bg-[#FBFDFB] px-3.5 py-3"
                                >
                                    <Icon
                                        size={15}
                                        aria-hidden="true"
                                        className="text-[#1B7A53]"
                                    />
                                    <p className="mt-2 text-xs sm:text-sm font-semibold text-[#294B3A]">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-[11px] sm:text-xs leading-4 text-[#8A978F]">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <Link
                            href="/deen-islam/learning/courses"
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                        >
                            Explore {LEARNING_COURSES.length} courses
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                        <Link
                            href="/deen-islam/learning"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            Academy overview
                        </Link>
                    </div>

                    <p className="mt-5 text-[11px] sm:text-xs text-[#9AA69D]">
                        {formatMinutes(totalMinutes)} of predefined curriculum
                        available
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function MyCoursesView() {
    const router = useRouter();
    const {
        progress,
        ready,
        storageError,
        togglePauseCourse,
    } = useLearningProgress();
    const [filter, setFilter] = useState("all");

    const stats = useMemo(() => getLearningStats(progress), [progress]);
    const enrollments = useMemo(() => {
        return getEnrollmentSummaries(progress).sort((a, b) => {
            const aTime = new Date(a.record.updatedAt || 0).getTime();
            const bTime = new Date(b.record.updatedAt || 0).getTime();
            return bTime - aTime;
        });
    }, [progress]);

    const filtered = enrollments.filter((item) => {
        if (filter === "all") return true;
        return item.status === filter;
    });

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
                    title="My Courses"
                    description="Your started courses, current module and lesson, and saved progress. Pick up exactly where you left off."
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
                            href="/deen-islam/learning/progress"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            My Progress
                            <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                    </div>
                </LearningPageHeader>

                {storageError ? (
                    <p
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        Progress could not be saved in this browser. You can
                        still study, but progress may reset after refresh.
                    </p>
                ) : null}

                {!ready ? (
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {[0, 1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-[122px] animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <section
                            aria-label="Course summary"
                            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
                        >
                            <SummaryCard
                                label="Total enrolled"
                                value={stats.enrolledCount}
                                hint="Courses you have started"
                                icon={Layers3}
                                tone="border-[#D7E4DC] bg-[#EEF6F0] text-[#1B7A53]"
                            />
                            <SummaryCard
                                label="In progress"
                                value={stats.activeCount}
                                hint="Currently active courses"
                                icon={Clock3}
                                tone="border-[#CDE6E2] bg-[#E8F3F2] text-[#0F766E]"
                            />
                            <SummaryCard
                                label="Paused"
                                value={stats.pausedCount}
                                hint="Courses waiting for you"
                                icon={PauseCircle}
                                tone="border-[#E5E9E6] bg-[#F4F7F5] text-[#6A7A70]"
                            />
                            <SummaryCard
                                label="Completed"
                                value={stats.completedCount}
                                hint="Courses finished"
                                icon={Trophy}
                                tone="border-[#EADFC8] bg-[#FBF4E6] text-[#9A6B1F]"
                            />
                        </section>

                        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div
                                role="group"
                                aria-label="Filter my courses"
                                className="flex flex-wrap gap-1.5"
                            >
                                {FILTERS.map((item) => {
                                    const count =
                                        item.id === "all"
                                            ? enrollments.length
                                            : enrollments.filter(
                                                (entry) =>
                                                    entry.status === item.id
                                            ).length;

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setFilter(item.id)}
                                            aria-pressed={filter === item.id}
                                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs sm:text-sm font-semibold transition ${
                                                filter === item.id
                                                    ? "border-[#1C6543] bg-[#185A3B] text-white"
                                                    : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                            }`}
                                        >
                                            {item.label}
                                            <span
                                                className={`rounded-full px-1.5 py-0.5 text-[11px] sm:text-xs ${
                                                    filter === item.id
                                                        ? "bg-white/15 text-white"
                                                        : "bg-[#EDF2EE] text-[#7A887F]"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <Link
                                href="/deen-islam/learning/courses"
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:text-[#14563B]"
                            >
                                Add another course
                                <ArrowRight size={11} aria-hidden="true" />
                            </Link>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="mt-4 rounded-2xl border border-dashed border-[#D7E4DC] bg-white px-5 py-12 text-center">
                                <PauseCircle
                                    size={28}
                                    aria-hidden="true"
                                    className="mx-auto text-[#8A978F]"
                                />
                                <h2 className="mt-3 text-base font-semibold text-[#294B3A]">
                                    No courses in this filter
                                </h2>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#7A887F]">
                                    Switch to another filter to see your other
                                    courses.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setFilter("all")}
                                    className="mt-4 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                                >
                                    Show all courses
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 grid gap-4 lg:grid-cols-2">
                                {filtered.map((item) => {
                                    const { course, record, status } = item;
                                    const resumeHref = getResumeHref(
                                        course,
                                        record
                                    );
                                    const actionHref =
                                        status === "completed"
                                            ? getCourseHref(course.id)
                                            : resumeHref;

                                    return (
                                        <LearningCourseCard
                                            key={course.id}
                                            course={course}
                                            record={record}
                                            actionLabel={
                                                status === "completed"
                                                    ? "Review Course"
                                                    : status === "paused"
                                                        ? "Resume Learning"
                                                        : "Continue Learning"
                                            }
                                            actionHref={actionHref}
                                            onAction={
                                                status === "paused"
                                                    ? () => {
                                                        togglePauseCourse(
                                                            course
                                                        );
                                                        router.push(
                                                            resumeHref
                                                        );
                                                    }
                                                    : undefined
                                            }
                                            extraActions={
                                                status === "in-progress" ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            togglePauseCourse(
                                                                course
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#5F6F66] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                                                    >
                                                        <Pause
                                                            size={12}
                                                            aria-hidden="true"
                                                        />
                                                        Pause
                                                    </button>
                                                ) : status === "paused" ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFC8] bg-[#FCF8EF] px-3 py-2 text-[11px] sm:text-xs font-semibold text-[#8A6418]">
                                                        <PauseCircle
                                                            size={11}
                                                            aria-hidden="true"
                                                        />
                                                        Paused
                                                    </span>
                                                ) : status === "completed" ? (
                                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CFE6D8] bg-[#EAF4EE] px-3 py-2 text-[11px] sm:text-xs font-semibold text-[#1B7A53]">
                                                        <CheckCircle2
                                                            size={11}
                                                            aria-hidden="true"
                                                        />
                                                        Completed
                                                    </span>
                                                ) : null
                                            }
                                        />
                                    );
                                })}
                            </div>
                        )}

                        <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#E7CE93]/80">
                                    Progress is saved in this browser
                                </p>
                                <h2 className="mt-1 text-base font-semibold">
                                    Resume any course from its last lesson
                                </h2>
                                <p className="mt-1 max-w-xl text-xs sm:text-sm leading-5 text-emerald-50/55">
                                    Completing a lesson or knowledge check
                                    updates this course list immediately. The
                                    same records power Overview and My Progress.
                                </p>
                            </div>
                            <Link
                                href="/deen-islam/learning/progress"
                                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                                View detailed progress
                                <ArrowRight size={12} aria-hidden="true" />
                            </Link>
                        </section>
                    </>
                )}

                <LearningFooter />
            </div>
        </main>
    );
}
