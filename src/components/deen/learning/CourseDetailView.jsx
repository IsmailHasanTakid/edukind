"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    BookOpenText,
    CheckCircle2,
    Clock3,
    Layers3,
    LockKeyhole,
    Play,
    Target,
} from "lucide-react";
import {
    CourseIcon,
    LearningFooter,
    LevelBadge,
    ProgressBar,
    StatusBadge,
    formatMinutes,
} from "@/components/deen/learning/learning-ui";
import {
    getCourseMinutes,
    getCourseLessons,
} from "@/lib/learning/courses";
import {
    getCourseCompletion,
    getCourseStatus,
    getCurrentCourseLesson,
    getLessonStatus,
    getResumeHref,
    isLessonUnlocked,
} from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

function LessonRow({ course, record, lesson, index }) {
    const status = getLessonStatus(course, record, lesson.id);
    const unlocked = isLessonUnlocked(course, record, lesson.id);
    const completed = status === "completed";
    const current = status === "current";
    const href = `/deen-islam/learning/courses/${course.id}/lessons/${lesson.id}`;

    const contents = (
        <>
            <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs sm:text-sm font-semibold ${
                    completed
                        ? "border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]"
                        : current
                            ? "border-[#1B7A53] bg-[#1B6B4B] text-white"
                            : unlocked
                                ? "border-[#DCE5DF] bg-white text-[#5F6F66]"
                                : "border-[#E5EBE6] bg-[#F5F8F6] text-[#A0ABA3]"
                }`}
            >
                {completed ? (
                    <CheckCircle2 size={14} />
                ) : !unlocked ? (
                    <LockKeyhole size={12} />
                ) : (
                    index + 1
                )}
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className={`block text-sm sm:text-base font-medium ${
                        unlocked ? "text-[#294B3A]" : "text-[#8A978F]"
                    }`}
                >
                    {lesson.title}
                </span>
                <span className="mt-0.5 block text-xs sm:text-sm text-[#8A978F]">
                    {formatMinutes(lesson.estimatedMinutes)}
                    {lesson.type === "assessment"
                        ? " · Assessment"
                        : lesson.quiz?.length
                            ? " · Knowledge check"
                            : " · Reading and practice"}
                </span>
            </span>

            {current ? (
                <span className="shrink-0 rounded-full bg-[#ECF7F2] px-2 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#12755A]">
                    Current
                </span>
            ) : null}
        </>
    );

    if (!unlocked) {
        return (
            <div
                aria-disabled="true"
                title="Complete the previous lesson to unlock this one"
                className="flex min-h-14 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-[#8A978F]"
            >
                {contents}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex min-h-14 items-center gap-3 rounded-xl border px-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A53] ${
                current
                    ? "border-[#CFE6D8] bg-[#F4FAF6]"
                    : "border-transparent hover:border-[#E0E9E3] hover:bg-[#F8FBF9]"
            }`}
        >
            {contents}
        </Link>
    );
}

export default function CourseDetailView({ course }) {
    const router = useRouter();
    const {
        progress,
        ready,
        enrollCourse,
        togglePauseCourse,
    } = useLearningProgress();
    const record = progress.courses[course.id];
    const status = getCourseStatus(course, record);
    const completion = getCourseCompletion(course, record);
    const currentLesson = getCurrentCourseLesson(course, record);
    const firstLesson = getCourseLessons(course)[0];
    const lessons = getCourseLessons(course);

    function startOrContinue() {
        if (!record) {
            enrollCourse(course);
            if (firstLesson) {
                router.push(
                    `/deen-islam/learning/courses/${course.id}/lessons/${firstLesson.id}`
                );
            }
            return;
        }

        if (record.paused) togglePauseCourse(course);
        const target = status === "completed" ? firstLesson : currentLesson;

        if (target) {
            router.push(
                `/deen-islam/learning/courses/${course.id}/lessons/${target.id}`
            );
        }
    }

    const actionLabel =
        status === "completed"
            ? "Review from the beginning"
            : record
                ? "Continue Learning"
                : "Start Course";

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(31,138,91,0.08), transparent 66%)",
                }}
            />

            <div className="relative mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <Link
                    href="/deen-islam/learning/courses"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] transition hover:gap-2.5 hover:text-[#14563B]"
                >
                    <ArrowLeft size={13} aria-hidden="true" />
                    Back to Explore Courses
                </Link>

                <header className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <LevelBadge level={course.level} />
                            <span className="rounded-full border border-[#DCE5DF] bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#5F6F66]">
                                {course.category}
                            </span>
                            <StatusBadge status={status} />
                        </div>

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#12362B] sm:text-4xl">
                            {course.title}
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-7 text-[#64756C]">
                            {course.longDescription || course.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#7A887F]">
                            <span className="inline-flex items-center gap-1.5">
                                <Layers3 size={13} aria-hidden="true" />
                                {course.modules.length} modules
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <BookOpenText size={13} aria-hidden="true" />
                                {lessons.length} lessons
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={13} aria-hidden="true" />
                                {formatMinutes(getCourseMinutes(course))} estimated
                            </span>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={startOrContinue}
                                disabled={!ready || !firstLesson}
                                className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#14563B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B4B] focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
                            >
                                <Play size={14} aria-hidden="true" />
                                {actionLabel}
                            </button>

                            {record && currentLesson ? (
                                <Link
                                    href={getResumeHref(course, record)}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#D5E3DA] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A53]"
                                >
                                    Resume: {currentLesson.title}
                                    <ArrowRight size={13} aria-hidden="true" />
                                </Link>
                            ) : null}
                        </div>
                    </div>

                    <aside className="rounded-2xl border border-[#DFE9E2] bg-white p-5 shadow-[0_10px_30px_-24px_rgba(20,60,45,0.45)]">
                        <div className="flex items-center gap-3">
                            <CourseIcon course={course} size="sm" />
                            <div>
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8A978F]">
                                    Your progress
                                </p>
                                <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#173B2D]">
                                    {record
                                        ? `${completion.completedLessons} of ${completion.totalLessons} lessons`
                                        : "Not started yet"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                                <span className="text-[#7A887F]">Completion</span>
                                <span className="font-semibold text-[#1B6B4B]">
                                    {completion.percentage}%
                                </span>
                            </div>
                            <ProgressBar
                                value={completion.percentage}
                                label={`${course.title} completion`}
                                className="mt-2"
                            />
                        </div>

                        {currentLesson ? (
                            <div className="mt-4 rounded-xl border border-[#EDF2EE] bg-[#F8FBF9] px-3 py-2.5">
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#8A978F]">
                                    Current lesson
                                </p>
                                <p className="mt-1 text-xs sm:text-sm font-medium leading-5 text-[#3E5B4C]">
                                    {currentLesson.title}
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-4 space-y-2.5 border-t border-[#EDF2EE] pt-4 text-xs sm:text-sm leading-5 text-[#7A887F]">
                            <p className="flex gap-2">
                                <Target
                                    size={13}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-[#1B7A53]"
                                />
                                {course.completionCriteria}
                            </p>
                            <p className="rounded-lg bg-[#FBF7EC] px-2.5 py-2 text-[#8A6A22]">
                                {course.sourceNote}
                            </p>
                        </div>

                        {record ? (
                            <button
                                type="button"
                                onClick={() => togglePauseCourse(course)}
                                className="mt-4 w-full rounded-full border border-[#D5E3DA] bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-[#5F6F66] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                            >
                                {record.paused ? "Resume course" : "Pause course"}
                            </button>
                        ) : null}
                    </aside>
                </header>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <section aria-labelledby="curriculum-heading">
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8A978F]">
                                    Course roadmap
                                </p>
                                <h2
                                    id="curriculum-heading"
                                    className="mt-1 text-xl font-semibold text-[#173B2D]"
                                >
                                    Curriculum
                                </h2>
                            </div>
                            <p className="text-xs sm:text-sm text-[#8A978F]">
                                {course.sequential
                                    ? "Complete lessons in order"
                                    : "Lessons can be studied in any order"}
                            </p>
                        </div>

                        <div className="mt-4 space-y-4">
                            {course.modules.map((module, moduleIndex) => {
                                const moduleLessons = module.lessons;
                                const completedInModule = moduleLessons.filter(
                                    (lesson) =>
                                        record?.completedLessons?.[lesson.id]
                                ).length;

                                return (
                                    <section
                                        key={module.id}
                                        className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8A978F]">
                                                    Module {moduleIndex + 1}
                                                </p>
                                                <h3 className="mt-1 text-base sm:text-lg font-semibold text-[#173B2D]">
                                                    {module.title}
                                                </h3>
                                                <p className="mt-1 text-xs sm:text-sm leading-5 text-[#7A887F]">
                                                    {module.description}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-full border border-[#E0E9E3] bg-[#F8FBF9] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#5F6F66]">
                                                {completedInModule}/{moduleLessons.length}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            {moduleLessons.map((lesson, index) => (
                                                <LessonRow
                                                    key={lesson.id}
                                                    course={course}
                                                    record={record}
                                                    lesson={lesson}
                                                    index={
                                                        getCourseLessons(course).findIndex(
                                                            (item) => item.id === lesson.id
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </section>

                    <aside className="space-y-5">
                        <section className="rounded-2xl border border-[#E0E9E3] bg-white p-5">
                            <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                Learning objectives
                            </h2>
                            <ul className="mt-3 space-y-2.5">
                                {course.objectives.map((objective) => (
                                    <li
                                        key={objective}
                                        className="flex gap-2 text-xs sm:text-sm leading-5 text-[#64756C]"
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

                        <section className="rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-5 text-white">
                            <h2 className="text-sm sm:text-base font-semibold">
                                How completion works
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm leading-6 text-emerald-50/60">
                                Opening a lesson does not complete it. You must
                                pass any knowledge check, then choose “Mark
                                lesson complete.” Progress is saved to this
                                browser.
                            </p>
                            <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs sm:text-sm leading-5 text-emerald-50/50">
                                This is an educational progress record, not a
                                certified ijazah or recitation credential.
                            </p>
                        </section>
                    </aside>
                </div>

                <LearningFooter />
            </div>
        </main>
    );
}
