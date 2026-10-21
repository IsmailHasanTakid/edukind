"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Award,
    BookOpenCheck,
    BrainCircuit,
    CheckCircle2,
    ChevronDown,
    CircleSlash,
    Clock3,
    Lightbulb,
    LoaderCircle,
    RefreshCw,
    RotateCcw,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
} from "lucide-react";
import { getGrade } from "@/lib/interview";

const RESULT_PREFIX = "edukindInterviewResult:";

const STATUS_STYLES = {
    correct: {
        label: "Correct",
        className: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        icon: CheckCircle2,
    },
    partially_correct: {
        label: "Partially correct",
        className: "border-amber-400/25 bg-amber-400/10 text-amber-300",
        icon: Target,
    },
    incorrect: {
        label: "Incorrect",
        className: "border-rose-400/25 bg-rose-400/10 text-rose-300",
        icon: CircleSlash,
    },
    not_answered: {
        label: "Not answered",
        className: "border-slate-400/20 bg-slate-400/10 text-slate-300",
        icon: AlertCircle,
    },
};

function scoreColor(score) {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#fbbf24";
    return "#fb7185";
}

function formatDate(value) {
    if (!value) return "Not available";

    try {
        return new Date(value).toLocaleString();
    } catch {
        return "Not available";
    }
}

function readCachedResult(id) {
    try {
        const raw = localStorage.getItem(`${RESULT_PREFIX}${id}`);

        if (!raw) return null;

        const parsed = JSON.parse(raw);

        if (parsed?.id !== id || parsed.status !== "completed") return null;

        return parsed;
    } catch {
        return null;
    }
}

function ScoreRing({ score }) {
    const value = Math.min(100, Math.max(0, Number(score) || 0));
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative h-36 w-36 shrink-0">
            <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={scoreColor(value)}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{value}</span>
                <span className="text-[11px] text-slate-500">out of 100</span>
            </div>
        </div>
    );
}

function StatCard({ label, value, hint, tone = "slate" }) {
    const tones = {
        slate: "text-slate-100",
        emerald: "text-emerald-300",
        amber: "text-amber-300",
        rose: "text-rose-300",
        cyan: "text-cyan-300",
        violet: "text-violet-300",
    };

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
                {label}
            </p>
            <p
                className={`mt-2 text-2xl font-semibold ${tones[tone] || tones.slate}`}
            >
                {value}
            </p>
            {hint && (
                <p className="mt-1 text-[11px] leading-5 text-slate-500">
                    {hint}
                </p>
            )}
        </div>
    );
}

function InfoList({ icon: Icon, title, items, tone = "violet", emptyText }) {
    const tones = {
        emerald: "border-emerald-400/15 bg-emerald-400/[0.04]",
        rose: "border-rose-400/15 bg-rose-400/[0.04]",
        violet: "border-violet-400/15 bg-violet-400/[0.04]",
        cyan: "border-cyan-400/15 bg-cyan-400/[0.04]",
    };

    return (
        <div className={`rounded-2xl border p-5 ${tones[tone] || tones.violet}`}>
            <div className="flex items-center gap-2">
                <Icon size={18} className="text-slate-300" />
                <h3 className="font-semibold">{title}</h3>
            </div>
            {Array.isArray(items) && items.length > 0 ? (
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-slate-400">
                    {items.map((item, index) => (
                        <li
                            key={`${item}-${index}`}
                            className="flex gap-2 break-words"
                        >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                    {emptyText || "No information was identified for this section."}
                </p>
            )}
        </div>
    );
}

function TopicBar({ topic }) {
    const value = Math.min(100, Math.max(0, Number(topic.score) || 0));

    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="break-words text-sm font-medium leading-5 text-slate-200">
                        {topic.topic}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        {topic.attempted ?? topic.total} answered ·{" "}
                        {topic.total} asked
                        {topic.unanswered
                            ? ` · ${topic.unanswered} unanswered`
                            : ""}
                    </p>
                </div>
                <span
                    className="text-sm font-semibold"
                    style={{ color: scoreColor(value) }}
                >
                    {value}%
                </span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${value}%`,
                        backgroundColor: scoreColor(value),
                    }}
                />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                <span className="text-emerald-300/80">
                    {topic.correct || 0} correct
                </span>
                <span className="text-amber-300/80">
                    {topic.partiallyCorrect || 0} partial
                </span>
                <span className="text-rose-300/80">
                    {topic.incorrect || 0} incorrect
                </span>
            </div>

            {topic.feedback && (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                    {topic.feedback}
                </p>
            )}

            {Array.isArray(topic.conceptsToRevise) &&
                topic.conceptsToRevise.length > 0 && (
                    <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300/80">
                            Revise
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            {topic.conceptsToRevise.join(" · ")}
                        </p>
                    </div>
                )}

            {topic.recommendation && (
                <p className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-xs leading-5 text-slate-400">
                    {topic.recommendation}
                </p>
            )}
        </div>
    );
}

function CriteriaBreakdown({ criteria, rubricCriteria }) {
    if (!criteria || !Array.isArray(rubricCriteria) || !rubricCriteria.length) {
        return null;
    }

    const available = rubricCriteria.filter(
        (criterion) => Number.isFinite(Number(criteria[criterion.key]))
    );

    if (!available.length) return null;

    return (
        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Rubric breakdown
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
                {available.map((criterion) => {
                    const value = Math.min(
                        100,
                        Math.max(0, Number(criteria[criterion.key]) || 0)
                    );

                    return (
                        <div
                            key={criterion.key}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-slate-400">
                                    {criterion.label}
                                </span>
                                <span className="text-xs font-medium text-slate-300">
                                    {value}/100
                                </span>
                            </div>
                            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${value}%`,
                                        backgroundColor: scoreColor(value),
                                    }}
                                />
                            </div>
                            <p className="mt-1 text-[10px] text-slate-600">
                                Weight {criterion.weight}%
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function QuestionResult({ item, rubricCriteria, defaultOpen }) {
    const status =
        STATUS_STYLES[item.status] || STATUS_STYLES.not_answered;
    const StatusIcon = status.icon;
    const answered = Boolean(item.answered);
    const score = Math.min(100, Math.max(0, Number(item.score) || 0));

    return (
        <details
            open={defaultOpen}
            className="group rounded-2xl border border-white/[0.08] bg-[#0D101B]/80"
        >
            <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4 sm:p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-sm font-semibold text-slate-300">
                    {item.index}
                </span>

                <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm font-medium text-slate-200">
                        {item.question}
                    </span>
                    <span className="mt-1 block break-words text-xs text-slate-500">
                        {item.category} · {item.difficulty}
                    </span>
                </span>

                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] ${status.className}`}
                >
                    <StatusIcon size={12} />
                    {status.label}
                </span>

                {answered ? (
                    <span className="text-right">
                        <span
                            className="block text-lg font-semibold"
                            style={{ color: scoreColor(score) }}
                        >
                            {score}/100
                        </span>
                        <span className="block text-[10px] text-slate-500">
                            ≈ {(score / 10).toFixed(1)}/10
                        </span>
                    </span>
                ) : (
                    <span className="text-sm font-medium text-slate-500">
                        Not evaluated
                    </span>
                )}

                <ChevronDown
                    size={18}
                    className="text-slate-500 transition group-open:rotate-180"
                />
            </summary>

            <div className="space-y-5 border-t border-white/[0.06] p-4 sm:p-5">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Question asked
                    </p>
                    <p className="whitespace-pre-wrap break-words rounded-xl border border-white/[0.08] bg-[#090b13] p-4 text-sm leading-7 text-slate-200">
                        {item.question}
                    </p>
                </div>

                <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                            Your submitted answer
                        </p>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] text-slate-500">
                            Original · unchanged
                        </span>
                    </div>
                    {answered ? (
                        <p className="whitespace-pre-wrap break-words rounded-xl border border-white/[0.08] bg-[#090b13] p-4 text-sm leading-7 text-slate-200">
                            {item.answer}
                        </p>
                    ) : (
                        <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4 text-sm leading-6 text-amber-200/80">
                            No answer was submitted for this question. It was
                            not evaluated, and no score or ideal answer has been
                            invented for it.
                        </div>
                    )}
                </div>

                {answered ? (
                    <>
                        <CriteriaBreakdown
                            criteria={item.criteria}
                            rubricCriteria={rubricCriteria}
                        />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                    What you answered correctly
                                </p>
                                {item.strengths?.length ? (
                                    <ul className="space-y-2 text-sm leading-6 text-slate-400">
                                        {item.strengths.map((value, index) => (
                                            <li
                                                key={`strength-${index}`}
                                                className="flex gap-2 break-words"
                                            >
                                                <CheckCircle2
                                                    size={14}
                                                    className="mt-1 shrink-0 text-emerald-400"
                                                />
                                                <span>{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No clear correct point was identified.
                                    </p>
                                )}
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-rose-300">
                                    Mistakes, missing concepts or gaps
                                </p>
                                {item.missingConcepts?.length ? (
                                    <ul className="space-y-2 text-sm leading-6 text-slate-400">
                                        {item.missingConcepts.map(
                                            (value, index) => (
                                                <li
                                                    key={`missing-${index}`}
                                                    className="flex gap-2 break-words"
                                                >
                                                    <AlertCircle
                                                        size={14}
                                                        className="mt-1 shrink-0 text-rose-400"
                                                    />
                                                    <span>{value}</span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        No major missing concept was identified.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-violet-400/15 bg-violet-400/[0.05] p-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                                Corrected / ideal answer
                            </p>
                            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">
                                {item.idealAnswer ||
                                    "No ideal answer was generated for this question."}
                            </p>
                            <p className="mt-3 text-[11px] leading-5 text-slate-500">
                                This is a separate AI-generated model answer. It
                                does not replace your original submission above.
                            </p>
                        </div>

                        {item.whyGood && (
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                                    Why the ideal answer is stronger
                                </p>
                                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-400">
                                    {item.whyGood}
                                </p>
                            </div>
                        )}

                        {item.improvements?.length > 0 && (
                            <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                                    How to improve your answer
                                </p>
                                <ul className="space-y-2 text-sm leading-6 text-slate-400">
                                    {item.improvements.map((value, index) => (
                                        <li
                                            key={`improvement-${index}`}
                                            className="flex gap-2 break-words"
                                        >
                                            <ArrowRight
                                                size={14}
                                                className="mt-1 shrink-0 text-amber-400"
                                            />
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {item.learningTips?.length > 0 && (
                            <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/[0.035] p-4">
                                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                    <Lightbulb size={14} />
                                    Learning tips
                                </p>
                                <ul className="space-y-2 text-sm leading-6 text-slate-400">
                                    {item.learningTips.map((value, index) => (
                                        <li
                                            key={`tip-${index}`}
                                            className="flex gap-2 break-words"
                                        >
                                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-xs leading-5 text-slate-500">
                        Unanswered questions count as 0 in the overall and
                        topic scores so that the report remains consistent.
                    </p>
                )}
            </div>
        </details>
    );
}

function StatusCard({ icon: Icon, title, children, tone = "violet" }) {
    const tones = {
        violet: "border-violet-400/15 bg-violet-400/[0.04]",
        rose: "border-rose-400/15 bg-rose-400/[0.04]",
        cyan: "border-cyan-400/15 bg-cyan-400/[0.04]",
        amber: "border-amber-400/15 bg-amber-400/[0.04]",
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#070910] px-5 py-10 text-white">
            <div
                className={`w-full max-w-lg rounded-3xl border p-7 text-center ${tones[tone] || tones.violet}`}
            >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-300">
                    <Icon size={28} />
                </div>
                <h1 className="text-xl font-bold">{title}</h1>
                <div className="mt-3 text-sm leading-6 text-slate-400">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default function InterviewResultPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    return <InterviewResultView key={id || "missing-id"} id={id} />;
}

function InterviewResultView({ id }) {
    const router = useRouter();

    const [view, setView] = useState("loading");
    const [result, setResult] = useState(null);
    const [session, setSession] = useState(null);
    const [error, setError] = useState("");
    const [fromCache, setFromCache] = useState(false);
    const [isRetrying, setIsRetrying] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isFetchingRef = useRef(false);

    function applyResponse(data) {
        if (data?.status === "completed" && data.result) {
            setResult(data.result);
            setSession(null);
            setError("");
            setView("completed");

            try {
                localStorage.setItem(
                    `${RESULT_PREFIX}${data.result.id}`,
                    JSON.stringify(data.result)
                );
            } catch {
                // Browser cache is optional.
            }

            return;
        }

        if (data?.status === "evaluating") {
            setSession(data.session || null);
            setError("");
            setView("evaluating");
            return;
        }

        if (data?.status === "failed") {
            setSession(data.session || null);
            setError(data.error || "Report generation failed.");
            setView("failed");
            return;
        }

        if (data?.status === "in_progress") {
            setSession(data.session || null);
            setError("");
            setView("in_progress");
            return;
        }

        throw new Error("The server returned an unexpected report status.");
    }

    async function loadResult({ silent = false, refresh = false } = {}) {
        if (!id || isFetchingRef.current) return;

        isFetchingRef.current = true;

        if (refresh) setIsRefreshing(true);

        try {
            const response = await fetch(`/api/interviewer/session/${id}`, {
                cache: "no-store",
            });
            const data = await response.json().catch(() => ({}));

            if (response.status === 404) {
                setResult(null);
                setSession(null);
                setError(
                    data.error ||
                    "This interview report does not exist or the ID is invalid."
                );
                setView("not_found");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.error || "Interview report could not be loaded."
                );
            }

            setFromCache(false);
            applyResponse(data);
        } catch (loadError) {
            if (silent) {
                setError(
                    loadError?.message ||
                    "Could not refresh the report status."
                );
                return;
            }

            const cached = readCachedResult(id);

            if (cached) {
                setResult(cached);
                setFromCache(true);
                setView("completed");
                setError("");
                return;
            }

            setResult(null);
            setSession(null);
            setError(
                loadError?.message ||
                "Could not load the interview report from the server."
            );
            setView("error");
        } finally {
            isFetchingRef.current = false;
            setIsRefreshing(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!id) {
                setError("Interview report ID is missing.");
                setView("not_found");
                return;
            }

            if (!cancelled) {
                await loadResult();
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (view !== "evaluating") return undefined;

        const timer = setInterval(() => {
            loadResult({ silent: true });
        }, 3000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [view, id]);

    async function retryEvaluation() {
        if (!id) return;

        setIsRetrying(true);
        setError("");

        try {
            const response = await fetch(
                `/api/interviewer/session/${id}/complete`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );
            const data = await response.json().catch(() => ({}));

            if (response.status === 202 || data.status === "evaluating") {
                setView("evaluating");
                return;
            }

            if (!response.ok || !data.result) {
                throw new Error(
                    data.error || "The report could not be generated."
                );
            }

            applyResponse({ status: "completed", result: data.result });
        } catch (retryError) {
            setError(
                retryError?.message ||
                "The report could not be generated. Please try again."
            );
            setView("failed");
        } finally {
            setIsRetrying(false);
        }
    }

    function retakeInterview() {
        const config = result?.config || session?.config;

        if (config) {
            try {
                sessionStorage.setItem(
                    "edukindInterviewRetakeConfig",
                    JSON.stringify(config)
                );
            } catch {
                // Setup still works without the pre-filled configuration.
            }
        }

        router.push("/mentor/interviewer/setup");
    }

    function resumeInterview() {
        const config = session?.config || result?.config;

        if (config) {
            try {
                sessionStorage.setItem(
                    "edukindInterviewConfig",
                    JSON.stringify(config)
                );
                sessionStorage.setItem("edukindInterviewSessionId", id);
            } catch {
                // The room will show its normal configuration error.
            }
        }

        router.push("/mentor/interviewer/room");
    }

    if (view === "loading") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#070910] px-5 text-white">
                <div className="text-center">
                    <LoaderCircle
                        size={38}
                        className="mx-auto animate-spin text-cyan-300"
                    />
                    <p className="mt-4 text-sm text-slate-400">
                        Loading your interview report...
                    </p>
                </div>
            </main>
        );
    }

    if (view === "not_found") {
        return (
            <StatusCard
                icon={AlertCircle}
                title="Report not found"
                tone="rose"
            >
                <p className="break-words">{error}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link
                        href="/mentor/interviewer"
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                    >
                        Back to Interviewer
                    </Link>
                    <button
                        type="button"
                        onClick={retakeInterview}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                    >
                        Start a new interview
                    </button>
                </div>
            </StatusCard>
        );
    }

    if (view === "error") {
        return (
            <StatusCard
                icon={AlertCircle}
                title="Could not load the report"
                tone="rose"
            >
                <p className="break-words">{error}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => loadResult({ refresh: true })}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                    >
                        Try again
                    </button>
                    <Link
                        href="/mentor/interviewer"
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                    >
                        Back to Interviewer
                    </Link>
                </div>
            </StatusCard>
        );
    }

    if (view === "evaluating") {
        const counts = session?.counts || {};

        return (
            <StatusCard
                icon={LoaderCircle}
                title="Generating your final report"
                tone="cyan"
            >
                <p>
                    Your answers are saved on the server. AI is evaluating each
                    answer and building the final report. This page updates
                    automatically; no scores are shown until the report is
                    validated.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Questions asked
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {counts.total ?? "—"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Answers saved
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {counts.answered ?? "—"}
                        </p>
                    </div>
                </div>
                {error && (
                    <p className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-xs text-amber-200">
                        {error} Retrying automatically...
                    </p>
                )}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => loadResult({ refresh: true })}
                        disabled={isRefreshing}
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05] disabled:opacity-50"
                    >
                        Refresh now
                    </button>
                    <Link
                        href="/mentor/interviewer"
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                    >
                        Back to Interviewer
                    </Link>
                </div>
            </StatusCard>
        );
    }

    if (view === "failed") {
        return (
            <StatusCard
                icon={AlertCircle}
                title="Report generation failed"
                tone="rose"
            >
                <p className="break-words">{error}</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                    Your questions and original answers are still saved. You can
                    retry the AI evaluation without losing them.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={retryEvaluation}
                        disabled={isRetrying}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold disabled:opacity-50"
                    >
                        {isRetrying && (
                            <LoaderCircle size={15} className="animate-spin" />
                        )}
                        Retry evaluation
                    </button>
                    <Link
                        href="/mentor/interviewer"
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                    >
                        Back to Interviewer
                    </Link>
                </div>
            </StatusCard>
        );
    }

    if (view === "in_progress") {
        const counts = session?.counts || {};

        return (
            <StatusCard
                icon={Clock3}
                title="This interview is still in progress"
                tone="amber"
            >
                <p>
                    Your saved progress is available, but a final report cannot
                    be shown until the interview is completed.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Questions asked
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {counts.total ?? "—"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-slate-500">
                            Answers saved
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                            {counts.answered ?? "—"}
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={resumeInterview}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                    >
                        Continue interview
                    </button>
                    <Link
                        href="/mentor/interviewer"
                        className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 hover:bg-white/[0.05]"
                    >
                        Back to Interviewer
                    </Link>
                </div>
            </StatusCard>
        );
    }

    if (!result) return null;

    const grade = getGrade(result.overallScore);
    const performanceGrade =
        result.performanceGrade || grade.performanceGrade;
    const counts = result.counts || {
        total: result.questions?.length || 0,
        answered: 0,
        unanswered: 0,
        correct: 0,
        partiallyCorrect: 0,
        incorrect: 0,
        notAnswered: 0,
    };
    const topics = Array.isArray(result.topicPerformance)
        ? result.topicPerformance
        : [];
    const rubricCriteria = result.evaluationRubric?.criteria || [];
    const questions = Array.isArray(result.questions) ? result.questions : [];

    return (
        <main className="min-h-screen bg-[#070910] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/mentor/interviewer"
                        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft size={16} />
                        Back to Interviewer
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => loadResult({ refresh: true })}
                            disabled={isRefreshing}
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-50"
                        >
                            <RefreshCw
                                size={14}
                                className={isRefreshing ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                        <button
                            type="button"
                            onClick={retakeInterview}
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-2.5 text-sm font-semibold"
                        >
                            <RotateCcw size={15} />
                            Retake Interview
                        </button>
                    </div>
                </header>

                {fromCache && (
                    <div className="mb-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-3 text-xs leading-5 text-amber-200">
                        The server could not be reached. This is a locally cached
                        copy of the last successfully saved report.
                    </div>
                )}

                <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#17152B] via-[#101423] to-[#0C1824] p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
                        <ScoreRing score={result.overallScore} />

                        <div className="min-w-0 flex-1 text-center sm:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs text-violet-200">
                                <Sparkles size={13} />
                                Interview result &amp; performance report
                            </div>

                            <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                                {result.config?.subject || "Interview"}{" "}
                                Interview
                            </h1>
                            <p className="mt-2 break-words text-sm text-slate-400">
                                {result.config?.interviewType || "Interview"} ·{" "}
                                {result.config?.difficulty || "Intermediate"} ·{" "}
                                {result.config?.language || "English"} ·{" "}
                                {counts.total} question
                                {counts.total === 1 ? "" : "s"} asked
                            </p>

                            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs text-emerald-300">
                                    <Trophy size={13} />
                                    Grade {result.grade || grade.grade} ·{" "}
                                    {performanceGrade}
                                </span>
                                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                                    {result.percentage ?? result.overallScore}%
                                </span>
                                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                                    {counts.answered} answered ·{" "}
                                    {counts.unanswered} unanswered
                                </span>
                            </div>

                            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:justify-start">
                                {result.strongestTopic && (
                                    <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 text-emerald-300">
                                        Strongest: {result.strongestTopic}
                                    </span>
                                )}
                                {result.weakestTopic &&
                                    result.weakestTopic !==
                                    result.strongestTopic && (
                                        <span className="rounded-lg border border-rose-400/15 bg-rose-400/[0.05] px-3 py-1.5 text-rose-300">
                                            Focus next: {result.weakestTopic}
                                        </span>
                                    )}
                            </div>

                            {result.summary && (
                                <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                                    {result.summary}
                                </p>
                            )}

                            <p className="mt-3 text-[11px] text-slate-500">
                                Completed {formatDate(result.completedAt)} ·{" "}
                                {result.summarySource === "ai"
                                    ? "AI-generated summary"
                                    : "Summary derived from the saved evaluations"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <StatCard
                        label="Total"
                        value={counts.total}
                        hint="Questions asked"
                        tone="cyan"
                    />
                    <StatCard
                        label="Answered"
                        value={counts.answered}
                        hint="Original answers saved"
                        tone="violet"
                    />
                    <StatCard
                        label="Unanswered"
                        value={counts.unanswered}
                        hint="Counted as 0"
                        tone="amber"
                    />
                    <StatCard
                        label="Correct"
                        value={counts.correct}
                        hint="Score 75+"
                        tone="emerald"
                    />
                    <StatCard
                        label="Partial"
                        value={counts.partiallyCorrect}
                        hint="Score 40-74"
                        tone="amber"
                    />
                    <StatCard
                        label="Incorrect"
                        value={counts.incorrect}
                        hint="Score below 40"
                        tone="rose"
                    />
                </section>

                <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <TrendingUp size={19} />
                        </div>
                        <div>
                            <h2 className="font-semibold">
                                Topic-wise performance analysis
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Scores are calculated from the evaluated
                                questions, not generated separately.
                            </p>
                        </div>
                    </div>

                    {topics.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {topics.map((topic) => (
                                <TopicBar
                                    key={`${topic.topic}-${topic.score}`}
                                    topic={topic}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm leading-6 text-slate-500">
                            No topic metadata was available for this interview.
                            Question-level feedback is still shown below.
                        </p>
                    )}
                </section>

                <section className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0D101B]/80 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                <BrainCircuit size={19} />
                            </div>
                            <div>
                                <h2 className="font-semibold">
                                    Overall performance feedback
                                </h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    {result.summarySource === "ai"
                                        ? "AI-generated from the complete interview history"
                                        : "Automatically derived from the saved question evaluations"}
                                </p>
                            </div>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                            {performanceGrade}
                        </span>
                    </div>

                    {result.summary ? (
                        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                            {result.summary}
                        </p>
                    ) : (
                        <p className="mt-4 text-sm text-slate-500">
                            No overall summary is available.
                        </p>
                    )}

                    {result.summarySource === "derived" && (
                        <p className="mt-3 text-[11px] leading-5 text-slate-500">
                            The AI summary step did not return a valid response.
                            This summary was calculated from the validated
                            per-question evaluations, so no result was invented.
                        </p>
                    )}
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <InfoList
                        icon={Award}
                        title="Strengths"
                        items={result.strengths}
                        tone="emerald"
                        emptyText="No specific strength was identified."
                    />
                    <InfoList
                        icon={Target}
                        title="Weaknesses"
                        items={result.weaknesses}
                        tone="rose"
                        emptyText="No specific weakness was identified."
                    />
                    <InfoList
                        icon={BrainCircuit}
                        title="Recommendations"
                        items={result.recommendations}
                        tone="violet"
                        emptyText="No recommendation was generated."
                    />
                    <InfoList
                        icon={Lightbulb}
                        title="Learning tips"
                        items={result.learningTips}
                        tone="cyan"
                        emptyText="No learning tip was generated."
                    />
                </section>

                <section className="mt-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                            <BookOpenCheck size={19} />
                        </div>
                        <div>
                            <h2 className="font-semibold">
                                Question-by-question evaluation
                            </h2>
                            <p className="mt-1 text-xs text-slate-500">
                                Your exact submitted answers and the separate AI
                                evaluation for every question.
                            </p>
                        </div>
                    </div>

                    {questions.length > 0 ? (
                        <div className="space-y-3">
                            {questions.map((item, index) => (
                                <QuestionResult
                                    key={`${item.index}-${index}`}
                                    item={item}
                                    rubricCriteria={rubricCriteria}
                                    defaultOpen={index === 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-6 text-center text-sm text-slate-500">
                            No question history was saved for this interview.
                        </div>
                    )}
                </section>

                <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.09] to-cyan-400/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div>
                        <h3 className="font-semibold">
                            Consistency builds confidence.
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                            Review the weak topics, then start a fresh interview.
                            Your previous report will remain saved.
                        </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Link
                            href="/mentor/interviewer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]"
                        >
                            <ArrowLeft size={15} />
                            Back to Interviewer
                        </Link>
                        <button
                            type="button"
                            onClick={retakeInterview}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                        >
                            <RotateCcw size={15} />
                            Retake Interview
                        </button>
                    </div>
                </section>

                <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-[11px] leading-5 text-slate-500">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0" />
                    <p>
                        {result.disclaimer ||
                            "Scores are approximate AI assessments based on the stated rubric. They are not an official certification."}
                    </p>
                </div>

                <footer className="py-8 text-center text-[11px] tracking-wide text-slate-600">
                    EDUKIND AI INTERVIEWER · LEARN · BUILD · IMPACT
                </footer>
            </div>
        </main>
    );
}
