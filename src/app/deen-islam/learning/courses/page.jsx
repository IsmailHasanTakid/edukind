"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Compass, Search, Sparkles } from "lucide-react";
import LearningCourseCard from "@/components/deen/learning/LearningCourseCard";
import {
    LearningFooter,
    LearningPageHeader,
} from "@/components/deen/learning/learning-ui";
import {
    LEARNING_COURSES,
    getCourseCategories,
    getCourseHref,
    getCourseLevels,
} from "@/lib/learning/courses";
import {
    getCourseStatus,
    getResumeHref,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

const LEVELS = getCourseLevels();
const CATEGORIES = getCourseCategories();

function CourseCardSkeleton() {
    return (
        <div className="h-[390px] animate-pulse rounded-2xl border border-[#E0E9E3] bg-white p-6">
            <div className="flex justify-between">
                <div className="h-12 w-12 rounded-xl bg-[#EDF2EE]" />
                <div className="h-5 w-24 rounded-full bg-[#EDF2EE]" />
            </div>
            <div className="mt-5 h-3 w-20 rounded bg-[#EDF2EE]" />
            <div className="mt-3 h-5 w-3/4 rounded bg-[#EDF2EE]" />
            <div className="mt-3 h-3 w-full rounded bg-[#F2F6F3]" />
            <div className="mt-2 h-3 w-5/6 rounded bg-[#F2F6F3]" />
            <div className="mt-8 h-2 w-full rounded-full bg-[#EDF2EE]" />
            <div className="mt-8 h-10 w-40 rounded-full bg-[#EDF2EE]" />
        </div>
    );
}

export default function ExploreCoursesPage() {
    const { progress, ready, storageError } = useLearningProgress();
    const [level, setLevel] = useState("all");
    const [category, setCategory] = useState("all");
    const [query, setQuery] = useState("");

    const filteredCourses = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        return LEARNING_COURSES.filter((course) => {
            if (level !== "all" && course.level !== level) return false;
            if (category !== "all" && course.category !== category) {
                return false;
            }
            if (!normalized) return true;

            return [
                course.title,
                course.description,
                course.level,
                course.category,
                ...course.objectives,
            ]
                .join(" ")
                .toLowerCase()
                .includes(normalized);
        });
    }, [category, level, query]);

    const startedCount = LEARNING_COURSES.filter(
        (course) => getCourseStatus(course, progress.courses[course.id]) !== "not-started"
    ).length;

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
                    title="Explore Courses"
                    description="Choose a predefined Quran learning path built for your current level. Every course has ordered modules, guided lessons, exercises, and a final knowledge check."
                >
                    <div className="flex items-center gap-3 rounded-2xl border border-[#DCE8DF] bg-white/80 px-4 py-3 shadow-[0_4px_18px_rgba(20,60,45,0.05)]">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F3D2E] text-[#E7CE93]">
                            <Compass size={20} aria-hidden="true" />
                        </span>
                        <div>
                            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                Course catalog
                            </p>
                            <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#173B2D]">
                                {LEARNING_COURSES.length} courses · {startedCount} started
                            </p>
                        </div>
                    </div>
                </LearningPageHeader>

                {storageError ? (
                    <p
                        role="alert"
                        className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                    >
                        Progress could not be saved in this browser. Lessons will
                        still work, but progress may reset after refresh.
                    </p>
                ) : null}

                <section
                    aria-labelledby="course-filters-heading"
                    className="mt-8 rounded-2xl border border-[#E0E9E3] bg-white p-4 shadow-[0_2px_10px_rgba(20,60,45,0.035)] sm:p-5"
                >
                    <h2 id="course-filters-heading" className="sr-only">
                        Filter courses
                    </h2>

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="relative flex min-h-11 w-full items-center rounded-xl border border-[#E1E8DE] bg-[#FAFCF8] focus-within:border-[#36845B]/60 focus-within:bg-white xl:max-w-sm">
                            <Search
                                size={17}
                                aria-hidden="true"
                                className="ml-3.5 shrink-0 text-[#8B9B8F]"
                            />
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search courses or objectives..."
                                aria-label="Search courses"
                                className="h-11 min-w-0 flex-1 bg-transparent px-3 text-sm sm:text-base text-[#234331] outline-none placeholder:text-[#9AA69D]"
                            />
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                            <div
                                role="group"
                                aria-label="Filter by level"
                                className="flex flex-wrap gap-1.5"
                            >
                                <button
                                    type="button"
                                    onClick={() => setLevel("all")}
                                    aria-pressed={level === "all"}
                                    className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                                        level === "all"
                                            ? "border-[#1C6543] bg-[#185A3B] text-white"
                                            : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                    }`}
                                >
                                    All levels
                                </button>
                                {LEVELS.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setLevel(item)}
                                        aria-pressed={level === item}
                                        className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                                            level === item
                                                ? "border-[#1C6543] bg-[#185A3B] text-white"
                                                : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>

                            <span
                                aria-hidden="true"
                                className="hidden h-5 w-px bg-[#E4ECE6] sm:block"
                            />

                            <div
                                role="group"
                                aria-label="Filter by category"
                                className="flex flex-wrap gap-1.5"
                            >
                                <button
                                    type="button"
                                    onClick={() => setCategory("all")}
                                    aria-pressed={category === "all"}
                                    className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                                        category === "all"
                                            ? "border-[#1C6543] bg-[#185A3B] text-white"
                                            : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                    }`}
                                >
                                    All categories
                                </button>
                                {CATEGORIES.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setCategory(item)}
                                        aria-pressed={category === item}
                                        className={`rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition ${
                                            category === item
                                                ? "border-[#1C6543] bg-[#185A3B] text-white"
                                                : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <p aria-live="polite" className="text-sm text-[#7A887F]">
                        Showing{" "}
                        <span className="font-semibold text-[#294B3A]">
                            {filteredCourses.length}
                        </span>{" "}
                        of {LEARNING_COURSES.length} courses
                    </p>

                    {(level !== "all" || category !== "all" || query) && (
                        <button
                            type="button"
                            onClick={() => {
                                setLevel("all");
                                setCategory("all");
                                setQuery("");
                            }}
                            className="text-xs sm:text-sm font-semibold text-[#1B7A53] hover:text-[#14563B]"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>

                {!ready ? (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        <CourseCardSkeleton />
                        <CourseCardSkeleton />
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-dashed border-[#D7E4DC] bg-white px-5 py-14 text-center">
                        <Compass
                            size={30}
                            aria-hidden="true"
                            className="mx-auto text-[#8A978F]"
                        />
                        <h2 className="mt-4 text-base font-semibold text-[#294B3A]">
                            No courses match these filters
                        </h2>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A887F]">
                            Try a different level or category, or clear the
                            search to see every available course.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setLevel("all");
                                setCategory("all");
                                setQuery("");
                            }}
                            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                        >
                            Show all courses
                            <ArrowRight size={13} aria-hidden="true" />
                        </button>
                    </div>
                ) : (
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                        {filteredCourses.map((course) => {
                            const record = progress.courses[course.id];
                            const status = getCourseStatus(course, record);
                            const actionHref =
                                status === "not-started"
                                    ? getCourseHref(course.id)
                                    : status === "completed"
                                        ? getCourseHref(course.id)
                                        : getResumeHref(course, record);

                            return (
                                <LearningCourseCard
                                    key={course.id}
                                    course={course}
                                    record={record}
                                    actionLabel={
                                        status === "completed"
                                            ? "Review Course"
                                            : status === "not-started"
                                                ? "View Course"
                                                : "Continue Learning"
                                    }
                                    actionHref={actionHref}
                                />
                            );
                        })}
                    </div>
                )}

                <section className="mt-8 rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-6 text-white sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex gap-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E7CE93]/20 bg-[#E7CE93]/10 text-[#E7CE93]">
                                <Sparkles size={20} aria-hidden="true" />
                            </span>
                            <div>
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#E7CE93]/80">
                                    Predefined curriculum, not AI-generated
                                </p>
                                <h2 className={`mt-1 text-xl font-semibold`}>
                                    AI supports the lesson. It does not replace it.
                                </h2>
                                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-emerald-50/60">
                                    The Academy assistant can explain lesson
                                    concepts, give practice questions, and
                                    clarify quiz answers. The course sequence,
                                    sources, and completion criteria remain
                                    fixed.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <LearningFooter />
            </div>
        </main>
    );
}
