
"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarCheck,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    ListChecks,
    Loader2,
    RotateCcw,
    Sparkles,
    Target,
    BookOpen,
    Flame,
    ArrowUpRight,
    CircleCheck,
    Timer,
    GraduationCap,
    CalendarDays,
    Zap,
    NotebookPen,
    ShieldCheck,
} from "lucide-react";

const STORAGE_KEY = "edukind-study-planner-v1";

const LEVELS = [
    { id: "beginner", label: "Beginner", hint: "একদম শুরু থেকে" },
    { id: "intermediate", label: "Intermediate", hint: "কিছুটা জানি" },
    { id: "advanced", label: "Advanced", hint: "আরও গভীরে যেতে চাই" },
];

const HOURS = [0.5, 1, 1.5, 2, 3, 4, 6];

const TYPE_STYLES = {
    lesson: {
        label: "Lesson",
        cls: "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-300",
        dot: "bg-cyan-400",
    },
    practice: {
        label: "Practice",
        cls: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
        dot: "bg-emerald-400",
    },
    revision: {
        label: "Revision",
        cls: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
        dot: "bg-amber-400",
    },
    quiz: {
        label: "Quiz",
        cls: "border-violet-400/20 bg-violet-400/[0.08] text-violet-300",
        dot: "bg-violet-400",
    },
};

const panel =
    "rounded-2xl border border-white/[0.08] bg-[#10121c]/80 shadow-[0_12px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl";

const field =
    "w-full rounded-xl border border-white/[0.09] bg-[#0b0d16] px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-fuchsia-400/50 focus:ring-4 focus:ring-fuchsia-500/[0.07]";

function toInputDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function parseInputDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function addDays(iso, amount) {
    const base = parseInputDate(iso);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + amount);
}

function formatDate(date) {
    return date.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
    });
}

function daysIncludingToday(deadlineIso) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = parseInputDate(deadlineIso);
    return Math.round((end - today) / 86400000) + 1;
}

function formatMinutes(total) {
    if (total < 60) return `${total} মিনিট`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m ? `${h} ঘণ্টা ${m} মিনিট` : `${h} ঘণ্টা`;
}

export default function StudyPlannerPage() {
    const [saved, setSaved] = useState(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSaved(JSON.parse(raw));
        } catch {
            // Ignore unavailable or invalid storage.
        }
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;

        try {
            if (saved) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // Ignore storage errors.
        }
    }, [saved, hydrated]);

    return (
        <main className="relative isolate min-h-[100dvh] overflow-x-hidden bg-[#080910] text-slate-100 selection:bg-fuchsia-500/30">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-64 left-[15%] h-[520px] w-[520px] rounded-full bg-fuchsia-700/[0.13] blur-[150px]" />
                <div className="absolute top-[28%] right-[-180px] h-[480px] w-[480px] rounded-full bg-violet-700/[0.10] blur-[150px]" />
                <div className="absolute bottom-[-220px] left-[25%] h-[440px] w-[440px] rounded-full bg-cyan-600/[0.06] blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:26px_26px] opacity-25" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/40 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pt-2 pb-7 sm:px-6 sm:pt-4 sm:pb-10 lg:px-10">
                {!hydrated ? (
                    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/[0.08]">
                            <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" />
                        </div>
                        <p className="text-sm text-slate-500">তোমার workspace প্রস্তুত হচ্ছে...</p>
                    </div>
                ) : saved ? (
                    <Workspace
                        saved={saved}
                        onChange={setSaved}
                        onReset={() => setSaved(null)}
                    />
                ) : (
                    <GoalForm onCreate={setSaved} />
                )}

                <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-5 text-[11px] text-slate-600 sm:flex-row">
                    <span className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-fuchsia-400/70" />
                        YOUR GOALS. YOUR PACE. YOUR PROGRESS.
                    </span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Your progress is saved on this device
                    </span>
                </footer>
            </div>
        </main>
    );
}

/* -------------------- Goal form -------------------- */

function GoalForm({ onCreate }) {
    const [topic, setTopic] = useState("");
    const [level, setLevel] = useState("beginner");
    const [deadline, setDeadline] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 14);
        return toInputDate(d);
    });
    const [hours, setHours] = useState(2);
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalDays = deadline ? daysIncludingToday(deadline) : 0;

    async function handleSubmit(event) {
        event.preventDefault();
        if (loading) return;

        setError("");

        if (topic.trim().length < 2) {
            setError("কী শিখতে চাও সেটা লেখো।");
            return;
        }

        if (!deadline || totalDays < 1) {
            setError("Deadline আজ বা ভবিষ্যতের কোনো তারিখ হতে হবে।");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/study-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: topic.trim(),
                    level,
                    deadlineDays: totalDays,
                    hoursPerDay: hours,
                    notes: notes.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "পরিকল্পনা তৈরি করা যায়নি।");
            }

            onCreate({
                goal: {
                    topic: topic.trim(),
                    level,
                    deadline,
                    hours,
                    notes: notes.trim(),
                },
                plan: data.plan,
                truncated: data.truncated,
                startDate: toInputDate(new Date()),
                done: {},
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <header className="pb-8 pt-3 text-center sm:pb-10 sm:pt-2">


                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-300/[0.06] px-3.5 py-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-50" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-300" />
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.18em] text-fuchsia-200">
                        AI STUDY PLANNER
                    </span>
                </div>

                <h1 className=" text-3xl mt-2 font-semibold tracking-tight text-white sm:text-3xl lg:text-[30px] lg:leading-[1.15]">
                    তোমার পরবর্তী লক্ষ্য,এবার পরিকল্পনামাফিক।

                </h1>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <HeroPill icon={Target} label="Clear goals" />
                    <HeroPill icon={CalendarDays} label="Daily schedule" />
                    <HeroPill icon={Flame} label="Track progress" />
                </div>
            </header>

            {/* Form panel */}
            <form
                onSubmit={handleSubmit}
                className={`${panel} relative overflow-hidden p-5 sm:p-8`}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/60 to-transparent" />

                <div className="mb-7 flex items-start gap-3 border-b border-white/[0.07] pb-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/[0.08] text-fuchsia-300">
                        <NotebookPen className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-white">
                            পরিকল্পনার বিবরণ
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            কয়েকটি তথ্য দিলেই তোমার journey শুরু হবে।
                        </p>
                    </div>
                    <span className="ml-auto rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-500">
                        STEP 01
                    </span>
                </div>

                <div className="space-y-6">
                    {/* Topic */}
                    <div>
                        <label htmlFor="study-topic" className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-200">
                            <Target className="h-4 w-4 text-fuchsia-300" />
                            কী শিখতে চাও?
                            <span className="text-rose-400">*</span>
                        </label>
                        <input
                            id="study-topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            maxLength={200}
                            placeholder="যেমন: React শিখে নিজের প্রজেক্ট বানানো"
                            className={field}
                        />
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-[11px] text-slate-600">
                                নির্দিষ্ট লক্ষ্য লিখলে পরিকল্পনা বুঝতে সুবিধা হবে।
                            </p>
                            <span className="shrink-0 text-[10px] tabular-nums text-slate-600">
                                {topic.length}/200
                            </span>
                        </div>
                    </div>

                    {/* Skill level */}
                    <fieldset>
                        <legend className="mb-2.5 text-xs font-semibold text-slate-200">
                            তোমার বর্তমান skill level
                        </legend>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {LEVELS.map((item, index) => {
                                const active = level === item.id;
                                const icons = [BookOpen, Zap, GraduationCap];
                                const LevelIcon = icons[index];

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={active}
                                        onClick={() => setLevel(item.id)}
                                        className={`group relative overflow-hidden rounded-xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 ${active
                                            ? "border-fuchsia-400/40 bg-gradient-to-br from-fuchsia-400/[0.12] to-violet-400/[0.04] shadow-[0_0_25px_rgba(217,70,239,0.06)]"
                                            : "border-white/[0.08] bg-white/[0.018] hover:border-white/[0.16] hover:bg-white/[0.035]"
                                            }`}
                                    >
                                        {active && (
                                            <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-400 text-[#130b1b]">
                                                <Check className="h-3 w-3" strokeWidth={3} />
                                            </span>
                                        )}
                                        <span className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl border transition ${active
                                            ? "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-200"
                                            : "border-white/[0.07] bg-white/[0.025] text-slate-500 group-hover:text-slate-300"
                                            }`}>
                                            <LevelIcon className="h-4 w-4" />
                                        </span>
                                        <span className={`block text-[13px] font-semibold ${active ? "text-white" : "text-slate-300"}`}>
                                            {item.label}
                                        </span>
                                        <span className="mt-1 block text-[11px] text-slate-500">
                                            {item.hint}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>

                    {/* Deadline and hours */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label htmlFor="study-deadline" className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-200">
                                <CalendarDays className="h-4 w-4 text-violet-300" />
                                Deadline
                            </label>
                            <input
                                id="study-deadline"
                                type="date"
                                value={deadline}
                                min={toInputDate(new Date())}
                                onChange={(e) => setDeadline(e.target.value)}
                                className={`${field} [color-scheme:dark]`}
                            />
                            {totalDays > 0 && (
                                <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <CalendarCheck className="h-3.5 w-3.5 text-violet-300" />
                                    মোট <span className="font-semibold text-slate-300">{totalDays} দিন</span>
                                    {totalDays > 28 && " · প্রথম ২৮ দিনের পরিকল্পনা"}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="study-hours" className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-200">
                                <Clock className="h-4 w-4 text-cyan-300" />
                                প্রতিদিন কতক্ষণ পড়বে?
                            </label>
                            <select
                                id="study-hours"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className={`${field} cursor-pointer`}
                            >
                                {HOURS.map((h) => (
                                    <option key={h} value={h}>
                                        {h} ঘণ্টা
                                    </option>
                                ))}
                            </select>
                            <p className="mt-2 text-[11px] text-slate-600">
                                নিজের রুটিনের সঙ্গে মানানসই সময় বেছে নাও।
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label htmlFor="study-notes" className="mb-2.5 flex items-center gap-2 text-xs font-semibold text-slate-200">
                            <NotebookPen className="h-4 w-4 text-amber-300" />
                            অতিরিক্ত নির্দেশনা
                            <span className="font-normal text-slate-600">(ঐচ্ছিক)</span>
                        </label>
                        <textarea
                            id="study-notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            maxLength={500}
                            rows={3}
                            placeholder="যেমন: শুক্রবার পড়তে পারব না, প্র্যাকটিসে বেশি জোর চাই..."
                            className={`${field} resize-y leading-6`}
                        />
                    </div>

                    {error && (
                        <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-4 text-sm text-rose-300">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-400/10">
                                !
                            </span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_8px_35px_rgba(168,85,247,0.20)] transition duration-200 hover:shadow-[0_8px_45px_rgba(168,85,247,0.32)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.12] to-white/0 opacity-0 transition group-hover:opacity-100" />
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                পরিকল্পনা তৈরি হচ্ছে...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 transition group-hover:rotate-12" />
                                Study Plan তৈরি করো
                                <ArrowUpRight className="ml-1 h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] leading-5 text-slate-600">
                        তোমার লক্ষ্য অনুযায়ী পরিকল্পনা তৈরি হবে। সময় ও অগ্রগতি
                        পরে workspace থেকে দেখতে পারবে।
                    </p>
                </div>
            </form>
        </div>
    );
}

function HeroPill({ icon: Icon, label }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-slate-400">
            <Icon className="h-3.5 w-3.5 text-fuchsia-300/80" />
            {label}
        </span>
    );
}

/* -------------------- Study workspace -------------------- */

function Workspace({ saved, onChange, onReset }) {
    const { plan, goal, startDate, done, truncated } = saved;
    const days = plan.days;

    const stats = useMemo(() => {
        let total = 0;
        let completed = 0;
        let totalMinutes = 0;
        let doneMinutes = 0;
        let daysDone = 0;

        days.forEach((day, d) => {
            let dayDone = 0;

            day.tasks.forEach((task, t) => {
                total += 1;
                totalMinutes += task.minutes;

                if (done[`${d}-${t}`]) {
                    completed += 1;
                    dayDone += 1;
                    doneMinutes += task.minutes;
                }
            });

            if (dayDone === day.tasks.length) daysDone += 1;
        });

        return {
            total,
            completed,
            remaining: total - completed,
            percent: total ? Math.round((completed / total) * 100) : 0,
            totalMinutes,
            doneMinutes,
            daysDone,
        };
    }, [days, done]);

    const [selected, setSelected] = useState(() => {
        const firstOpen = days.findIndex((day, d) =>
            day.tasks.some((_, t) => !done[`${d}-${t}`])
        );
        return firstOpen === -1 ? 0 : firstOpen;
    });

    function toggleTask(d, t) {
        const key = `${d}-${t}`;
        const next = { ...done };

        if (next[key]) {
            delete next[key];
        } else {
            next[key] = true;
        }

        onChange({ ...saved, done: next });
    }

    function handleReset() {
        if (
            window.confirm(
                "নতুন পরিকল্পনা বানালে বর্তমান plan আর progress মুছে যাবে। চালিয়ে যাবে?"
            )
        ) {
            onReset();
        }
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7).map((_, k) => i + k));
    }

    const day = days[selected];
    const dayDoneCount = day.tasks.filter((_, t) => done[`${selected}-${t}`]).length;
    const dayMinutes = day.tasks.reduce((sum, task) => sum + task.minutes, 0);
    const levelLabel = LEVELS.find((l) => l.id === goal.level)?.label;

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Workspace header */}
            <header className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#10121c]/85 p-5 shadow-[0_15px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-8">
                <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/[0.12] blur-[85px]" />
                <div className="pointer-events-none absolute bottom-0 right-[28%] h-32 w-32 rounded-full bg-violet-500/[0.07] blur-[65px]" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/15 bg-fuchsia-300/[0.06] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-fuchsia-200">
                            <Sparkles className="h-3.5 w-3.5" />
                            STUDY WORKSPACE
                        </div>

                        <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {plan.title}
                        </h1>

                        {plan.summary && (
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                                {plan.summary}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            <MetaPill>{levelLabel}</MetaPill>
                            <MetaPill>
                                <Clock className="h-3 w-3" />
                                প্রতিদিন {goal.hours} ঘণ্টা
                            </MetaPill>
                            <MetaPill>
                                <CalendarDays className="h-3 w-3" />
                                Deadline: {formatDate(parseInputDate(goal.deadline))}
                            </MetaPill>
                        </div>
                    </div>

                    <button
                        onClick={handleReset}
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-rose-400/25 hover:bg-rose-400/[0.07] hover:text-rose-200"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        নতুন plan
                    </button>
                </div>

                {truncated && (
                    <div className="relative mt-5 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-xs leading-6 text-amber-200/90">
                        <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                            তোমার deadline ২৮ দিনের বেশি, তাই এখানে প্রথম ২৮ দিনের
                            পরিকল্পনা দেওয়া হয়েছে।
                        </span>
                    </div>
                )}
            </header>

            {/* Progress overview */}
            <section className={`${panel} relative overflow-hidden p-5 sm:p-7`}>
                <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-violet-500/[0.09] blur-[80px]" />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.17em] text-slate-500">
                            <Target className="h-4 w-4 text-fuchsia-300" />
                            GOAL PROGRESS
                        </div>

                        <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
                            <span className="text-5xl font-semibold tracking-tight text-white tabular-nums">
                                {stats.percent}
                                <span className="text-3xl text-fuchsia-300">%</span>
                            </span>
                            <span className="mb-1.5 text-xs text-slate-500">
                                {stats.percent === 100
                                    ? "সব task সম্পন্ন!"
                                    : `${stats.remaining}টি task বাকি`}
                            </span>
                        </div>

                        <div
                            className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]"
                            role="progressbar"
                            aria-valuenow={stats.percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Study plan progress"
                        >
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 transition-all duration-700 ease-out"
                                style={{ width: `${stats.percent}%` }}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                            <span>
                                {formatMinutes(stats.doneMinutes)} সম্পন্ন
                            </span>
                            <span>
                                মোট {formatMinutes(stats.totalMinutes)}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:w-[48%]">
                        <MetricCard
                            icon={CircleCheck}
                            label="সম্পন্ন task"
                            value={stats.completed}
                            tone="emerald"
                        />
                        <MetricCard
                            icon={ListChecks}
                            label="বাকি task"
                            value={stats.remaining}
                            tone="violet"
                        />
                        <MetricCard
                            icon={BookOpen}
                            label="মোট task"
                            value={stats.total}
                            tone="cyan"
                        />
                        <MetricCard
                            icon={Flame}
                            label="সম্পন্ন দিন"
                            value={`${stats.daysDone}/${days.length}`}
                            tone="amber"
                        />
                    </div>
                </div>

                {stats.percent === 100 && (
                    <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                            <Check className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-200">
                                অসাধারণ কাজ!
                            </p>
                            <p className="mt-1 text-xs leading-5 text-emerald-100/60">
                                অভিনন্দন! তুমি পুরো পরিকল্পনা শেষ করেছ।
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Schedule and tasks */}
            <section className="grid items-start gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">
                {/* Calendar */}
                <aside className={`${panel} p-4 sm:p-5`}>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-slate-500">
                                <CalendarDays className="h-4 w-4 text-violet-300" />
                                YOUR TIMELINE
                            </div>
                            <h2 className="mt-2 text-base font-semibold text-white">
                                Study Schedule
                            </h2>
                        </div>
                        <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-slate-400">
                            {days.length} days
                        </span>
                    </div>

                    <div className="mt-5 space-y-5">
                        {weeks.map((indexes, w) => (
                            <div key={w}>
                                <div className="mb-2.5 flex items-center justify-between">
                                    <p className="text-xs font-medium text-slate-300">
                                        সপ্তাহ {w + 1}
                                    </p>
                                    <span className="text-[10px] text-slate-600">
                                        {indexes.length} দিন
                                    </span>
                                </div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {indexes.map((d) => {
                                        const total = days[d].tasks.length;
                                        const finished = days[d].tasks.filter(
                                            (_, t) => done[`${d}-${t}`]
                                        ).length;
                                        const complete = finished === total;
                                        const partial = finished > 0 && !complete;
                                        const isSelected = d === selected;

                                        return (
                                            <button
                                                key={d}
                                                onClick={() => setSelected(d)}
                                                aria-pressed={isSelected}
                                                title={`Day ${d + 1}: ${days[d].focus}`}
                                                className={`relative flex aspect-square items-center justify-center rounded-xl border text-xs font-semibold transition duration-200 hover:-translate-y-0.5 ${isSelected
                                                    ? "border-fuchsia-300/60 bg-gradient-to-br from-fuchsia-400/25 to-violet-400/15 text-white shadow-[0_0_20px_rgba(217,70,239,0.12)]"
                                                    : complete
                                                        ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300 hover:bg-emerald-400/[0.14]"
                                                        : partial
                                                            ? "border-amber-400/25 bg-amber-400/[0.07] text-amber-200 hover:bg-amber-400/[0.12]"
                                                            : "border-white/[0.06] bg-white/[0.02] text-slate-500 hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-slate-200"
                                                    }`}
                                            >
                                                {complete && !isSelected ? (
                                                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                                                ) : (
                                                    d + 1
                                                )}
                                                {partial && !isSelected && (
                                                    <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-amber-300" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 border-t border-white/[0.06] pt-4">
                        <p className="mb-3 text-[10px] font-medium tracking-wider text-slate-500">
                            COMPLETION STATUS
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            <Legend color="bg-emerald-400" label="শেষ" />
                            <Legend color="bg-amber-400" label="চলছে" />
                            <Legend color="bg-white/25" label="বাকি" />
                        </div>
                    </div>
                </aside>

                {/* Selected day */}
                <section className={`${panel} min-w-0 overflow-hidden`}>
                    <div className="border-b border-white/[0.07] p-5 sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 rounded-lg border border-fuchsia-400/15 bg-fuchsia-400/[0.06] px-2.5 py-1.5 text-[10px] font-semibold tracking-wider text-fuchsia-200">
                                    <CalendarCheck className="h-3.5 w-3.5" />
                                    DAY {selected + 1}
                                    <span className="text-fuchsia-200/40">/</span>
                                    {formatDate(addDays(startDate, selected))}
                                </div>

                                <h2 className="mt-3 break-words text-xl font-semibold text-white sm:text-2xl">
                                    {day.focus}
                                </h2>

                                <p className="mt-2 text-xs leading-5 text-slate-500">
                                    আজকের task শেষ করে নিজের অগ্রগতি এগিয়ে নাও।
                                </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                                <button
                                    onClick={() => setSelected((s) => Math.max(0, s - 1))}
                                    disabled={selected === 0}
                                    aria-label="Previous day"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        setSelected((s) => Math.min(days.length - 1, s + 1))
                                    }
                                    disabled={selected === days.length - 1}
                                    aria-label="Next day"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-slate-400 transition hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <DaySummary
                                icon={ListChecks}
                                label="সম্পন্ন"
                                value={`${dayDoneCount}/${day.tasks.length}`}
                            />
                            <DaySummary
                                icon={Timer}
                                label="মোট সময়"
                                value={formatMinutes(dayMinutes)}
                            />
                            <div className="col-span-2 sm:col-span-1">
                                <DaySummary
                                    icon={Target}
                                    label="আজকের অগ্রগতি"
                                    value={`${day.tasks.length ? Math.round((dayDoneCount / day.tasks.length) * 100) : 0}%`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-sm font-semibold text-white">
                                    আজকের কাজগুলো
                                </h3>
                                <p className="mt-1 text-[11px] text-slate-500">
                                    শেষ হলে task-এ click করে mark as complete করো।
                                </p>
                            </div>
                            <span className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[10px] text-slate-400">
                                {day.tasks.length} tasks
                            </span>
                        </div>

                        <ul className="space-y-3">
                            {day.tasks.map((task, t) => {
                                const checked = Boolean(done[`${selected}-${t}`]);
                                const style = TYPE_STYLES[task.type] || TYPE_STYLES.lesson;

                                return (
                                    <li key={t}>
                                        <button
                                            role="checkbox"
                                            aria-checked={checked}
                                            onClick={() => toggleTask(selected, t)}
                                            className={`group flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition duration-200 sm:gap-4 sm:p-5 ${checked
                                                ? "border-emerald-400/20 bg-gradient-to-r from-emerald-400/[0.07] to-transparent"
                                                : "border-white/[0.07] bg-white/[0.018] hover:border-fuchsia-300/20 hover:bg-white/[0.035]"
                                                }`}
                                        >
                                            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${checked
                                                ? "border-emerald-400 bg-emerald-400 text-[#07100d]"
                                                : "border-white/[0.15] bg-white/[0.025] text-transparent group-hover:border-fuchsia-300/50"
                                                }`}>
                                                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className={`block break-words text-sm font-medium leading-6 transition ${checked ? "text-slate-500 line-through" : "text-slate-200"
                                                    }`}>
                                                    {task.title}
                                                </span>

                                                <span className="mt-3 flex flex-wrap items-center gap-2">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-medium ${style.cls}`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                                                        {style.label}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-500">
                                                        <Clock className="h-3 w-3" />
                                                        {task.minutes} মিনিট
                                                    </span>
                                                </span>
                                            </span>

                                            {checked && (
                                                <span className="hidden shrink-0 items-center gap-1 text-[10px] font-medium text-emerald-300 sm:inline-flex">
                                                    <Check className="h-3.5 w-3.5" />
                                                    Done
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {dayDoneCount === day.tasks.length && (
                            <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                        <Check className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-emerald-200">
                                            আজকের সব task শেষ!
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            দারুণ ধারাবাহিকতা। এবার পরের দিনের জন্য প্রস্তুত হও।
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </section>
        </div>
    );
}

function MetaPill({ children }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-slate-400">
            {children}
        </span>
    );
}

function MetricCard({ icon: Icon, label, value, tone }) {
    const tones = {
        emerald: "border-emerald-400/15 bg-emerald-400/[0.045] text-emerald-300",
        violet: "border-violet-400/15 bg-violet-400/[0.045] text-violet-300",
        cyan: "border-cyan-400/15 bg-cyan-400/[0.045] text-cyan-300",
        amber: "border-amber-400/15 bg-amber-400/[0.045] text-amber-300",
    };

    return (
        <div className={`rounded-xl border p-3.5 transition hover:-translate-y-0.5 sm:p-4 ${tones[tone]}`}>
            <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] leading-4 text-slate-500">{label}</span>
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white tabular-nums">
                {value}
            </p>
        </div>
    );
}

function DaySummary({ icon: Icon, label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Icon className="h-3.5 w-3.5 text-fuchsia-300/80" />
                {label}
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-200">{value}</p>
        </div>
    );
}

function Legend({ color, label }) {
    return (
        <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
            <span className={`h-2 w-2 rounded-sm ${color}`} />
            {label}
        </span>
    );
}

function StatBox({ label, value }) {
    return (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <p className="text-lg font-semibold text-white">{value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
        </div>
    );
}
