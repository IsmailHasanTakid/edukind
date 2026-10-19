
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    BookOpen,
    BrainCircuit,
    Check,
    Code2,
    Command,
    Compass,
    GraduationCap,
    History,
    Menu,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Search,
    Send,
    Settings2,
    Sparkles,
    SquarePen,
    Trash2,
    X,
} from "lucide-react";

const suggestions = [
    {
        title: "Understand a concept",
        description: "Make difficult topics simple.",
        prompt: "Explain a difficult concept to me in simple terms.",
        icon: BookOpen,
        color: "violet",
    },
    {
        title: "Debug my code",
        description: "Find bugs and understand why.",
        prompt: "Help me debug my code and explain the solution.",
        icon: Code2,
        color: "cyan",
    },
    {
        title: "Solve a problem",
        description: "Break problems into small steps.",
        prompt: "Help me solve a problem step by step.",
        icon: BrainCircuit,
        color: "amber",
    },
    {
        title: "Plan my learning",
        description: "Build a learning path for me.",
        prompt: "Help me create a personalized learning roadmap.",
        icon: GraduationCap,
        color: "pink",
    },
];

const initialChats = [
    "Understanding JavaScript closures",
    "My React learning roadmap",
    "How does the internet work?",
    "Data structures made simple",
];

const iconColors = {
    violet: "text-violet-300 bg-violet-400/10 border-violet-400/15",
    cyan: "text-cyan-300 bg-cyan-400/10 border-cyan-400/15",
    amber: "text-amber-300 bg-amber-400/10 border-amber-400/15",
    pink: "text-pink-300 bg-pink-400/10 border-pink-400/15",
};

export default function AskAIMentorPage() {
    const [prompt, setPrompt] = useState("");
    const [chats, setChats] = useState(initialChats);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showNotice, setShowNotice] = useState(false);

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

    function handleSend(value = prompt) {
        const text = value.trim();
        if (!text) return;

        const title = text.length > 34 ? `${text.slice(0, 34)}...` : text;

        setMessages((previous) => [
            ...previous,
            { id: Date.now(), text, role: "user" },
        ]);

        if (!activeChat) {
            setActiveChat(title);
            setChats((previous) => [title, ...previous]);
        }

        setPrompt("");
        setShowNotice(true);
    }

    const filteredChats = chats.filter((chat) =>
        chat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="relative flex h-[100dvh] overflow-hidden bg-[#080A12] text-slate-100 selection:bg-violet-500/30">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-48 left-[38%] h-[440px] w-[440px] rounded-full bg-violet-700/[0.12] blur-[140px]" />
                <div className="absolute bottom-[-200px] right-[8%] h-[400px] w-[400px] rounded-full bg-cyan-600/[0.07] blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
            </div>

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
                className={`fixed inset-y-0 left-0 z-50 flex w-[285px] flex-col border-r border-white/[0.07] bg-[#0B0D17]/95 backdrop-blur-2xl transition-transform duration-300 lg:relative lg:z-10 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Brand */}
                <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 shadow-[0_0_25px_rgba(139,92,246,0.12)]">
                            <Sparkles className="h-5 w-5 text-violet-200" />
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0B0D17] bg-cyan-300" />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold tracking-[0.18em] text-white">
                                EDUKIND
                            </p>
                            <p className="mt-0.5 text-[10px] tracking-[0.2em] text-slate-500">
                                AI LEARNING SPACE
                            </p>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Sidebar actions */}
                <div className="space-y-2 px-4 pt-5">
                    <button
                        onClick={startNewChat}
                        className="group flex w-full items-center justify-between rounded-xl border border-violet-400/25 bg-gradient-to-r from-violet-500/15 to-indigo-500/[0.08] px-3.5 py-3 text-sm font-medium text-white transition hover:border-violet-300/40 hover:from-violet-500/25"
                    >
                        <span className="flex items-center gap-2.5">
                            <SquarePen className="h-4 w-4 text-violet-300" />
                            New conversation
                        </span>
                        <Plus className="h-4 w-4 text-violet-300 transition group-hover:rotate-90" />
                    </button>

                    <button
                        onClick={() => setSearchOpen((open) => !open)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100"
                    >
                        <Search className="h-4 w-4" />
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
                            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none placeholder:text-slate-600 focus:border-violet-400/40"
                        />
                    )}
                </div>


                <div className="mt-8 flex-1 overflow-y-auto px-4">
                    <div className="mb-3 flex items-center justify-between px-2">
                        <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                            RECENT CONVERSATIONS
                        </p>
                        <History className="h-3.5 w-3.5 text-slate-600" />
                    </div>

                    <div className="space-y-1">
                        {filteredChats.map((chat, index) => (
                            <button
                                key={`${chat}-${index}`}
                                onClick={() => selectChat(chat)}
                                className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] transition ${activeChat === chat
                                    ? "bg-violet-400/10 text-violet-100"
                                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                    }`}
                            >
                                <MessageCircle className="h-4 w-4 shrink-0 text-slate-500" />
                                <span className="min-w-0 flex-1 truncate">{chat}</span>
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


                <div className="shrink-0 border-t border-white/[0.06] p-4">
                    <Link
                        href="/mentor"
                        className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Mentor home
                    </Link>

                    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-xs font-bold text-white">
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
                        <Settings2 className="h-4 w-4 text-slate-500" />
                    </div>
                </div>
            </aside>

            {/* Main workspace */}
            <section className="relative z-10 flex min-w-0 flex-1 flex-col">
                {/* Top bar */}
                <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4 sm:px-7">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg border border-white/[0.08] p-2 text-slate-400 hover:bg-white/5 lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <Menu className="h-4 w-4" />
                        </button>

                        <div className="min-w-0">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="hidden sm:inline">EDUKIND</span>
                                <span className="hidden sm:inline text-slate-700">/</span>
                                <span className="truncate">AI Mentor</span>
                            </div>
                            <h1 className="mt-1 truncate text-sm font-semibold text-slate-100">
                                {activeChat || "New conversation"}
                            </h1>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-3 py-1.5 sm:flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] text-emerald-300/90">
                                UI Preview
                            </span>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 sm:px-3">
                            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
                            <span className="text-[10px] font-medium text-slate-300 sm:text-xs">
                                EDUKIND AI
                            </span>
                        </div>

                        <button
                            aria-label="More options"
                            className="hidden rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white sm:block"
                        >
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col">
                    <div className="flex-1 overflow-y-auto">
                        {messages.length === 0 ? (
                            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col items-center justify-start px-5 pt-8 pb-6 sm:px-6 sm:pt-10">

                                <div className="mb-3 flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1.5">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300" />
                                    <span className="text-[10px] font-medium tracking-[0.13em] text-violet-200">
                                        YOUR PERSONAL AI MENTOR
                                    </span>
                                </div>
                                <div className="mt-10 grid w-full max-w-[650px] grid-cols-1 gap-3 sm:grid-cols-2">
                                    {suggestions.map((item) => {
                                        const Icon = item.icon;

                                        return (
                                            <button
                                                key={item.title}
                                                onClick={() => setPrompt(item.prompt)}
                                                className="group flex items-start gap-3.5 rounded-2xl border border-white/[0.075] bg-white/[0.025] p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-white/[0.045]"
                                            >
                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${iconColors[item.color]
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
                                                <ArrowUp
                                                    className="mt-1 h-4 w-4 rotate-45 text-slate-600 transition group-hover:text-violet-300"
                                                />
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
                                            className={`max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-7 ${message.role === "user"
                                                ? "border border-violet-400/15 bg-violet-500/[0.13] text-slate-100"
                                                : "border border-white/[0.06] bg-white/[0.025] text-slate-300"
                                                }`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                ))}

                                {showNotice && (
                                    <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-4 text-xs leading-6 text-amber-200/80">
                                        <div className="mb-1 flex items-center gap-2 font-medium">
                                            <Sparkles className="h-4 w-4" />
                                            UI preview only
                                        </div>
                                        Your message is displayed, but AI responses are not
                                        connected yet. We will connect the Gemini API in the next
                                        step.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                    <div className="relative z-20 mb-10 shrink-0 bg-[#080A12]/95 px-4 pb-3 pt-1 backdrop-blur-xl sm:mb-14 sm:px-7 sm:pb-4">
                        <div className="mx-auto max-w-3xl">
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    handleSend();
                                }}
                                className="group relative rounded-[22px] border border-white/[0.10] bg-[#10121D]/90 p-2 shadow-[0_12px_60px_rgba(0,0,0,0.22)] transition focus-within:border-violet-400/35 focus-within:shadow-[0_0_35px_rgba(139,92,246,0.07)]"
                            >
                                <textarea
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
                                    rows={2}
                                    placeholder="Ask your mentor anything..."
                                    className="max-h-40 min-h-[60px] w-full resize-y bg-transparent px-3 py-3 text-sm leading-6 text-slate-100 outline-none placeholder:text-slate-600 sm:px-4"
                                />

                                <div className="flex items-center justify-between gap-2 px-1 pb-1 sm:px-2">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            title="Coming soon"
                                            onClick={() => setShowNotice(true)}
                                            className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-2.5 py-2 text-[10px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 sm:text-xs"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            <span>Attach</span>
                                        </button>

                                        <button
                                            type="button"
                                            title="Coming soon"
                                            onClick={() => setShowNotice(true)}
                                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 sm:text-xs"
                                        >
                                            <Compass className="h-3.5 w-3.5" />
                                            <span>Learning mode</span>
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!prompt.trim()}
                                        aria-label="Send message"
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_3px_18px_rgba(139,92,246,0.24)] transition hover:scale-105 hover:shadow-[0_3px_25px_rgba(139,92,246,0.4)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:scale-100"
                                    >
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
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
