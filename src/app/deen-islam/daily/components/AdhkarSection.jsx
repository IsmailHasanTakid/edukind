"use client";

import { useEffect, useRef, useState } from "react";
import {
    Check,
    ExternalLink,
    Minus,
    MoonStar,
    Plus,
    RotateCcw,
    Sun,
    Undo2,
} from "lucide-react";
import { arabic, bnSerif } from "@/lib/deen-fonts";
import { ADHKAR_PERIODS } from "../data/adhkar";
import { toBn } from "../utils/dates";
import SectionHeading from "./SectionHeading";

function itemKey(periodId, itemId) {
    return `${periodId}:${itemId}`;
}

function PeriodTab({ period, count, completed, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`group relative flex min-h-12 flex-1 items-center justify-between gap-3 overflow-hidden rounded-xl border px-3.5 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2 sm:px-4 ${
                active
                    ? "border-[#C69B52] bg-[#1E4F4A] text-white shadow-[0_10px_24px_rgba(30,79,74,0.2)]"
                    : "border-[#DDCDB7] bg-white text-[#153B37] hover:border-[#C69B52] hover:bg-[#FFF8EF]"
            }`}
        >
            <span className="flex min-w-0 items-center gap-2.5">
                <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                        active
                            ? "border-white/15 bg-white/10 text-[#E8CE96]"
                            : "border-[#E4D2B8] bg-[#FBF1E8] text-[#8A6A2F]"
                    }`}
                >
                    {period.id === "morning" ? (
                        <Sun size={15} aria-hidden="true" />
                    ) : (
                        <MoonStar size={15} aria-hidden="true" />
                    )}
                </span>
                <span className="min-w-0">
                    <span className="block text-sm font-bold">
                        {period.label}
                    </span>
                    <span
                        className={`mt-0.5 block truncate text-xs sm:text-sm ${
                            active ? "text-[#DCE8E2]/70" : "text-[#718078]"
                        }`}
                    >
                        {period.description}
                    </span>
                </span>
            </span>

            <span
                className={`shrink-0 rounded-full px-2 py-1 text-[11px] sm:text-xs font-bold ${
                    active
                        ? "bg-[#E8CE96] text-[#153B37]"
                        : "bg-[#F3E8DA] text-[#8A6A2F]"
                }`}
            >
                {toBn(completed)}/{toBn(count)}
            </span>
        </button>
    );
}

function AdhkarCard({
    item,
    count,
    onIncrement,
    onDecrement,
    onReset,
}) {
    const safeCount = Math.min(count, item.target);
    const isComplete = safeCount >= item.target;
    const percent = Math.min(
        100,
        Math.round((safeCount / Math.max(1, item.target)) * 100)
    );

    return (
        <article
            className={`relative flex flex-col overflow-hidden rounded-2xl border p-4 transition sm:p-5 ${
                isComplete
                    ? "border-[#9FC4B5] bg-[#F2F8F4] shadow-[0_10px_26px_rgba(30,79,74,0.08)]"
                    : "border-[#EADCCB] bg-[#FFF8EF] shadow-[0_4px_16px_rgba(21,59,55,0.04)]"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3
                        className={`${bnSerif.className} text-base sm:text-lg font-bold leading-6 ${
                            isComplete ? "text-[#1E4F4A]" : "text-[#153B37]"
                        }`}
                    >
                        {item.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-[#8A6A2F]">
                        {item.reference}
                    </p>
                </div>

                {isComplete ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#1E4F4A] px-2 py-1 text-[11px] sm:text-xs font-bold text-white">
                        <Check size={10} aria-hidden="true" />
                        সম্পন্ন
                    </span>
                ) : null}
            </div>

            <div className="mt-3 rounded-xl border border-[#E4D2B8] bg-[#FFFBF5] px-3.5 py-3.5">
                <p
                    dir="rtl"
                    lang="ar"
                    className={`${arabic.className} text-right text-[1.35rem] leading-[2] text-[#153B37] sm:text-2xl`}
                >
                    {item.arabic}
                </p>
            </div>

            <p className="mt-3 text-xs sm:text-sm leading-6 text-[#405A52]">
                <span className="font-semibold text-[#6F5322]">উচ্চারণ: </span>
                {item.transliteration}
            </p>
            <p className="mt-1 text-xs sm:text-sm leading-6 text-[#718078]">
                <span className="font-semibold text-[#6F5322]">অর্থ: </span>
                {item.meaning}
            </p>

            {item.note ? (
                <p className="mt-2 rounded-lg border border-[#E4D2B8] bg-[#FBF1E8] px-2.5 py-2 text-xs sm:text-sm leading-5 text-[#6F5322]">
                    {item.note}
                </p>
            ) : null}

            <div className="mt-auto pt-4">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm text-[#718078]">
                        লক্ষ্য:{" "}
                        <span className="font-bold text-[#1E4F4A]">
                            {toBn(item.target)} বার
                        </span>
                    </p>
                    {safeCount > 0 ? (
                        <button
                            type="button"
                            onClick={() => onReset()}
                            className="inline-flex min-h-8 items-center gap-1 rounded-full px-2 text-xs sm:text-sm font-medium text-[#8A6A2F] transition hover:bg-[#F3E8DA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                        >
                            <RotateCcw size={11} aria-hidden="true" />
                            রিসেট
                        </button>
                    ) : null}
                </div>

                <div
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E8DCCB]"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={item.target}
                    aria-valuenow={safeCount}
                    aria-label={`${item.title} গণনার অগ্রগতি`}
                >
                    <div
                        className={`h-full rounded-full transition-[width] duration-300 ${
                            isComplete
                                ? "bg-gradient-to-r from-[#1E4F4A] to-[#4D8B7C]"
                                : "bg-gradient-to-r from-[#C69B52] to-[#E8CE96]"
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onDecrement()}
                        disabled={safeCount <= 0}
                        aria-label={`${item.title} গণনা এক কম করুন`}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#DDCDB7] bg-white text-[#405A52] transition hover:border-[#C69B52] hover:text-[#8A6A2F] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <Minus size={15} aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        onClick={() => onIncrement()}
                        disabled={isComplete}
                        aria-label={`${item.title} একবার গণনা করুন`}
                        className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2 ${
                            isComplete
                                ? "cursor-default border border-[#9FC4B5] bg-[#E4F0E9] text-[#1E4F4A]"
                                : "bg-[#1E4F4A] text-white hover:bg-[#153B37] active:translate-y-px"
                        }`}
                    >
                        {isComplete ? (
                            <>
                                <Check size={14} aria-hidden="true" />
                                লক্ষ্য পূর্ণ
                            </>
                        ) : (
                            <>
                                <Plus size={14} aria-hidden="true" />
                                পড়া হয়েছে
                            </>
                        )}
                    </button>

                    <span
                        className={`inline-flex h-10 min-w-[74px] shrink-0 items-center justify-center rounded-xl border px-2 text-sm sm:text-base font-bold tabular-nums ${
                            isComplete
                                ? "border-[#9FC4B5] bg-white text-[#1E4F4A]"
                                : "border-[#DDCDB7] bg-white text-[#153B37]"
                        }`}
                        aria-label={`${toBn(safeCount)} বার সম্পন্ন, লক্ষ্য ${toBn(item.target)} বার`}
                    >
                        {toBn(safeCount)}
                        <span className="mx-0.5 text-xs sm:text-sm font-medium text-[#97A29B]">
                            /
                        </span>
                        {toBn(item.target)}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function AdhkarSection({
    counts,
    ready,
    onIncrement,
    onDecrement,
    onResetItems,
    onRestore,
    dateLabel,
}) {
    const [activePeriod, setActivePeriod] = useState("morning");
    const [undo, setUndo] = useState(null);
    const undoTimer = useRef(null);

    useEffect(() => {
        return () => {
            if (undoTimer.current) clearTimeout(undoTimer.current);
        };
    }, []);

    const period =
        ADHKAR_PERIODS.find((entry) => entry.id === activePeriod) ??
        ADHKAR_PERIODS[0];

    const completedCount = period.items.filter(
        (item) =>
            (counts[itemKey(period.id, item.id)] ?? 0) >= item.target
    ).length;

    const showUndo = (snapshot, message) => {
        setUndo({ snapshot, message });
        if (undoTimer.current) clearTimeout(undoTimer.current);
        undoTimer.current = setTimeout(() => setUndo(null), 7000);
    };

    const resetItems = (items, message) => {
        const snapshot = {};
        for (const item of items) {
            const key = itemKey(period.id, item.id);
            const value = counts[key] ?? 0;
            if (value > 0) snapshot[key] = value;
        }

        if (Object.keys(snapshot).length === 0) return;

        onResetItems(
            items.map((item) => itemKey(period.id, item.id))
        );
        showUndo(snapshot, message);
    };

    const handleRestore = () => {
        if (!undo) return;
        onRestore(undo.snapshot);
        setUndo(null);
        if (undoTimer.current) clearTimeout(undoTimer.current);
    };

    return (
        <section
            id="adhkar"
            aria-labelledby="adhkar-heading"
            className="scroll-mt-24 pt-12 sm:pt-16"
        >
            <SectionHeading
                eyebrow="ADHKAR · REMEMBRANCE"
                title="সকাল ও সন্ধ্যার যিকির"
                description="হাদিসে বর্ণিত যিকিরগুলো লক্ষ্য সংখ্যাসহ পড়ুন এবং আজকের অগ্রগতি সংরক্ষণ করুন।"
                icon={MoonStar}
                headingId="adhkar-heading"
                action={
                    <button
                        type="button"
                        onClick={() =>
                            resetItems(
                                period.items,
                                `${period.label} রিসেট হয়েছে`
                            )
                        }
                        disabled={period.items.every(
                            (item) =>
                                (counts[itemKey(period.id, item.id)] ?? 0) ===
                                0
                        )}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D8C4A8] bg-white px-4 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <RotateCcw size={13} aria-hidden="true" />
                        {period.shortLabel} রিসেট
                    </button>
                }
            />

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                {ADHKAR_PERIODS.map((entry) => {
                    const done = entry.items.filter(
                        (item) =>
                            (counts[itemKey(entry.id, item.id)] ?? 0) >=
                            item.target
                    ).length;

                    return (
                        <PeriodTab
                            key={entry.id}
                            period={entry}
                            count={entry.items.length}
                            completed={ready ? done : 0}
                            active={entry.id === activePeriod}
                            onClick={() => setActivePeriod(entry.id)}
                        />
                    );
                })}
            </div>

            <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#E6D6BC] bg-[#FBF1E8] px-3.5 py-2.5 text-xs sm:text-sm leading-5 text-[#6F5322] sm:flex-row sm:items-center sm:justify-between">
                <span>
                    আজকের গণনা:{" "}
                    <strong className="font-bold text-[#153B37]">
                        {ready ? toBn(completedCount) : "—"}
                    </strong>{" "}
                    / {toBn(period.items.length)} যিকির সম্পন্ন
                    {dateLabel ? ` · ${dateLabel}` : ""}
                </span>
                <span className="text-[#839088]">
                    সংখ্যা শুধু ব্যক্তিগত অগ্রগতির জন্য; গ্রহণযোগ্যতা আল্লাহর
                    কাছে।
                </span>
            </div>

            {undo ? (
                <div
                    role="status"
                    className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D8C4A8] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#405A52] shadow-[0_8px_20px_rgba(21,59,55,0.06)]"
                >
                    <span>{undo.message}</span>
                    <button
                        type="button"
                        onClick={handleRestore}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#1E4F4A] px-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <Undo2 size={12} aria-hidden="true" />
                        ফিরিয়ে আনুন
                    </button>
                </div>
            ) : null}

            <div
                className="mt-4 grid gap-3 lg:grid-cols-2"
            >
                {period.items.map((item) => {
                    const key = itemKey(period.id, item.id);

                    return (
                        <AdhkarCard
                            key={key}
                            item={item}
                            count={counts[key] ?? 0}
                            onIncrement={() => onIncrement(key)}
                            onDecrement={() => onDecrement(key)}
                            onReset={() =>
                                resetItems(
                                    [item],
                                    `${item.title} রিসেট হয়েছে`
                                )
                            }
                        />
                    );
                })}
            </div>

            <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-[#EADCCB] bg-[#FFF8EF] px-3.5 py-3 text-xs sm:text-sm leading-5 text-[#718078]">
                <p>
                    সূত্র: প্রতিটি যিকিরের সঙ্গে হাদিসের রেফারেন্স দেওয়া হয়েছে।
                    বিস্তারিত জানতে রেফারেন্স লিংকে দেখুন।
                </p>
                <a
                    href="https://sunnah.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1 font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                >
                    Sunnah.com-এ যাচাই করুন
                    <ExternalLink size={11} aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}
