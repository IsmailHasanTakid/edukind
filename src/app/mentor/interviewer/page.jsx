
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    AudioLines,
    BrainCircuit,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    ChevronRight,
    Clock3,
    Code2,
    History,
    LoaderCircle,
    Mic,
    Plus,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Zap,
} from "lucide-react";

const TYPE_STYLES = {
    Technical: {
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
        icon: Code2,
    },
    Coding: {
        color: "text-violet-300",
        bg: "bg-violet-400/10",
        icon: BrainCircuit,
    },
    HR: {
        color: "text-amber-300",
        bg: "bg-amber-400/10",
        icon: BriefcaseBusiness,
    },
    Mixed: {
        color: "text-emerald-300",
        bg: "bg-emerald-400/10",
        icon: Users,
    },
};

function aggregateWeakTopics(sessions) {
    const topics = new Map();

    sessions.forEach((session) => {
        (session.topicPerformance || []).forEach((topic) => {
            const score = Number(topic.score);

            if (!topic.topic || !Number.isFinite(score)) return;

            if (!topics.has(topic.topic)) {
                topics.set(topic.topic, { total: 0, count: 0 });
            }

            const entry = topics.get(topic.topic);
            entry.total += score;
            entry.count += 1;
        });
    });

    return Array.from(topics.entries())
        .map(([name, entry]) => ({
            name,
            progress: Math.round(entry.total / entry.count),
        }))
        .sort((a, b) => a.progress - b.progress)
        .slice(0, 3);
}

export default function InterviewerPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState("");
    const [now, setNow] = useState(0);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(
                    "/api/interviewer/session?limit=100"
                );
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.error || "Interview history লোড করা যায়নি।"
                    );
                }

                if (!cancelled) {
                    setSessions(
                        Array.isArray(data.interviews) ? data.interviews : []
                    );
                    setNow(Date.now());
                }
            } catch (error) {
                if (!cancelled) {
                    setHistoryError(
                        error?.message || "Interview history লোড করা যায়নি।"
                    );
                }
            } finally {
                if (!cancelled) setIsHistoryLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const totalInterviews = sessions.length;
    const averageScore = totalInterviews
        ? Math.round(
            sessions.reduce(
                (total, session) =>
                    total + (Number(session.overallScore) || 0),
                0
            ) / totalInterviews
        )
        : 0;
    const practiceHours = (
        sessions.reduce(
            (total, session) =>
                total + (Number(session.config?.duration) || 0),
            0
        ) / 60
    ).toFixed(1);
    const topicCount = new Set(
        sessions.flatMap((session) => session.config?.topics || [])
    ).size;
    const weekSessions = sessions.filter(
        (session) =>
            now - new Date(session.createdAt).getTime() <
            7 * 24 * 60 * 60 * 1000 &&
            now - new Date(session.createdAt).getTime() >= 0
    ).length;
    const recentSessions = sessions.slice(0, 6);
    const weaknessTopics = aggregateWeakTopics(sessions);

    const weekActivity = Array.from({ length: 7 }).map((_, index) => {
        const day = new Date(now || 0);
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - (6 - index));

        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);

        return sessions.filter((session) => {
            const created = new Date(session.createdAt);
            return created >= day && created < nextDay;
        }).length;
    });
    const maxActivity = Math.max(...weekActivity, 1);
    const dayLabels = Array.from({ length: 7 }).map((_, index) => {
        const day = new Date(now || 0);
        day.setDate(day.getDate() - (6 - index));
        return day
            .toLocaleDateString("en-US", { weekday: "short" })
            .slice(0, 1);
    });

    const stats = [
        {
            label: "Total Interviews",
            value: String(totalInterviews).padStart(2, "0"),
            change: `${weekSessions} this week`,
            icon: History,
            color: "text-cyan-300",
            bg: "bg-cyan-400/10",
        },
        {
            label: "Average Score",
            value: `${averageScore}%`,
            change: totalInterviews
                ? "Across saved reports"
                : "Complete one to begin",
            icon: Target,
            color: "text-violet-300",
            bg: "bg-violet-400/10",
        },
        {
            label: "Practice Hours",
            value: `${practiceHours}h`,
            change: "Total interview time",
            icon: Clock3,
            color: "text-blue-300",
            bg: "bg-blue-400/10",
        },
        {
            label: "Topics Practiced",
            value: String(topicCount).padStart(2, "0"),
            change: topicCount ? "Tracked from your setup" : "Choose topics next",
            icon: TrendingUp,
            color: "text-emerald-300",
            bg: "bg-emerald-400/10",
        },
    ];

    return (
        <main className="min-h-screen overflow-x-clip bg-[#080A12] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute right-0 top-[35%] h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
            </div>

            <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
                {/* Main content */}
                <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-8 xl:px-10">
                    {/* Header */}
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
                                <BrainCircuit className="h-6 w-6 text-cyan-300" />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-wider">EDUKIND</p>
                                <p className="text-[10px] text-violet-300">AI INTERVIEWER</p>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-sm text-slate-400">
                                Workspace / <span className="text-white">Overview</span>
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                                Interview Dashboard
                            </h1>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 sm:flex">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs text-emerald-300">
                                    AI Workspace
                                </span>
                            </div>
                            <a
                                href="/mentor"
                                className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 transition hover:bg-white/[0.05] sm:px-4 sm:text-sm"
                            >
                                AI Mentor
                            </a>
                        </div>
                    </header>

                    {/* Hero */}
                    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#17152B] via-[#101423] to-[#0C1824] p-6 sm:p-8 xl:p-10">
                        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" />
                        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

                        <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_240px]">
                            <div className="max-w-2xl">
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-3 py-1.5 text-xs text-violet-200">
                                    <Sparkles className="h-3.5 w-3.5" />
                                    Your personal AI interview coach
                                </div>

                                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl xl:text-5xl">
                                    Prepare smarter.
                                    <br />
                                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                                        Perform better.
                                    </span>
                                </h2>

                                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                                    Practice real-world interviews, explore any topic you want,
                                    and discover what it takes to reach your next level.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => router.push("/mentor/interviewer/setup")}
                                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/25 transition hover:-translate-y-0.5 hover:shadow-violet-500/20"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Start New Interview
                                        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                                    </button>

                                    <a
                                        href="#interview-history"
                                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07]"
                                    >
                                        <History className="h-4 w-4" />
                                        View History
                                    </a>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Mic className="h-3.5 w-3.5 text-cyan-300" />
                                        Voice practice
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BrainCircuit className="h-3.5 w-3.5 text-violet-300" />
                                        Adaptive questions
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Target className="h-3.5 w-3.5 text-blue-300" />
                                        Personalized feedback
                                    </span>
                                </div>
                            </div>

                            <div className="relative mx-auto hidden h-52 w-52 items-center justify-center lg:flex">
                                <div className="absolute inset-0 rounded-full border border-violet-400/15" />
                                <div className="absolute inset-4 rounded-full border border-cyan-300/15" />
                                <div className="absolute inset-9 rounded-full border border-violet-300/20" />
                                <div className="absolute inset-3 rounded-full bg-violet-500/[0.06] blur-xl" />
                                <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-violet-300/30 bg-gradient-to-br from-violet-400/20 to-cyan-300/10 shadow-2xl shadow-violet-500/20">
                                    <AudioLines className="h-12 w-12 text-cyan-200" />
                                </div>
                                <div className="absolute right-5 top-7 rounded-xl border border-cyan-300/20 bg-[#111827] p-2.5">
                                    <Mic className="h-4 w-4 text-cyan-300" />
                                </div>
                                <div className="absolute bottom-7 left-3 rounded-xl border border-violet-300/20 bg-[#111827] p-2.5">
                                    <Zap className="h-4 w-4 text-violet-300" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats */}
                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <article
                                    key={stat.label}
                                    className="rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 transition hover:border-white/[0.15]"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-slate-400">{stat.label}</p>
                                            <p className="mt-3 text-3xl font-semibold tracking-tight">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl p-3 ${stat.bg}`}>
                                            <Icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                    </div>
                                    <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                                        <TrendingUp className={`h-3.5 w-3.5 ${stat.color}`} />
                                        {stat.change}
                                    </p>
                                </article>
                            );
                        })}
                    </section>

                    {/* Main grid */}
                    <div className="grid items-start gap-6 xl:grid-cols-[1.45fr_1fr]">
                        {/* Interview history */}
                        <section
                            id="interview-history"
                            className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6"
                        >
                            <div className="mb-6 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold">Recent Interviews</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your latest practice sessions
                                    </p>
                                </div>
                                <History className="h-5 w-5 text-slate-500" />
                            </div>

                            <div className="space-y-3">
                                {isHistoryLoading ? (
                                    <div className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.015] py-10 text-xs text-slate-500">
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                        Loading interview history...
                                    </div>
                                ) : historyError ? (
                                    <div className="rounded-xl border border-rose-400/15 bg-rose-400/[0.05] p-4 text-sm leading-6 text-rose-300">
                                        {historyError}
                                    </div>
                                ) : recentSessions.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-center">
                                        <History
                                            size={26}
                                            className="mx-auto text-slate-600"
                                        />
                                        <p className="mt-3 text-sm font-medium text-slate-300">
                                            এখনো কোনো completed interview নেই
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            প্রথম AI interview শেষ করলে এখানে
                                            score ও report দেখা যাবে।
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    "/mentor/interviewer/setup"
                                                )
                                            }
                                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-xs font-semibold"
                                        >
                                            <Plus size={14} />
                                            Start your first interview
                                        </button>
                                    </div>
                                ) : (
                                    recentSessions.map((session) => {
                                        const style =
                                            TYPE_STYLES[
                                            session.config?.interviewType
                                            ] || TYPE_STYLES.Technical;
                                        const Icon = style.icon;
                                        const score =
                                            Number(session.overallScore) || 0;
                                        const scoreTone =
                                            score >= 80
                                                ? "text-emerald-300"
                                                : score >= 60
                                                    ? "text-amber-300"
                                                    : "text-rose-300";

                                        return (
                                            <Link
                                                key={session.id}
                                                href={`/mentor/interviewer/result/${session.id}`}
                                                className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 transition hover:border-white/10 hover:bg-white/[0.035] sm:gap-4 sm:p-4"
                                            >
                                                <div
                                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.bg}`}
                                                >
                                                    <Icon
                                                        className={`h-5 w-5 ${style.color}`}
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h4 className="truncate text-sm font-medium text-slate-200">
                                                        {session.config?.subject ||
                                                            "Interview"}{" "}
                                                        {session.config
                                                            ?.interviewType ||
                                                            "Practice"}{" "}
                                                        Interview
                                                    </h4>
                                                    <p className="mt-1 truncate text-xs text-slate-500">
                                                        {session.config
                                                            ?.subject ||
                                                            "Custom"}{" "}
                                                        ·{" "}
                                                        {session.config
                                                            ?.difficulty ||
                                                            "Intermediate"}{" "}
                                                        ·{" "}
                                                        {session.questionCount}{" "}
                                                        questions
                                                    </p>
                                                    <p className="mt-2 text-[11px] text-slate-600">
                                                        {new Date(
                                                            session.createdAt
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="shrink-0 text-right">
                                                    <p
                                                        className={`text-lg font-semibold ${scoreTone}`}
                                                    >
                                                        {score}%
                                                    </p>
                                                    <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-500">
                                                        View report
                                                        <ArrowRight
                                                            size={11}
                                                            className="transition group-hover:translate-x-0.5"
                                                        />
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })
                                )}
                            </div>

                            <button
                                onClick={() => router.push("/mentor/interviewer/setup")}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-xs font-medium text-slate-400 transition hover:border-violet-400/30 hover:text-violet-300"
                            >
                                <Plus className="h-4 w-4" />
                                Start another practice session
                            </button>
                        </section>

                        {/* Performance */}
                        <section className="rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Performance Overview</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Your practice activity
                                    </p>
                                </div>
                                <div className="rounded-xl bg-emerald-400/10 p-2.5">
                                    <ChartNoAxesCombined className="h-5 w-5 text-emerald-300" />
                                </div>
                            </div>

                            <div className="mt-6 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-4xl font-semibold tracking-tight">
                                        {averageScore}
                                        <span className="text-xl text-slate-400">
                                            %
                                        </span>
                                    </p>
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        {totalInterviews
                                            ? `Based on ${totalInterviews} saved report${totalInterviews === 1 ? "" : "s"}`
                                            : "Complete an interview to see your score"}
                                    </p>
                                </div>
                                <span className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-slate-400">
                                    Last 7 days
                                </span>
                            </div>

                            <div className="mt-8 flex h-36 items-end justify-between gap-2">
                                {weekActivity.map((count, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <div className="flex w-full flex-1 items-end">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-300 ${index === 6
                                                    ? "bg-gradient-to-t from-violet-600 to-cyan-300"
                                                    : "bg-gradient-to-t from-violet-600/30 to-violet-300/50"
                                                    }`}
                                                style={{
                                                    height: `${Math.max(
                                                        count
                                                            ? Math.round(
                                                                (count /
                                                                    maxActivity) *
                                                                100
                                                            )
                                                            : 4,
                                                        4
                                                    )}%`,
                                                }}
                                                title={`${count} interview${count === 1 ? "" : "s"}`}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-600">
                                            {dayLabels[index]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-white/[0.07] pt-5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Weekly goal
                                    </span>
                                    <span className="font-medium text-slate-200">
                                        {Math.min(weekSessions, 5)} / 5 sessions
                                    </span>
                                </div>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (weekSessions / 5) * 100,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>
                                <p className="mt-3 text-[11px] text-slate-500">
                                    {weekSessions >= 5
                                        ? "Weekly goal complete. Keep the momentum going."
                                        : `${5 - weekSessions} more session${5 - weekSessions === 1 ? "" : "s"} to reach your weekly goal.`}
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Weakness tracker */}
                    <section
                        id="weakness-tracker"
                        className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6"
                    >
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-rose-400/10 p-3">
                                    <Target className="h-5 w-5 text-rose-300" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Focus Areas</h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Topics that need more practice
                                    </p>
                                </div>
                            </div>
                            <span className="rounded-full border border-rose-400/20 bg-rose-400/[0.06] px-3 py-1.5 text-xs text-rose-300">
                                {weaknessTopics.length
                                    ? `${weaknessTopics.length} areas to improve`
                                    : "No topic data yet"}
                            </span>
                        </div>

                        {weaknessTopics.length ? (
                            <div className="grid gap-5 md:grid-cols-3">
                                {weaknessTopics.map((item) => {
                                    const color =
                                        item.progress < 40
                                            ? "bg-rose-400"
                                            : item.progress < 60
                                                ? "bg-amber-400"
                                                : "bg-violet-400";

                                    return (
                                        <div
                                            key={item.name}
                                            className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <p className="text-sm font-medium leading-5 text-slate-300">
                                                    {item.name}
                                                </p>
                                                <span className="text-xs text-slate-500">
                                                    {item.progress}%
                                                </span>
                                            </div>
                                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                                <div
                                                    className={`h-full rounded-full ${color}`}
                                                    style={{
                                                        width: `${item.progress}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="mt-3 text-[11px] text-slate-500">
                                                Practice recommended
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] p-5 text-sm leading-6 text-slate-500">
                                একাধিক interview শেষ করলে topic-wise score থেকে
                                focus area দেখানো হবে।
                            </p>
                        )}
                    </section>

                    {/* Motivation */}
                    <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.09] to-cyan-400/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-violet-400/10 p-3">
                                <Trophy className="h-6 w-6 text-violet-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Consistency builds confidence.</h3>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    Practice one topic at a time and learn from every interview.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/mentor/interviewer/setup")}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-400/15"
                        >
                            Start practicing <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </section>

                    <footer className="py-8 text-center text-[11px] text-slate-600">
                        EDUKIND AI INTERVIEWER · LEARN · BUILD · IMPACT
                    </footer>
                </section>
            </div>

        </main>
    );
}
