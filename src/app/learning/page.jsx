"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Instrument_Serif, Hind_Siliguri } from "next/font/google";
import {
    ArrowUpRight,
    BookOpen,
    BookOpenText,
    Bookmark,
    Brain,
    CheckCircle2,
    Code2,
    Compass,
    GraduationCap,
    Layers3,
    LibraryBig,
    Network,
    Search,
    Sparkles,
    Star,
    Terminal,
    X,
} from "lucide-react";

const serif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
});
const sans = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600"],
});

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const categories = [
    {
        title: "Knowledge Library",
        description: "Documentation, tutorials & trusted resources",
        detail: "Explore resources",
        href: "/learning/library",
        icon: LibraryBig,
        color: "text-violet-200",
        tile: "from-violet-400/30 to-violet-600/10 ring-violet-300/30",
        rgb: "139,92,246",
        tag: "Library",
    },
    {
        title: "Study Notes",
        description: "Simplified concepts and revision notes",
        detail: "Browse notes",
        href: "/learning/notes",
        icon: BookOpenText,
        color: "text-cyan-200",
        tile: "from-cyan-400/30 to-cyan-600/10 ring-cyan-300/30",
        rgb: "34,211,238",
        tag: "Notes",
    },
    {
        title: "Cheat Sheets",
        description: "Syntax, commands and quick references",
        detail: "Quick reference",
        href: "/learning/cheatsheets",
        icon: Terminal,
        color: "text-amber-200",
        tile: "from-amber-400/30 to-amber-600/10 ring-amber-300/30",
        rgb: "251,191,36",
        tag: "Tools",
    },
    {
        title: "University Companion",
        description: "CSE subjects, labs and viva preparation",
        detail: "Explore subjects",
        href: "/learning/university",
        icon: GraduationCap,
        color: "text-emerald-200",
        tile: "from-emerald-400/30 to-emerald-600/10 ring-emerald-300/30",
        rgb: "52,211,153",
        tag: "University",
    },
    {
        title: "Concept Maps",
        description: "Understand how ideas connect together",
        detail: "Explore concepts",
        href: "/learning/concept-maps",
        icon: Network,
        color: "text-pink-200",
        tile: "from-pink-400/30 to-pink-600/10 ring-pink-300/30",
        rgb: "244,114,182",
        tag: "Concepts",
    },
    {
        title: "Tech Insights",
        description: "Discover ideas across modern technology",
        detail: "Read insights",
        href: "/learning/insights",
        icon: Brain,
        color: "text-sky-200",
        tile: "from-sky-400/30 to-sky-600/10 ring-sky-300/30",
        rgb: "56,189,248",
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
        color: "text-amber-200",
        tile: "from-amber-400/30 to-amber-600/10 ring-amber-300/30",
        rgb: "251,191,36",
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
        color: "text-cyan-200",
        tile: "from-cyan-400/30 to-cyan-600/10 ring-cyan-300/30",
        rgb: "34,211,238",
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
        color: "text-violet-200",
        tile: "from-violet-400/30 to-violet-600/10 ring-violet-300/30",
        rgb: "139,92,246",
        source: "GitHub Docs",
        href: "https://docs.github.com/en/get-started",
    },
];

const filterTabs = ["All", "Beginner", "JavaScript", "React", "Developer Tools"];

/* Wide cards in the bento grid (lg: 3 columns) */
const WIDE = new Set([0, 3, 5]);

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Cursor-following spotlight: writes the pointer position into CSS vars
const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Spotlight = ({ rgb, strength = 0.16 }) => (
    <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(${rgb},${strength}), transparent 45%)`,
        }}
    />
);

const Spark = ({ rgb }) => (
    <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
            padding: 1,
            background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(${rgb},0.85), transparent 60%)`,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
        }}
    />
);

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LearningPage() {
    const [search, setSearch] = useState("");
    const [selectedTab, setSelectedTab] = useState("All");
    const [bookmarked, setBookmarked] = useState([]);

    const toggleBookmark = (title, e) => {
        e.preventDefault();
        e.stopPropagation();
        setBookmarked((prev) =>
            prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
        );
    };

    // Ctrl/Cmd + K focuses search
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                document.getElementById("learning-search-input")?.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const filteredCategories = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return categories;
        return categories.filter((i) =>
            `${i.title} ${i.description} ${i.tag}`.toLowerCase().includes(q)
        );
    }, [search]);

    const filteredResources = useMemo(() => {
        const q = search.trim().toLowerCase();
        return resources.filter((i) => {
            const okQuery =
                !q ||
                `${i.title} ${i.description} ${i.category} ${i.source}`
                    .toLowerCase()
                    .includes(q);
            const okTab =
                selectedTab === "All" || i.level === selectedTab || i.category === selectedTab;
            return okQuery && okTab;
        });
    }, [search, selectedTab]);

    const savedItems = resources.filter((r) => bookmarked.includes(r.title));

    return (
        <main
            className={`${sans.className} relative min-h-screen overflow-hidden bg-[#05060b] text-white selection:bg-violet-500/40 selection:text-white`}
        >
            {/* ---------- Keyframes (scoped to this page) ---------- */}
            <style>{`
                @keyframes lp-float-a { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(60px,40px,0) scale(1.15)} }
                @keyframes lp-float-b { 0%,100%{transform:translate3d(0,0,0) scale(1)} 50%{transform:translate3d(-70px,50px,0) scale(1.1)} }
                @keyframes lp-spin { to { transform: rotate(360deg) } }
                @keyframes lp-spin-rev { to { transform: rotate(-360deg) } }
                @keyframes lp-rise { from{opacity:0; transform:translateY(22px); filter:blur(8px)} to{opacity:1; transform:none; filter:none} }
                @keyframes lp-shine { to { background-position: 200% center } }
                .lp-rise { opacity:0; animation: lp-rise .9s cubic-bezier(.2,.7,.2,1) forwards; }
                .lp-shine-text { background-size: 200% auto; animation: lp-shine 6s linear infinite; }
                .lp-noscroll::-webkit-scrollbar{display:none}
                .lp-noscroll{scrollbar-width:none}
                @media (prefers-reduced-motion: reduce) {
                    .lp-rise,.lp-shine-text,.lp-anim{animation:none!important; opacity:1!important; filter:none!important; transform:none}
                }
            `}</style>

            {/* ---------- Atmosphere ---------- */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className="lp-anim absolute -left-40 -top-48 h-[620px] w-[620px] rounded-full bg-violet-600/25 blur-[150px]"
                    style={{ animation: "lp-float-a 22s ease-in-out infinite" }}
                />
                <div
                    className="lp-anim absolute -right-40 top-[180px] h-[560px] w-[560px] rounded-full bg-cyan-500/15 blur-[150px]"
                    style={{ animation: "lp-float-b 26s ease-in-out infinite" }}
                />
                <div
                    className="lp-anim absolute bottom-[-200px] left-[30%] h-[480px] w-[480px] rounded-full bg-pink-500/10 blur-[150px]"
                    style={{ animation: "lp-float-a 30s ease-in-out infinite" }}
                />
                {/* fine grid, fading out toward the bottom */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_30%,transparent_80%)]" />
                {/* film grain */}
                <div
                    className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                    }}
                />
            </div>

            <div className="relative mx-auto max-w-[1360px] px-5 pb-10 pt-8 sm:px-8 lg:px-12">
                {/* ---------- Breadcrumb ---------- */}
                <nav
                    aria-label="Breadcrumb"
                    className="lp-rise inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 text-xs text-slate-400 backdrop-blur-xl"
                >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-cyan-400 text-[#05060b]">
                        <Compass size={13} strokeWidth={2.4} />
                    </span>
                    <span className="font-medium text-slate-200">Edukind</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-300">Learning</span>
                </nav>

                {/* ---------- Hero ---------- */}
                <section className="relative grid items-center gap-12 pb-14 pt-12 lg:grid-cols-[1.25fr_1fr] lg:gap-6 lg:pb-20 lg:pt-16">
                    <div>
                        <div
                            className="lp-rise inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-400/10 px-3.5 py-1.5 text-xs text-violet-200 backdrop-blur-md"
                            style={{ animationDelay: "80ms" }}
                        >
                            <Sparkles size={13} />
                            Your personal learning space
                        </div>

                        <h1
                            className={`${serif.className} lp-rise mt-6 text-[52px] leading-[0.98] tracking-[-0.02em] sm:text-[80px] lg:text-[104px]`}
                            style={{ animationDelay: "160ms" }}
                        >
                            Make room
                            <br />
                            <span className="lp-shine-text bg-gradient-to-r from-violet-300 via-white to-cyan-300 bg-clip-text italic text-transparent">
                                for curiosity.
                            </span>
                        </h1>

                        <p
                            className="lp-rise mt-7 max-w-[34rem] text-[15px] leading-8 text-slate-400 sm:text-[17px]"
                            style={{ animationDelay: "260ms" }}
                        >
                            শেখার জন্য যা কিছু দরকার, সব এক জায়গায়। নতুন বিষয় আবিষ্কার করো,
                            জটিল ধারণা সহজে বোঝো এবং নিজের গতিতে সামনে এগিয়ে যাও।
                        </p>

                        {/* quick stats from real data */}
                        <div
                            className="lp-rise mt-9 flex flex-wrap items-center gap-3"
                            style={{ animationDelay: "340ms" }}
                        >
                            {[
                                { n: categories.length, l: "learning spaces" },
                                { n: resources.length, l: "featured resources" },
                                { n: bookmarked.length, l: "saved by you" },
                            ].map((s) => (
                                <div
                                    key={s.l}
                                    className="flex items-baseline gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl"
                                >
                                    <span className={`${serif.className} text-3xl leading-none text-white`}>
                                        {s.n}
                                    </span>
                                    <span className="text-xs text-slate-400">{s.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Orbit visual — the one memorable moment */}
                    <div
                        className="lp-rise relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center"
                        style={{ animationDelay: "300ms" }}
                    >
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)]" />

                        {/* rings */}
                        <div className="absolute inset-[6%] rounded-full border border-white/[0.08]" />
                        <div className="absolute inset-[22%] rounded-full border border-dashed border-white/[0.12]" />
                        <div className="absolute inset-[38%] rounded-full border border-white/[0.08]" />

                        {/* outer orbit */}
                        <div
                            className="lp-anim absolute inset-[6%]"
                            style={{ animation: "lp-spin 38s linear infinite" }}
                        >
                            {[
                                { a: 0, Icon: Code2, c: "text-amber-200" },
                                { a: 120, Icon: Brain, c: "text-sky-200" },
                                { a: 240, Icon: Network, c: "text-pink-200" },
                            ].map(({ a, Icon, c }) => (
                                <div
                                    key={a}
                                    className="absolute inset-0"
                                    style={{ transform: `rotate(${a}deg)` }}
                                >
                                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                        <span
                                            className={`lp-anim flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[#0b0d17]/80 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl ${c}`}
                                            style={{
                                                animation: "lp-spin-rev 38s linear infinite",
                                                transform: `rotate(${-a}deg)`,
                                            }}
                                        >
                                            <Icon size={20} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* inner orbit */}
                        <div
                            className="lp-anim absolute inset-[22%]"
                            style={{ animation: "lp-spin-rev 26s linear infinite" }}
                        >
                            {[
                                { a: 60, Icon: BookOpenText, c: "text-cyan-200" },
                                { a: 240, Icon: GraduationCap, c: "text-emerald-200" },
                            ].map(({ a, Icon, c }) => (
                                <div
                                    key={a}
                                    className="absolute inset-0"
                                    style={{ transform: `rotate(${a}deg)` }}
                                >
                                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                                        <span
                                            className={`lp-anim flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0b0d17]/80 backdrop-blur-xl ${c}`}
                                            style={{
                                                animation: "lp-spin 26s linear infinite",
                                                transform: `rotate(${-a}deg)`,
                                            }}
                                        >
                                            <Icon size={17} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* core */}
                        <div className="relative flex h-[30%] w-[30%] flex-col items-center justify-center rounded-full border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.02] text-center shadow-[0_0_80px_rgba(139,92,246,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl">
                            <Sparkles size={22} className="text-violet-200" />
                            <span className={`${serif.className} mt-1 text-[15px] leading-tight text-white sm:text-lg`}>
                                Learn
                                <br />
                                <span className="italic text-slate-300">with purpose</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* ---------- Sticky search + filters ---------- */}
                <section className="sticky top-3 z-30">
                    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0a0c16]/70 p-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-[440px]">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                id="learning-search-input"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search topics, notes, or resources"
                                aria-label="Search learning content"
                                className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-20 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/60 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(139,92,246,0.12)]"
                            />
                            {search ? (
                                <button
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
                                >
                                    <X size={15} />
                                </button>
                            ) : (
                                <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-medium text-slate-400 sm:flex">
                                    Ctrl K
                                </kbd>
                            )}
                        </div>

                        <div className="lp-noscroll flex items-center gap-1.5 overflow-x-auto px-0.5 sm:px-0">
                            {filterTabs.map((tab) => {
                                const active = selectedTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        aria-pressed={active}
                                        className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-medium transition duration-300 ${active
                                            ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_8px_24px_-6px_rgba(139,92,246,0.7)]"
                                            : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ---------- Content ---------- */}
                <div className="grid gap-12 pb-6 pt-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
                    <div className="min-w-0">
                        {/* Learning spaces — bento */}
                        <section>
                            <div className="mb-7 flex items-end justify-between gap-4">
                                <h2 className={`${serif.className} text-4xl tracking-tight sm:text-5xl`}>
                                    Learning <span className="italic text-slate-400">spaces</span>
                                </h2>
                                <span className="pb-2 text-xs text-slate-500">
                                    {filteredCategories.length} of {categories.length}
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-flow:dense]">
                                {filteredCategories.map((item, idx) => {
                                    const Icon = item.icon;
                                    const wide = !search && WIDE.has(idx);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onMouseMove={spot}
                                            className={`group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_30px_80px_-30px_rgba(${item.rgb},0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${wide ? "lg:col-span-2" : ""
                                                }`}
                                        >
                                            <Spotlight rgb={item.rgb} />
                                            <Spark rgb={item.rgb} />

                                            {/* corner glow */}
                                            <span
                                                aria-hidden
                                                className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-60 blur-3xl transition duration-700 group-hover:opacity-100"
                                                style={{ background: `rgba(${item.rgb},0.14)` }}
                                            />

                                            <div className="relative flex items-start justify-between">
                                                <span
                                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition duration-500 group-hover:scale-110 group-hover:-rotate-3 ${item.tile} ${item.color}`}
                                                >
                                                    <Icon size={24} strokeWidth={1.7} />
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
                                                        {item.tag}
                                                    </span>
                                                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition duration-500 group-hover:rotate-0 group-hover:border-white/30 group-hover:bg-white group-hover:text-[#05060b]">
                                                        <ArrowUpRight size={16} />
                                                    </span>
                                                </span>
                                            </div>

                                            <div className="relative mt-10">
                                                <h3 className={`${serif.className} text-[28px] leading-tight text-white`}>
                                                    {item.title}
                                                </h3>
                                                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                                                    {item.description}
                                                </p>
                                                <span className={`mt-4 inline-block text-xs font-medium ${item.color} opacity-70 transition group-hover:opacity-100`}>
                                                    {item.detail}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {filteredCategories.length === 0 && (
                                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-slate-400">
                                    কোনো ক্যাটাগরি খুঁজে পাওয়া যায়নি।
                                </div>
                            )}
                        </section>

                        {/* Featured resources */}
                        <section className="mt-20">
                            <div className="mb-7 flex items-end justify-between gap-3">
                                <h2 className={`${serif.className} text-4xl tracking-tight sm:text-5xl`}>
                                    Featured <span className="italic text-slate-400">resources</span>
                                </h2>
                                <BookOpen size={20} className="mb-2 text-slate-500" />
                            </div>

                            <div className="grid gap-4">
                                {filteredResources.map((item) => {
                                    const Icon = item.icon;
                                    const isSaved = bookmarked.includes(item.title);
                                    return (
                                        <article
                                            key={item.title}
                                            onMouseMove={spot}
                                            className="group relative flex gap-5 overflow-hidden rounded-3xl border border-white/[0.09] bg-gradient-to-r from-white/[0.05] to-white/[0.015] p-5 backdrop-blur-xl transition duration-500 hover:border-white/20 sm:p-6"
                                        >
                                            <Spotlight rgb={item.rgb} strength={0.12} />
                                            <Spark rgb={item.rgb} />

                                            {/* whole-card link */}
                                            <a
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${item.title} — ${item.source}`}
                                                className="absolute inset-0 z-10 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                                            />

                                            <span
                                                className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ${item.tile} ${item.color}`}
                                            >
                                                <Icon size={24} strokeWidth={1.7} />
                                            </span>

                                            <div className="relative min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <h3 className={`${serif.className} text-2xl text-white`}>
                                                        {item.title}
                                                    </h3>
                                                    <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-200">
                                                        {item.level}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                                    {item.description}
                                                </p>
                                                <p className="mt-4 text-xs text-slate-500">
                                                    <span className="font-medium text-slate-300">{item.source}</span>
                                                    <span className="mx-2 text-slate-700">|</span>
                                                    {item.time}
                                                </p>
                                            </div>

                                            <div className="relative z-20 flex flex-col items-end justify-between">
                                                <button
                                                    onClick={(e) => toggleBookmark(item.title, e)}
                                                    aria-pressed={isSaved}
                                                    aria-label={isSaved ? "Remove from saved" : "Save resource"}
                                                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition duration-300 ${isSaved
                                                        ? "scale-105 border-amber-300/40 bg-amber-300/15 text-amber-300 shadow-[0_0_30px_-4px_rgba(251,191,36,0.6)]"
                                                        : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/25 hover:text-white"
                                                        }`}
                                                >
                                                    <Star size={16} fill={isSaved ? "currentColor" : "none"} />
                                                </button>
                                                <span className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition duration-500 group-hover:border-white/30 group-hover:bg-white group-hover:text-[#05060b]">
                                                    <ArrowUpRight size={16} />
                                                </span>
                                            </div>
                                        </article>
                                    );
                                })}

                                {filteredResources.length === 0 && (
                                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-12 text-center text-slate-400">
                                        এই ফিল্টারের সঙ্গে মেলে এমন কোনো রিসোর্স পাওয়া যায়নি।
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* ---------- Sidebar ---------- */}
                    <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                        {/* Tip */}
                        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-xl">
                            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
                            <div className="relative flex items-center gap-2 text-xs font-medium text-violet-200">
                                <Sparkles size={15} />
                                Learning tip
                            </div>
                            <h3 className={`${serif.className} relative mt-4 text-3xl leading-[1.1] text-white`}>
                                Don&apos;t just read.
                                <br />
                                <span className="italic text-slate-400">Understand and build.</span>
                            </h3>
                            <p className="relative mt-4 text-[13px] leading-relaxed text-slate-400">
                                নতুন কোনো concept শেখার পর ছোট একটি example নিজে তৈরি করো। প্র্যাকটিস করলে শেখা আরও দীর্ঘস্থায়ী হবে।
                            </p>
                            <div className="relative mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-400">
                                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                                Learn, practice, reflect
                            </div>
                        </section>

                        {/* Saved */}
                        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-200">
                                    <Star size={15} className="text-amber-300" />
                                    Saved resources
                                </h3>
                                <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-[11px] text-slate-400">
                                    {savedItems.length}
                                </span>
                            </div>
                            {savedItems.length === 0 ? (
                                <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                                    কোনো রিসোর্সের তারকা চিহ্নে ক্লিক করলে সেটি এখানে জমা হবে।
                                </p>
                            ) : (
                                <ul className="mt-4 space-y-2">
                                    {savedItems.map((s) => (
                                        <li key={s.title}>
                                            <a
                                                href={s.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-slate-300 transition hover:border-white/20 hover:text-white"
                                            >
                                                <span className="truncate">{s.title}</span>
                                                <ArrowUpRight size={14} className="shrink-0 text-slate-500" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        {/* CTA */}
                        <section className="group relative overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-600/25 via-indigo-600/10 to-cyan-500/10 p-6">
                            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-400/30 blur-3xl transition duration-700 group-hover:scale-125" />
                            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                                <Bookmark size={18} />
                            </span>
                            <h3 className={`${serif.className} relative mt-5 text-3xl leading-tight text-white`}>
                                Build your knowledge base
                            </h3>
                            <p className="relative mt-3 text-[13px] leading-relaxed text-slate-300/80">
                                দরকারি resources খুঁজে বের করো এবং নিজের learning journey গুছিয়ে নাও।
                            </p>
                            <Link
                                href="/learning/library"
                                className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#05060b] shadow-[0_10px_30px_-8px_rgba(255,255,255,0.5)] transition hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060b]"
                            >
                                Open Knowledge Library
                                <ArrowUpRight size={14} />
                            </Link>
                        </section>
                    </aside>
                </div>

                {/* ---------- Footer ---------- */}
                <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span className={`${serif.className} text-lg text-slate-300`}>
                        Edukind <span className="italic text-slate-500">learning space</span>
                    </span>
                    <span>Keep exploring. Small steps, every day.</span>
                </footer>
            </div>
        </main>
    );
}