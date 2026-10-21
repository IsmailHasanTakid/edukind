"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    BookOpen,
    Check,
    Compass,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
import { arabic } from "@/lib/deen-fonts";

const FILTERS = [
    { id: "all", label: "সব সূরা" },
    { id: "Meccan", label: "মক্কী" },
    { id: "Medinan", label: "মাদানী" },
];

const bn = (n) => Number(n).toLocaleString("bn-BD");

const normalize = (value = "") =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/[০-৯]/g, (digit) =>
            String("০১২৩৪৫৬৭৮৯".indexOf(digit))
        )
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const normalizeArabic = (value = "") =>
    String(value)
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي")
        .trim();

export default function SurahBrowser({ surahs = [] }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const results = useMemo(() => {
        const q = normalize(query);
        const arabicQuery = normalizeArabic(query);

        return surahs.filter((surah) => {
            if (
                filter !== "all" &&
                surah.revelationType !== filter
            ) {
                return false;
            }

            if (!q) return true;

            const searchableText = [
                surah.englishName,
                surah.englishNameTranslation,
            ]
                .map(normalize)
                .join(" ");

            const arabicName = normalizeArabic(
                surah.name
                    .replace("سُورَةُ ", "")
                    .replace("سورة ", "")
            );

            return (
                String(surah.number) === q ||
                bn(surah.number) === query.trim() ||
                searchableText.includes(q) ||
                arabicName.includes(arabicQuery)
            );
        });
    }, [surahs, query, filter]);

    const clearSearch = () => {
        setQuery("");
        setFilter("all");
    };

    return (
        <div>
            {/* Search and filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex min-h-12 w-full items-center rounded-2xl border border-[#E1E8DE] bg-[#FAFCF8] transition duration-300 focus-within:border-[#36845B]/60 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(54,132,91,0.07)] lg:max-w-xl">
                    <Search
                        size={19}
                        className="ml-4 shrink-0 text-[#8B9B8F]"
                        aria-hidden="true"
                    />

                    <input
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="সূরার নাম বা নম্বর লিখুন..."
                        aria-label="সূরা খুঁজুন"
                        className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm text-[#234331] outline-none placeholder:text-[#9AA69D]"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="অনুসন্ধান মুছুন"
                            className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#829187] transition hover:bg-[#EAF2E9] hover:text-[#285C3D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36845B]"
                        >
                            <X size={16} aria-hidden="true" />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-medium text-[#849087]">
                        <SlidersHorizontal size={14} aria-hidden="true" />
                        ধরন
                    </span>

                    {FILTERS.map((item) => {
                        const active = filter === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setFilter(item.id)}
                                aria-pressed={active}
                                className={`inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39865D] focus-visible:ring-offset-2 ${active
                                        ? "border-[#1C6543] bg-[#185A3B] text-white shadow-[0_4px_12px_rgba(24,90,59,0.16)]"
                                        : "border-[#E0E7DE] bg-white text-[#617366] hover:border-[#9FBDA5] hover:bg-[#F4F8F1]"
                                    }`}
                            >
                                {active && (
                                    <Check
                                        size={13}
                                        aria-hidden="true"
                                    />
                                )}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Results summary */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8ECE5] pb-4">
                <div
                    aria-live="polite"
                    className="flex items-center gap-2 text-sm text-[#697B6D]"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF3E9] text-[#32694A]">
                        <BookOpen size={16} aria-hidden="true" />
                    </span>
                    <span>
                        মোট{" "}
                        <strong className="font-bold text-[#234632]">
                            {bn(results.length)}
                        </strong>{" "}
                        টি সূরা
                    </span>
                </div>

                {(query || filter !== "all") && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-[#477658] transition hover:bg-[#EAF3E9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39865D]"
                    >
                        <X size={13} aria-hidden="true" />
                        সব ফিল্টার মুছুন
                    </button>
                )}
            </div>

            {/* Empty state */}
            {results.length === 0 ? (
                <div className="mt-5 flex flex-col items-center rounded-3xl border border-dashed border-[#D8E3D6] bg-white/65 px-5 py-14 text-center sm:py-20">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E0EADD] bg-[#F0F5EC] text-[#477958]">
                        <Compass size={28} strokeWidth={1.5} aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-[#254833]">
                        কোনো সূরা পাওয়া যায়নি
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-7 text-[#839087]">
                        অন্য কোনো নাম বা নম্বর দিয়ে চেষ্টা করুন, অথবা
                        ফিল্টার পরিবর্তন করে আবার খুঁজুন।
                    </p>

                    <button
                        type="button"
                        onClick={clearSearch}
                        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#185A3B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10482E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39865D] focus-visible:ring-offset-2"
                    >
                        <X size={15} aria-hidden="true" />
                        সব সূরা দেখুন
                    </button>
                </div>
            ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                    {results.map((surah) => {
                        const isMeccan =
                            surah.revelationType === "Meccan";

                        return (
                            <Link
                                key={surah.number}
                                href={`/deen-islam/quran/${surah.number}`}
                                aria-label={`${surah.englishName}, সূরা ${bn(surah.number)}`}
                                className="group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-[#E5EAE1] bg-white p-3.5 shadow-[0_3px_14px_rgba(29,67,43,0.035)] transition duration-300 hover:-translate-y-1 hover:border-[#CDBB87]/65 hover:shadow-[0_14px_32px_rgba(29,67,43,0.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#39865D] focus-visible:ring-offset-2 sm:gap-4 sm:p-4"
                            >
                                {/* Subtle hover accent */}
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-[#CDBB87]/0 to-transparent transition duration-300 group-hover:via-[#CDBB87]/90"
                                />

                                {/* Ornamental number badge */}
                                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-[5px] rotate-45 rounded-[5px] border border-[#C5A75F]/55 bg-[#FBF6E8] transition duration-300 group-hover:rotate-[135deg] group-hover:border-[#A88B48]/80 group-hover:bg-[#F6EBCB]"
                                    />

                                    <span className="relative text-sm font-bold tabular-nums text-[#8A6A2C]">
                                        {bn(surah.number)}
                                    </span>
                                </div>

                                {/* Surah details */}
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate text-[14px] font-bold text-[#244632] transition-colors group-hover:text-[#187449] sm:text-[15px]">
                                        {surah.englishName}
                                    </h3>

                                    <p className="mt-1 truncate text-[11px] leading-5 text-[#829087] sm:text-xs">
                                        {surah.englishNameTranslation}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                        <span className="rounded-md bg-[#F1F5EE] px-2 py-1 text-[10px] font-medium text-[#627767] sm:text-[11px]">
                                            {bn(surah.numberOfAyahs)} আয়াত
                                        </span>

                                        <span
                                            className={`rounded-md px-2 py-1 text-[10px] font-medium sm:text-[11px] ${isMeccan
                                                    ? "bg-[#F8F0DE] text-[#90743B]"
                                                    : "bg-[#E8F3EC] text-[#397653]"
                                                }`}
                                        >
                                            {isMeccan ? "মক্কী" : "মাদানী"}
                                        </span>
                                    </div>
                                </div>

                                {/* Arabic name and arrow */}
                                <div className="flex shrink-0 flex-col items-center gap-2 pl-1">
                                    <span
                                        dir="rtl"
                                        lang="ar"
                                        className={`${arabic.className} max-w-[100px] truncate text-right text-lg leading-relaxed text-[#276344] transition-colors group-hover:text-[#A2833E] sm:max-w-[116px] sm:text-xl`}
                                    >
                                        {surah.name
                                            .replace("سُورَةُ ", "")
                                            .replace("سورة ", "")}
                                    </span>

                                    <span
                                        aria-hidden="true"
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8ECE5] text-[#9AA79D] transition duration-300 group-hover:border-[#D8C99F] group-hover:bg-[#FBF6E8] group-hover:text-[#8A6A2C]"
                                    >
                                        <ArrowUpRight
                                            size={14}
                                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}