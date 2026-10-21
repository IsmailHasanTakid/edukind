
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowUpRight,
    Bookmark,
    BookmarkCheck,
    BookOpen,
    Check,
    CheckCircle2,
    Clock3,
    Compass,
    Sparkles,
    Trash2,
    RotateCcw,
    LibraryBig,
    BookMarked,
} from "lucide-react";

const AYAH_KEY = "deen-quran-bookmarks";
const SURAH_KEY = "deen-quran-surah-bookmarks";
const COMPLETED_KEY = "deen-quran-completed-surahs";

const bn = (n) => Number(n || 0).toLocaleString("bn-BD");

const SURAH_METADATA = {
    1: {
        arabic: "الْفَاتِحَة",
        bangla: "আল-ফাতিহা",
        english: "Al-Fatihah",
        type: "মাক্কি",
        ayahs: 7,
        summary: "কুরআনের সূচনা। আল্লাহর প্রশংসা, ইবাদত ও সরল পথের দিকনির্দেশনা নিয়ে এই সূরা।",
    },
    2: {
        arabic: "الْبَقَرَة",
        bangla: "আল-বাকারা",
        english: "Al-Baqarah",
        type: "মাদানি",
        ayahs: 286,
        summary: "ঈমান, ইবাদত, নৈতিকতা, পারিবারিক জীবন ও ইসলামী জীবনব্যবস্থার বিভিন্ন নির্দেশনা রয়েছে।",
    },
    3: {
        arabic: "آلِ عِمْرَان",
        bangla: "আলে ইমরান",
        english: "Ali 'Imran",
        type: "মাদানি",
        ayahs: 200,
        summary: "ঈমান, আল্লাহর ওপর ভরসা, ধৈর্য এবং সত্যের পথে অবিচল থাকার শিক্ষা দেয়।",
    },
    18: {
        arabic: "الْكَهْف",
        bangla: "আল-কাহফ",
        english: "Al-Kahf",
        type: "মাক্কি",
        ayahs: 110,
        summary: "গুহাবাসী, দুই বাগানের মালিক, মূসা ও খিজির এবং যুলকারনাইনের ঘটনা রয়েছে।",
    },
    36: {
        arabic: "يس",
        bangla: "ইয়াসিন",
        english: "Ya-Sin",
        type: "মাক্কি",
        ayahs: 83,
        summary: "রিসালাত, পুনরুত্থান, আল্লাহর নিদর্শন এবং পরকালের কথা স্মরণ করিয়ে দেয়।",
    },
    55: {
        arabic: "الرَّحْمَٰن",
        bangla: "আর-রহমান",
        english: "Ar-Rahman",
        type: "মাদানি",
        ayahs: 78,
        summary: "আল্লাহর অসংখ্য নিয়ামত, সৃষ্টি এবং তাঁর অনুগ্রহের কথা বারবার স্মরণ করিয়ে দেয়।",
    },
    67: {
        arabic: "الْمُلْك",
        bangla: "আল-মুলক",
        english: "Al-Mulk",
        type: "মাক্কি",
        ayahs: 30,
        summary: "সার্বভৌম ক্ষমতা আল্লাহর। জীবন-মৃত্যু ও সৃষ্টিজগতের নিদর্শন নিয়ে চিন্তা করতে শেখায়।",
    },
    112: {
        arabic: "الْإِخْلَاص",
        bangla: "আল-ইখলাস",
        english: "Al-Ikhlas",
        type: "মাক্কি",
        ayahs: 4,
        summary: "আল্লাহর একত্ব ও তাঁর অতুলনীয় সত্তার সংক্ষিপ্ত ঘোষণা।",
    },
    113: {
        arabic: "الْفَلَق",
        bangla: "আল-ফালাক",
        english: "Al-Falaq",
        type: "মাক্কি",
        ayahs: 5,
        summary: "সৃষ্টির অনিষ্ট, অন্ধকারের অনিষ্ট ও হিংসুকের অনিষ্ট থেকে আল্লাহর আশ্রয় চাওয়ার শিক্ষা।",
    },
    114: {
        arabic: "النَّاس",
        bangla: "আন-নাস",
        english: "An-Nas",
        type: "মাক্কি",
        ayahs: 6,
        summary: "অন্তরের কুমন্ত্রণা ও শয়তানের অনিষ্ট থেকে আল্লাহর আশ্রয় প্রার্থনা।",
    },
};

function getSurahInfo(item) {
    const number = Number(item.surahNumber);
    const info = SURAH_METADATA[number];

    return {
        number,
        bangla: info?.bangla || `সূরা ${bn(number)}`,
        arabic: info?.arabic || "",
        english: info?.english || `Surah ${number}`,
        type: info?.type || "কুরআনের সূরা",
        ayahs: Number(item.ayahCount || info?.ayahs || 0),
        summary:
            info?.summary ||
            "এই সূরাটি খুলে এর আরবি পাঠ, বাংলা অনুবাদ এবং বিস্তারিত অধ্যয়ন করুন।",
    };
}

function readArray(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

function saveArray(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

export default function QuranBookmarksPage() {
    const [ayahBookmarks, setAyahBookmarks] = useState([]);
    const [surahBookmarks, setSurahBookmarks] = useState([]);
    const [completedSurahs, setCompletedSurahs] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("surahs");

    useEffect(() => {
        setAyahBookmarks(readArray(AYAH_KEY));
        setSurahBookmarks(readArray(SURAH_KEY));
        setCompletedSurahs(
            readArray(COMPLETED_KEY)
                .map(Number)
                .filter((number) => Number.isInteger(number) && number > 0)
        );
        setLoaded(true);
    }, []);

    const completedSet = useMemo(
        () => new Set(completedSurahs),
        [completedSurahs]
    );

    const savedSurahs = useMemo(
        () =>
            surahBookmarks.filter(
                (item) => !completedSet.has(Number(item.surahNumber))
            ),
        [surahBookmarks, completedSet]
    );

    const completedBookmarks = useMemo(
        () =>
            surahBookmarks.filter((item) =>
                completedSet.has(Number(item.surahNumber))
            ),
        [surahBookmarks, completedSet]
    );

    function markAsDone(number) {
        const updated = [...new Set([...completedSurahs, Number(number)])];

        if (saveArray(COMPLETED_KEY, updated)) {
            setCompletedSurahs(updated);
        }
    }

    function markAsUndone(number) {
        const updated = completedSurahs.filter(
            (item) => item !== Number(number)
        );

        if (saveArray(COMPLETED_KEY, updated)) {
            setCompletedSurahs(updated);
        }
    }

    function removeSurah(number) {
        const updated = surahBookmarks.filter(
            (item) => Number(item.surahNumber) !== Number(number)
        );

        const updatedCompleted = completedSurahs.filter(
            (item) => item !== Number(number)
        );

        if (saveArray(SURAH_KEY, updated)) {
            setSurahBookmarks(updated);
        }

        if (saveArray(COMPLETED_KEY, updatedCompleted)) {
            setCompletedSurahs(updatedCompleted);
        }
    }

    function removeAyah(surahNumber, ayahNumber) {
        const updated = ayahBookmarks.filter(
            (item) =>
                !(
                    Number(item.surahNumber) === Number(surahNumber) &&
                    Number(item.ayahNumber) === Number(ayahNumber)
                )
        );

        if (saveArray(AYAH_KEY, updated)) {
            setAyahBookmarks(updated);
        }
    }

    if (!loaded) {
        return (
            <main className="min-h-screen bg-[#F5F7F2] px-4 py-20">
                <div className="mx-auto flex max-w-md flex-col items-center rounded-3xl border border-[#DCE8DE] bg-white p-10 text-center shadow-sm">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF4EC] text-[#176344]">
                        <BookOpen className="animate-pulse" size={27} />
                    </div>
                    <p className="font-medium text-[#537064]">
                        আপনার বুকমার্ক লোড হচ্ছে...
                    </p>
                </div>
            </main>
        );
    }

    const tabs = [
        {
            id: "surahs",
            label: "সংরক্ষিত সূরা",
            count: savedSurahs.length,
            icon: BookOpen,
        },
        {
            id: "completed",
            label: "সম্পন্ন সূরা",
            count: completedBookmarks.length,
            icon: CheckCircle2,
        },
        {
            id: "ayahs",
            label: "সংরক্ষিত আয়াত",
            count: ayahBookmarks.length,
            icon: Bookmark,
        },
    ];

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#F5F7F2] px-4 py-7 sm:px-7 sm:py-10 lg:px-10">
            <div className="pointer-events-none absolute -left-36 top-64 h-80 w-80 rounded-full bg-[#C9A14A]/[0.07] blur-3xl" />
            <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#16805A]/[0.06] blur-3xl" />

            <div className="relative mx-auto max-w-6xl">
                <Link
                    href="/deen-islam/quran"
                    className="group mb-7 inline-flex items-center gap-2 rounded-xl text-sm font-medium text-[#537064] transition hover:text-[#16764F]"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#DCE8DE] bg-white transition group-hover:border-[#A7CDB1] group-hover:bg-[#EAF4EC]">
                        <ArrowLeft size={17} />
                    </span>
                    কুরআনে ফিরে যান
                </Link>

                {/* Hero */}
                <section className="relative isolate overflow-hidden rounded-[28px] border border-[#285B45] bg-gradient-to-br from-[#103F30] via-[#14553D] to-[#092D23] text-white shadow-[0_22px_65px_-30px_rgba(16,63,48,0.55)]">
                    <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full border border-white/[0.08]" />
                    <div className="pointer-events-none absolute -right-5 -top-12 h-64 w-64 rounded-full border border-[#D7B65E]/20" />
                    <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#D7B65E]/10 blur-3xl" />

                    <div className="relative grid gap-9 p-6 sm:p-9 lg:grid-cols-[1fr_300px] lg:items-center lg:p-12">
                        <div>
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E8CD86]/25 bg-white/[0.08] text-[#E8CD86] shadow-inner">
                                <BookmarkCheck size={28} strokeWidth={1.7} />
                            </div>

                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8CD86]/20 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8CD86] sm:text-xs">
                                <Sparkles size={13} />
                                Your Personal Quran Library
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                আমার বুকমার্ক
                            </h1>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                                আপনার প্রিয় সূরা ও আয়াত সংরক্ষণ করুন, পড়ার অগ্রগতি
                                ধরে রাখুন এবং সম্পন্ন করা সূরাগুলো এক জায়গায় সাজিয়ে
                                রাখুন।
                            </p>

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link
                                    href="/deen-islam/quran"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#E8CD86] px-5 py-3 text-sm font-bold text-[#183D2D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#F0DDA5]"
                                >
                                    <BookOpen size={17} />
                                    কুরআন পড়ুন
                                    <ArrowUpRight size={15} />
                                </Link>

                                <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white/80">
                                    <Compass size={17} className="text-[#E8CD86]" />
                                    আপনার পড়ার সংগ্রহ
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                            <StatCard
                                icon={LibraryBig}
                                value={surahBookmarks.length}
                                label="মোট সংরক্ষিত সূরা"
                            />
                            <StatCard
                                icon={CheckCircle2}
                                value={completedBookmarks.length}
                                label="সম্পন্ন সূরা"
                            />
                            <StatCard
                                icon={Bookmark}
                                value={ayahBookmarks.length}
                                label="সংরক্ষিত আয়াত"
                            />
                        </div>
                    </div>

                    <div className="relative h-px bg-gradient-to-r from-transparent via-[#E8CD86]/40 to-transparent" />

                    <div className="relative flex flex-wrap items-center justify-between gap-3 px-6 py-4 sm:px-9 lg:px-12">
                        <div className="flex items-center gap-2 text-xs text-white/65 sm:text-sm">
                            <span className="h-2 w-2 rounded-full bg-[#DCC788]" />
                            আপনার পড়ার অগ্রগতি, আপনার নিজের গতিতে
                        </div>
                        <span className="text-xs font-medium tracking-wide text-[#E8CD86]">
                            LEARN · REFLECT · GROW
                        </span>
                    </div>
                </section>

                {/* Reading progress */}
                <section className="mt-6 rounded-2xl border border-[#E0E8E1] bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF4EC] text-[#176344]">
                                <CheckCircle2 size={21} />
                            </div>
                            <div>
                                <h2 className="font-bold text-[#193D2D]">
                                    আপনার পড়ার অগ্রগতি
                                </h2>
                                <p className="mt-1 text-xs text-[#7A897E]">
                                    আপনার সংরক্ষিত সূরার মধ্যে কতগুলো সম্পন্ন করেছেন
                                </p>
                            </div>
                        </div>

                        <p className="text-xl font-bold text-[#176344]">
                            {bn(completedBookmarks.length)}
                            <span className="mx-1 text-sm font-normal text-[#89978D]">
                                /
                            </span>
                            <span className="text-sm font-semibold text-[#718075]">
                                {bn(surahBookmarks.length)}
                            </span>
                        </p>
                    </div>

                    <div
                        className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#EDF2ED]"
                        role="progressbar"
                        aria-label="সংরক্ষিত সূরার সম্পন্ন অগ্রগতি"
                        aria-valuemin={0}
                        aria-valuemax={surahBookmarks.length || 1}
                        aria-valuenow={completedBookmarks.length}
                    >
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#176344] via-[#2A936A] to-[#C9A14A] transition-all duration-500"
                            style={{
                                width: `${surahBookmarks.length
                                    ? Math.min(
                                        100,
                                        (completedBookmarks.length / surahBookmarks.length) *
                                        100
                                    )
                                    : 0
                                    }%`,
                            }}
                        />
                    </div>

                    <p className="mt-3 text-xs text-[#7A897E]">
                        {surahBookmarks.length === 0
                            ? "সূরা বুকমার্ক করলে এখানে আপনার অগ্রগতি দেখা যাবে।"
                            : completedBookmarks.length === surahBookmarks.length
                                ? "চমৎকার! আপনার সব সংরক্ষিত সূরা সম্পন্ন হয়েছে।"
                                : `আরও ${bn(surahBookmarks.length - completedBookmarks.length)}টি সংরক্ষিত সূরা বাকি আছে।`}
                    </p>
                </section>

                {/* Tabs */}
                <div className="mt-8">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold tracking-tight text-[#193D2D] sm:text-2xl">
                            আপনার সংগ্রহ
                        </h2>
                        <p className="mt-1 text-sm text-[#738278]">
                            সংরক্ষিত পাঠ, সম্পন্ন সূরা এবং প্রিয় আয়াত পরিচালনা করুন।
                        </p>
                    </div>

                    <div
                        className="grid grid-cols-1 gap-2 rounded-2xl border border-[#E0E8E1] bg-white p-2 shadow-sm sm:grid-cols-3"
                        role="tablist"
                        aria-label="বুকমার্কের ধরন"
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const selected = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex min-w-0 items-center gap-3 rounded-xl px-3 py-3.5 text-left transition duration-200 sm:justify-center sm:px-4 ${selected
                                        ? "bg-[#14553D] text-white shadow-md shadow-[#14553D]/15"
                                        : "text-[#53685B] hover:bg-[#F1F6F1]"
                                        }`}
                                >
                                    <span
                                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected
                                            ? "bg-white/10 text-[#E8CD86]"
                                            : "bg-[#EAF4EC] text-[#176344]"
                                            }`}
                                    >
                                        <Icon size={19} />
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold">
                                            {tab.label}
                                        </span>
                                        <span
                                            className={`mt-0.5 block text-xs ${selected ? "text-white/65" : "text-[#89978D]"
                                                }`}
                                        >
                                            {bn(tab.count)}টি আইটেম
                                        </span>
                                    </span>

                                    <span
                                        className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-xs font-bold ${selected
                                            ? "bg-white/10 text-[#E8CD86]"
                                            : "bg-[#F0F4EF] text-[#53685B]"
                                            }`}
                                    >
                                        {bn(tab.count)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Saved Surahs */}
                {activeTab === "surahs" && (
                    <section className="mt-5 space-y-4">
                        {savedSurahs.length === 0 ? (
                            <EmptyState
                                icon={BookOpen}
                                description="কুরআন থেকে কোনো সূরা বুকমার্ক করুন। সংরক্ষিত সূরাগুলো এখানে দেখা যাবে।"
                                href="/deen-islam/quran"
                                linkLabel="কুরআন ব্রাউজ করুন"
                            />
                        ) : (
                            savedSurahs.map((item) => (
                                <SurahCard
                                    key={item.surahNumber}
                                    item={item}
                                    onDone={markAsDone}
                                    onDelete={removeSurah}
                                    completed={false}
                                />
                            ))
                        )}
                    </section>
                )}

                {/* Completed Surahs */}
                {activeTab === "completed" && (
                    <section className="mt-5 space-y-4">
                        {completedBookmarks.length === 0 ? (
                            <EmptyState
                                icon={CheckCircle2}
                                title="এখনো কোনো সূরা সম্পন্ন করেননি"
                                description="সংরক্ষিত সূরা পড়া শেষ হলে Mark as Done চাপুন। আপনার সম্পন্ন সূরা এখানে জমা থাকবে।"
                                href="/deen-islam/quran"
                                linkLabel="পড়া শুরু করুন"
                            />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 rounded-xl border border-[#CDE3D0] bg-[#EAF4EC] px-4 py-3 text-sm text-[#176344]">
                                    <CheckCircle2 size={18} />
                                    <span>
                                        আপনি {bn(completedBookmarks.length)}টি সূরা সম্পন্ন
                                        করেছেন।
                                    </span>
                                </div>

                                {completedBookmarks.map((item) => (
                                    <SurahCard
                                        key={item.surahNumber}
                                        item={item}
                                        onDone={markAsDone}
                                        onUndo={markAsUndone}
                                        onDelete={removeSurah}
                                        completed
                                    />
                                ))}
                            </>
                        )}
                    </section>
                )}

                {/* Saved Ayahs */}
                {activeTab === "ayahs" && (
                    <section className="mt-5 space-y-4">
                        {ayahBookmarks.length === 0 ? (
                            <EmptyState
                                icon={Bookmark}
                                title="এখনো কোনো আয়াত বুকমার্ক করেননি"
                                description="সূরার পেজ থেকে পছন্দের আয়াত বুকমার্ক করুন। আপনার সংরক্ষিত আয়াতগুলো এখানে থাকবে।"
                                href="/deen-islam/quran"
                                linkLabel="আয়াত খুঁজুন"
                            />
                        ) : (
                            ayahBookmarks.map((item) => (
                                <article
                                    key={`${item.surahNumber}-${item.ayahNumber}`}
                                    className="group relative overflow-hidden rounded-2xl border border-[#E0E8E1] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#B6D2BE] hover:shadow-lg hover:shadow-[#193D2D]/[0.05] sm:p-7"
                                >
                                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-[#C9A14A]/[0.06] transition group-hover:bg-[#C9A14A]/[0.1]" />

                                    <div className="relative flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-2 rounded-lg border border-[#E5D6A8] bg-[#FBF5E6] px-3 py-2 text-xs font-semibold text-[#8A6A22]">
                                                <BookMarked size={14} />
                                                সূরা {bn(item.surahNumber)} · আয়াত{" "}
                                                {bn(item.ayahNumber)}
                                            </span>
                                            <span className="rounded-lg bg-[#F1F6F1] px-2.5 py-2 text-xs text-[#718075]">
                                                সংরক্ষিত আয়াত
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAyah(item.surahNumber, item.ayahNumber)
                                            }
                                            aria-label="আয়াতের বুকমার্ক সরান"
                                            title="বুকমার্ক সরান"
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-[#87948A] transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <p
                                        dir="rtl"
                                        lang="ar"
                                        className="relative mt-7 text-right text-2xl leading-[2.25] text-[#193D2D] sm:text-3xl sm:leading-[2.2]"
                                    >
                                        {item.arabic || "আরবি পাঠ উপলভ্য নয়"}
                                    </p>

                                    <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#C9A14A]/40 to-transparent" />

                                    <div>
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A17C32]">
                                            বাংলা অনুবাদ
                                        </p>
                                        <p className="text-sm leading-8 text-[#53685B] sm:text-base">
                                            {item.bangla || "বাংলা অনুবাদ সংরক্ষিত নেই।"}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF1EC] pt-4">
                                        <span className="inline-flex items-center gap-2 text-xs text-[#89978D]">
                                            <Bookmark size={14} />
                                            আপনার ব্যক্তিগত সংগ্রহ
                                        </span>

                                        <Link
                                            href={`/deen-islam/quran/${item.surahNumber}#ayah-${item.ayahNumber}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#EAF4EC] px-4 py-2.5 text-sm font-semibold text-[#176344] transition hover:bg-[#DCEEE0]"
                                        >
                                            আয়াতে ফিরে যান
                                            <ArrowUpRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>
                )}

                <footer className="mt-10 border-t border-[#DFE7DF] py-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-[#53685B]">
                        <span className="h-px w-8 bg-[#C9A14A]/60" />
                        <Sparkles size={15} className="text-[#A17C32]" />
                        কুরআনের সঙ্গে আপনার যাত্রা অব্যাহত থাকুক
                        <span className="h-px w-8 bg-[#C9A14A]/60" />
                    </div>
                    <p className="mt-2 text-xs text-[#89978D]">
                        আপনার বুকমার্ক এই ব্রাউজারে সংরক্ষিত থাকে।
                    </p>
                </footer>
            </div>
        </main>
    );
}

function StatCard({ icon: Icon, value, label }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition hover:bg-white/[0.11] sm:p-5 lg:flex lg:items-center lg:gap-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8CD86]/20 bg-[#E8CD86]/10 text-[#E8CD86] lg:mb-0">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight">{bn(value)}</p>
                <p className="mt-1 text-xs text-white/65">{label}</p>
            </div>
        </div>
    );
}

function SurahCard({ item, onDone, onUndo, onDelete, completed }) {
    const info = getSurahInfo(item);

    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#193D2D]/[0.05] sm:p-6 ${completed
                ? "border-[#CDE3D0] hover:border-[#A6D0AE]"
                : "border-[#E0E8E1] hover:border-[#B6D2BE]"
                }`}
        >
            <div
                className={`pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full blur-3xl ${completed ? "bg-[#2B936A]/[0.08]" : "bg-[#C9A14A]/[0.08]"
                    }`}
            />

            <div className="relative flex items-start gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#DCE8DE] bg-gradient-to-br from-[#F1F7F0] to-[#E5F0E5] text-[#176344] transition group-hover:border-[#B6D2BE]">
                    <BookOpen size={23} strokeWidth={1.7} />
                    <span className="absolute -bottom-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-lg border-2 border-white bg-[#14553D] px-1 text-[10px] font-bold text-white">
                        {bn(info.number)}
                    </span>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold tracking-tight text-[#193D2D] sm:text-xl">
                            {info.bangla}
                        </h3>

                        {completed && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#CDE3D0] bg-[#EAF4EC] px-2.5 py-1 text-[10px] font-bold text-[#176344]">
                                <CheckCircle2 size={12} />
                                সম্পন্ন
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs font-medium tracking-wide text-[#89978D]">
                        {info.english}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F1F6F1] px-2.5 py-1.5 text-xs text-[#53685B]">
                            <BookOpen size={13} />
                            {bn(info.ayahs)}টি আয়াত
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5D6A8]/70 bg-[#FBF5E6] px-2.5 py-1.5 text-xs text-[#8A6A22]">
                            <Compass size={13} />
                            {info.type}
                        </span>
                    </div>
                </div>

                <div
                    dir="rtl"
                    lang="ar"
                    className="hidden shrink-0 text-right text-xl leading-relaxed text-[#176344] sm:block sm:text-2xl"
                >
                    {info.arabic}
                </div>
            </div>

            <div className="relative mt-5 rounded-xl border border-[#E8EEE7] bg-[#F8FAF6] p-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A17C32]">
                    সূরা পরিচিতি
                </p>
                <p className="text-sm leading-7 text-[#637267]">
                    {info.summary}
                </p>
            </div>

            <div className="relative mt-5 flex flex-col gap-3 border-t border-[#EDF1EC] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                    href={`/deen-islam/quran/${info.number}`}
                    className="inline-flex min-h-10 items-center gap-2 self-start rounded-xl px-1 text-sm font-semibold text-[#176344] transition hover:text-[#0B4931] hover:underline"
                >
                    সূরা পড়ুন
                    <ArrowUpRight size={16} />
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                    {completed ? (
                        <button
                            type="button"
                            onClick={() => onUndo(info.number)}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-3 py-2 text-xs font-semibold text-[#53685B] transition hover:border-[#B6D2BE] hover:bg-[#F1F6F1] sm:px-4 sm:text-sm"
                        >
                            <RotateCcw size={15} />
                            আবার পড়ব
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => onDone(info.number)}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#14553D] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0E4431] hover:shadow-md sm:px-4 sm:text-sm"
                        >
                            <Check size={16} />
                            Mark as Done
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => onDelete(info.number)}
                        aria-label={`${info.bangla} বুকমার্ক সরান`}
                        title="বুকমার্ক সরান"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-transparent text-[#87948A] transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    >
                        <Trash2 size={17} />
                    </button>
                </div>
            </div>
        </article>
    );
}

function EmptyState({ icon: Icon, title, description, href, linkLabel }) {
    return (
        <div className="rounded-2xl border border-dashed border-[#D4E0D5] bg-white px-5 py-12 text-center shadow-sm sm:py-16">
            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#DCE8DE] bg-gradient-to-br from-[#F1F7F0] to-[#E5F0E5] text-[#176344]">
                <Icon size={27} strokeWidth={1.6} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E8CD86] text-[#193D2D]">
                    <Sparkles size={11} />
                </span>
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#193D2D]">{title}</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#738278]">
                {description}
            </p>

            <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#14553D] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0E4431]"
            >
                {linkLabel}
                <ArrowUpRight size={16} />
            </Link>
        </div>
    );
}
