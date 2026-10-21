
"use client";
import { useRouter } from "next/navigation";

import { useState } from "react";
import {
    ArrowUpRight,
    AudioLines,
    BrainCircuit,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    ChevronRight,
    Clock3,
    Code2,
    GraduationCap,
    History,
    LayoutDashboard,
    Mic,
    Plus,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    X,
    Zap,
} from "lucide-react";

const stats = [
    {
        label: "Total Interviews",
        value: "12",
        change: "+3 this week",
        icon: History,
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
    },
    {
        label: "Average Score",
        value: "78%",
        change: "+12% improvement",
        icon: Target,
        color: "text-violet-300",
        bg: "bg-violet-400/10",
    },
    {
        label: "Practice Hours",
        value: "8.5h",
        change: "Keep it going",
        icon: Clock3,
        color: "text-blue-300",
        bg: "bg-blue-400/10",
    },
    {
        label: "Skills Improved",
        value: "06",
        change: "Across 4 topics",
        icon: TrendingUp,
        color: "text-emerald-300",
        bg: "bg-emerald-400/10",
    },
];

const interviews = [
    {
        title: "React.js Technical Interview",
        subtitle: "React.js · Intermediate",
        date: "Today",
        score: "84%",
        status: "Completed",
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
        icon: Code2,
    },
    {
        title: "JavaScript Fundamentals",
        subtitle: "JavaScript · Beginner",
        date: "Yesterday",
        score: "76%",
        status: "Completed",
        color: "text-amber-300",
        bg: "bg-amber-400/10",
        icon: BrainCircuit,
    },
    {
        title: "Frontend Developer HR",
        subtitle: "HR Interview · Intermediate",
        date: "Oct 18",
        score: "72%",
        status: "Completed",
        color: "text-violet-300",
        bg: "bg-violet-400/10",
        icon: BriefcaseBusiness,
    },
];

const weaknesses = [
    { name: "Asynchronous JavaScript", progress: 35, color: "bg-rose-400" },
    { name: "React Performance", progress: 52, color: "bg-amber-400" },
    { name: "Problem Explanation", progress: 68, color: "bg-violet-400" },
];

const activity = [32, 48, 38, 65, 52, 78, 58];

export default function InterviewerPage() {
    const [showSetupNotice, setShowSetupNotice] = useState(false);
    const router = useRouter();

    return (
        <main className="min-h-screen overflow-hidden bg-[#080A12] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute right-0 top-[35%] h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
                {/* Sidebar */}
                <aside className="hidden w-[250px] shrink-0 border-r border-white/[0.07] bg-[#0A0C15]/80 px-5 py-7 lg:flex lg:flex-col">
                    <a href="/mentor" className="mb-10 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-cyan-400/10">
                            <BrainCircuit className="h-6 w-6 text-cyan-300" />
                        </div>
                        <div>
                            <p className="text-sm font-bold tracking-[0.14em]">
                                EDUKIND
                            </p>
                            <p className="text-[10px] tracking-[0.2em] text-violet-300">
                                AI INTERVIEWER
                            </p>
                        </div>
                    </a>

                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Workspace
                    </p>

                    <nav className="space-y-1">
                        <a
                            href="/mentor/interviewer"
                            className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-500/[0.12] px-3 py-3 text-sm font-medium text-white"
                        >
                            <LayoutDashboard className="h-[18px] w-[18px] text-violet-300" />
                            Overview
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                        </a>

                        <button
                            onClick={() => router.push("/mentor/interviewer/setup")}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            <Plus className="h-[18px] w-[18px]" />
                            New Interview
                        </button>

                        <a
                            href="#interview-history"
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            <History className="h-[18px] w-[18px]" />
                            Interview History
                        </a>

                        <a
                            href="#weakness-tracker"
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            <ChartNoAxesCombined className="h-[18px] w-[18px]" />
                            My Progress
                        </a>
                    </nav>

                    <div className="mt-auto">
                        <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.13] to-cyan-500/[0.05] p-4">
                            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/15 blur-2xl" />
                            <Sparkles className="relative mb-3 h-6 w-6 text-violet-300" />
                            <p className="relative text-sm font-semibold">
                                Level up your skills
                            </p>
                            <p className="relative mt-2 text-xs leading-5 text-slate-400">
                                Practice consistently and turn your weak areas into strengths.
                            </p>
                            <a
                                href="#weakness-tracker"
                                className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-300"
                            >
                                View progress <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        <p className="mt-5 text-center text-[10px] tracking-wide text-slate-600">
                            LEARN · BUILD · IMPACT
                        </p>
                    </div>
                </aside>

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
                                {interviews.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <article
                                            key={item.title}
                                            className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5 transition hover:border-white/10 hover:bg-white/[0.035] sm:gap-4 sm:p-4"
                                        >
                                            <div
                                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                                            >
                                                <Icon className={`h-5 w-5 ${item.color}`} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className="truncate text-sm font-medium text-slate-200">
                                                    {item.title}
                                                </h4>
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {item.subtitle}
                                                </p>
                                                <p className="mt-2 text-[11px] text-slate-600">
                                                    {item.date}
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right">
                                                <p className={`text-lg font-semibold ${item.color}`}>
                                                    {item.score}
                                                </p>
                                                <span className="mt-1 block text-[10px] text-slate-500">
                                                    {item.status}
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}
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
                                        78<span className="text-xl text-slate-400">%</span>
                                    </p>
                                    <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        +12% from last month
                                    </p>
                                </div>
                                <span className="rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] text-slate-400">
                                    Last 7 days
                                </span>
                            </div>

                            <div className="mt-8 flex h-36 items-end justify-between gap-2">
                                {activity.map((height, index) => (
                                    <div
                                        key={index}
                                        className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                    >
                                        <div className="flex w-full flex-1 items-end">
                                            <div
                                                className={`w-full rounded-t-lg transition-all duration-300 ${index === 5
                                                    ? "bg-gradient-to-t from-violet-600 to-cyan-300"
                                                    : "bg-gradient-to-t from-violet-600/30 to-violet-300/50"
                                                    }`}
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-slate-600">
                                            {["M", "T", "W", "T", "F", "S", "S"][index]}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-white/[0.07] pt-5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400">Weekly goal</span>
                                    <span className="font-medium text-slate-200">3 / 5 sessions</span>
                                </div>
                                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" />
                                </div>
                                <p className="mt-3 text-[11px] text-slate-500">
                                    Two more sessions to reach your weekly goal.
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
                                3 areas to improve
                            </span>
                        </div>

                        <div className="grid gap-5 md:grid-cols-3">
                            {weaknesses.map((item) => (
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
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                    <p className="mt-3 text-[11px] text-slate-500">
                                        Practice recommended
                                    </p>
                                </div>
                            ))}
                        </div>
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

            {/* Next-step notice */}
            {showSetupNotice && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                    onClick={() => setShowSetupNotice(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="setup-notice-title"
                        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111421] p-6 shadow-2xl shadow-violet-950/30"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowSetupNotice(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10">
                            <Sparkles className="h-6 w-6 text-violet-300" />
                        </div>

                        <h3 id="setup-notice-title" className="text-xl font-semibold">
                            Your next interview starts here
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            The dashboard is ready. Next, we will build the interview setup
                            form so you can choose any topic, difficulty, language, duration,
                            and voice or text mode.
                        </p>

                        <div className="mt-5 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                            <p className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                                <Mic className="h-4 w-4" />
                                Voice interview support
                            </p>
                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Microphone access and AI voice integration will be added in
                                the upcoming steps.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowSetupNotice(false)}
                            className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-semibold transition hover:brightness-110"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
