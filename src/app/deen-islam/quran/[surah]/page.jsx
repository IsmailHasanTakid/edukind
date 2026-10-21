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
            className={`${bangla.className} min-h-screen bg-[linear-gradient(180deg,#F7FAF8_0%,#EDF5EF_45%,#F8F3E6_100%)] text-[#1B3A2F]`}
        >
            <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
                {/* Breadcrumb */}
                <nav
                    aria-label="breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-xs text-[#7C8A82]"
                >
                    <Link href="/deen-islam" className="transition hover:text-[#119A62]">
                        DeenIslam
                    </Link>
                    <ChevronRight size={13} />
                    <Link
                        href="/deen-islam/quran"
                        className="transition hover:text-[#119A62]"
                    >
                        কুরআন
                    </Link>
                    <ChevronRight size={13} />
                    <span className="text-[#1F6B4C]">{info.englishName}</span>
                </nav>

                {/* সূরার হেডার */}
                <header className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B3B2D] via-[#0F4D3A] to-[#14614A] px-6 py-9 text-center shadow-[0_24px_60px_rgba(11,59,45,0.22)] ring-1 ring-[#E8C872]/25">
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#E8C872]/20 blur-[90px]" />

                    <p className="relative text-[11px] font-semibold tracking-[0.25em] text-[#E8C872]">
                        সূরা নং {bn(info.number)}
                    </p>

                    <h1
                        dir="rtl"
                        lang="ar"
                        className={`${arabic.className} relative mt-3 text-5xl leading-[1.6] text-[#F6E3A1]`}
                    >
                        {info.name}
                    </h1>

                    <p className="relative mt-1 text-lg font-semibold text-white">
                        {info.englishName}
                    </p>
                    <p className="relative mt-1 text-sm text-[#D5E2DA]">
                        {info.englishNameTranslation}
                    </p>

                    <div className="relative mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs">
                        <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-white">
                            {bn(info.numberOfAyahs)} আয়াত
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-white">
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
                    className="mt-4 grid gap-3 sm:grid-cols-2"
                >
                    {prev ? (
                        <Link
                            href={`/deen-islam/quran/${prev.number}`}
                            className="group flex items-center gap-3 rounded-2xl border border-[#E3EAE5] bg-white p-4 transition hover:border-[#119A62]/40 hover:shadow-[0_12px_30px_rgba(20,60,45,0.1)]"
                        >
                            <ArrowLeft className="h-4 w-4 text-[#7C8A82] transition group-hover:-translate-x-1 group-hover:text-[#119A62]" />
                            <div>
                                <p className="text-[11px] text-[#7C8A82]">আগের সূরা</p>
                                <p className="text-sm font-semibold">{prev.englishName}</p>
                            </div>
                        </Link>
                    ) : (
                        <span />
                    )}

                    {next && (
                        <Link
                            href={`/deen-islam/quran/${next.number}`}
                            className="group flex items-center justify-end gap-3 rounded-2xl border border-[#E3EAE5] bg-white p-4 text-right transition hover:border-[#119A62]/40 hover:shadow-[0_12px_30px_rgba(20,60,45,0.1)]"
                        >
                            <div>
                                <p className="text-[11px] text-[#7C8A82]">পরের সূরা</p>
                                <p className="text-sm font-semibold">{next.englishName}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#7C8A82] transition group-hover:translate-x-1 group-hover:text-[#119A62]" />
                        </Link>
                    )}
                </nav>

                <p className="mt-8 text-center text-xs leading-6 text-[#8A968F]">
                    আরবি টেক্সট, অনুবাদ ও অডিও: AlQuran Cloud API।
                    {translator && <> বাংলা অনুবাদ: {translator}।</>}
                    {reciter && <> তিলাওয়াত: {reciter}।</>}
                </p>
            </div>
        </main>
    );
}