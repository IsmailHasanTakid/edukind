import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpenText,
    Clock3,
    Layers3,
} from "lucide-react";
import {
    getCourseMinutes,
    getCourseHref,
    getLessonCourseHref,
} from "@/lib/learning/courses";
import {
    getCourseCompletion,
    getCourseStatus,
    getCurrentCourseLesson,
} from "@/lib/learning/progress";
import {
    CourseIcon,
    LevelBadge,
    ProgressBar,
    StatusBadge,
    formatMinutes,
    formatWhen,
    getLevelMeta,
} from "./learning-ui";

export default function LearningCourseCard({
    course,
    record,
    actionLabel,
    actionHref,
    onAction,
    secondaryLabel = "View roadmap",
    secondaryHref,
    showProgress = true,
    extraActions,
}) {
    const status = getCourseStatus(course, record);
    const completion = getCourseCompletion(course, record);
    const currentLesson = record
        ? getCurrentCourseLesson(course, record)
        : null;
    const levelMeta = getLevelMeta(course.level);
    const roadmapHref = secondaryHref || getCourseHref(course.id);
    const primaryHref =
        actionHref ||
        (currentLesson
            ? getLessonCourseHref(course.id, currentLesson.id)
            : roadmapHref);

    const actionClass =
        "mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B6B4B] focus-visible:ring-offset-2";

    return (
        <article className="group flex h-full flex-col rounded-2xl border border-[#E0E9E3] bg-white p-5 shadow-[0_2px_10px_rgba(20,60,45,0.035)] transition duration-300 hover:-translate-y-0.5 hover:border-[#BFD9C9] hover:shadow-[0_18px_38px_-22px_rgba(20,60,45,0.32)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <CourseIcon course={course} />

                <div className="flex flex-wrap items-center justify-end gap-2">
                    <LevelBadge level={course.level} />
                    <StatusBadge status={status} />
                </div>
            </div>

            <p className="mt-4 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[#8A978F]">
                {course.category}
            </p>

            <h3 className="mt-1.5 text-lg sm:text-xl font-semibold leading-6 text-[#173B2D]">
                {course.title}
            </h3>

            <p className="mt-2 flex-1 text-sm sm:text-base leading-6 text-[#6A7A70]">
                {course.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[#849188]">
                <span className="inline-flex items-center gap-1.5">
                    <Layers3 size={12} aria-hidden="true" />
                    {course.modules.length} modules
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <BookOpenText size={12} aria-hidden="true" />
                    {completion.totalLessons} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={12} aria-hidden="true" />
                    {formatMinutes(getCourseMinutes(course))}
                </span>
            </div>

            {showProgress ? (
                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <span className="font-medium text-[#5F6F66]">
                            {record ? "Course progress" : "Ready to begin"}
                        </span>
                        <span className="font-semibold text-[#1B6B4B]">
                            {completion.percentage}%
                        </span>
                    </div>

                    <ProgressBar
                        value={completion.percentage}
                        label={`${course.title} course progress`}
                        tone={levelMeta.bar}
                        className="mt-2"
                    />

                    <p className="mt-2 text-xs sm:text-sm leading-5 text-[#849188]">
                        {record
                            ? `${completion.completedLessons} of ${completion.totalLessons} lessons completed${
                                record.updatedAt
                                    ? ` · Last studied ${formatWhen(
                                        record.updatedAt
                                    )}`
                                    : ""
                            }`
                            : "Start this course to save your lesson progress."}
                    </p>
                </div>
            ) : null}

            {currentLesson ? (
                <div className="mt-4 rounded-xl border border-[#EDF2EE] bg-[#F8FBF9] px-3 py-2.5 text-xs sm:text-sm leading-5 text-[#64756C]">
                    <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#9AA69D]">
                        Current module · {currentLesson.moduleTitle}
                    </span>
                    <span className="mt-0.5 block">
                        <span className="font-medium text-[#3E5B4C]">
                            Current lesson:
                        </span>{" "}
                        {currentLesson.title}
                    </span>
                </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-2">
                {onAction ? (
                    <button
                        type="button"
                        onClick={onAction}
                        className={actionClass}
                    >
                        {actionLabel || "Start Course"}
                        <ArrowRight size={13} aria-hidden="true" />
                    </button>
                ) : (
                    <Link href={primaryHref} className={actionClass}>
                        {actionLabel ||
                            (status === "completed"
                                ? "Review Course"
                                : record
                                    ? "Continue Learning"
                                    : "View Course")}
                        <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                )}

                <Link
                    href={roadmapHref}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A53]"
                >
                    {secondaryLabel}
                    <ArrowUpRight size={12} aria-hidden="true" />
                </Link>

                {extraActions}
            </div>
        </article>
    );
}
