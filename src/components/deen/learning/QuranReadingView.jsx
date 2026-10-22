"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Bookmark,
    ChevronRight,
    Clock3,
} from "lucide-react";
import SurahReader from "@/components/deen/SurahReader";
import {
    LearningFooter,
    formatWhen,
} from "./learning-ui";
import { arabic } from "@/lib/deen-fonts";
import { getQuranProgress } from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

const bn = (number) => Number(number).toLocaleString("bn-BD");

export default function QuranReadingView({
    info,
    ayahs,
    translator,
    reciter,
    showBismillah,
    prev,
    next,
}) {
    const { progress, ready, recordQuranPosition } = useLearningProgress();
    const saved = getQuranProgress(progress);
    const savedHere = saved?.surahNumber === info.number ? saved : null;

    useEffect(() => {
        if (!ready) return;

        recordQuranPosition({
            surahNumber: info.number,
            surahName: info.englishName,
            ayahNumber: 1,
        });
        // Save once per surah opening. Ayah-level updates come from the reader.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, info.number]);

    function handleAyahChange(ayah) {
        recordQuranPosition({
            surahNumber: info.number,
            surahName: info.englishName,
            ayahNumber: ayah?.number || 1,
        });
    }

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[340px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(201,161,74,0.09), transparent 62%), radial-gradient(ellipse at top left, rgba(31,138,91,0.07), transparent 58%)",
                }}
            />

            <div className="relative mx-auto max-w-4xl px-5 py-7 sm:px-8 lg:py-9">
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#8A978F]"
                >
                    <Link
                        href="/deen-islam/learning"
                        className="transition hover:text-[#1B7A53]"
                    >
                        Learning Space
                    </Link>
                    <ChevronRight size={11} aria-hidden="true" />
                    <Link
                        href="/deen-islam/learning/quran"
                        className="transition hover:text-[#1B7A53]"
                    >
                        Read Quran
                    </Link>
                    <ChevronRight size={11} aria-hidden="true" />
                    <span className="font-medium text-[#5F6F66]">
                        {info.englishName}
                    </span>
                </nav>

                <header className="mt-4 overflow-hidden rounded-3xl border border-[#DCE8DF] bg-[#0C2E24] px-5 py-7 text-white sm:px-7 sm:py-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#E7CE93]/75">
                                Surah {bn(info.number)} ·{" "}
                                {info.revelationType === "Meccan"
                                    ? "Makki"
                                    : "Madani"}{" "}
                                · {bn(info.numberOfAyahs)} ayahs
                            </p>
                            <h1
                                dir="rtl"
                                lang="ar"
                                className={`${arabic.className} mt-3 text-4xl leading-tight text-[#F2D98D] sm:text-5xl`}
                            >
                                {info.name}
                            </h1>
                            <p className="mt-2 text-xl font-semibold text-white">
                                {info.englishName}
                            </p>
                            <p className="mt-0.5 text-xs sm:text-sm text-emerald-50/55">
                                {info.englishNameTranslation}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href="/deen-islam/quran/bookmarks"
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                                <Bookmark size={12} aria-hidden="true" />
                                Bookmarks
                            </Link>
                            <Link
                                href="/deen-islam/learning/quran"
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                                <ArrowLeft size={12} aria-hidden="true" />
                                All surahs
                            </Link>
                        </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-[11px] sm:text-xs text-emerald-50/45">
                        <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={11} aria-hidden="true" />
                            {savedHere
                                ? `Saved here: Ayah ${bn(
                                    savedHere.ayahNumber
                                )} · ${formatWhen(savedHere.updatedAt)}`
                                : "Reading position saves automatically"}
                        </span>
                        <span>
                            Text: AlQuran Cloud
                            {translator ? ` · Translation: ${translator}` : ""}
                            {reciter ? ` · Recitation: ${reciter}` : ""}
                        </span>
                    </div>
                </header>

                <div className="mt-4">
                    <SurahReader
                        surahNumber={info.number}
                        ayahs={ayahs}
                        showBismillah={showBismillah}
                        reciter={reciter}
                        onAyahChange={handleAyahChange}
                    />
                </div>

                <nav
                    aria-label="Surah navigation"
                    className="mt-4 grid gap-2 sm:grid-cols-2"
                >
                    {prev ? (
                        <Link
                            href={`/deen-islam/learning/quran/${prev.number}`}
                            className="group flex items-center gap-3 rounded-2xl border border-[#E0E9E3] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#BFD9C9]"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E0E9E3] bg-[#F8FBF9] text-[#7A887F] transition group-hover:text-[#1B7A53]">
                                <ArrowLeft size={14} aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#9AA69D]">
                                    Previous surah
                                </span>
                                <span className="mt-0.5 block truncate text-sm sm:text-base font-semibold text-[#294B3A]">
                                    {prev.englishName}
                                </span>
                            </span>
                        </Link>
                    ) : (
                        <span />
                    )}

                    {next ? (
                        <Link
                            href={`/deen-islam/learning/quran/${next.number}`}
                            className="group flex items-center justify-end gap-3 rounded-2xl border border-[#E0E9E3] bg-white p-4 text-right transition hover:-translate-y-0.5 hover:border-[#BFD9C9]"
                        >
                            <span className="min-w-0">
                                <span className="block text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#9AA69D]">
                                    Next surah
                                </span>
                                <span className="mt-0.5 block truncate text-sm sm:text-base font-semibold text-[#294B3A]">
                                    {next.englishName}
                                </span>
                            </span>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E0E9E3] bg-[#F8FBF9] text-[#7A887F] transition group-hover:text-[#1B7A53]">
                                <ArrowRight size={14} aria-hidden="true" />
                            </span>
                        </Link>
                    ) : null}
                </nav>

                <p className="mt-4 rounded-xl border border-[#EADFC8] bg-[#FBF7EC] px-4 py-3 text-xs sm:text-sm leading-5 text-[#8A6418]">
                    This reader uses the project&apos;s verified AlQuran Cloud
                    integration. Reading position and audio bookmarks are saved
                    in this browser. Text-based AI cannot certify recitation.
                </p>

                <LearningFooter />
            </div>
        </main>
    );
}
