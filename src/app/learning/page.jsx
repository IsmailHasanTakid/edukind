"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    BookOpenText,
    Bookmark,
    Brain,
    CheckCircle2,
    Code2,
    Compass,
    FileText,
    GraduationCap,
    Layers3,
    LibraryBig,
    Network,
    Search,
    Sparkles,
    Terminal,
    X,
    Star,
} from "lucide-react";

const categories = [
    {
        number: "01",
        title: "Knowledge Library",
        description: "Documentation, tutorials & trusted resources",
        detail: "Explore resources",
        href: "/learning/library",
        icon: LibraryBig,
        color: "text-violet-300",
        bg: "bg-violet-400/10",
        tag: "Library",
    },
    {
        number: "02",
        title: "Study Notes",
        description: "Simplified concepts and revision notes",
        detail: "Browse notes",
        href: "/learning/notes",
        icon: BookOpenText,
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
        tag: "Notes",
    },
    {
        number: "03",
        title: "Cheat Sheets",
        description: "Syntax, commands and quick references",
        detail: "Quick reference",
        href: "/learning/cheatsheets",
        icon: Terminal,
        color: "text-amber-300",
        bg: "bg-amber-400/10",
        tag: "Tools",
    },
    {
        number: "04",
        title: "University Companion",
        description: "CSE subjects, labs and viva preparation",
        detail: "Explore subjects",
        href: "/learning/university",
        icon: GraduationCap,
        color: "text-emerald-300",
        bg: "bg-emerald-400/10",
        tag: "University",
    },
    {
        number: "05",
        title: "Concept Maps",
        description: "Understand how ideas connect together",
        detail: "Explore concepts",
        href: "/learning/concept-maps",
        icon: Network,
        color: "text-pink-300",
        bg: "bg-pink-400/10",
        tag: "Concepts",
    },
    {
        number: "06",
        title: "Tech Insights",
        description: "Discover ideas across modern technology",
        detail: "Read insights",
        href: "/learning/insights",
        icon: Brain,
        color: "text-blue-300",
        bg: "bg-blue-400/10",
        tag: "Insights",
    },
];

const resources = [
    {
        title: "JavaScript Fundamentals",
        description: "Variables, functions, arrays এবং objects-এর মূল ধারণাগুলো শেখো।",
        category: "JavaScript",
        level: "Beginner",
        time: "12 min read",
        icon: Code2,
        color: "text-amber-300",
        bg: "bg-amber-400/10",
        source: "MDN Web Docs",
        href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
    },
    {
        title: "React Documentation",
        description: "Components, props, state এবং modern React শেখার নির্ভরযোগ্য গাইড।",
        category: "React",
        level: "Beginner",
        time: "Official guide",
        icon: Layers3,
        color: "text-cyan-300",
        bg: "bg-cyan-400/10",
        source: "React",
        href: "https://react.dev/learn",
    },
    {
        title: "Git & GitHub Essentials",
        description: "Version control, commits, branches এবং collaboration-এর ভিত্তি।",
        category: "Developer Tools",
        level: "Beginner",
        time: "Quick guide",
        icon: Terminal,
        color: "text-violet-300",
        bg: "bg-violet-400/10",
        source: "GitHub Docs",
        href: "https://docs.github.com/en/get-started",
    },
];

const filterTabs = ["All", "Beginner", "JavaScript", "React", "Developer Tools"];

export default function LearningPage() {
    const [search, setSearch] = useState("");
    const [selectedTab, setSelectedTab] = useState("All");
    const [bookmarked, setBookmarked] = useState([]);

    // Toggle Bookmark
    const toggleBookmark = (title, e) => {
        e.preventDefault();
        setBookmarked((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        );
    };

    // Keyboard shortcut (Ctrl + K / Cmd + K) for search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                document.getElementById("learning-search-input")?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredCategories = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return categories;
        return categories.filter((item) =>
            `${item.title} ${item.description}`.toLowerCase().includes(query)
        );
    }, [search]);

    const filteredResources = useMemo(() => {
        const query = search.trim().toLowerCase();
        return resources.filter((item) => {
            const matchesQuery =
                !query ||
                `${item.title} ${item.description} ${item.category} ${item.source}`
                    .toLowerCase()
                    .includes(query);

            const matchesTab =
                selectedTab === "All" ||
                item.level === selectedTab ||
                item.category === selectedTab;

            return matchesQuery && matchesTab;
        });
    }, [search, selectedTab]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070910] text-white selection:bg-violet-500/30 selection:text-violet-200">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.08] blur-[160px]" />
                <div className="absolute top-[500px] -right-20 h-[450px] w-[450px] rounded-full bg-cyan-500/[0.05] blur-[160px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
            </div>

            <div className="relative mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-7 lg:px-12">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs tracking-wider text-slate-500">
                    <Compass size={14} className="text-violet-400" />
                    <span className="font-semibold text-slate-400">EDUKIND</span>
                    <span>/</span>
                    <span className="text-slate-200">Learning</span>
                </div>

                {/* Editorial hero */}
                <section className="relative grid gap-9 border-b border-white/[0.08] pb-7 pt-5 sm:pb-7 sm:pt-7 lg:grid-cols-[1fr_320px] lg:items-end lg:gap-8">
                    <div className="max-w-3xl">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.15em] text-violet-300 backdrop-blur-md">
                            <Sparkles size={13} />
                            YOUR PERSONAL LEARNING SPACE
                        </div>

                        <h1 className="text-[32px] font-bold leading-tight tracking-[-0.035em] sm:text-5xl lg:text-[64px] whitespace-nowrap">
                            Make room{" "}
                            <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
                                for curiosity.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                            শেখার জন্য যা কিছু দরকার, সব এক জায়গায়। নতুন বিষয় আবিষ্কার করো, জটিল ধারণা সহজে বোঝো এবং নিজের গতিতে সামনে এগিয়ে যাও।
                        </p>
                    </div>

                    {/* Hero Right Card with glassmorphism */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 backdrop-blur-xl transition hover:border-violet-500/30">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl group-hover:bg-violet-500/20 transition duration-500" />

                        <div className="relative flex items-center justify-between">
                            <span className="text-[11px] font-semibold tracking-wider text-slate-400">
                                A SPACE TO GROW
                            </span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                                <Sparkles size={15} />
                            </div>
                        </div>

                        <p className="relative mt-5 text-xl font-semibold tracking-tight text-white">
                            Learn with purpose.
                        </p>
                        <p className="relative mt-2 text-xs leading-relaxed text-slate-400">
                            ছোট পদক্ষেপ, পরিষ্কার ধারণা, প্রতিদিন নতুন কিছু শেখার অভ্যাস গড়ো।
                        </p>

                        <div className="relative mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-xs text-slate-400">
                            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                            <span>তোমার শেখা, তোমার নিজের গতিতে</span>
                        </div>
                    </div>
                </section>

                {/* Search & Filter Bar */}
                <section className="flex flex-col gap-4 border-b border-white/[0.08] py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-[420px]">
                        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            id="learning-search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search topics, notes, or resources... (Ctrl + K)"
                            aria-label="Search learning content"
                            className="h-12 w-full rounded-xl border border-white/[0.10] bg-white/[0.03] pl-11 pr-10 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-400/[0.08]"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setSelectedTab(tab)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition shrink-0 ${selectedTab === tab
                                    ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                                    : "border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/[0.15] hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Main Content & Sidebar Grid */}
                <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-14 lg:py-12">
                    <div className="min-w-0">
                        {/* Category List */}
                        <section>
                            <div className="mb-5 flex items-end justify-between gap-4">
                                <div>
                                    <p className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-violet-400">
                                        EXPLORE
                                    </p>
                                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        Learning spaces
                                    </h2>
                                </div>
                                <span className="pb-1 text-xs text-slate-500">
                                    {filteredCategories.length} sections
                                </span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-1">
                                {filteredCategories.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            href={item.href}
                                            key={item.href}
                                            className="group relative flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition duration-300 hover:border-violet-500/30 hover:bg-white/[0.04] sm:p-5"
                                        >
                                            <span className="hidden w-6 shrink-0 text-xs font-mono text-slate-600 sm:block">
                                                {item.number}
                                            </span>

                                            <span
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color} transition duration-300 group-hover:scale-110 shadow-inner`}
                                            >
                                                <Icon size={22} strokeWidth={1.8} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-[15px] font-medium text-slate-200 transition group-hover:text-white sm:text-base">
                                                    {item.title}
                                                </span>
                                                <span className="mt-1 block text-xs leading-relaxed text-slate-400 sm:text-sm">
                                                    {item.description}
                                                </span>
                                            </span>

                                            <span className="hidden shrink-0 text-xs text-slate-500 transition group-hover:text-violet-300 md:block">
                                                {item.detail}
                                            </span>

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-slate-400 transition duration-300 group-hover:border-violet-500/30 group-hover:bg-violet-500/10 group-hover:text-violet-300">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {filteredCategories.length === 0 && (
                                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center text-slate-400">
                                    কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি।
                                </div>
                            )}
                        </section>

                        {/* Featured Resources */}
                        <section className="mt-14">
                            <div className="mb-6 flex items-end justify-between gap-3">
                                <div>
                                    <p className="mb-1 text-[10px] font-semibold tracking-[0.2em] text-cyan-400">
                                        HANDPICKED FOR YOU
                                    </p>
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Featured resources
                                    </h2>
                                </div>
                                <BookOpen size={20} className="mb-1 text-slate-500" />
                            </div>

                            <div className="grid gap-3">
                                {filteredResources.map((item) => {
                                    const Icon = item.icon;
                                    const isBookmarked = bookmarked.includes(item.title);

                                    return (
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            key={item.title}
                                            className="group relative flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition duration-300 hover:border-cyan-500/30 hover:bg-white/[0.04] sm:p-5"
                                        >
                                            <span
                                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                                            >
                                                <Icon size={22} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <span className="text-sm font-medium text-slate-200 group-hover:text-white sm:text-base">
                                                        {item.title}
                                                    </span>
                                                    <span className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] text-slate-400 font-mono">
                                                        {item.level}
                                                    </span>
                                                </span>

                                                <span className="mt-2 block text-xs leading-relaxed text-slate-400 sm:text-sm">
                                                    {item.description}
                                                </span>

                                                <span className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                                    <span className="text-slate-400 font-medium">{item.source}</span>
                                                    <span>·</span>
                                                    <span>{item.time}</span>
                                                </span>
                                            </span>

                                            <div className="flex flex-col items-end justify-between">
                                                <button
                                                    onClick={(e) => toggleBookmark(item.title, e)}
                                                    className={`p-1.5 rounded-lg transition ${isBookmarked
                                                        ? "text-amber-400 bg-amber-400/10"
                                                        : "text-slate-500 hover:text-white hover:bg-white/[0.05]"
                                                        }`}
                                                    title="Bookmark resource"
                                                >
                                                    <Star size={16} fill={isBookmarked ? "currentColor" : "none"} />
                                                </button>

                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-slate-500 transition group-hover:border-cyan-500/30 group-hover:text-cyan-300">
                                                    <ArrowUpRight size={16} />
                                                </div>
                                            </div>
                                        </a>
                                    );
                                })}

                                {filteredResources.length === 0 && (
                                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center text-slate-400">
                                        এই ফিল্টারের সঙ্গে মেলে এমন কোনো রিসোর্স পাওয়া যায়নি।
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <aside className="space-y-6">
                        {/* Learning Tip Card */}
                        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 sm:p-6 backdrop-blur-md">
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-violet-400">
                                <Sparkles size={15} />
                                LEARNING TIP
                            </div>

                            <h3 className="mt-4 text-lg font-medium leading-snug tracking-tight text-white">
                                Don't just read. <br />
                                <span className="text-slate-400">Understand and build.</span>
                            </h3>

                            <p className="mt-3 text-xs leading-relaxed text-slate-400">
                                নতুন কোনো concept শেখার পর ছোট একটি example নিজে তৈরি করো। প্র্যাকটিস করলে শেখা আরও দীর্ঘস্থায়ী হবে।
                            </p>

                            <div className="mt-5 flex items-center gap-2 border-t border-white/[0.08] pt-4 text-xs text-slate-400">
                                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                <span>Learn · Practice · Reflect</span>
                            </div>
                        </section>

                        {/* Knowledge Library CTA Card */}
                        <section className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/[0.12] to-cyan-500/[0.04] p-5 sm:p-6">
                            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-500/20 blur-2xl" />

                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300 shadow-inner">
                                <Bookmark size={18} />
                            </div>

                            <h3 className="relative mt-4 text-base font-semibold text-white">
                                Build your knowledge base
                            </h3>

                            <p className="relative mt-2 text-xs leading-relaxed text-slate-400">
                                দরকারি resources খুঁজে বের করো এবং নিজের learning journey গুছিয়ে নাও।
                            </p>

                            <Link
                                href="/learning/library"
                                className="relative mt-5 inline-flex items-center gap-2 text-xs font-semibold text-violet-300 transition hover:text-violet-200 group"
                            >
                                Open Knowledge Library
                                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                            </Link>
                        </section>


                    </aside>
                </div>

                {/* Footer */}
                <footer className="flex flex-col gap-3 border-t border-white/[0.08] py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-mono tracking-wider">EDUKIND / LEARNING SPACE</span>
                    <span className="flex items-center gap-2">
                        Keep exploring
                        <ArrowDownRight size={14} />
                    </span>
                </footer>
            </div>
        </main>
    );
}