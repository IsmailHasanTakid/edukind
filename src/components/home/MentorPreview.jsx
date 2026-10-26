"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowUpRight,
    Briefcase,
    CalendarCheck,
    Code2,
    GraduationCap,
    Lightbulb,
    MessageCircle,
    Mic,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config: keep LIMIT and MAX_CHARS in sync with route.js              */
/* ------------------------------------------------------------------ */
const LIMIT = 4;
const MAX_CHARS = 300;
const WINDOW_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "edukind-mentor-preview";
// Put the globe image at public/images/mentor-globe.jpeg
const GLOBE_SRC = "/images/mentor-globe.jpeg";
const MENTOR_HREF = "/mentor";

// Where the globe sits inside the source image (used to centre it)
const GLOBE_X = 66; // % from left
const GLOBE_Y = 37; // % from top

const TOPICS = [
    {
        id: "science",
        label: "Science",
        prompts: [
            "How do plants make their own food?",
            "Why is the sky blue?",
            "What is gravity, in simple words?",
        ],
    },
    {
        id: "math",
        label: "Math",
        prompts: [
            "What is a fraction? Give me an easy example",
            "Explain derivatives in simple words",
            "What is probability?",
        ],
    },
    {
        id: "code",
        label: "Code",
        prompts: [
            "What is the difference between an array and an object in JavaScript?",
            "What is an API?",
            "Explain recursion with a small example",
        ],
    },
    {
        id: "life",
        label: "Study & career",
        prompts: [
            "How do I start learning programming?",
            "How can I plan my study time better?",
            "Which skills will matter most in the future?",
        ],
    },
];

// Other tools inside Mentor Space. Add an `href` to a tool to link it to its own route.
const TOOLS = [
    { id: "learn", title: "Learn with AI", text: "Step-by-step guided learning for difficult concepts.", icon: GraduationCap, color: "#22D3EE" },
    { id: "code", title: "Code Mentor", text: "Understand code and improve your programming skills.", icon: Code2, color: "#34D399" },
    { id: "solver", title: "Problem Solver", text: "Break complex problems into smaller, solvable steps.", icon: Lightbulb, color: "#FBBF24" },
    { id: "planner", title: "AI Study Planner", text: "Turn your goals into a structured learning roadmap.", icon: CalendarCheck, color: "#F472B6", badge: "New" },
    { id: "career", title: "Career Guidance", text: "Explore career paths and plan your next steps.", icon: Briefcase, color: "#60A5FA" },
    { id: "interview", title: "AI Interviewer", text: "Practice interviews with adaptive questions and feedback.", icon: Mic, color: "#38BDF8" },
];

/* ------------------------------------------------------------------ */
/* Tool tile (small card that links to /mentor)                         */
/* ------------------------------------------------------------------ */
function onCardMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function ToolTile({ tool, index }) {
    const Icon = tool.icon;
    return (
        <Link
            href={tool.href ?? MENTOR_HREF}
            onMouseMove={onCardMove}
            style={{ "--i": index }}
            className="mp-tile group relative isolate flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0B0F1C]/80 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-white/[0.2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), ${tool.color}26, transparent 65%)`,
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 -z-10 h-32 w-32 rounded-full opacity-[0.14] blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                style={{ backgroundColor: tool.color }}
            />

            <div className="flex items-start justify-between">
                <span
                    className="grid h-10 w-10 place-items-center rounded-xl border transition duration-300 group-hover:scale-105"
                    style={{
                        borderColor: `${tool.color}40`,
                        backgroundColor: `${tool.color}16`,
                        boxShadow: `0 8px 24px -12px ${tool.color}`,
                    }}
                >
                    <Icon size={19} strokeWidth={1.7} style={{ color: tool.color }} />
                </span>
                <div className="flex items-center gap-2">
                    {tool.badge && (
                        <span
                            className="rounded-full border px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                            style={{
                                borderColor: `${tool.color}44`,
                                backgroundColor: `${tool.color}14`,
                                color: tool.color,
                            }}
                        >
                            {tool.badge}
                        </span>
                    )}
                    <ArrowUpRight
                        size={16}
                        className="text-slate-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                    />
                </div>
            </div>

            <h4 className="mt-auto pt-4 text-[16px] font-semibold tracking-[-0.02em] text-white">
                {tool.title}
            </h4>
            <p className="mt-1.5 text-[13px] leading-6 text-slate-400">{tool.text}</p>
        </Link>
    );
}

/* ------------------------------------------------------------------ */
/* Browser-side usage counter (UI only, the real limit is on server)   */
/* ------------------------------------------------------------------ */
function readUsed() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { count: 0, resetAt: Date.now() + WINDOW_MS };
        const data = JSON.parse(raw);
        if (!data.resetAt || data.resetAt < Date.now()) {
            return { count: 0, resetAt: Date.now() + WINDOW_MS };
        }
        return data;
    } catch {
        return { count: 0, resetAt: Date.now() + WINDOW_MS };
    }
}

function writeUsed(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        /* ignore */
    }
}

/* ------------------------------------------------------------------ */
/* Answer renderer: code blocks, **bold**, `inline`, lists             */
/* ------------------------------------------------------------------ */
function splitBlocks(text) {
    const blocks = [];
    const re = /```([\w+#-]*)[^\S\n]*\n?([\s\S]*?)(```|$)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) blocks.push({ type: "text", value: text.slice(last, m.index) });
        blocks.push({ type: "code", lang: m[1] || "code", value: m[2].replace(/\n$/, "") });
        last = re.lastIndex;
        if (m[0] === "") re.lastIndex++;
    }
    if (last < text.length) blocks.push({ type: "text", value: text.slice(last) });
    return blocks;
}

function Inline({ text }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
    return parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
            return (
                <strong key={i} className="font-semibold text-white">
                    {p.slice(2, -2)}
                </strong>
            );
        }
        if (p.startsWith("`") && p.endsWith("`")) {
            return (
                <code
                    key={i}
                    className="rounded-md bg-cyan-400/10 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-200"
                >
                    {p.slice(1, -1)}
                </code>
            );
        }
        return <span key={i}>{p}</span>;
    });
}

function TextBlock({ value }) {
    const lines = value.split("\n");
    return (
        <div className="space-y-1.5">
            {lines.map((raw, i) => {
                const line = raw.trimEnd();
                if (!line.trim()) return <div key={i} className="h-1" />;

                const heading = line.match(/^#{1,4}\s+(.*)/);
                if (heading) {
                    return (
                        <p key={i} className="pt-1 font-semibold text-white">
                            <Inline text={heading[1]} />
                        </p>
                    );
                }

                const bullet = line.match(/^\s*[-*•]\s+(.*)/);
                if (bullet) {
                    return (
                        <p key={i} className="flex gap-2 pl-1">
                            <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300/80" />
                            <span>
                                <Inline text={bullet[1]} />
                            </span>
                        </p>
                    );
                }

                const numbered = line.match(/^\s*(\d+)[.)]\s+(.*)/);
                if (numbered) {
                    return (
                        <p key={i} className="flex gap-2 pl-1">
                            <span className="shrink-0 text-cyan-300/90">{numbered[1]}.</span>
                            <span>
                                <Inline text={numbered[2]} />
                            </span>
                        </p>
                    );
                }

                return (
                    <p key={i}>
                        <Inline text={line} />
                    </p>
                );
            })}
        </div>
    );
}

function CodeBlock({ lang, value }) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* ignore */
        }
    }

    return (
        <div className="my-2 overflow-hidden rounded-xl border border-white/10 bg-[#060916]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-3 py-1.5">
                <span className="font-mono text-xs text-slate-400">{lang}</span>
                <button
                    type="button"
                    onClick={copy}
                    className="rounded-md px-2 py-0.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre className="overflow-x-auto p-3 text-[13px] leading-relaxed text-slate-100">
                <code className="font-mono">{value}</code>
            </pre>
        </div>
    );
}

function Answer({ text }) {
    const blocks = useMemo(() => splitBlocks(text), [text]);
    return (
        <div className="space-y-2 text-[15px] leading-7 text-slate-200">
            {blocks.map((b, i) =>
                b.type === "code" ? (
                    <CodeBlock key={i} lang={b.lang} value={b.value} />
                ) : (
                    <TextBlock key={i} value={b.value} />
                ),
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Small icons                                                          */
/* ------------------------------------------------------------------ */
function SendIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

function SparkIcon() {
    return (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2zm7 11l.9 2.7 2.6.8-2.6.8L19 20l-.9-2.7-2.6-.8 2.6-.8L19 13z" />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */
export default function MentorPreview() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [remaining, setRemaining] = useState(LIMIT);
    const [error, setError] = useState("");
    const [topicId, setTopicId] = useState(TOPICS[0].id);

    const sectionRef = useRef(null);
    const parallaxRef = useRef(null);
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);

    const topic = TOPICS.find((t) => t.id === topicId) ?? TOPICS[0];

    // Read previous usage from the browser
    useEffect(() => {
        const used = readUsed();
        setRemaining(Math.max(0, LIMIT - used.count));
    }, []);

    // Scroll inside the chat box only (never the whole page)
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, [messages, loading]);

    // Globe follows the pointer a little (skipped for reduced motion)
    useEffect(() => {
        const section = sectionRef.current;
        const target = parallaxRef.current;
        if (!section || !target) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let raf = 0;
        function onMove(e) {
            const rect = section.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                target.style.transform = `translate3d(${x * 28}px, ${y * 18}px, 0) scale(1.01)`;
            });
        }
        function onLeave() {
            target.style.transform = "translate3d(0,0,0)";
        }

        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerleave", onLeave);
        return () => {
            cancelAnimationFrame(raf);
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    const limitReached = remaining <= 0;
    const tooLong = input.length > MAX_CHARS;
    const canSend = !loading && !limitReached && input.trim().length > 0 && !tooLong;
    const empty = messages.length === 0;

    async function send(text) {
        const message = (text ?? input).trim();
        if (!message || loading || limitReached || message.length > MAX_CHARS) return;

        setError("");
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: message }]);
        setLoading(true);

        try {
            const res = await fetch("/api/mentor-preview", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.status === 429) {
                setRemaining(0);
                writeUsed({ count: LIMIT, resetAt: readUsed().resetAt });
                return;
            }

            if (!res.ok || !data.reply) {
                setError(
                    data.error === "invalid_message"
                        ? `Please keep your question under ${MAX_CHARS} characters.`
                        : "Couldn't get an answer right now. Please try again in a moment.",
                );
                return;
            }

            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
            const left = typeof data.remaining === "number" ? data.remaining : remaining - 1;
            setRemaining(left);
            writeUsed({ count: LIMIT - left, resetAt: readUsed().resetAt });
        } catch {
            setError("Connection problem. Check your internet and try again.");
        } finally {
            setLoading(false);
            textareaRef.current?.focus();
        }
    }

    function onKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
        }
    }

    return (
        <section
            id="mentor-preview"
            ref={sectionRef}
            className="relative isolate pb-20 sm:pb-28"
        >
            {/* ---------- Globe hero (centred) ---------- */}
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-[260px] overflow-x-clip sm:h-[380px]"
                style={{ "--w": "min(900px, 125vw)" }}
            >
                {/* soft glow behind the globe */}
                <div
                    className={`absolute left-1/2 top-1/2 h-[70%] w-[70%] max-w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-[90px] transition-opacity duration-700 ${loading ? "opacity-100" : "opacity-60"
                        }`}
                />

                {/* parallax wrapper */}
                <div
                    ref={parallaxRef}
                    className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
                >
                    {/* image positioned so the globe sits at the exact centre */}
                    <div
                        className={`absolute left-1/2 top-1/2 ${loading ? "motion-safe:animate-pulse" : ""
                            }`}
                        style={{
                            width: "var(--w)",
                            aspectRatio: "1264 / 848",
                            transform: `translate(-${GLOBE_X}%, -${GLOBE_Y}%)`,
                            WebkitMaskImage: `radial-gradient(ellipse 30% 52% at ${GLOBE_X}% ${GLOBE_Y + 6}%, #000 45%, transparent 100%)`,
                            maskImage: `radial-gradient(ellipse 30% 52% at ${GLOBE_X}% ${GLOBE_Y + 6}%, #000 45%, transparent 100%)`,
                        }}
                    >
                        <Image
                            src={GLOBE_SRC}
                            alt=""
                            fill
                            priority
                            sizes="(min-width: 900px) 900px, 125vw"
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* orbit rings around the globe */}
                <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: "calc(var(--w) * 0.4)", height: "calc(var(--w) * 0.4)" }}
                >
                    <div
                        className="absolute inset-0 rounded-full border border-dashed border-cyan-300/25 motion-safe:animate-spin"
                        style={{ animationDuration: loading ? "6s" : "40s" }}
                    />
                    <div
                        className="absolute inset-[9%] rounded-full border border-violet-300/20 motion-safe:animate-spin"
                        style={{
                            animationDuration: loading ? "9s" : "60s",
                            animationDirection: "reverse",
                        }}
                    />
                </div>
            </div>

            <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-12">
                {/* ---------- Heading ---------- */}
                <header className="relative text-center">
                    <h2
                        className="whitespace-nowrap text-[clamp(1.35rem,5.4vw,3.25rem)] font-semibold tracking-tight text-white"
                        style={{ textShadow: "0 2px 28px rgba(5,7,20,0.95), 0 0 6px rgba(5,7,20,0.7)" }}
                    >
                        Ask anything. <span className="text-slate-300">Learn it your way.</span>
                    </h2>
                    <p
                        className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-slate-200 sm:text-lg"
                        style={{ textShadow: "0 2px 20px rgba(5,7,20,0.95)" }}
                    >
                        Your AI Mentor explains any topic in simple words, at your pace. Try it now,
                        no sign-up needed. {LIMIT} questions are free.
                    </p>
                </header>

                {/* ---------- Mentor Space bento ---------- */}
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* ===== Ask AI Mentor (live chat) ===== */}
                    <div
                        className="mp-tile relative h-[580px] rounded-3xl bg-gradient-to-b from-cyan-300/40 via-white/10 to-violet-400/30 p-px shadow-[0_0_100px_-24px_rgba(56,189,248,0.5)] sm:col-span-2 sm:h-[600px] lg:row-span-3"
                        style={{ "--i": 0 }}
                    >
                        <div className="flex h-full flex-col rounded-[23px] bg-[#080c1f]/90 backdrop-blur-xl">
                            {/* top bar */}
                            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="grid h-9 w-9 place-items-center rounded-xl border"
                                        style={{
                                            borderColor: "#A78BFA40",
                                            backgroundColor: "#A78BFA16",
                                            boxShadow: "0 8px 24px -12px #A78BFA",
                                        }}
                                    >
                                        <MessageCircle size={18} strokeWidth={1.7} style={{ color: "#A78BFA" }} />
                                    </span>
                                    <div className="leading-tight">
                                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                                            Ask AI Mentor
                                            <span className="relative flex h-2 w-2">
                                                <span
                                                    className={`absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 ${loading ? "motion-safe:animate-ping" : "hidden"
                                                        }`}
                                                />
                                                <span
                                                    className={`relative inline-flex h-2 w-2 rounded-full ${limitReached ? "bg-slate-500" : "bg-cyan-300"
                                                        }`}
                                                />
                                            </span>
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            {loading ? "Thinking..." : "Free preview"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex items-center gap-1"
                                        role="img"
                                        aria-label={`${remaining} questions left`}
                                    >
                                        {Array.from({ length: LIMIT }).map((_, i) => (
                                            <span
                                                key={i}
                                                className={`h-1.5 w-5 rounded-full transition-colors duration-500 ${i < remaining
                                                    ? "bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                                                    : "bg-white/15"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <Link
                                        href={MENTOR_HREF}
                                        className="hidden rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-200 transition hover:border-cyan-300/60 hover:text-white sm:inline-block"
                                    >
                                        Open full Mentor
                                    </Link>
                                </div>
                            </div>

                            {/* topic chips (hidden after the first question) */}
                            {empty && !limitReached && (
                                <div
                                    role="tablist"
                                    aria-label="Question topics"
                                    className="flex flex-wrap gap-1.5 px-4 pt-4 sm:px-6"
                                >
                                    {TOPICS.map((t) => {
                                        const active = t.id === topicId;
                                        return (
                                            <button
                                                key={t.id}
                                                type="button"
                                                role="tab"
                                                aria-selected={active}
                                                onClick={() => setTopicId(t.id)}
                                                className={`rounded-full px-3.5 py-1 text-[13px] font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 ${active
                                                    ? "bg-gradient-to-r from-cyan-300 to-blue-400 text-[#03101f]"
                                                    : "border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                                                    }`}
                                            >
                                                {t.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* messages */}
                            <div
                                ref={scrollRef}
                                className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6"
                                aria-live="polite"
                            >
                                {empty ? (
                                    <div className="flex h-full flex-col justify-center">
                                        <p className="mb-3 flex items-center gap-2 text-sm text-slate-400">
                                            <SparkIcon />
                                            {limitReached
                                                ? "Your free questions are used up for now"
                                                : "Try one of these, or type your own"}
                                        </p>
                                        <div className="grid gap-2.5">
                                            {topic.prompts.map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => send(p)}
                                                    disabled={loading || limitReached}
                                                    className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-[15px] text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                                                >
                                                    <span>{p}</span>
                                                    <span className="shrink-0 text-cyan-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                                                        <SendIcon />
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <ul className="space-y-5">
                                        {messages.map((m, i) => (
                                            <li
                                                key={i}
                                                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                                            >
                                                {m.role === "user" ? (
                                                    <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-gradient-to-br from-cyan-300 to-blue-500 px-4 py-2.5 text-[15px] leading-7 text-[#03101f] shadow-[0_8px_30px_-10px_rgba(56,189,248,0.8)]">
                                                        {m.content}
                                                    </p>
                                                ) : (
                                                    <div className="max-w-full rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 sm:max-w-[92%]">
                                                        <Answer text={m.content} />
                                                    </div>
                                                )}
                                            </li>
                                        ))}

                                        {loading && (
                                            <li className="flex justify-start">
                                                <div
                                                    className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3.5"
                                                    role="status"
                                                    aria-label="Generating answer"
                                                >
                                                    {[0, 1, 2].map((d) => (
                                                        <span
                                                            key={d}
                                                            className="h-2 w-2 rounded-full bg-cyan-300/80 motion-safe:animate-bounce"
                                                            style={{ animationDelay: `${d * 140}ms` }}
                                                        />
                                                    ))}
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                )}

                                {error && (
                                    <p
                                        role="alert"
                                        className="mt-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-3.5 py-2.5 text-sm text-rose-200"
                                    >
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* input or limit CTA */}
                            <div className="border-t border-white/10 p-3 sm:p-4">
                                {limitReached ? (
                                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
                                        <div>
                                            <p className="font-medium text-white">
                                                You've used your {LIMIT} free questions
                                            </p>
                                            <p className="mt-1 text-sm text-slate-300">
                                                Keep going in the full AI Mentor: unlimited chat, code help and study plans.
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-center gap-2">
                                            <Link
                                                href={MENTOR_HREF}
                                                className="rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-2.5 text-sm font-semibold text-[#03101f] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                                            >
                                                Open AI Mentor
                                            </Link>
                                            {process.env.NODE_ENV === "development" && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        try {
                                                            localStorage.removeItem(STORAGE_KEY);
                                                        } catch {
                                                            /* ignore */
                                                        }
                                                        setRemaining(LIMIT);
                                                        setMessages([]);
                                                    }}
                                                    className="text-xs text-slate-400 underline underline-offset-2 hover:text-white"
                                                >
                                                    Reset limit (dev only)
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            send();
                                        }}
                                    >
                                        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-[#050714]/80 p-2 transition focus-within:border-cyan-300/60 focus-within:shadow-[0_0_30px_-8px_rgba(103,232,249,0.6)]">
                                            <label htmlFor="mentor-preview-input" className="sr-only">
                                                Your question
                                            </label>
                                            <textarea
                                                id="mentor-preview-input"
                                                ref={textareaRef}
                                                rows={1}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={onKeyDown}
                                                placeholder="Ask your question..."
                                                disabled={loading}
                                                className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2.5 py-2 text-[15px] text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!canSend}
                                                aria-label="Send question"
                                                className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 text-sm font-semibold text-[#03101f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:from-white/10 disabled:to-white/10 disabled:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                                            >
                                                Ask
                                                <SendIcon />
                                            </button>
                                        </div>
                                        <div className="mt-2 flex justify-between px-1 text-xs text-slate-500">
                                            <span>Enter to send, Shift + Enter for a new line</span>
                                            <span className={tooLong ? "text-rose-300" : ""}>
                                                {input.length}/{MAX_CHARS}
                                            </span>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== Other 6 tools ===== */}
                    {TOOLS.map((tool, i) => (
                        <ToolTile key={tool.id} tool={tool} index={i + 1} />
                    ))}
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                    AI can make mistakes. Check important facts with a teacher or a textbook.
                </p>
            </div>

            <style>{`
                @keyframes mp-rise {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .mp-tile {
                    animation: mp-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: calc(var(--i, 0) * 70ms);
                }
                @media (prefers-reduced-motion: reduce) {
                    .mp-tile { animation: none; }
                }
            `}</style>
        </section>
    );
}