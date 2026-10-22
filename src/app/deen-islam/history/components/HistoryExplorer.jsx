"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    BookOpenText,
    Check,
    ChevronRight,
    Compass,
    Gem,
    History,
    Hourglass,
    LibraryBig,
    RotateCcw,
    Scale,
    Search,
    SearchX,
    ShieldCheck,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import { bangla, bnSerif, arabic, serif } from "@/lib/deen-fonts";
import {
    HERO_FEATURED_SLUG,
    MAX_RECENT_STORIES,
    RECENT_EVENT,
    RECENT_STORAGE_KEY,
    STORY_MAP,
    THEME_MAP,
    THEMES,
    formatRef,
    matchesQuery,
    toBn,
} from "../data/prophets";
import {
    ArchOutline,
    IslamicPattern,
    OrnamentDivider,
    StarSeal,
} from "./Ornaments";

const THEME_ICONS = {
    tawhid: Gem,
    patience: Hourglass,
    repentance: RotateCcw,
    justice: Scale,
    guidance: Compass,
    communities: Users,
};

const QUICK_LINKS = [
    { label: "নবী-রাসূল", href: "#explore", icon: LibraryBig },
    { label: "কুরআনি ঘটনা", href: "#quranic-events", icon: BookOpenText },
    { label: "বিষয়ভিত্তিক পাঠ", href: "#themes", icon: Compass },
    { label: "শিক্ষা ও চিন্তা", href: "#lessons", icon: Sparkles },
];

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
    });
}

function StoryCard({ story, index }) {
    const shownRefs = story.refs.slice(0, 2);
    const remainingRefs = story.refs.length - shownRefs.length;

    return (
        <Link
            href={`/deen-islam/history/${story.slug}`}
            className="group flex flex-col overflow-hidden rounded-[22px] border border-[#E2D8C2] bg-[#FFFDF8] shadow-[0_6px_24px_rgba(25,60,45,0.06)] transition duration-300 hover:-translate-y-1 hover:border-[#C6A15B]/70 hover:shadow-[0_22px_46px_rgba(25,60,45,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08B45] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F5EC] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        >
            <div className="relative h-[152px] overflow-hidden bg-[#0A3528]">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(198,161,91,0.28),transparent_52%),linear-gradient(125deg,#082D23_0%,#0C3E2E_55%,#14503C_100%)]"
                />
                <IslamicPattern
                    stroke="#EFDCA8"
                    opacity={0.13}
                    size={104}
                    className="transition duration-700 group-hover:scale-105 motion-reduce:transition-none"
                />

                <span className="absolute left-4 top-4 rounded-full border border-[#E8D6A4]/30 bg-white/10 px-3 py-1 text-xs sm:text-sm font-medium tracking-wide text-[#F4E7C1] backdrop-blur-sm">
                    {story.category}
                </span>

                <span
                    className={`${serif.className} absolute right-4 top-3 text-2xl font-semibold text-[#E8D6A4]/45`}
                >
                    {toBn(index + 1).padStart(2, "০")}
                </span>

                <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4">
                    <div>
                        <p
                            className={`${bnSerif.className} text-[22px] font-semibold leading-tight text-[#FFF9E9]`}
                        >
                            {story.name}
                            <span className="ml-1 text-sm sm:text-base font-medium text-[#E8D6A4]">
                                ({story.shortHonorific})
                            </span>
                        </p>
                        <p className="mt-1 text-xs sm:text-sm text-[#D6E3D9]/80">
                            {story.epithet}
                        </p>
                    </div>

                    <p
                        dir="rtl"
                        lang="ar"
                        className={`${arabic.className} text-[30px] leading-none text-[#E8D6A4]`}
                    >
                        {story.arabicName}
                    </p>
                </div>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D8BC79]/45 to-transparent"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3
                    className={`${bnSerif.className} text-[18px] font-semibold leading-[1.5] text-[#173D30]`}
                >
                    {story.title}
                </h3>

                <p className="mt-2 line-clamp-4 text-sm sm:text-base leading-[1.9] text-[#66756D]">
                    {story.summary}
                </p>

                <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm font-medium text-[#9A8148]">
                    {story.themes.slice(0, 3).map((themeId, index) => (
                        <span
                            key={themeId}
                            className="inline-flex items-center gap-2"
                        >
                            {index > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="h-1 w-1 rounded-full bg-[#C6A15B]/50"
                                />
                            )}
                            {THEME_MAP[themeId]?.short}
                        </span>
                    ))}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                    {shownRefs.map((ref) => (
                        <span
                            key={`${ref.s}-${ref.from}-${ref.to ?? ""}`}
                            className="rounded-md border border-[#E4DAC5] bg-[#F7F2E6] px-2 py-1 text-xs sm:text-sm font-medium text-[#7D6737]"
                        >
                            {formatRef(ref)}
                        </span>
                    ))}
                    {remainingRefs > 0 && (
                        <span className="rounded-md border border-[#E4DAC5] px-2 py-1 text-xs sm:text-sm text-[#8A928C]">
                            +{toBn(remainingRefs)}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#EEE7D7] pt-4">
                    <span
                        className={`${serif.className} text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#A08347]`}
                    >
                        Prophetic History
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D5C43] transition group-hover:gap-2.5">
                        ইতিহাস পড়ুন
                        <ArrowRight size={15} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

function RecentlyViewed({ stories }) {
    const [recentSlugs, setRecentSlugs] = useState([]);

    useEffect(() => {
        function readRecent() {
            try {
                const raw = window.localStorage.getItem(RECENT_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                const safe = Array.isArray(parsed)
                    ? parsed
                          .filter((item) => typeof item === "string")
                          .filter((slug) => STORY_MAP[slug])
                          .slice(0, MAX_RECENT_STORIES)
                    : [];

                setRecentSlugs(safe);
            } catch {
                setRecentSlugs([]);
            }
        }

        readRecent();
        window.addEventListener("storage", readRecent);
        window.addEventListener(RECENT_EVENT, readRecent);
        window.addEventListener("focus", readRecent);

        return () => {
            window.removeEventListener("storage", readRecent);
            window.removeEventListener(RECENT_EVENT, readRecent);
            window.removeEventListener("focus", readRecent);
        };
    }, []);

    const recentStories = recentSlugs
        .map((slug) => stories.find((story) => story.slug === slug))
        .filter(Boolean);

    if (recentStories.length === 0) return null;

    function clearRecent() {
        try {
            window.localStorage.removeItem(RECENT_STORAGE_KEY);
        } catch {
            // Ignore storage restrictions.
        }
        setRecentSlugs([]);
    }

    return (
        <div className="mb-10 rounded-[20px] border border-[#E3D8C2] bg-[#FBF7EC] px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0D4030]/[0.07] text-[#1B5A43]">
                        <History size={16} />
                    </span>
                    <div>
                        <p className="text-sm sm:text-base font-semibold text-[#1B4536]">
                            সম্প্রতি পড়েছেন
                        </p>
                        <p className="text-xs sm:text-sm text-[#7C8A81]">
                            আপনার পাঠের ধারা এখান থেকে চালিয়ে যান
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={clearRecent}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#7C8A81] transition hover:bg-white hover:text-[#1B4536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    <X size={12} />
                    মুছুন
                </button>
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
                {recentStories.map((story) => (
                    <Link
                        key={story.slug}
                        href={`/deen-islam/history/${story.slug}`}
                        className="group flex min-w-[190px] shrink-0 items-center gap-3 rounded-xl border border-[#E8DFCE] bg-white/80 px-3.5 py-3 transition hover:border-[#C6A15B]/60 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                    >
                        <span
                            dir="rtl"
                            lang="ar"
                            className={`${arabic.className} text-xl text-[#B08B45]`}
                        >
                            {story.arabicName}
                        </span>
                        <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-[#234A3A]">
                                {story.name} ({story.shortHonorific})
                            </span>
                            <span className="mt-0.5 block truncate text-xs sm:text-sm text-[#819087]">
                                {story.category}
                            </span>
                        </span>
                        <ChevronRight
                            size={14}
                            className="ml-auto shrink-0 text-[#A99A78] transition group-hover:translate-x-0.5 group-hover:text-[#1B5A43]"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function HistoryExplorer({ stories }) {
    const [query, setQuery] = useState("");
    const [activeTheme, setActiveTheme] = useState("all");

    const featured =
        stories.find((story) => story.slug === HERO_FEATURED_SLUG) ?? stories[0];

    const totalRefs = stories.reduce(
        (total, story) => total + story.refs.length,
        0
    );

    const results = useMemo(
        () =>
            stories.filter(
                (story) =>
                    (activeTheme === "all" ||
                        story.themes.includes(activeTheme)) &&
                    matchesQuery(story, query)
            ),
        [stories, activeTheme, query]
    );

    const activeThemeLabel =
        activeTheme === "all"
            ? "সব জীবনী"
            : THEMES.find((theme) => theme.id === activeTheme)?.label ??
              "সব জীবনী";

    const hasFilters = query.trim() !== "" || activeTheme !== "all";

    function resetFilters() {
        setQuery("");
        setActiveTheme("all");
    }

    function applyTheme(themeId) {
        setQuery("");
        setActiveTheme(themeId);
        scrollToSection("explore");
    }

    function submitHeroSearch(event) {
        event.preventDefault();
        scrollToSection("explore");
    }

    return (
        <>
            <section
                aria-labelledby="history-hero-title"
                className="relative isolate overflow-hidden bg-[#062A21] text-white"
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(198,161,91,0.20),transparent_46%),radial-gradient(ellipse_at_4%_88%,rgba(18,125,91,0.30),transparent_50%),linear-gradient(132deg,#05231B_0%,#083326_52%,#0B3D2E_100%)]"
                />
                <IslamicPattern
                    stroke="#D8BC79"
                    opacity={0.1}
                    size={132}
                    className="[mask-image:linear-gradient(100deg,black_10%,transparent_78%)]"
                />
                <ArchOutline className="right-[3%] top-16 hidden h-[500px] w-[430px] lg:block" />

                <div
                    aria-hidden="true"
                    className={`${arabic.className} pointer-events-none absolute -right-6 top-28 hidden text-[12rem] leading-none text-white/[0.035] lg:block`}
                >
                    {featured.arabicName}
                </div>

                <div className="relative mx-auto max-w-[1180px] px-5 pb-24 pt-9 sm:px-8 sm:pt-12 lg:pb-28 lg:pt-16">
                    <nav
                        aria-label="ব্রেডক্রাম্ব"
                        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#C5D7CC]/75"
                    >
                        <Link
                            href="/deen-islam"
                            className="rounded transition hover:text-[#F0DDA8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                        >
                            DeenIslam
                        </Link>
                        <ChevronRight size={12} aria-hidden="true" />
                        <span className="text-[#E8D6A4]">ইসলামের ইতিহাস</span>
                    </nav>

                    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)] lg:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8BC79]/25 bg-[#D8BC79]/10 px-3 py-1.5 text-xs sm:text-sm font-semibold tracking-[0.16em] text-[#F0DDA8]">
                                    <Sparkles size={12} />
                                    সূত্রসহ ইসলামিক ইতিহাস
                                </span>
                                <span className="text-xs sm:text-sm text-[#BFD3C7]/70">
                                    নবী ও রাসূলগণ
                                </span>
                            </div>

                            <h1
                                id="history-hero-title"
                                className={`${bnSerif.className} mt-5 max-w-[640px] text-[34px] font-bold leading-[1.42] text-[#FFF9E9] sm:text-[42px] lg:text-[46px]`}
                            >
                                নবী-রাসূলদের জীবনী
                                <span className="mt-2 block bg-gradient-to-r from-[#F7E8B8] via-[#E7C980] to-[#C89D4F] bg-clip-text text-transparent">
                                    কুরআনের আলোকে পথের সন্ধান
                                </span>
                            </h1>

                            <p className="mt-5 max-w-[590px] text-sm sm:text-base leading-[2] text-[#D8E5DD]/85">
                                আদম থেকে মুহাম্মদ (সা.) পর্যন্ত নির্বাচিত
                                নবী-রাসূলদের জীবনী, কুরআনে বর্ণিত ঘটনা,
                                শিক্ষা ও যাচাইকৃত সূত্র—শান্ত ও গভীর পাঠের
                                জন্য একটি সাজানো সংগ্রহ।
                            </p>

                            <form
                                role="search"
                                onSubmit={submitHeroSearch}
                                className="mt-7 flex max-w-[590px] items-center gap-1.5 rounded-2xl border border-white/15 bg-white/[0.075] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md focus-within:border-[#D8BC79]/55"
                            >
                                <Search
                                    size={19}
                                    aria-hidden="true"
                                    className="ml-3 shrink-0 text-[#D8BC79]"
                                />
                                <label htmlFor="history-search" className="sr-only">
                                    নবীর নাম, বিষয় বা ঘটনা দিয়ে খুঁজুন
                                </label>
                                <input
                                    id="history-search"
                                    type="search"
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="নবীর নাম, বিষয় বা ঘটনা খুঁজুন..."
                                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm sm:text-base text-[#FFF9E9] outline-none placeholder:text-[#B9CCC0]/55"
                                />
                                {query && (
                                    <button
                                        type="button"
                                        onClick={() => setQuery("")}
                                        aria-label="সার্চ মুছুন"
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#C5D7CC]/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#D8BC79] px-4 py-2.5 text-sm font-semibold text-[#173A2C] transition hover:bg-[#E7D19A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFF3D1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A3528]"
                                >
                                    খুঁজুন
                                    <ArrowRight size={14} />
                                </button>
                            </form>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {QUICK_LINKS.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.045] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#E1EBE5]/85 transition hover:border-[#D8BC79]/45 hover:bg-white/[0.09] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                                        >
                                            <Icon size={12} />
                                            {link.label}
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/10 pt-5 text-xs sm:text-sm text-[#C1D3C8]/75">
                                <span className="inline-flex items-center gap-1.5">
                                    <ShieldCheck
                                        size={13}
                                        className="text-[#D8BC79]"
                                    />
                                    কুরআনি রেফারেন্স
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <BookOpen
                                        size={13}
                                        className="text-[#D8BC79]"
                                    />
                                    সীরাত আলাদা চিহ্নিত
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Check
                                        size={13}
                                        className="text-[#D8BC79]"
                                    />
                                    তারিখ অনুমান নয়
                                </span>
                            </div>

                            <dl className="mt-6 grid max-w-[500px] grid-cols-3 gap-3">
                                {[
                                    { value: stories.length, label: "জীবনী" },
                                    { value: THEMES.length, label: "পাঠ-বিষয়" },
                                    { value: totalRefs, label: "কুরআনি রেফারেন্স" },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="border-l border-[#D8BC79]/20 pl-3 first:border-l-0 first:pl-0"
                                    >
                                        <dt className="sr-only">{stat.label}</dt>
                                        <dd>
                                            <span
                                                className={`${serif.className} block text-2xl font-semibold text-[#F0DDA8]`}
                                            >
                                                {toBn(stat.value)}
                                            </span>
                                            <span className="mt-0.5 block text-xs sm:text-sm text-[#BFD3C7]/70">
                                                {stat.label}
                                            </span>
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="relative hidden justify-self-end lg:block">
                            <div className="relative w-[342px] rounded-t-[190px] border border-[#D8BC79]/25 bg-white/[0.045] px-7 pb-6 pt-12 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-x-6 top-6 h-[calc(100%-24px)] rounded-t-[170px] border border-[#D8BC79]/10"
                                />

                                <div className="relative text-center">
                                    <StarSeal className="mx-auto h-11 w-11 text-[#D8BC79]/80" />
                                    <p className="mt-4 text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#D8BC79]">
                                        নির্বাচিত পাঠ
                                    </p>
                                    <p
                                        dir="rtl"
                                        lang="ar"
                                        className={`${arabic.className} mt-3 text-5xl leading-none text-[#F0DDA8]`}
                                    >
                                        {featured.arabicName}
                                    </p>
                                    <h2
                                        className={`${bnSerif.className} mt-3 text-xl font-semibold text-[#FFF9E9]`}
                                    >
                                        {featured.name} ({featured.shortHonorific})
                                    </h2>
                                    <p className="mt-1 text-xs sm:text-sm leading-5 text-[#C8D9CE]/75">
                                        {featured.epithet}
                                    </p>

                                    <div
                                        aria-hidden="true"
                                        className="mx-auto my-5 h-px w-24 bg-gradient-to-r from-transparent via-[#D8BC79]/50 to-transparent"
                                    />

                                    <p className="text-sm sm:text-base leading-[1.9] text-[#E2EBE5]/80">
                                        {featured.title}
                                    </p>

                                    <Link
                                        href={`/deen-islam/history/${featured.slug}`}
                                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[#D8BC79]/40 bg-[#D8BC79]/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#F4E4B9] transition hover:bg-[#D8BC79]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/70"
                                    >
                                        পাঠ শুরু করুন
                                        <ArrowUpRight size={14} />
                                    </Link>
                                    <p className="mt-3 text-[11px] sm:text-xs tracking-wide text-[#BFD3C7]/55">
                                        কুরআনি সূত্রসহ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href={`/deen-islam/history/${featured.slug}`}
                        className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-[#D8BC79]/20 bg-white/[0.05] px-4 py-3.5 lg:hidden"
                    >
                        <span className="flex items-center gap-3">
                            <span
                                dir="rtl"
                                lang="ar"
                                className={`${arabic.className} text-2xl text-[#E8D6A4]`}
                            >
                                {featured.arabicName}
                            </span>
                            <span>
                                <span className="block text-xs sm:text-sm tracking-[0.16em] text-[#D8BC79]">
                                    নির্বাচিত পাঠ
                                </span>
                                <span className="mt-0.5 block text-sm sm:text-base font-semibold text-[#FFF9E9]">
                                    {featured.name} ({featured.shortHonorific}) —{" "}
                                    {featured.title}
                                </span>
                            </span>
                        </span>
                        <ArrowUpRight
                            size={17}
                            className="shrink-0 text-[#D8BC79]"
                        />
                    </Link>
                </div>

                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F8F5EC] via-[#F8F5EC]/55 to-transparent"
                />
            </section>

            <section
                id="explore"
                aria-labelledby="explore-title"
                className="scroll-mt-24 bg-[#F8F5EC]"
            >
                <div className="mx-auto max-w-[1180px] px-5 pb-16 pt-16 sm:px-8 sm:pt-20">
                    <RecentlyViewed stories={stories} />

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-[680px]">
                            <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#987B3F]">
                                <span className="h-px w-8 bg-[#C6A15B]/60" />
                                জীবনী সংগ্রহ
                            </p>
                            <h2
                                id="explore-title"
                                className={`${bnSerif.className} mt-3 text-[28px] font-bold leading-tight text-[#163D2F] sm:text-[34px]`}
                            >
                                নবী-রাসূলদের জীবনী
                            </h2>
                            <p className="mt-3 text-sm sm:text-base leading-7 text-[#67766D]">
                                নাম, বিষয় বা ঘটনা দিয়ে খুঁজুন। প্রতিটি
                                কার্ডের ভেতরে কুরআনে বর্ণিত ঘটনা, শিক্ষা ও
                                যাচাইকৃত রেফারেন্স রয়েছে।
                            </p>
                        </div>

                        <div className="shrink-0 rounded-xl border border-[#E3D8C2] bg-white/60 px-4 py-3 text-center">
                            <p
                                className={`${serif.className} text-2xl font-semibold text-[#1B5A43]`}
                            >
                                {toBn(results.length)}
                                <span className="text-sm sm:text-base text-[#A99263]">
                                    {" "}
                                    / {toBn(stories.length)}
                                </span>
                            </p>
                            <p className="mt-0.5 text-xs sm:text-sm text-[#7D8A82]">
                                {activeThemeLabel}
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-2 shadow-[0_8px_30px_rgba(25,60,45,0.05)] sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                            <Search
                                size={18}
                                aria-hidden="true"
                                className="shrink-0 text-[#A99263]"
                            />
                            <label htmlFor="explore-search" className="sr-only">
                                জীবনী খুঁজুন
                            </label>
                            <input
                                id="explore-search"
                                type="search"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="যেমন: ইউসুফ, ধৈর্য, সমুদ্র, তাওবা..."
                                className="min-w-0 flex-1 bg-transparent py-3 text-sm sm:text-base text-[#193F32] outline-none placeholder:text-[#9BA79F]"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={() => setQuery("")}
                                    aria-label="সার্চ মুছুন"
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#8C9991] transition hover:bg-[#F0EBDD] hover:text-[#193F32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-[#EFE8D9] px-3 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                            <span className="text-xs sm:text-sm text-[#7D8A82]">
                                বিষয় ফিল্টার
                            </span>
                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-1 rounded-full border border-[#D9CDB5] px-2.5 py-1.5 text-xs sm:text-sm font-medium text-[#7E6534] transition hover:border-[#B79A58] hover:bg-[#F7F2E6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                                >
                                    <X size={11} />
                                    ফিল্টার মুছুন
                                </button>
                            )}
                        </div>
                    </div>

                    <div
                        role="group"
                        aria-label="বিষয় অনুযায়ী ফিল্টার"
                        className="mt-4 flex flex-wrap gap-2"
                    >
                        <button
                            type="button"
                            onClick={() => setActiveTheme("all")}
                            aria-pressed={activeTheme === "all"}
                            className={`rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 ${
                                activeTheme === "all"
                                    ? "border-[#1B5A43] bg-[#1B5A43] text-[#FFF9E9] shadow-sm"
                                    : "border-[#DED3BE] bg-white/60 text-[#5E6E65] hover:border-[#C6A15B]/70 hover:text-[#1B4536]"
                            }`}
                        >
                            সব জীবনী
                        </button>

                        {THEMES.map((theme) => {
                            const Icon = THEME_ICONS[theme.id];
                            const active = activeTheme === theme.id;

                            return (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveTheme(active ? "all" : theme.id)
                                    }
                                    aria-pressed={active}
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 ${
                                        active
                                            ? "border-[#1B5A43] bg-[#1B5A43] text-[#FFF9E9] shadow-sm"
                                            : "border-[#DED3BE] bg-white/60 text-[#5E6E65] hover:border-[#C6A15B]/70 hover:text-[#1B4536]"
                                    }`}
                                >
                                    <Icon size={12} />
                                    {theme.short}
                                </button>
                            );
                        })}
                    </div>

                    <p className="sr-only" aria-live="polite">
                        {toBn(results.length)}টি জীবনী পাওয়া গেছে।
                    </p>

                    {results.length > 0 ? (
                        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                            {results.map((story, index) => (
                                <StoryCard
                                    key={story.slug}
                                    story={story}
                                    index={stories.indexOf(story)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-8 rounded-[24px] border border-dashed border-[#D8CBB0] bg-[#FFFDF8]/70 px-6 py-14 text-center">
                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#E4D8C0] bg-[#F7F2E6] text-[#A99263]">
                                <SearchX size={24} />
                            </span>
                            <h3
                                className={`${bnSerif.className} mt-5 text-xl font-semibold text-[#1D4536]`}
                            >
                                কোনো জীবনী পাওয়া যায়নি
                            </h3>
                            <p className="mx-auto mt-2 max-w-md text-sm sm:text-base leading-7 text-[#748279]">
                                {query.trim()
                                    ? `“${query.trim()}” দিয়ে কোনো ফলাফল মেলেনি।`
                                    : "এই বিষয়ে এখনো কোনো জীবনী যোগ করা হয়নি।"}{" "}
                                অন্য নাম বা বিষয় দিয়ে চেষ্টা করুন।
                            </p>
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1B5A43] px-5 py-2.5 text-sm font-semibold text-[#FFF9E9] transition hover:bg-[#144534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EC]"
                            >
                                সব ফিল্টার মুছুন
                                <RotateCcw size={14} />
                            </button>
                        </div>
                    )}

                    <div className="mt-7 flex flex-col gap-2 rounded-xl border border-[#E8DFCE] bg-white/50 px-4 py-3 text-xs sm:text-sm leading-6 text-[#7C8A81] sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            কার্ডের ক্রম ঐতিহাসিক কালপঞ্জি নয়—পাঠের সুবিধার্থে
                            সাজানো হয়েছে।
                        </p>
                        <a
                            href="#sources"
                            className="inline-flex shrink-0 items-center gap-1.5 font-medium text-[#1B5A43] hover:text-[#8A6C31]"
                        >
                            সূত্র ও নীতিমালা
                            <ArrowRight size={13} />
                        </a>
                    </div>
                </div>
            </section>

            <section
                id="themes"
                aria-labelledby="themes-title"
                className="scroll-mt-24 border-y border-[#E4DAC6] bg-[#F1EBDD]"
            >
                <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
                    <div className="mx-auto max-w-[700px] text-center">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#987B3F]">
                            বিষয়ভিত্তিক পাঠ
                        </p>
                        <h2
                            id="themes-title"
                            className={`${bnSerif.className} mt-3 text-[28px] font-bold leading-tight text-[#163D2F] sm:text-[34px]`}
                        >
                            যে বিষয়ে আজ পড়তে চান
                        </h2>
                        <p className="mt-3 text-sm sm:text-base leading-7 text-[#6C7A72]">
                            কুরআনের ঘটনাগুলোকে বিষয় অনুযায়ী সাজিয়ে দেখা যায়।
                            এটি ঘটনার কালানুক্রম নয়, বরং শিক্ষার শ্রেণিবিন্যাস।
                        </p>
                    </div>

                    <OrnamentDivider className="my-7" />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {THEMES.map((theme) => {
                            const Icon = THEME_ICONS[theme.id];
                            const count = stories.filter((story) =>
                                story.themes.includes(theme.id)
                            ).length;
                            const active = activeTheme === theme.id;

                            return (
                                <button
                                    key={theme.id}
                                    type="button"
                                    onClick={() => applyTheme(theme.id)}
                                    aria-pressed={active}
                                    className={`group rounded-2xl border p-5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EBDD] ${
                                        active
                                            ? "border-[#B08B45] bg-[#FFFDF8] shadow-[0_16px_36px_rgba(25,60,45,0.12)]"
                                            : "border-[#DED2BD] bg-[#FBF7EC]/80 hover:-translate-y-0.5 hover:border-[#C6A15B]/70 hover:bg-[#FFFDF8] hover:shadow-[0_14px_30px_rgba(25,60,45,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
                                                active
                                                    ? "border-[#1B5A43] bg-[#1B5A43] text-[#F0DDA8]"
                                                    : "border-[#E1D5BF] bg-[#F4EEDF] text-[#1B5A43] group-hover:border-[#C6A15B]/50"
                                            }`}
                                        >
                                            <Icon size={19} />
                                        </span>
                                        <span className="rounded-full border border-[#E0D5C0] px-2.5 py-1 text-xs sm:text-sm text-[#8A7440]">
                                            {toBn(count)}টি জীবনী
                                        </span>
                                    </div>
                                    <h3
                                        className={`${bnSerif.className} mt-4 text-lg sm:text-xl font-semibold text-[#1B4536]`}
                                    >
                                        {theme.label}
                                    </h3>
                                    <p className="mt-2 text-sm sm:text-base leading-[1.9] text-[#6E7C74]">
                                        {theme.description}
                                    </p>
                                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B5A43] transition group-hover:gap-2.5">
                                        {active ? "নির্বাচিত" : "এই বিষয়ে পড়ুন"}
                                        {active ? (
                                            <Check size={14} />
                                        ) : (
                                            <ArrowRight size={14} />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}
