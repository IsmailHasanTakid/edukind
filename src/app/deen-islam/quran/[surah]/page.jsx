import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getSurah, getSurahList, TOTAL_SURAHS } from "@/lib/quran";
import { arabic, bangla } from "@/lib/deen-fonts";
import SurahReader from "@/components/deen/SurahReader";

const bn = (n) => n.toLocaleString("bn-BD");

function isValidSurah(number) {
    return Number.isInteger(number) && number >= 1 && number <= TOTAL_SURAHS;
}

export function generateStaticParams() {
    return Array.from({ length: TOTAL_SURAHS }, (_, i) => ({
        surah: String(i + 1),
    }));
}

export async function generateMetadata({ params }) {
    const { surah } = await params;
    const number = Number(surah);

    if (!isValidSurah(number)) {
        return { title: "কুরআন | DeenIslam" };
    }

    const surahs = await getSurahList();
    const current = surahs.find((s) => s.number === number);

    return {
        title: `সূরা ${current?.englishName ?? number} | DeenIslam`,
    };
}

export default async function SurahPage({ params }) {
    const { surah } = await params;
    const number = Number(surah);

    if (!isValidSurah(number)) {
        notFound();
    }

    const [{ info, ayahs, translator, reciter }, surahs] = await Promise.all([
        getSurah(number),
        getSurahList(),
    ]);

    const prev = surahs.find((s) => s.number === number - 1);
    const next = surahs.find((s) => s.number === number + 1);
    const showBismillah = number !== 1 && number !== 9;

    return (
        <main
            className={`${bangla.className} relative min-h-screen bg-[linear-gradient(180deg,#F7FAF8_0%,#EDF5EF_45%,#F8F3E6_100%)] text-[#1B3A2F]`}
        >
            {/* সূক্ষ্ম পৃষ্ঠা-আলোকছটা */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden"
            >
                <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-[#119A62]/[0.07] blur-[100px]" />
                <div className="absolute -right-20 -top-10 h-80 w-80 rounded-full bg-[#C9A14A]/[0.1] blur-[110px]" />
            </div>

            <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
                {/* Breadcrumb */}
                <nav
                    aria-label="breadcrumb"
                    className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium tracking-wide text-[#7C8A82] sm:gap-2 sm:text-xs"
                >
                    <Link
                        href="/deen-islam"
                        className="rounded-full px-1.5 py-0.5 transition-colors hover:text-[#0F7A52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#119A62]/40"
                    >
                        DeenIslam
                    </Link>
                    <ChevronRight
                        size={13}
                        aria-hidden="true"
                        className="text-[#AEB9B2]"
                    />
                    <Link
                        href="/deen-islam/quran"
                        className="rounded-full px-1.5 py-0.5 transition-colors hover:text-[#0F7A52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#119A62]/40"
                    >
                        কুরআন
                    </Link>
                    <ChevronRight
                        size={13}
                        aria-hidden="true"
                        className="text-[#AEB9B2]"
                    />
                    <span className="px-1.5 py-0.5 font-semibold text-[#1F6B4C]">
                        {info.englishName}
                    </span>
                </nav>

                {/* সূরার হেডার */}
                <header className="relative mt-6 overflow-hidden rounded-[26px] px-5 py-10 text-center shadow-[0_28px_70px_-24px_rgba(9,47,37,0.55)] ring-1 ring-[#E8C872]/30 sm:rounded-[32px] sm:px-8 sm:py-12">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[linear-gradient(140deg,#082B21_0%,#0B3B2D_36%,#0F4D3A_68%,#14614A_100%)]"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cg fill='none' stroke='%23E8C872' stroke-width='.8'%3E%3Cpath d='M32 0 64 32 32 64 0 32Z M32 12 52 32 32 52 12 32Z M0 0 64 64 M64 0 0 64'/%3E%3C/g%3E%3C/svg%3E\")",
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#E8C872]/25 blur-[90px]"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#119A62]/35 blur-[80px]"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-[#E8C872]/70 to-transparent"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#E8C872]/15 sm:inset-3.5 sm:rounded-[24px]"
                    />

                    <div className="relative flex items-center justify-center gap-2.5 text-[#E8C872]">
                        <span
                            aria-hidden="true"
                            className="h-px w-6 bg-gradient-to-r from-transparent to-[#E8C872]/60 sm:w-9"
                        />
                        <span aria-hidden="true" className="text-[13px] leading-none">
                            ۞
                        </span>
                        <p className="text-[10px] font-semibold tracking-[0.3em] sm:text-[11px]">
                            সূরা নং {bn(info.number)}
                        </p>
                        <span
                            aria-hidden="true"
                            className="h-px w-6 bg-gradient-to-l from-transparent to-[#E8C872]/60 sm:w-9"
                        />
                    </div>

                    <h1
                        dir="rtl"
                        lang="ar"
                        className={`${arabic.className} relative mt-3 text-[2.6rem] leading-[1.5] text-[#F6E3A1] drop-shadow-[0_4px_24px_rgba(232,200,114,0.22)] sm:mt-4 sm:text-6xl sm:leading-[1.45]`}
                    >
                        {info.name}
                    </h1>

                    <div
                        aria-hidden="true"
                        className="relative mx-auto mt-4 flex items-center justify-center gap-3"
                    >
                        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#E8C872]/55 sm:w-16" />
                        <span className="h-1.5 w-1.5 rotate-45 border border-[#E8C872]/80" />
                        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#E8C872]/55 sm:w-16" />
                    </div>

                    <p className="relative mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {info.englishName}
                    </p>
                    <p className="relative mt-1.5 text-[13px] text-[#CFE0D6] sm:text-sm">
                        {info.englishNameTranslation}
                    </p>

                    <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[11px] sm:mt-7 sm:text-xs">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8C872]/25 bg-white/[0.08] px-3.5 py-1.5 font-medium text-[#F4EBD6] backdrop-blur-sm transition-colors duration-300 hover:border-[#E8C872]/45 hover:bg-white/[0.12]">
                            <span
                                aria-hidden="true"
                                className="h-1 w-1 rounded-full bg-[#E8C872]/80"
                            />
                            {bn(info.numberOfAyahs)} আয়াত
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8C872]/25 bg-white/[0.08] px-3.5 py-1.5 font-medium text-[#F4EBD6] backdrop-blur-sm transition-colors duration-300 hover:border-[#E8C872]/45 hover:bg-white/[0.12]">
                            <span
                                aria-hidden="true"
                                className="h-1 w-1 rounded-full bg-[#E8C872]/80"
                            />
                            {info.revelationType === "Meccan" ? "মক্কী" : "মাদানী"}
                        </span>
                    </div>
                </header>

                {/* তিলাওয়াত, বিসমিল্লাহ ও আয়াতসমূহ (client কম্পোনেন্ট) */}
                <SurahReader
                    surahNumber={info.number}
                    ayahs={ayahs}
                    showBismillah={showBismillah}
                    reciter={reciter}
                />

                {/* আগের / পরের সূরা */}
                <nav
                    aria-label="সূরা নেভিগেশন"
                    className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2"
                >
                    {prev ? (
                        <Link
                            href={`/deen-islam/quran/${prev.number}`}
                            className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-[#E3EAE5] bg-white/85 p-4 shadow-[0_2px_12px_rgba(20,60,45,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#119A62]/35 hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(20,60,45,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#119A62]/40 sm:p-5"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-4 left-0 w-[2px] rounded-full bg-gradient-to-b from-transparent via-[#119A62]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E3EAE5] bg-[#F4F9F5] text-[#7C8A82] transition-all duration-300 group-hover:border-[#119A62]/30 group-hover:bg-[#EAF6EF] group-hover:text-[#0F7A52]">
                                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium tracking-wide text-[#7C8A82]">
                                    আগের সূরা
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-[#1B3A2F]">
                                    {prev.englishName}
                                </p>
                            </div>
                        </Link>
                    ) : (
                        <span />
                    )}

                    {next && (
                        <Link
                            href={`/deen-islam/quran/${next.number}`}
                            className="group relative flex items-center justify-end gap-3.5 overflow-hidden rounded-2xl border border-[#E3EAE5] bg-white/85 p-4 text-right shadow-[0_2px_12px_rgba(20,60,45,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-[#119A62]/35 hover:bg-white hover:shadow-[0_18px_40px_-16px_rgba(20,60,45,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#119A62]/40 sm:p-5"
                        >
                            <span
                                aria-hidden="true"
                                className="absolute inset-y-4 right-0 w-[2px] rounded-full bg-gradient-to-b from-transparent via-[#119A62]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                            />
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium tracking-wide text-[#7C8A82]">
                                    পরের সূরা
                                </p>
                                <p className="mt-0.5 truncate text-sm font-semibold text-[#1B3A2F]">
                                    {next.englishName}
                                </p>
                            </div>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E3EAE5] bg-[#F4F9F5] text-[#7C8A82] transition-all duration-300 group-hover:border-[#119A62]/30 group-hover:bg-[#EAF6EF] group-hover:text-[#0F7A52]">
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                    )}
                </nav>

                <div className="mt-10 flex flex-col items-center gap-3">
                    <div
                        aria-hidden="true"
                        className="flex items-center gap-2.5 text-[#C9A14A]/80"
                    >
                        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#C9A14A]/45" />
                        <span className="text-[11px] leading-none">۞</span>
                        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#C9A14A]/45" />
                    </div>
                    <p className="text-center text-[11px] leading-6 text-[#8A968F] sm:text-xs">
                        আরবি টেক্সট, অনুবাদ ও অডিও: AlQuran Cloud API।
                        {translator && <> বাংলা অনুবাদ: {translator}।</>}
                        {reciter && <> তিলাওয়াত: {reciter}।</>}
                    </p>
                </div>
            </div>
        </main>
    );
}