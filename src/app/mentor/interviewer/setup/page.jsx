
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    AudioLines,
    BookOpen,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    Code2,
    Clock3,
    Mic,
    Sparkles,
    Terminal,
    Users,
} from "lucide-react";

const subjects = [
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "MongoDB",
    "HTML & CSS",
    "Python",
    "Java",
    "C / C++",
    "Data Structures & Algorithms",
    "Computer Networks",
    "Operating Systems",
    "Database Systems",
    "Other / Custom Subject",
];

const suggestedTopics = {
    JavaScript: [
        "Closures",
        "Promises",
        "Async/Await",
        "Event Loop",
        "Hoisting",
        "Scope",
        "Prototypes",
    ],
    React: [
        "Components & Props",
        "useState",
        "useEffect",
        "Virtual DOM",
        "Reconciliation",
        "Context API",
        "Custom Hooks",
    ],
    "Next.js": [
        "App Router",
        "Server Components",
        "Client Components",
        "CSR vs SSR",
        "API Route Handlers",
        "Data Fetching",
        "Caching",
    ],
    "Node.js": [
        "Event Loop",
        "Express Middleware",
        "REST APIs",
        "Authentication",
        "Error Handling",
        "Streams",
    ],
    MongoDB: [
        "CRUD Operations",
        "Aggregation",
        "Indexing",
        "$lookup",
        "Schema Design",
        "Pagination",
    ],
    "HTML & CSS": [
        "Semantic HTML",
        "Flexbox",
        "CSS Grid",
        "Responsive Design",
        "Accessibility",
        "CSS Positioning",
    ],
    Python: [
        "Data Types",
        "Functions",
        "OOP",
        "Decorators",
        "Exception Handling",
        "Generators",
    ],
    Java: [
        "OOP",
        "Collections",
        "Exception Handling",
        "Multithreading",
        "Interfaces",
        "JVM",
    ],
    "C / C++": [
        "Pointers",
        "Memory Management",
        "OOP",
        "Data Structures",
        "References",
        "Compilation",
    ],
    "Data Structures & Algorithms": [
        "Arrays",
        "Linked Lists",
        "Stacks & Queues",
        "Trees",
        "Graphs",
        "Sorting & Searching",
        "Dynamic Programming",
    ],
    "Computer Networks": [
        "OSI Model",
        "TCP vs UDP",
        "HTTP & HTTPS",
        "DNS",
        "IP Addressing",
        "TCP Handshake",
    ],
    "Operating Systems": [
        "Process vs Thread",
        "Deadlocks",
        "Memory Management",
        "Scheduling",
        "Virtual Memory",
        "Synchronization",
    ],
    "Database Systems": [
        "Normalization",
        "SQL Joins",
        "Transactions",
        "ACID Properties",
        "Indexing",
        "Database Design",
    ],
};

const interviewTypes = [
    {
        id: "Technical",
        title: "Technical",
        description: "Concepts, fundamentals & follow-up questions",
        icon: BookOpen,
    },
    {
        id: "Coding",
        title: "Coding",
        description: "Programming logic & problem solving",
        icon: Terminal,
    },
    {
        id: "HR",
        title: "HR Interview",
        description: "Communication, behavior & career questions",
        icon: BriefcaseBusiness,
    },
    {
        id: "Mixed",
        title: "Mixed",
        description: "A combination of technical and HR",
        icon: Users,
    },
];

const difficulties = ["Beginner", "Intermediate", "Advanced"];
const languages = ["বাংলা", "English", "Bangla + English"];
const durations = [5, 15, 30, 60];

function OptionButton({ selected, onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm transition ${selected
                ? "border-violet-400/60 bg-violet-500/[0.13] text-white shadow-[0_0_20px_rgba(139,92,246,0.07)]"
                : "border-white/[0.09] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
        >
            <span>{children}</span>
            {selected && (
                <Check className="h-4 w-4 shrink-0 text-cyan-300" />
            )}
        </button>
    );
}

export default function InterviewSetupPage() {
    const [interviewType, setInterviewType] = useState("Technical");
    const [subject, setSubject] = useState("React");
    const [customSubject, setCustomSubject] = useState("");
    const [topicMode, setTopicMode] = useState("custom");
    const [selectedTopics, setSelectedTopics] = useState([
        "useState",
        "useEffect",
    ]);
    const router = useRouter();
    const [customTopics, setCustomTopics] = useState(
        "useState, useEffect, Virtual DOM"
    );
    const [difficulty, setDifficulty] = useState("Intermediate");
    const [language, setLanguage] = useState("বাংলা");
    const [mode, setMode] = useState("Voice");
    const [duration, setDuration] = useState(15);
    const [questionCount, setQuestionCount] = useState("10");
    const [error, setError] = useState("");
    const [submittedConfig, setSubmittedConfig] = useState(null);

    const topicList = suggestedTopics[subject] || [];
    const finalSubject =
        subject === "Other / Custom Subject"
            ? customSubject.trim()
            : subject;

    function toggleTopic(topic) {
        setSelectedTopics((current) =>
            current.includes(topic)
                ? current.filter((item) => item !== topic)
                : [...current, topic]
        );
    }

    function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSubmittedConfig(null);

        if (!finalSubject) {
            setError("Please enter a subject.");
            return;
        }

        let topics = [];

        if (topicMode === "suggested") {
            topics = selectedTopics;
        } else if (topicMode === "custom") {
            topics = customTopics
                .split(/[\n,;]+/)
                .map((topic) => topic.trim())
                .filter(Boolean);
        }

        if (topicMode !== "all" && topics.length === 0) {
            setError("Please select or enter at least one topic.");
            return;
        }

        const config = {
            interviewType,
            subject: finalSubject,
            topicMode,
            topics,
            difficulty,
            language,
            mode,
            duration,
            questionCount: Number(questionCount),
        };

        setSubmittedConfig(config);
        sessionStorage.setItem(
            "edukindInterviewConfig",
            JSON.stringify(config)
        );

        router.push("/mentor/interviewer/room");
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080A12] text-white">
            <div className="pointer-events-none fixed inset-0">
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[140px]" />
            </div>

            <div className="relative mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
                <header className="mb-8 flex items-center justify-between gap-3">
                    <Link
                        href="/mentor/interviewer"
                        className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                        <span className="sm:hidden">Back</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10">
                            <Sparkles className="h-5 w-5 text-cyan-300" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-[0.14em]">
                                EDUKIND
                            </p>
                            <p className="text-[9px] tracking-[0.16em] text-violet-300">
                                AI INTERVIEWER
                            </p>
                        </div>
                    </div>
                </header>

                <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3 py-1.5 text-xs text-violet-200">
                        <Sparkles className="h-3.5 w-3.5" />
                        Personalized interview experience
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Design your{" "}
                        <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-transparent">
                            interview.
                        </span>
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        Choose any subject, focus on the topics that matter to you,
                        and customize your AI-powered practice session.
                    </p>

                    <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 text-cyan-300">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300/10">1</span>
                            Setup
                        </span>
                        <span className="h-px w-8 bg-white/10" />
                        <span>Interview</span>
                        <span className="h-px w-8 bg-white/10" />
                        <span>Results</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Interview type */}
                    <section className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-7">
                        <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                                01 — Interview format
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                What are you preparing for?
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Choose the style that matches your goal.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {interviewTypes.map((item) => {
                                const Icon = item.icon;
                                const selected = interviewType === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setInterviewType(item.id)}
                                        className={`flex gap-4 rounded-xl border p-4 text-left transition ${selected
                                            ? "border-violet-400/50 bg-violet-500/[0.09]"
                                            : "border-white/[0.08] bg-white/[0.015] hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selected
                                            ? "bg-violet-400/15 text-violet-200"
                                            : "bg-white/[0.04] text-slate-400"
                                            }`}>
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                                {item.description}
                                            </p>
                                        </div>

                                        {selected && (
                                            <Check className="h-4 w-4 shrink-0 text-cyan-300" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Subject and topics */}
                    <section className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-7">
                        <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                02 — Subject & topics
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                What do you want to be interviewed on?
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                Pick a familiar subject or enter something completely
                                different. You are not limited to the suggested topics.
                            </p>
                        </div>

                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Technology / Subject
                        </label>

                        <div className="relative">
                            <select
                                value={subject}
                                onChange={(event) => {
                                    setSubject(event.target.value);
                                    setSelectedTopics([]);
                                }}
                                className="w-full appearance-none rounded-xl border border-white/10 bg-[#111522] px-4 py-3.5 pr-10 text-sm text-white outline-none transition focus:border-violet-400/60"
                            >
                                {subjects.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        </div>

                        {subject === "Other / Custom Subject" && (
                            <div className="mt-4">
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Enter your subject
                                </label>
                                <input
                                    value={customSubject}
                                    onChange={(event) => setCustomSubject(event.target.value)}
                                    placeholder="e.g. Cybersecurity, Biology, Economics..."
                                    className="w-full rounded-xl border border-white/10 bg-[#111522] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400/60"
                                />
                            </div>
                        )}

                        <div className="mb-3 mt-6">
                            <label className="block text-sm font-medium text-slate-300">
                                Choose your topics
                            </label>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Select suggested topics, enter your own, or cover the
                                entire subject.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <OptionButton
                                selected={topicMode === "all"}
                                onClick={() => setTopicMode("all")}
                            >
                                All topics
                            </OptionButton>
                            <OptionButton
                                selected={topicMode === "suggested"}
                                onClick={() => setTopicMode("suggested")}
                            >
                                Suggested topics
                            </OptionButton>
                            <OptionButton
                                selected={topicMode === "custom"}
                                onClick={() => setTopicMode("custom")}
                            >
                                My own topics
                            </OptionButton>
                        </div>

                        {topicMode === "suggested" && (
                            <div className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-slate-300">
                                        Topics for {finalSubject || "your subject"}
                                    </p>
                                    <span className="text-xs text-slate-500">
                                        {selectedTopics.length} selected
                                    </span>
                                </div>

                                {topicList.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {topicList.map((topic) => {
                                            const selected = selectedTopics.includes(topic);

                                            return (
                                                <button
                                                    key={topic}
                                                    type="button"
                                                    onClick={() => toggleTopic(topic)}
                                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition ${selected
                                                        ? "border-cyan-300/40 bg-cyan-300/[0.08] text-cyan-200"
                                                        : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                                                        }`}
                                                >
                                                    {selected && <Check className="h-3.5 w-3.5" />}
                                                    {topic}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm leading-6 text-slate-400">
                                        There are no predefined suggestions for this subject
                                        yet. Choose “My own topics” to enter any topic you want.
                                    </p>
                                )}
                            </div>
                        )}

                        {topicMode === "custom" && (
                            <div className="mt-5">
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Enter any topic you want
                                </label>
                                <textarea
                                    value={customTopics}
                                    onChange={(event) => setCustomTopics(event.target.value)}
                                    rows={4}
                                    placeholder={"e.g.\nReact Server Components\nOperating System Deadlock\nJavaScript Event Loop"}
                                    className="w-full resize-y rounded-xl border border-white/10 bg-[#111522] px-4 py-3 text-sm leading-6 outline-none placeholder:text-slate-600 focus:border-violet-400/60"
                                />
                                <p className="mt-2 text-xs text-slate-500">
                                    Separate multiple topics with commas, semicolons, or
                                    new lines.
                                </p>
                            </div>
                        )}
                    </section>

                    {/* Difficulty */}
                    <section className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-7">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                            03 — Difficulty
                        </p>
                        <h2 className="mt-2 text-lg font-semibold">
                            Set your challenge level
                        </h2>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {difficulties.map((item, index) => (
                                <OptionButton
                                    key={item}
                                    selected={difficulty === item}
                                    onClick={() => setDifficulty(item)}
                                >
                                    <span className="block font-medium">{item}</span>
                                    <span className="mt-1 block text-xs text-slate-500">
                                        {[
                                            "Build your foundations",
                                            "Test practical knowledge",
                                            "Deep concepts & edge cases",
                                        ][index]}
                                    </span>
                                </OptionButton>
                            ))}
                        </div>
                    </section>

                    {/* Language and mode */}
                    <section className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                04 — Language
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                Choose your language
                            </h2>
                            <div className="mt-5 space-y-3">
                                {languages.map((item) => (
                                    <OptionButton
                                        key={item}
                                        selected={language === item}
                                        onClick={() => setLanguage(item)}
                                    >
                                        {item}
                                    </OptionButton>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                                05 — Interview mode
                            </p>
                            <h2 className="mt-2 text-lg font-semibold">
                                How do you want to practice?
                            </h2>

                            <div className="mt-5 space-y-3">
                                <OptionButton
                                    selected={mode === "Voice"}
                                    onClick={() => setMode("Voice")}
                                >
                                    <span className="flex items-center gap-3">
                                        <Mic className="h-5 w-5 text-cyan-300" />
                                        <span>
                                            <span className="block font-medium">Voice interview</span>
                                            <span className="mt-1 block text-xs text-slate-500">
                                                Speak your answers aloud
                                            </span>
                                        </span>
                                    </span>
                                </OptionButton>

                                <OptionButton
                                    selected={mode === "Text"}
                                    onClick={() => setMode("Text")}
                                >
                                    <span className="flex items-center gap-3">
                                        <Code2 className="h-5 w-5 text-violet-300" />
                                        <span>
                                            <span className="block font-medium">Text interview</span>
                                            <span className="mt-1 block text-xs text-slate-500">
                                                Type your answers
                                            </span>
                                        </span>
                                    </span>
                                </OptionButton>
                            </div>

                            {mode === "Voice" && (
                                <div className="mt-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] p-3">
                                    <p className="flex items-center gap-2 text-xs text-cyan-200">
                                        <AudioLines className="h-4 w-4" />
                                        Microphone access will be needed
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Duration */}
                    <section className="rounded-2xl border border-white/[0.09] bg-[#0D101B]/90 p-5 sm:p-7">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-blue-400/10 p-3">
                                <Clock3 className="h-5 w-5 text-blue-300" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
                                    06 — Session length
                                </p>
                                <h2 className="mt-1 text-lg font-semibold">
                                    How much time do you have?
                                </h2>
                            </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {durations.map((item) => (
                                <OptionButton
                                    key={item}
                                    selected={duration === item}
                                    onClick={() => setDuration(item)}
                                >
                                    <span className="block text-lg font-semibold">
                                        {item} min
                                    </span>
                                    <span className="mt-1 block text-xs text-slate-500">
                                        {item === 5
                                            ? "Quick practice"
                                            : item === 15
                                                ? "Short session"
                                                : item === 30
                                                    ? "Full practice"
                                                    : "Deep practice"}
                                    </span>
                                </OptionButton>
                            ))}
                        </div>

                        <div className="mt-6 border-t border-white/[0.07] pt-5">
                            <label
                                htmlFor="questionCount"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Preferred number of questions
                            </label>
                            <select
                                id="questionCount"
                                value={questionCount}
                                onChange={(event) => setQuestionCount(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#111522] px-4 py-3 text-sm outline-none focus:border-violet-400/60 sm:max-w-xs"
                            >
                                <option value="5">5 questions</option>
                                <option value="10">10 questions</option>
                                <option value="15">15 questions</option>
                                <option value="20">20 questions</option>
                            </select>
                            <p className="mt-2 text-xs text-slate-500">
                                The final number of questions may depend on your session
                                duration and follow-up questions.
                            </p>
                        </div>
                    </section>

                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm text-rose-300"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <section className="rounded-2xl border border-violet-400/15 bg-gradient-to-r from-violet-500/[0.08] to-cyan-400/[0.04] p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="flex items-center gap-2 text-sm font-semibold">
                                    <Sparkles className="h-4 w-4 text-violet-300" />
                                    Your interview, your rules.
                                </p>
                                <p className="mt-2 max-w-lg text-xs leading-6 text-slate-400">
                                    Your choices will shape the interview. AI question
                                    generation and live voice interaction will be connected
                                    in the next implementation step.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:brightness-110"
                            >
                                Prepare Interview
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </section>
                </form>

                {submittedConfig && (
                    <section
                        aria-live="polite"
                        className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5 sm:p-6"
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                                <Check className="h-5 w-5 text-emerald-300" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-semibold text-emerald-200">
                                    Your configuration is ready
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-400">
                                    {submittedConfig.interviewType} interview ·{" "}
                                    {submittedConfig.subject} · {submittedConfig.difficulty} ·{" "}
                                    {submittedConfig.language} · {submittedConfig.mode} ·{" "}
                                    {submittedConfig.duration} minutes
                                </p>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                    Topics:{" "}
                                    {submittedConfig.topicMode === "all"
                                        ? "All topics"
                                        : submittedConfig.topics.join(", ")}
                                </p>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    Setup form is working. The next step is to build the
                                    interview room and connect the selected configuration to
                                    the AI engine. No live interview has started yet.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <footer className="py-8 text-center text-[11px] tracking-wide text-slate-600">
                    EDUKIND · LEARN · BUILD · IMPACT
                </footer>
            </div>
        </main>
    );
}
