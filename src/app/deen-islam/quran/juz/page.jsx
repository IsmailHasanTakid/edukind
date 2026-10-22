import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { bangla, bnSerif, arabic } from "@/lib/deen-fonts";
import { getJuzList, getSurahList } from "@/lib/quran";

export const metadata = {
    title: "পারা অনুযায়ী কুরআন | DeenIslam",
    description: "কুরআনের ৩০টি পারার সূচনা-স্থান ও সংশ্লিষ্ট সূরা দেখুন।",
};

const bn = (n) => Number(n).toLocaleString("bn-BD");

export default async function JuzIndexPage() {
    const [juzs, surahs] = await Promise.all([getJuzList(), getSurahList()]);
    const surahMap = new Map(surahs.map((surah) => [surah.number, surah]));

    const entries = juzs.map((start, index) => ({
        number: index + 1,
        start,
        surah: surahMap.get(start.surah),
    }));

    return (
        <main
            lang="bn"
            className={`${bangla.className} min-h-screen bg-[#F8F6EF] text-[#173B2D]`}
        >
            <section className="relative isolate overflow-hidden bg-[#092F25] text-white">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_18%,rgba(39,111,77,0.35),transparent_44%),linear-gradient(120deg,#08291F_0%,#0B392A_58%,#104633_100%)]"
                />
                <div className="relative mx-auto max-w-[1180px] px-5 pb-12 pt-6 sm:px-8 sm:pb-14 sm:pt-8">
                    <nav
                        aria-label="ব্রেডক্রাম্ব"
                        className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-50/60"
                    >
                        <Link
                            href="/deen-islam"
                            className="transition hover:text-[#E5CC91]"
                        >
                            DeenIslam
                        </Link>
                        <span aria-hidden="true">/</span>
                        <Link
                            href="/deen-islam/quran"
                            className="transition hover:text-[#E5CC91]"
                        >
                            কুরআন
                        </Link>
                        <span aria-hidden="true">/</span>
                        <span className="text-[#E5CC91]">পারা</span>
                    </nav>

                    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="max-w-[620px]">
                            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9BC79]">
                                <Layers size={13} aria-hidden="true" />
                                ৩০ পারা
                            </p>
                            <h1
                                className={`${bnSerif.className} mt-3 text-[32px] font-bold leading-tight text-[#FFF9E9] sm:text-[40px]`}
                            >
                                পারা অনুযায়ী কুরআন
                            </h1>
                            <p className="mt-3 text-[13px] leading-7 text-emerald-50/70 sm:text-sm">
                                প্রতিটি পারার সূচনা-স্থান থেকে সংশ্লিষ্ট সূরায়
                                যান। পাঠের ধারাবাহিকতা বোঝার সহজ সূচি।
                            </p>
                        </div>

                        <Link
                            href="/deen-islam/quran"
                            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8BC79]/35 bg-[#D8BC79]/10 px-4 py-2.5 text-[11px] font-semibold text-[#F0DDA8] transition hover:bg-[#D8BC79]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/70"
                        >
                            <ArrowLeft size={14} aria-hidden="true" />
                            সূরার তালিকা
                        </Link>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {entries.map(({ number, start, surah }) => (
                        <Link
                            key={number}
                            href={`/deen-islam/quran/${start.surah}`}
                            className="group flex items-start gap-4 rounded-2xl border border-[#E2D7BA] bg-[#FDFBF5] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C6A15B]/70 hover:shadow-[0_16px_34px_rgba(25,60,45,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6EF] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                        >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D9CAAE] bg-[#F4EEDF] text-[13px] font-semibold text-[#8A6B31]">
                                {bn(number)}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="flex items-start justify-between gap-2">
                                    <span className="block text-[13px] font-semibold text-[#1B4536]">
                                        {surah?.englishName ?? `সূরা ${start.surah}`}
                                    </span>
                                    <ArrowUpRight
                                        size={13}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-[#B0A080] transition group-hover:text-[#1B5A43]"
                                    />
                                </span>
                                <span className="mt-1 block text-[11px] text-[#7C8A81]">
                                    শুরু: সূরা {bn(start.surah)}, আয়াত {bn(start.ayah)}
                                </span>
                                <span
                                    dir="rtl"
                                    lang="ar"
                                    className={`${arabic.className} mt-2 block text-lg text-[#B08B45]`}
                                >
                                    {surah?.name?.replace("سُورَةُ ", "")}
                                </span>
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 flex flex-col items-center gap-3 border-t border-[#E2D7BA] pt-8 text-center">
                    <p className="inline-flex items-center gap-2 text-[11px] text-[#7C8A81]">
                        <BookOpen size={14} className="text-[#B08B45]" aria-hidden="true" />
                        পারার সূচনা-তথ্য আল-কুরআন ক্লাউড API থেকে নেওয়া।
                    </p>
                    <Link
                        href="/deen-islam/quran"
                        className="text-[11px] font-semibold text-[#1B5A43] underline decoration-[#C6A15B]/40 underline-offset-4 transition hover:text-[#8A6B31]"
                    >
                        সব সূরা দেখুন
                    </Link>
                </div>
            </section>
        </main>
    );
}
