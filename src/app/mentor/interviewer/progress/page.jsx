"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    ArrowUpRight,
    BrainCircuit,
    ChartNoAxesCombined,
    ChevronRight,
    Clock3,
    History,
    LoaderCircle,
    Plus,
    RefreshCw,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
} from "lucide-react";

const RESULT_BASE_PATH = "/mentor/interviewer/result";
const START_INTERVIEW_PATH = "/mentor/interviewer/setup";

function getScore(value) {
    if (value === null || value === undefined || value === "") return null;

    const score = Number(value);

    return Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : null;
}

function scoreTone(score) {
    if (score === null) return "text-slate-400";
    if (score >= 80) return "text-emerald-300";
    if (score >= 60) return "text-amber-300";
    return "text-rose-300";
}

function scoreBarTone(score) {
    if (score === null) return "bg-slate-500";
    if (score >= 80) return "bg-emerald-400";
    if (score >= 60) return "bg-amber-400";
    return "bg-rose-400";
}

function formatDate(value) {
    if (!value) return "Date not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Date not available";

    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function interviewTitle(session) {
    const subject = session.config?.subject || "Practice";
    const type = session.config?.interviewType;

    return type ? `${subject} ${type} Interview` : `${subject} Interview`;
}

function performanceSummary(session) {
    if (typeof session.summary === "string" && session.summary.trim()) {
        return session.summary.trim();
    }

    const strongest = session.strongestTopic;
    const weakest = session.weakestTopic;

    if (strongest && weakest && strongest !== weakest) {
        return `Strongest area: ${strongest}. Focus next on ${weakest}.`;
    }

    if (strongest) {
        return `Strongest area: ${strongest}.`;
    }

    if (weakest) {
        return `Focus next on ${weakest}.`;
    }

    return "Open the full report to review the detailed performance breakdown.";
}

function StatCard({ label, value, hint, icon: Icon, color, bg, loading }) {
    return (
        <article className="rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 transition hover:border-white/[0.15]">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs text-slate-400">{label}</p>
                    {loading ? (
                        <span className="mt-3 block h-9 w-20 animate-pulse rounded-lg bg-white/[0.06]" />
                    ) : (
                        <p className="mt-3 text-3xl font-semibold tracking-tight">
                            {value}
                        </p>
                    )}
                </div>
                <div className={`shrink-0 rounded-xl p-3 ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                <TrendingUp className={`h-3.5 w-3.5 ${color}`} />
                {hint}
            </p>
        </article>
    );
}

function ResultCard({ session }) {
    const score = getScore(session.overallScore ?? session.percentage);
    const grade =
        session.performanceGrade ||
        session.gradeLabel ||
        (session.grade ? `Grade ${session.grade}` : null);
    const topicCount =
        Number(session.questionCount) || Number(session.counts?.total) || 0;
    const difficulty = session.config?.difficulty || "Not specified";
    const language = session.config?.language || null;

    return (
        <Link
            href={`${RESULT_BASE_PATH}/${session.id}`}
            className="group block rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-4 transition hover:border-violet-400/25 hover:bg-[#101423] sm:p-5"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex items-start gap-3 sm:flex-1">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08]">
                        <BrainCircuit className="h-5 w-5 text-violet-300" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="break-words text-sm font-semibold text-slate-100 sm:text-base">
                                {interviewTitle(session)}
                            </h3>
                            {grade && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1 text-[10px] text-emerald-300">
                                    <Trophy size={11} />
                                    {grade}
                                </span>
                            )}
                        </div>

                        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{difficulty}</span>
                            <span aria-hidden="true">·</span>
                            <span>
                                {topicCount} question{topicCount === 1 ? "" : "s"}
                            </span>
                            {language && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <span>{language}</span>
                                </>
                            )}
                            <span aria-hidden="true">·</span>
                            <span>
                                {formatDate(
                                    session.completedAt || session.createdAt
                                )}
                            </span>
                        </p>

                        <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-slate-400">
                            {performanceSummary(session)}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                            {session.strongestTopic && (
                                <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1 text-emerald-300">
                                    Strongest: {session.strongestTopic}
                                </span>
                            )}
                            {session.weakestTopic &&
                                session.weakestTopic !==
                                    session.strongestTopic && (
                                    <span className="rounded-lg border border-rose-400/15 bg-rose-400/[0.05] px-2.5 py-1 text-rose-300">
                                        Focus next: {session.weakestTopic}
                                    </span>
                                )}
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/[0.06] pt-4 sm:w-44 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                        <p
                            className={`text-2xl font-semibold tracking-tight ${scoreTone(score)}`}
                        >
                            {score === null ? "—" : `${Math.round(score)}%`}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                            {score === null
                                ? "Score not available"
                                : "Overall score"}
                        </p>
                        {score !== null && (
                            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className={`h-full rounded-full ${scoreBarTone(score)}`}
                                    style={{ width: `${score}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition group-hover:border-violet-400/25 group-hover:text-violet-200">
                        Full result
                        <ArrowRight
                            size={13}
                            className="transition group-hover:translate-x-0.5"
                        />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function InterviewerProgressPage() {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadProgress = useCallback(async ({ refresh = false, signal } = {}) => {
        if (refresh) setIsRefreshing(true);

        try {
            const response = await fetch("/api/interviewer/session?limit=100", {
                cache: "no-store",
                signal,
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.error || "Interview progress could not be loaded."
                );
            }

            setSessions(Array.isArray(data.interviews) ? data.interviews : []);
            setError("");
        } catch (loadError) {
            if (loadError?.name === "AbortError") return;

            setError(
                loadError?.message ||
                    "Interview progress could not be loaded. Please try again."
            );
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            await loadProgress({ signal: controller.signal });
        })();

        return () => controller.abort();
    }, [loadProgress]);

    const scoredSessions = sessions.filter(
        (session) => getScore(session.overallScore ?? session.percentage) !== null
    );
    const averageScore = scoredSessions.length
        ? Math.round(
              scoredSessions.reduce(
                  (total, session) =>
                      total +
                      getScore(session.overallScore ?? session.percentage),
                  0
              ) / scoredSessions.length
          )
        : null;
    const bestScore = scoredSessions.length
        ? Math.max(
              ...scoredSessions.map((session) =>
                  getScore(session.overallScore ?? session.percentage)
              )
          )
        : null;
    const topicCount = new Set(
        sessions.flatMap((session) =>
            Array.isArray(session.config?.topics)
                ? session.config.topics
                : []
        )
    ).size;
    const missingScoreCount = sessions.length - scoredSessions.length;

    return (
        <main className="min-h-screen overflow-x-clip bg-[#080A12] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute right-0 top-[35%] h-80 w-80 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
            </div>

            <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
                <section className="min-w-0 flex-1 px-4 py-5 sm:px-7 sm:py-8 xl:px-10">
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15">
                                <BrainCircuit className="h-6 w-6 text-cyan-300" />
                            </div>
                            <div>
                                <p className="text-sm font-bold tracking-wider">
                                    EDUKIND
                                </p>
                                <p className="text-[10px] text-violet-300">
                                    AI INTERVIEWER
                                </p>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <p className="text-sm text-slate-400">
                                Workspace /{" "}
                                <span className="text-white">My Progress</span>
                            </p>
                            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                                My Progress
                            </h1>
                        </div>

                        <div className="ml-auto flex items-center gap-3">
                            <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 sm:flex">
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                <span className="text-xs text-emerald-300">
                                    AI Workspace
                                </span>
                            </div>
                            <Link
                                href="/mentor/interviewer"
                                className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 transition hover:bg-white/[0.05] sm:px-4 sm:text-sm"
                            >
                                Overview
                            </Link>
                        </div>
                    </header>

                    <section className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#17152B] via-[#101423] to-[#0C1824] p-6 sm:p-8">
                        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" />
                        <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />

                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-3 py-1.5 text-xs text-violet-200">
                                    <ChartNoAxesCombined className="h-3.5 w-3.5" />
                                    Your interview growth tracker
                                </div>
                                <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                                    Every interview is a{" "}
                                    <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                                        step forward.
                                    </span>
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                                    Review your completed interviews, compare
                                    your scores, and open any saved report to
                                    see the full question-by-question feedback.
                                </p>
                            </div>

                            <Link
                                href={START_INTERVIEW_PATH}
                                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/25 transition hover:-translate-y-0.5 hover:shadow-violet-500/20"
                            >
                                <Plus className="h-4 w-4" />
                                Start New Interview
                                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                    </section>

                    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                            label="Total Interviews"
                            value={String(sessions.length).padStart(2, "0")}
                            hint={
                                sessions.length
                                    ? "Completed practice sessions"
                                    : "Complete one to begin"
                            }
                            icon={History}
                            color="text-cyan-300"
                            bg="bg-cyan-400/10"
                            loading={isLoading}
                        />
                        <StatCard
                            label="Average Score"
                            value={
                                averageScore === null
                                    ? "—"
                                    : `${averageScore}%`
                            }
                            hint={
                                scoredSessions.length
                                    ? `Across ${scoredSessions.length} saved report${scoredSessions.length === 1 ? "" : "s"}`
                                    : "No saved scores yet"
                            }
                            icon={Target}
                            color="text-violet-300"
                            bg="bg-violet-400/10"
                            loading={isLoading}
                        />
                        <StatCard
                            label="Best Score"
                            value={
                                bestScore === null ? "—" : `${bestScore}%`
                            }
                            hint={
                                bestScore === null
                                    ? "Your best result will appear here"
                                    : "Your highest saved result"
                            }
                            icon={Trophy}
                            color="text-amber-300"
                            bg="bg-amber-400/10"
                            loading={isLoading}
                        />
                        <StatCard
                            label="Topics Practiced"
                            value={String(topicCount).padStart(2, "0")}
                            hint={
                                topicCount
                                    ? "Tracked from your setup"
                                    : "Choose topics next"
                            }
                            icon={TrendingUp}
                            color="text-emerald-300"
                            bg="bg-emerald-400/10"
                            loading={isLoading}
                        />
                    </section>

                    <section className="rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6">
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Interview Results
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    {isLoading
                                        ? "Loading your saved reports..."
                                        : sessions.length
                                          ? `${sessions.length} completed interview${sessions.length === 1 ? "" : "s"}`
                                          : "Your completed interviews will appear here"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => loadProgress({ refresh: true })}
                                disabled={isLoading || isRefreshing}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <RefreshCw
                                    size={14}
                                    className={
                                        isRefreshing ? "animate-spin" : ""
                                    }
                                />
                                Refresh
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[0, 1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-11 w-11 rounded-xl bg-white/[0.06]" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3.5 w-2/5 rounded bg-white/[0.06]" />
                                                <div className="h-3 w-3/5 rounded bg-white/[0.04]" />
                                                <div className="h-3 w-full rounded bg-white/[0.04]" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <p className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
                                    <LoaderCircle
                                        size={14}
                                        className="animate-spin"
                                    />
                                    Loading previous interview results...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-rose-400/15 bg-rose-400/[0.05] p-6 text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-400/10">
                                    <AlertCircle className="h-6 w-6 text-rose-300" />
                                </div>
                                <p className="mt-4 text-sm font-semibold text-rose-200">
                                    Could not load your progress
                                </p>
                                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-rose-300/80">
                                    {error}
                                </p>
                                <button
                                    type="button"
                                    onClick={() =>
                                        loadProgress({ refresh: true })
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-xs font-semibold"
                                >
                                    <RefreshCw size={14} />
                                    Try again
                                </button>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/[0.08]">
                                    <Sparkles className="h-7 w-7 text-violet-300" />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold">
                                    No Progress Found Yet
                                </h3>
                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                                    You haven&apos;t completed any interviews
                                    yet. Start your first interview to track
                                    your performance and see your progress
                                    here.
                                </p>
                                <Link
                                    href={START_INTERVIEW_PATH}
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-900/25 transition hover:-translate-y-0.5"
                                >
                                    <Plus size={16} />
                                    Start Your First Interview
                                    <ArrowUpRight size={15} />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {missingScoreCount > 0 && (
                                    <div className="mb-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-xs leading-5 text-amber-200/80">
                                        {missingScoreCount} completed interview
                                        {missingScoreCount === 1 ? "" : "s"} do
                                        not have a saved score yet. Open the
                                        report to see its current status. No
                                        score has been invented.
                                    </div>
                                )}

                                {sessions.map((session) => (
                                    <ResultCard
                                        key={session.id}
                                        session={session}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.09] to-cyan-400/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-violet-400/10 p-3">
                                <Clock3 className="h-6 w-6 text-violet-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Keep your practice consistent.
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-400">
                                    Each completed interview gives you a new
                                    report to learn from and a clearer view of
                                    your progress.
                                </p>
                            </div>
                        </div>
                        <Link
                            href={START_INTERVIEW_PATH}
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-violet-300/20 bg-violet-400/10 px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-400/15"
                        >
                            Start practicing <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </section>

                    <footer className="py-8 text-center text-[11px] text-slate-600">
                        EDUKIND AI INTERVIEWER · LEARN · BUILD · IMPACT
                    </footer>
                </section>
            </div>
        </main>
    );
}
