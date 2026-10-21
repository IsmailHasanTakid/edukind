"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUp,
    BookOpen,
    Bug,
    BrainCircuit,
    Check,
    Code2,
    Command,
    Compass,
    GraduationCap,
    History,
    Lightbulb,
    Menu,
    CalendarDays,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    Settings2,
    Sparkles,
    SquarePen,
    Target,
    X,
} from "lucide-react";

// Pages pass icon NAMES (strings), because functions/components
// cannot be passed from a server page to a client component.
const ICONS = {
    book: BookOpen,
    bug: Bug,
    brain: BrainCircuit,
    code: Code2,
    graduation: GraduationCap,
    lightbulb: Lightbulb,
    target: Target,
    chat: MessageCircle,
};

const iconColors = {
    violet: "text-violet-300 bg-violet-400/10 border-violet-400/15",
    cyan: "text-cyan-300 bg-cyan-400/10 border-cyan-400/15",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/15",
    pink: "text-pink-300 bg-pink-400/10 border-pink-400/15",
};

const ACCENTS = {
    violet: {
        glow: "bg-violet-700/[0.12]",
        badge: "border-violet-400/15 bg-violet-400/[0.06] text-violet-200",
        dot: "bg-violet-300",
        iconBox: "border-violet-400/25 bg-violet-400/10 text-violet-300",
        send: "from-violet-500 to-indigo-500",
        active: "border-violet-400/25 bg-violet-400/10 text-violet-100",
        focus: "focus-within:border-violet-400/35",
    },
    cyan: {
        glow: "bg-cyan-600/[0.14]",
        badge: "border-cyan-400/15 bg-cyan-400/[0.06] text-cyan-200",
        dot: "bg-cyan-300",
        iconBox: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
        send: "from-cyan-500 to-sky-500",
        active: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
        focus: "focus-within:border-cyan-400/35",
    },
    emerald: {
        glow: "bg-emerald-600/[0.14]",
        badge: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-200",
        dot: "bg-emerald-300",
        iconBox: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        send: "from-emerald-500 to-teal-500",
        active: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
        focus: "focus-within:border-emerald-400/35",
    },
    amber: {
        glow: "bg-amber-600/[0.12]",
        badge: "border-amber-400/15 bg-amber-400/[0.06] text-amber-200",
        dot: "bg-amber-300",
        iconBox: "border-amber-400/25 bg-amber-400/10 text-amber-300",
        send: "from-amber-500 to-orange-500",
        active: "border-amber-400/25 bg-amber-400/10 text-amber-100",
        focus: "focus-within:border-amber-400/35",
    },
};

const MODES = [
    { id: "chat", label: "Ask AI Mentor", href: "/mentor/chat", icon: MessageCircle, accent: "violet" },
    { id: "learn", label: "Learn with AI", href: "/mentor/learn", icon: GraduationCap, accent: "cyan" },
    { id: "code", label: "Code Mentor", href: "/mentor/code", icon: Code2, accent: "emerald" },
    { id: "problem-solver", label: "Problem Solver", href: "/mentor/problem-solver", icon: Lightbulb, accent: "amber" },
];

export default function MentorChat({
    mode = "chat",
    hideSidebar = false,
    title = "AI Mentor",
    description = "",
    heroIcon = "chat",
    accent = "violet",
    badge = "YOUR PERSONAL AI MENTOR",
    placeholder = "Ask your mentor anything...",
    suggestions = [],
    initialChats = [],
}) {
    const theme = ACCENTS[accent] || ACCENTS.violet;
    const HeroIcon = ICONS[heroIcon] || Sparkles;

    const [prompt, setPrompt] = useState("");
    const [chats, setChats] = useState(initialChats);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotice, setShowNotice] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const textareaRef = useRef(null);
    const bottomRef = useRef(null);

    // Auto-resize textarea (max 200px)
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [prompt]);

    // Auto-scroll to the newest message while streaming
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isLoading]);

    function startNewChat() {
        setActiveChat(null);
        setMessages([]);
        setPrompt("");
        setSidebarOpen(false);
    }

    function selectChat(chat) {
        setActiveChat(chat);
        setMessages([]);
        setSidebarOpen(false);
        setShowNotice(true);
    }

    async function handleSend(value = prompt) {
        const text = value.trim();

        if (!text || isLoading) return;

        const previousMessages = messages;

        const userMessage = {
            id: Date.now(),
            text,
            role: "user",
        };

        setMessages((previous) => [...previous, userMessage]);

        if (!activeChat) {
            const title = text.length > 34 ? `${text.slice(0, 34)}...` : text;

            setActiveChat(title);
            setChats((previous) => [title, ...previous]);
        }

        setPrompt("");
        setShowNotice(false);
        setIsLoading(true);

        let assistantId = null;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode,
                    messages: [
                        ...previousMessages.map(({ role, text }) => ({
                            role,
                            text,
                        })),
                        { role: "user", text },
                    ],
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "AI request failed.");
            }

            assistantId = Date.now() + 1;
            const currentId = assistantId;

            setMessages((previous) => [
                ...previous,
                { id: currentId, text: "", role: "assistant" },
            ]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const piece = decoder.decode(value, { stream: true });

                setMessages((previous) =>
                    previous.map((m) =>
                        m.id === currentId ? { ...m, text: m.text + piece } : m
                    )
                );
            }
        } catch (error) {
            const errorText = `দুঃখিত, AI উত্তর দিতে পারেনি। ${error.message}`;
            const currentId = assistantId;

            setMessages((previous) => {
                if (currentId && previous.some((m) => m.id === currentId)) {
                    return previous.map((m) =>
                        m.id === currentId
                            ? { ...m, text: `${m.text}\n\n${errorText}` }
                            : m
                    );
                }

                return [
                    ...previous,
                    { id: Date.now() + 1, text: errorText, role: "assistant" },
                ];
            });
        } finally {
            setIsLoading(false);
        }
    }

    const filteredChats = chats.filter((chat) =>
        chat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="relative flex h-full overflow-hidden bg-[#080A12] text-slate-100 selection:bg-violet-500/30">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -top-48 left-[38%] h-[440px] w-[440px] rounded-full blur-[140px] ${theme.glow}`}
                />
                <div className="absolute bottom-[-200px] right-[8%] h-[400px] w-[400px] rounded-full bg-cyan-600/[0.07] blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
            </div>

            {!hideSidebar && (
                <>
                    {/* Mobile overlay */}
                    {sidebarOpen && (
                        <button
                            aria-label="Close navigation"
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                        />
                    )}

                    {/* Sidebar */}
                    <aside
                        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[272px] max-w-[86vw] flex-col border-r border-white/[0.07] bg-[#0B0D17]/95 shadow-2xl backdrop-blur-2xl transition-transform duration-300 lg:relative lg:z-10 lg:h-full lg:max-w-none lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                {/* Brand */}
                <div className="flex h-[76px] shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-5">
                    <Link href="/" className="flex min-w-0 items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-[0_0_25px_rgba(139,92,246,0.12)]">
                            <Sparkles className="h-5 w-5 text-violet-200" />
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0B0D17] bg-cyan-300" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-[15px] font-bold tracking-[0.18em] text-white">
                                EDUKIND
                            </p>
                            <p className="mt-0.5 truncate text-[10px] tracking-[0.2em] text-slate-500">
                                AI LEARNING SPACE
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300/70 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    {/* Sidebar actions */}
                    <div className="space-y-2 px-3 pt-4">
                    <button
                        onClick={startNewChat}
                        className="group flex w-full items-center justify-between rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-500/15 to-indigo-500/[0.08] px-3 py-2.5 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 hover:border-violet-300/40 hover:from-violet-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300/70 motion-reduce:transition-none"
                    >
                        <span className="flex items-center gap-2.5">
                            <SquarePen className="h-4 w-4 text-violet-300" />
                            New conversation
                        </span>
                        <Plus className="h-4 w-4 text-violet-300 transition group-hover:rotate-90" />
                    </button>

                    <button
                        onClick={() => setSearchOpen((open) => !open)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] text-slate-400 transition-colors duration-200 hover:bg-white/[0.045] hover:text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300/70 motion-reduce:transition-none"
                    >
                        <Search className="h-4 w-4 shrink-0" />
                        Search conversations
                        <span className="ml-auto flex items-center gap-1 rounded-md border border-white/[0.08] px-1.5 py-0.5 text-[10px] text-slate-500">
                            <Command className="h-3 w-3" /> K
                        </span>
                    </button>

                    {searchOpen && (
                        <input
                            autoFocus
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search chats..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                        />
                    )}
                </div>

                <div className="mt-5 px-3">
                    <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                        MENTOR TOOLS
                    </p>
                    <div className="space-y-1.5">
                        {MODES.map((item) => {
                            const ItemIcon = item.icon;
                            const isCurrent = item.id === mode;

                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 motion-reduce:transition-none ${isCurrent
                                        ? `${ACCENTS[item.accent].active} shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`
                                        : "border-transparent text-slate-400 hover:bg-white/[0.045] hover:text-slate-200"
                                        }`}
                                >
                                    <ItemIcon className="h-4 w-4 shrink-0" />
                                    <span className="truncate leading-5">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-5 px-3 pb-3">
                    <div className="mb-2 flex items-center justify-between px-3">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                            RECENT CONVERSATIONS
                        </p>
                        <History className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                    </div>

                    <div className="space-y-1.5">
                        {filteredChats.map((chat, index) => (
                            <button
                                key={`${chat}-${index}`}
                                onClick={() => selectChat(chat)}
                                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300/70 motion-reduce:transition-none ${activeChat === chat
                                    ? "bg-violet-400/10 text-violet-100"
                                    : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-200"
                                    }`}
                            >
                                <MessageCircle className="h-4 w-4 shrink-0 text-slate-500" />
                                <span className="min-w-0 flex-1 truncate leading-5">{chat}</span>
                                <MoreHorizontal className="h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
                            </button>
                        ))}

                        {filteredChats.length === 0 && (
                            <p className="px-3 py-4 text-xs text-slate-500">
                                No conversations found.
                            </p>
                        )}
                    </div>
                </div>
                </div>

                <div className="shrink-0 border-t border-white/[0.07] px-3 py-3">
                    <Link
                        href="/mentor"
                        className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-slate-400 transition-colors duration-200 hover:bg-white/[0.045] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300/70 motion-reduce:transition-none"
                    >
                        <ArrowLeft className="h-4 w-4 shrink-0" />
                        Back to Mentor home
                    </Link>

                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold text-white">
                            E
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-slate-200">
                                Learner
                            </p>
                            <p className="mt-1 text-[10px] text-slate-500">
                                Your learning journey
                            </p>
                        </div>
                        <Settings2 className="h-4 w-4 shrink-0 text-slate-500" />
                    </div>
                </div>
                    </aside>
                </>
            )}

            {/* Main workspace */}
            <section className="relative z-10 flex min-w-0 flex-1 flex-col">
                {/* Mobile menu bar */}
                {!hideSidebar && (
                    <div className="flex shrink-0 items-center px-4 pb-1 pt-3 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                            className="flex max-w-full items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-xs text-slate-300 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 motion-reduce:transition-none"
                        >
                            <Menu className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                                {activeChat || title}
                            </span>
                        </button>
                    </div>
                )}

                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-start px-5 pt-8 pb-6 sm:px-6 sm:pt-10">
                                <div className="flex flex-col items-center text-center">
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${theme.iconBox}`}
                                    >
                                        <HeroIcon className="h-6 w-6" />
                                    </div>

                                    <div
                                        className={`mt-4 flex items-center gap-2 rounded-full border px-3 py-1.5 ${theme.badge}`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 animate-pulse rounded-full ${theme.dot}`}
                                        />
                                        <span className="text-[10px] font-medium tracking-[0.13em]">
                                            {badge}
                                        </span>
                                    </div>

                                    <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                                        {title}
                                    </h2>

                                    {description && (
                                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                                            {description}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-8 grid w-full max-w-[650px] grid-cols-1 gap-3 sm:grid-cols-2">
                                    {suggestions.map((item) => {
                                        const Icon = ICONS[item.icon] || Sparkles;

                                        return (
                                            <button
                                                key={item.title}
                                                onClick={() => setPrompt(item.prompt)}
                                                className="group flex items-start gap-3.5 rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.045]"
                                            >
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconColors[item.color] || iconColors.violet
                                                        }`}
                                                >
                                                    <Icon className="h-[18px] w-[18px]" />
                                                </div>
                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <p className="text-[13px] font-medium text-slate-200 transition group-hover:text-white">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1.5 text-xs leading-5 text-slate-500">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <ArrowUp className="mt-1 h-4 w-4 rotate-45 text-slate-600 transition group-hover:text-violet-300" />
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-slate-600">
                                    <span className="flex items-center gap-1.5">
                                        <Check className="h-3 w-3 text-emerald-400/70" />
                                        Learn at your own pace
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Check className="h-3 w-3 text-emerald-400/70" />
                                        Ask anything
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Check className="h-3 w-3 text-emerald-400/70" />
                                        Grow every day
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto w-full max-w-3xl space-y-6 px-5 py-8 sm:px-8">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""
                                            }`}
                                    >
                                        {message.role !== "user" && (
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10">
                                                <Sparkles className="h-4 w-4 text-violet-300" />
                                            </div>
                                        )}

                                        <div
                                            className={`min-w-0 rounded-2xl px-5 py-4 text-sm leading-7 ${message.role === "user"
                                                ? "max-w-[85%] border border-violet-400/15 bg-violet-500/[0.13] text-slate-100"
                                                : "w-full max-w-full border border-white/[0.06] bg-white/[0.025] text-slate-300"
                                                }`}
                                        >
                                            {message.role === "assistant" ? (
                                                <div
                                                    className="prose prose-invert prose-sm max-w-none break-words
                                                    prose-headings:font-semibold prose-headings:text-slate-100
                                                    prose-headings:mt-4 prose-headings:mb-2
                                                    prose-p:my-2 prose-p:leading-7
                                                    prose-ul:my-2 prose-ol:my-2
                                                    prose-li:my-1
                                                    prose-strong:text-white
                                                    prose-code:rounded prose-code:bg-slate-800
                                                    prose-code:px-1 prose-code:py-0.5 prose-code:text-violet-300
                                                    prose-pre:overflow-x-auto prose-pre:rounded-xl
                                                    prose-pre:border prose-pre:border-white/10
                                                    prose-pre:bg-slate-950
                                                    prose-table:block prose-table:overflow-x-auto
                                                    prose-th:border prose-th:border-white/10
                                                    prose-th:px-3 prose-th:py-2
                                                    prose-td:border prose-td:border-white/10
                                                    prose-td:px-3 prose-td:py-2"
                                                >
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {message.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div className="whitespace-pre-wrap break-words">
                                                    {message.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {isLoading &&
                                    messages[messages.length - 1]?.role === "user" && (
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/10">
                                                <Sparkles className="h-4 w-4 animate-pulse text-violet-300" />
                                            </div>

                                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3 text-sm text-slate-400">
                                                তোমার AI Mentor উত্তর তৈরি করছে...
                                            </div>
                                        </div>
                                    )}

                                <div ref={bottomRef} />
                            </div>
                        )}
                    </div>

                    {/* Chat input */}
                    <div
                        className={`relative z-20 shrink-0 bg-[#080A12]/95 px-4 pb-4 pt-2 backdrop-blur-xl transition-[margin] duration-500 ease-out sm:px-7 ${messages.length === 0 ? "mb-24 sm:mb-40" : "mb-15"
                            }`}
                    >
                        <div className="mx-auto max-w-3xl">
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSend();
                                }}
                                className={`flex items-end gap-1.5 rounded-[28px] border border-white/[0.10] bg-[#10121D]/90 px-2.5 py-2 shadow-[0_12px_60px_rgba(0,0,0,0.22)] transition ${theme.focus}`}
                            >
                                <button
                                    type="button"
                                    title="Attach (coming soon)"
                                    aria-label="Attach"
                                    onClick={() => setShowNotice(true)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>

                                <textarea
                                    ref={textareaRef}
                                    value={prompt}
                                    onChange={(event) => setPrompt(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey &&
                                            !event.nativeEvent.isComposing
                                        ) {
                                            event.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    rows={1}
                                    placeholder={placeholder}
                                    className="max-h-[200px] min-h-[40px] flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600"
                                />

                                <button
                                    type="button"
                                    title="Learning mode (coming soon)"
                                    aria-label="Learning mode"
                                    onClick={() => setShowNotice(true)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                                >
                                    <Compass className="h-[18px] w-[18px]" />
                                </button>

                                <button
                                    type="submit"
                                    disabled={!prompt.trim() || isLoading}
                                    aria-label="Send message"
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100 ${theme.send}`}
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>

                            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] leading-5 text-slate-600">
                                <Sparkles className="h-3 w-3" />
                                AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}