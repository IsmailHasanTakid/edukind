"use client";

import { useEffect, useRef, useState } from "react";
import {
    Bookmark,
    Check,
    ChevronDown,
    Copy,
    ExternalLink,
    Heart,
    Search,
    SearchX,
    Sparkles,
    X,
} from "lucide-react";
import { arabic, bangla, bnSerif } from "@/lib/deen-fonts";
import {
    DUAS,
    DUA_CATEGORIES,
    FEATURED_DUA_ID,
    getCategoryById,
} from "../data/duas";
import { toBn } from "../utils/dates";
import { GeometricPattern } from "./Decor";
import SectionHeading from "./SectionHeading";
import { DeenIcon } from "./icons";

async function writeToClipboard(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
    } catch {
        // Fall through to the textarea fallback.
    }

    try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        return copied;
    } catch {
        return false;
    }
}

function FavoriteButton({ active, onClick, label }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            aria-label={label}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2 ${active
                ? "border-[#C69B52] bg-[#FBF1E8] text-[#8A6A2F]"
                : "border-[#E4D2B8] bg-white/80 text-[#6A7D75] hover:border-[#C69B52] hover:text-[#8A6A2F]"
                }`}
        >
            <Bookmark
                size={15}
                strokeWidth={1.8}
                fill={active ? "currentColor" : "none"}
                aria-hidden="true"
            />
        </button>
    );
}

function CategoryCard({ category, count, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2 ${active
                ? "border-[#C69B52] bg-[#1E4F4A] text-white shadow-[0_14px_30px_rgba(30,79,74,0.2)]"
                : "border-[#EADCCB] bg-[#FFF8EF] text-[#153B37] hover:-translate-y-0.5 hover:border-[#D8C4A8] hover:shadow-[0_12px_26px_rgba(21,59,55,0.08)]"
                }`}
        >
            <span
                aria-hidden="true"
                className={`absolute -right-6 -top-7 h-20 w-20 rounded-full border ${active ? "border-white/10" : "border-[#C69B52]/12"
                    }`}
            />
            <span
                aria-hidden="true"
                className={`absolute -right-1 -top-2 h-12 w-12 rotate-45 border ${active ? "border-white/10" : "border-[#C69B52]/10"
                    }`}
            />

            <span className="flex items-start justify-between gap-2">
                <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${active
                        ? "border-white/15 bg-white/10 text-[#E8CE96]"
                        : "border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]"
                        }`}
                >
                    <DeenIcon
                        name={category.icon}
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </span>
                <span
                    className={`rounded-full px-2 py-0.5 text-[11px] sm:text-xs font-semibold ${active
                        ? "bg-[#E8CE96] text-[#153B37]"
                        : "bg-[#F3E8DA] text-[#8A6A2F]"
                        }`}
                >
                    {toBn(count)}টি
                </span>
            </span>

            <span className="mt-3 block text-sm sm:text-base font-bold leading-5">
                {category.title}
            </span>
            <span
                className={`mt-1 block text-xs sm:text-sm leading-5 ${active ? "text-[#DCE8E2]/70" : "text-[#718078]"
                    }`}
            >
                {category.description}
            </span>
        </button>
    );
}

export default function DuaSection({
    favorites,
    favoritesReady,
    onToggleFavorite,
    filter,
    onFilterChange,
    search,
    onSearchChange,
    onViewAll,
}) {
    const [featuredId, setFeaturedId] = useState(FEATURED_DUA_ID);
    const [copyState, setCopyState] = useState({ id: null, status: "idle" });
    const copyTimer = useRef(null);

    useEffect(() => {
        return () => {
            if (copyTimer.current) clearTimeout(copyTimer.current);
        };
    }, []);

    const normalizedSearch = search.trim().toLowerCase();
    const matches = DUAS.filter((dua) => {
        if (filter === "favorites" && !favorites.includes(dua.id)) return false;
        if (
            filter !== "all" &&
            filter !== "favorites" &&
            dua.category !== filter
        ) {
            return false;
        }
        if (!normalizedSearch) return true;

        const categoryTitle = getCategoryById(dua.category)?.title ?? "";
        return [
            dua.title,
            dua.arabic,
            dua.transliteration,
            dua.meaning,
            dua.reference,
            categoryTitle,
        ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedSearch);
    });

    const featured =
        matches.find((dua) => dua.id === featuredId) ?? matches[0] ?? null;
    const otherDuas = featured
        ? matches.filter((dua) => dua.id !== featured.id)
        : matches;

    const handleCopy = async (dua) => {
        const text = [
            dua.title,
            "",
            dua.arabic,
            "",
            `বাংলা উচ্চারণ: ${dua.transliteration}`,
            `অর্থ: ${dua.meaning}`,
            `সূত্র: ${dua.reference}`,
        ].join("\n");

        const copied = await writeToClipboard(text);
        setCopyState({ id: dua.id, status: copied ? "success" : "error" });

        if (copyTimer.current) clearTimeout(copyTimer.current);
        copyTimer.current = setTimeout(() => {
            setCopyState({ id: null, status: "idle" });
        }, 2600);
    };

    const clearFilters = () => {
        onFilterChange("all");
        onSearchChange("");
    };

    const isFavorite = (id) => favorites.includes(id);
    const categoryLabel = featured
        ? getCategoryById(featured.category)?.title
        : null;

    return (
        <section
            id="duas"
            aria-labelledby="duas-heading"
            className="scroll-mt-24 pt-12 sm:pt-16"
        >
            <SectionHeading
                eyebrow="DUA · SUPPLICATION"
                title="দৈনন্দিন দোয়া"
                description="নির্ভরযোগ্য সূত্রে বর্ণিত দোয়াগুলো আরবি, বাংলা উচ্চারণ ও অর্থসহ পড়ুন।"
                icon={Heart}
                headingId="duas-heading"
                action={
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D8C4A8] bg-white px-4 text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        সব দোয়া দেখুন
                        <ChevronDown
                            size={14}
                            className="text-[#8A6A2F]"
                            aria-hidden="true"
                        />
                    </button>
                }
            />

            <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {DUA_CATEGORIES.map((category) => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        count={
                            DUAS.filter((dua) => dua.category === category.id)
                                .length
                        }
                        active={filter === category.id}
                        onClick={() =>
                            onFilterChange(
                                filter === category.id ? "all" : category.id
                            )
                        }
                    />
                ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                <label className="relative flex min-h-11 flex-1 items-center rounded-xl border border-[#DDCDB7] bg-white transition focus-within:border-[#1E4F4A] focus-within:ring-4 focus-within:ring-[#1E4F4A]/10">
                    <Search
                        size={16}
                        className="ml-3.5 shrink-0 text-[#8A6A2F]"
                        aria-hidden="true"
                    />
                    <span className="sr-only">দোয়া খুঁজুন</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="দোয়ার নাম, অর্থ বা আরবি শব্দ দিয়ে খুঁজুন…"
                        className="min-h-11 min-w-0 flex-1 bg-transparent px-3 text-sm sm:text-base text-[#153B37] outline-none placeholder:text-[#97A29B]"
                    />
                    {search ? (
                        <button
                            type="button"
                            onClick={() => onSearchChange("")}
                            aria-label="সার্চ মুছুন"
                            className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#718078] transition hover:bg-[#F3E8DA] hover:text-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                        >
                            <X size={14} aria-hidden="true" />
                        </button>
                    ) : null}
                </label>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onFilterChange("all")}
                        aria-pressed={filter === "all"}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-1 ${filter === "all"
                            ? "border-[#1E4F4A] bg-[#1E4F4A] text-white"
                            : "border-[#D8C4A8] bg-white text-[#405A52] hover:border-[#C69B52]"
                            }`}
                    >
                        সব দোয়া
                        <span className="rounded-full bg-white/15 px-1.5 text-[11px] sm:text-xs">
                            {toBn(DUAS.length)}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => onFilterChange("favorites")}
                        aria-pressed={filter === "favorites"}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-1 ${filter === "favorites"
                            ? "border-[#8A6A2F] bg-[#8A6A2F] text-white"
                            : "border-[#D8C4A8] bg-white text-[#405A52] hover:border-[#C69B52]"
                            }`}
                    >
                        <Bookmark
                            size={12}
                            fill={
                                filter === "favorites" ? "currentColor" : "none"
                            }
                            aria-hidden="true"
                        />
                        ফেভারিট
                        <span className="rounded-full bg-white/15 px-1.5 text-[11px] sm:text-xs">
                            {favoritesReady ? toBn(favorites.length) : "—"}
                        </span>
                    </button>

                    {filter !== "all" || search ? (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex min-h-9 items-center gap-1 rounded-full px-2.5 text-xs sm:text-sm font-medium text-[#8A6A2F] transition hover:bg-[#F3E8DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                        >
                            <X size={12} aria-hidden="true" />
                            ফিল্টার মুছুন
                        </button>
                    ) : null}
                </div>
            </div>

            <div className="mt-5" aria-live="polite">
                {featured ? (
                    <article className="relative overflow-hidden rounded-[1.75rem] border border-[#DCC7A9] bg-[#FBF1E8] p-5 shadow-[0_20px_50px_rgba(21,59,55,0.09)] sm:p-7">
                        <GeometricPattern className="opacity-[0.045]" />
                        <div
                            aria-hidden="true"
                            className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-[#C69B52]/15"
                        />
                        <div
                            aria-hidden="true"
                            className="absolute -right-8 -top-12 h-36 w-36 rotate-45 border border-[#C69B52]/10"
                        />

                        <div className="relative">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9C09A] bg-[#FFF8EF] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#8A6A2F]">
                                        <Sparkles
                                            size={11}
                                            aria-hidden="true"
                                        />
                                        নির্বাচিত দোয়া
                                    </span>
                                    {categoryLabel ? (
                                        <span className="text-xs sm:text-sm font-medium text-[#718078]">
                                            {categoryLabel}
                                        </span>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-2">
                                    <FavoriteButton
                                        active={isFavorite(featured.id)}
                                        onClick={() =>
                                            onToggleFavorite(featured.id)
                                        }
                                        label={
                                            isFavorite(featured.id)
                                                ? `${featured.title} ফেভারিট থেকে সরান`
                                                : `${featured.title} ফেভারিট করুন`
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(featured)}
                                        className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#D8C4A8] bg-white/85 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#405A52] transition hover:border-[#C69B52] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                                    >
                                        {copyState.id === featured.id &&
                                            copyState.status === "success" ? (
                                            <Check
                                                size={13}
                                                className="text-[#1E4F4A]"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Copy
                                                size={13}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {copyState.id === featured.id
                                            ? copyState.status === "success"
                                                ? "কপি হয়েছে"
                                                : copyState.status === "error"
                                                    ? "কপি ব্যর্থ"
                                                    : "কপি"
                                            : "কপি"}
                                    </button>
                                </div>
                            </div>

                            <h3
                                className={`${bnSerif.className} mt-4 text-xl font-bold text-[#153B37] sm:text-2xl`}
                            >
                                {featured.title}
                            </h3>

                            <div className="mt-4 rounded-2xl border border-[#E4D2B8] bg-[#FFF8EF]/85 px-4 py-5 sm:px-6">
                                <p
                                    dir="rtl"
                                    lang="ar"
                                    className={`${arabic.className} text-right text-2xl leading-[2.15] text-[#153B37] sm:text-[1.75rem]`}
                                >
                                    {featured.arabic}
                                </p>
                            </div>

                            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#8A6A2F]">
                                        বাংলা উচ্চারণ
                                    </dt>
                                    <dd className="mt-1.5 text-sm sm:text-base leading-7 text-[#405A52]">
                                        {featured.transliteration}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#8A6A2F]">
                                        অর্থ
                                    </dt>
                                    <dd className="mt-1.5 text-sm sm:text-base leading-7 text-[#405A52]">
                                        {featured.meaning}
                                    </dd>
                                </div>
                            </dl>

                            {featured.note ? (
                                <p className="mt-4 rounded-xl border border-[#E4D2B8] bg-[#FFF8EF]/80 px-3.5 py-2.5 text-xs sm:text-sm leading-6 text-[#6F5322]">
                                    {featured.note}
                                </p>
                            ) : null}

                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4D2B8] pt-4">
                                <a
                                    href={featured.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                                >
                                    সূত্র: {featured.reference}
                                    <ExternalLink
                                        size={12}
                                        aria-hidden="true"
                                    />
                                </a>

                                <span
                                    role="status"
                                    className={`text-xs sm:text-sm ${copyState.status === "error"
                                        ? "text-[#A54A3A]"
                                        : "text-[#718078]"
                                        }`}
                                >
                                    {copyState.id === featured.id &&
                                        copyState.status === "error"
                                        ? "কপি করা যায়নি; ম্যানুয়ালি কপি করুন।"
                                        : ""}
                                </span>
                            </div>
                        </div>
                    </article>
                ) : (
                    <div className="rounded-[1.75rem] border border-dashed border-[#D8C4A8] bg-[#FFF8EF] px-5 py-14 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E4D2B8] bg-[#FBF1E8] text-[#8A6A2F]">
                            {filter === "favorites" ? (
                                <Bookmark
                                    size={24}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            ) : (
                                <SearchX
                                    size={24}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                            )}
                        </span>
                        <h3 className="mt-4 text-base font-bold text-[#153B37]">
                            {filter === "favorites"
                                ? "কোনো ফেভারিট দোয়া নেই"
                                : "এই অনুসন্ধানে কোনো দোয়া পাওয়া যায়নি"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#718078]">
                            {filter === "favorites"
                                ? "দোয়া কার্ডের বুকমার্ক আইকনে চাপ দিয়ে পছন্দের দোয়া সংরক্ষণ করুন।"
                                : "অন্য শব্দ দিয়ে খুঁজুন বা ফিল্টার মুছে সব দোয়া দেখুন।"}
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#1E4F4A] px-4 text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                        >
                            সব দোয়া দেখুন
                        </button>
                    </div>
                )}
            </div>

            {otherDuas.length > 0 ? (
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-sm sm:text-base font-bold text-[#153B37]">
                            {filter === "favorites"
                                ? "আপনার ফেভারিট দোয়া"
                                : "আরও দোয়া"}
                        </h3>
                        <span className="text-xs sm:text-sm text-[#718078]">
                            {toBn(matches.length)}টি দোয়া
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {otherDuas.map((dua) => {
                            return (
                                <article
                                    key={dua.id}
                                    className={`${bangla.className} group flex flex-col rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#D8C4A8] hover:shadow-[0_12px_26px_rgba(21,59,55,0.08)]`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]">
                                            <DeenIcon
                                                name={
                                                    getCategoryById(
                                                        dua.category
                                                    )?.icon
                                                }
                                                size={16}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <FavoriteButton
                                            active={isFavorite(dua.id)}
                                            onClick={() =>
                                                onToggleFavorite(dua.id)
                                            }
                                            label={
                                                isFavorite(dua.id)
                                                    ? `${dua.title} ফেভারিট থেকে সরান`
                                                    : `${dua.title} ফেভারিট করুন`
                                            }
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setFeaturedId(dua.id)}
                                        className="mt-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                                    >
                                        <h4 className="text-sm sm:text-base font-bold text-[#153B37]">
                                            {dua.title}
                                        </h4>
                                        <p
                                            dir="rtl"
                                            lang="ar"
                                            className={`${arabic.className} mt-2 line-clamp-2 text-right text-lg leading-8 text-[#405A52]`}
                                        >
                                            {dua.arabic}
                                        </p>
                                        <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-6 text-[#718078]">
                                            {dua.meaning}
                                        </p>
                                    </button>

                                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-[#EADCCB] pt-3">
                                        <span className="text-[11px] sm:text-xs text-[#8A6A2F]">
                                            {dua.reference}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFeaturedId(dua.id)
                                            }
                                            className="text-xs sm:text-sm font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                                        >
                                            বিস্তারিত দেখুন
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            <p className="mt-4 text-xs sm:text-sm leading-6 text-[#839088]">
                আরবি পাঠ ও সূত্র যাচাই করা হয়েছে। বাংলা উচ্চারণ সহায়ক; শুদ্ধ
                তিলাওয়াতের জন্য শিক্ষকের সাহায্য নিন।
            </p>
        </section>
    );
}
