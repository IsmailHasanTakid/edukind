
"use client";

import Link from "next/link";
import {
    LibraryBig,
    NotebookPen,
    FileCode2,
    GraduationCap,
    Network,
    BookOpenText,
    ArrowUpRight,
    Search,
    Sparkles,
    Compass,
} from "lucide-react";
import { useMemo, useState } from "react";

const learningCards = [
    {
        title: "Knowledge Library",
        description:
            "এক জায়গায় খুঁজে নাও programming documentation, tutorials এবং দরকারি learning resources।",
        category: "RESOURCES",
        icon: LibraryBig,
        href: "/learning/library",
        color: "violet",
        tags: ["Resources", "Tutorials"],
    },
    {
        title: "Study Notes",
        description:
            "গুরুত্বপূর্ণ concepts, সহজ বাংলা ব্যাখ্যা এবং পরীক্ষার প্রস্তুতির নোট গুছিয়ে রাখো।",
        category: "STUDY",
        icon: NotebookPen,
        href: "/learning/notes",
        color: "cyan",
        tags: ["Notes", "Revision"],
    },
    {
        title: "Cheat Sheets",
        description:
            "JavaScript, React, Git, SQL এবং অন্যান্য প্রযুক্তির দরকারি syntax দ্রুত দেখে নাও।",
        category: "QUICK REFERENCE",
        icon: FileCode2,
        href: "/learning/cheatsheets",
        color: "amber",
        tags: ["Code", "Reference"],
    },
    {
        title: "University Companion",
        description:
            "CSE subjects, lab concepts, viva questions এবং academic resources এক জায়গায় রাখো।",
        category: "ACADEMICS",
        icon: GraduationCap,
        href: "/learning/university",
        color: "emerald",
        tags: ["CSE", "University"],
    },
    {
        title: "Concept Maps",
        description:
            "বিভিন্ন concept-এর মধ্যে সম্পর্ক বুঝতে visual learning map ব্যবহার করো।",
        category: "VISUAL LEARNING",
        icon: Network,
        href: "/learning/concept-maps",
        color: "pink",
        tags: ["Visual", "Concepts"],
    },
    {
        title: "Tech Insights",
        description:
            "Programming, software engineering এবং নতুন technology সম্পর্কে শেখো।",
        category: "EXPLORE",
        icon: BookOpenText,
        href: "/learning/insights",
        color: "blue",
        tags: ["Technology", "Articles"],
    },
];

const colorStyles = {
    violet: {
        icon: "bg-violet-500/10 text-violet-400 ring-violet-500/20",
        glow: "group-hover:border-violet-400/30",
        orb: "bg-violet-500/10",
    },
    cyan: {
        icon: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
        glow: "group-hover:border-cyan-400/30",
        orb: "bg-cyan-500/10",
    },
    amber: {
        icon: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
        glow: "group-hover:border-amber-400/30",
        orb: "bg-amber-500/10",
    },
    emerald: {
        icon: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
        glow: "group-hover:border-emerald-400/30",
        orb: "bg-emerald-500/10",
    },
    pink: {
        icon: "bg-pink-500/10 text-pink-400 ring-pink-500/20",
        glow: "group-hover:border-pink-400/30",
        orb: "bg-pink-500/10",
    },
    blue: {
        icon: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
        glow: "group-hover:border-blue-400/30",
        orb: "bg-blue-500/10",
    },
};

export default function LearningPage() {
    const [search, setSearch] = useState("");

    const filteredCards = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return learningCards;

        return learningCards.filter((card) =>
            [
                card.title,
                card.description,
                card.category,
                ...card.tags,
            ]
                .join(" ")
                .toLowerCase()
                .includes(query)
        );
    }, [search]);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080b14] text-white">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-violet-600/[0.10] blur-[120px]" />
                <div className="absolute top-72 -right-40 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.055)_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
            </div>

            <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
                {/* Breadcrumb */}
                <div className="mb-8 flex items-center gap-2 text-sm text-slate-400">
                    <Compass size={16} className="text-violet-400" />
                    <span>EDUKIND</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-200">Learning</span>
                </div>

                {/* Hero */}
                <section className="mb-12 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-2 text-xs font-semibold tracking-[0.16em] text-violet-300">
                        <Sparkles size={14} />
                        YOUR LEARNING SPACE
                    </div>

                    <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-5xl">
                        Learn something extraordinary.
                    </h1>

                    <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                        তোমার শেখার সবকিছু এখন এক জায়গায়। নতুন concept
                        শেখো, দরকারি resources খুঁজে নাও এবং নিজের learning
                        journey-কে আরও সহজ করে তোলো।
                    </p>
                </section>

                {/* Search */}
                <section className="mb-8">
                    <div className="relative max-w-xl">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="কী শিখতে চাও? Search learning resources..."
                            aria-label="Search learning categories"
                            className="h-14 w-full rounded-2xl border border-white/[0.09] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400/50 focus:bg-white/[0.05] focus:ring-4 focus:ring-violet-400/[0.07]"
                        />
                    </div>
                </section>

                {/* Section heading */}
                <section>
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-cyan-400">
                                EXPLORE & DISCOVER
                            </p>
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Learning spaces
                            </h2>
                            <p className="mt-2 text-sm text-slate-400">
                                তোমার প্রয়োজন অনুযায়ী একটি বিভাগ বেছে নাও।
                            </p>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">
                            {filteredCards.length} categories
                        </span>
                    </div>

                    {/* Cards */}
                    {filteredCards.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredCards.map((card, index) => {
                                const Icon = card.icon;
                                const styles = colorStyles[card.color];

                                return (
                                    <Link
                                        key={card.href}
                                        href={card.href}
                                        className={`group relative flex min-h-[255px] flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045] sm:p-7 ${styles.glow}`}
                                    >
                                        <div
                                            className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition duration-500 group-hover:scale-150 ${styles.orb}`}
                                        />

                                        <div className="relative flex items-start justify-between gap-3">
                                            <div
                                                className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 ${styles.icon}`}
                                            >
                                                <Icon size={23} strokeWidth={1.8} />
                                            </div>

                                            <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[9px] font-semibold tracking-[0.13em] text-slate-400">
                                                {card.category}
                                            </span>
                                        </div>

                                        <div className="relative mt-6 flex-1">
                                            <h3 className="text-xl font-semibold tracking-tight text-slate-100 transition group-hover:text-white">
                                                {card.title}
                                            </h3>

                                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                                {card.description}
                                            </p>
                                        </div>

                                        <div className="relative mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                                            <span className="text-sm font-medium text-slate-300 transition group-hover:text-white">
                                                Explore resources
                                            </span>
                                            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.09] text-slate-400 transition group-hover:border-white/20 group-hover:bg-white/[0.07] group-hover:text-white">
                                                <ArrowUpRight size={17} />
                                            </span>
                                        </div>

                                        <span className="sr-only">
                                            Open {card.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] px-5 py-14 text-center">
                            <Search
                                size={28}
                                className="mx-auto mb-4 text-slate-500"
                            />
                            <h3 className="text-lg font-semibold">
                                কোনো বিভাগ পাওয়া যায়নি
                            </h3>
                            <p className="mt-2 text-sm text-slate-400">
                                অন্য কোনো keyword দিয়ে আবার খোঁজ করো।
                            </p>
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </section>

                {/* Bottom note */}
                <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-violet-400/15 bg-violet-400/[0.035] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-xl bg-violet-400/10 p-2 text-violet-300">
                            <Sparkles size={18} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-100">
                                শেখা হোক নিজের গতিতে
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                একটি বিষয় বেছে নাও, ছোট ছোট ধাপে শেখো এবং
                                অনুশীলনের মাধ্যমে দক্ষতা বাড়াও।
                            </p>
                        </div>
                    </div>

                    <span className="shrink-0 text-xs font-medium tracking-wide text-violet-300">
                        KEEP LEARNING →
                    </span>
                </div>
            </div>
        </main>
    );
}
