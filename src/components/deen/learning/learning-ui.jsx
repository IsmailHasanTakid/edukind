import {
    AudioLines,
    BookOpenText,
    CheckCircle2,
    Circle,
    Clock3,
    PauseCircle,
    ScrollText,
    Sparkles,
} from "lucide-react";
import { serif } from "@/lib/deen-fonts";

export const LEVEL_META = {
    Beginner: {
        icon: BookOpenText,
        tile: "border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]",
        badge: "border-[#CFE6D8] bg-[#F2F9F5] text-[#1B7A53]",
        bar: "from-[#1B7A53] to-[#2AA57A]",
    },
    Intermediate: {
        icon: AudioLines,
        tile: "border-[#CDE6E2] bg-[#E8F3F2] text-[#0F766E]",
        badge: "border-[#CDE6E2] bg-[#F0F8F7] text-[#0F6B64]",
        bar: "from-[#0F766E] to-[#2AA79C]",
    },
    Advanced: {
        icon: ScrollText,
        tile: "border-[#EADFC8] bg-[#FBF4E6] text-[#9A6B1F]",
        badge: "border-[#EADFC8] bg-[#FCF8EF] text-[#8A5E18]",
        bar: "from-[#9A6B1F] to-[#C9A14A]",
    },
};

export const STATUS_META = {
    "not-started": {
        label: "Not Started",
        badge: "border-[#DCE5DF] bg-[#F5F8F6] text-[#5F6F66]",
        dot: "bg-[#8A978F]",
        icon: Circle,
    },
    "in-progress": {
        label: "In Progress",
        badge: "border-[#CBE4DC] bg-[#ECF7F2] text-[#12755A]",
        dot: "bg-[#1B8A63]",
        icon: Clock3,
    },
    completed: {
        label: "Completed",
        badge: "border-[#EADFC8] bg-[#FBF7EC] text-[#8A6418]",
        dot: "bg-[#B58B3B]",
        icon: CheckCircle2,
    },
    paused: {
        label: "Paused",
        badge: "border-[#DCE5DF] bg-[#F5F8F6] text-[#5F6F66]",
        dot: "bg-[#8A978F]",
        icon: PauseCircle,
    },
};

export function getLevelMeta(level) {
    return LEVEL_META[level] || LEVEL_META.Beginner;
}

export function getStatusMeta(status) {
    return STATUS_META[status] || STATUS_META["not-started"];
}

export function LevelBadge({ level }) {
    if (!level) return null;

    const meta = getLevelMeta(level);

    return (
        <span
            className={`rounded-full border px-2.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] ${meta.badge}`}
        >
            {level}
        </span>
    );
}

export function StatusBadge({ status }) {
    const meta = getStatusMeta(status);
    const Icon = meta.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] ${meta.badge}`}
        >
            <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
            />
            {meta.label}
        </span>
    );
}

export function CourseIcon({ course, size = "md" }) {
    const meta = getLevelMeta(course?.level);
    const Icon = meta.icon;
    const box =
        size === "lg"
            ? "h-14 w-14 rounded-2xl"
            : size === "sm"
                ? "h-10 w-10 rounded-xl"
                : "h-12 w-12 rounded-xl";
    const iconSize = size === "lg" ? 26 : size === "sm" ? 18 : 22;

    return (
        <span
            aria-hidden="true"
            className={`flex shrink-0 items-center justify-center border ${box} ${meta.tile}`}
        >
            <Icon size={iconSize} strokeWidth={1.6} />
        </span>
    );
}

export function ProgressBar({
    value,
    label,
    tone = "from-[#1B7A53] to-[#2AA57A]",
    className = "",
}) {
    const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

    return (
        <div
            role="progressbar"
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeValue}
            aria-valuetext={`${safeValue}% complete`}
            className={`h-2 overflow-hidden rounded-full bg-[#EDF2EE] ${className}`}
        >
            <div
                className={`h-full rounded-full bg-gradient-to-r ${tone}`}
                style={{ width: `${safeValue}%` }}
            />
        </div>
    );
}

export function LearningPageHeader({ title, description, children }) {
    return (
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#CFE4D7] bg-white/80 px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#1C6B4A]">
                    <Sparkles size={13} aria-hidden="true" />
                    Quran Learning Academy
                </span>

                <h1
                    className={`${serif.className} mt-4 text-[2.5rem] leading-[1.05] tracking-tight text-[#12362B] sm:text-5xl`}
                >
                    {title}
                </h1>

                {description ? (
                    <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-[#64756C]">
                        {description}
                    </p>
                ) : null}
            </div>

            {children ? <div className="shrink-0">{children}</div> : null}
        </header>
    );
}

export function formatMinutes(minutes) {
    const safe = Math.max(0, Number(minutes) || 0);
    const hours = Math.floor(safe / 60);
    const rest = safe % 60;

    if (hours > 0 && rest > 0) return `${hours}h ${rest}m`;
    if (hours > 0) return `${hours}h`;

    return `${rest}m`;
}

export function formatWhen(value) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    if (sameDay) {
        return `Today, ${date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function LearningFooter() {
    return (
        <footer className="mt-10 flex flex-col gap-2 border-t border-[#DEE9E2] py-6 text-xs sm:text-sm text-[#8A978F] sm:flex-row sm:items-center sm:justify-between">
            <p>
                <span className="font-semibold tracking-[0.08em] text-[#3E5B4C]">
                    EDUKIND
                </span>
                <span className="mx-2 text-[#C2CEC6]">|</span>
                Quran Learning Academy
            </p>
            <p>Learn with purpose · one step at a time</p>
        </footer>
    );
}
