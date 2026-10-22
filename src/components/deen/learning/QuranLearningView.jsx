"use client";

import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Bookmark,
    Clock3,
    Headphones,
    Play,
    Sparkles,
} from "lucide-react";
import SurahBrowser from "@/components/deen/SurahBrowser";
import {
    LearningFooter,
    LearningPageHeader,
    formatWhen,
} from "./learning-ui";
import { getQuranProgress } from "@/lib/learning/progress";
import { useLearningProgress } from "@/lib/learning/use-learning-progress";

function QuranSkeleton() {
    return (
        <div className="mt-6 space-y-4">
            <div className="h-28 animate-pulse rounded-2xl bg-white" />
            <div className="h-20 animate-pulse rounded-2xl bg-white" />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <div
                        key={item}
                        className="h-24 animate-pulse rounded-2xl bg-white"
                    />
                ))}
            </div>
        </div>
    );
}

export default function QuranLearningView({ surahs = [], loadError = false }) {
    const { progress, ready } = useLearningProgress();
    const quran = getQuranProgress(progress);

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(201,161,74,0.09), transparent 62%), radial-gradient(ellipse at top left, rgba(31,138,91,0.07), transparent 58%)",
                }}
            />

            <div className="relative mx-auto max-w-[1240px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <LearningPageHeader
                    title="Read Quran"
                    description="Read the Quran independently in verified Arabic with Bengali translation and audio. This is separate from the structured course curriculum."
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/deen-islam/quran/bookmarks"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            <Bookmark size={13} aria-hidden="true" />
                            Bookmarks
                        </Link>
                        <Link
                            href="/deen-islam/learning/courses"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            Quran courses
                            <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                    </div>
                </LearningPageHeader>

                {loadError ? (
                    <div
                        role="alert"
                        className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-6 text-center"
                    >
                        <BookOpen
                            size={24}
                            aria-hidden="true"
                            className="mx-auto text-amber-700"
                        />
                        <h2 className="mt-2 text-sm sm:text-base font-semibold text-amber-900">
                            The Quran library could not be loaded
                        </h2>
                        <p className="mx-auto mt-1 max-w-md text-xs sm:text-sm leading-5 text-amber-800">
                            The AlQuran Cloud request failed. Check the network
                            connection and try loading the page again.
                        </p>
                        <Link
                            href="/deen-islam/learning/quran"
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#8A6418] px-4 py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#6F4F12]"
                        >
                            Try again
                        </Link>
                    </div>
                ) : !ready ? (
                    <QuranSkeleton />
                ) : (
                    <>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                                <BookOpen
                                    size={16}
                                    aria-hidden="true"
                                    className="text-[#1B7A53]"
                                />
                                <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#8A978F]">
                                    Quran library
                                </p>
                                <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#294B3A]">
                                    {surahs.length} surahs available
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                                <Headphones
                                    size={16}
                                    aria-hidden="true"
                                    className="text-[#0F766E]"
                                />
                                <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#8A978F]">
                                    Recitation
                                </p>
                                <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#294B3A]">
                                    Audio and ayah bookmarks
                                </p>
                            </div>
                            <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                                <Sparkles
                                    size={16}
                                    aria-hidden="true"
                                    className="text-[#9A6B1F]"
                                />
                                <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#8A978F]">
                                    Source
                                </p>
                                <p className="mt-0.5 text-sm sm:text-base font-semibold text-[#294B3A]">
                                    AlQuran Cloud · Bengali translation
                                </p>
                            </div>
                        </div>

                        {quran ? (
                            <section className="mt-4 overflow-hidden rounded-2xl border border-[#DCE8DF] bg-[#0C2E24] p-5 text-white sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#E7CE93]/20 bg-[#E7CE93]/10 text-[#E7CE93]">
                                            <Clock3
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </span>
                                        <div>
                                            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#E7CE93]/75">
                                                Continue reading
                                            </p>
                                            <h2 className="mt-1 text-lg font-semibold">
                                                {quran.surahName}
                                            </h2>
                                            <p className="mt-0.5 text-xs sm:text-sm text-emerald-50/50">
                                                Last read: Ayah{" "}
                                                {Number(
                                                    quran.ayahNumber
                                                ).toLocaleString("en-BD")}{" "}
                                                · {formatWhen(quran.updatedAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/deen-islam/learning/quran/${quran.surahNumber}`}
                                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#E7CE93] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#173B2D] transition hover:bg-[#F0DCA8]"
                                    >
                                        <Play size={12} aria-hidden="true" />
                                        Open saved position
                                    </Link>
                                </div>
                            </section>
                        ) : (
                            <div className="mt-4 rounded-2xl border border-dashed border-[#D7E4DC] bg-white px-5 py-4 text-center">
                                <p className="text-xs sm:text-sm font-semibold text-[#5F6F66]">
                                    No saved reading position yet
                                </p>
                                <p className="mt-0.5 text-[11px] sm:text-xs text-[#8A978F]">
                                    Choose any surah below. Your last-read
                                    surah and ayah will be saved in this
                                    browser.
                                </p>
                            </div>
                        )}

                        <section className="mt-5 rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5">
                            <div className="flex flex-wrap items-end justify-between gap-2">
                                <div>
                                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                                        Verified text
                                    </p>
                                    <h2 className="mt-1 text-base font-semibold text-[#173B2D]">
                                        Select a surah
                                    </h2>
                                </div>
                                <p className="text-[11px] sm:text-xs text-[#9AA69D]">
                                    Arabic: Uthmani · Translation: Bengali ·
                                    Audio: Alafasy
                                </p>
                            </div>

                            <div className="mt-3">
                                <SurahBrowser
                                    surahs={surahs}
                                    hrefBuilder={(surah) =>
                                        `/deen-islam/learning/quran/${surah.number}`
                                    }
                                />
                            </div>
                        </section>

                        <p className="mt-4 rounded-xl border border-[#EADFC8] bg-[#FBF7EC] px-4 py-3 text-xs sm:text-sm leading-5 text-[#8A6418]">
                            Quranic Arabic text, Bengali translation, and audio
                            are loaded from the project&apos;s existing
                            AlQuran Cloud integration. The Academy assistant
                            cannot hear or certify recitation; use a qualified
                            teacher for pronunciation feedback.
                        </p>
                    </>
                )}

                <LearningFooter />
            </div>
        </main>
    );
}
