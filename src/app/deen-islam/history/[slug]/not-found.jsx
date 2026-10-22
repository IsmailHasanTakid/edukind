import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, SearchX } from "lucide-react";
import { bangla, bnSerif } from "@/lib/deen-fonts";
import { IslamicPattern, OrnamentDivider, StarSeal } from "../components/Ornaments";

export const metadata = {
    title: "জীবনী পাওয়া যায়নি | DeenIslam",
};

export default function StoryNotFound() {
    return (
        <main
            lang="bn"
            className={`${bangla.className} -mx-12 flex min-h-screen items-center justify-center bg-[#F8F5EC] px-5 py-16 text-[#173D30]`}
        >
            <div className="w-full max-w-[620px] text-center">
                <div className="relative isolate overflow-hidden rounded-[26px] border border-[#E3D8C2] bg-[#FFFDF8] px-6 py-10 shadow-[0_24px_70px_rgba(25,60,45,0.1)] sm:px-10 sm:py-12">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(132deg,#05231B_0%,#083326_54%,#0B3D2E_100%)]"
                    />
                    <IslamicPattern
                        stroke="#D8BC79"
                        opacity={0.09}
                        size={112}
                        className="[mask-image:linear-gradient(180deg,black,transparent)]"
                    />

                    <div className="relative">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D8BC79]/35 bg-[#0A3528] text-[#E8D6A4] shadow-lg">
                            <SearchX size={23} />
                        </span>

                        <p className="mt-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#987B3F]">
                            চারশো চার
                        </p>
                        <h1
                            className={`${bnSerif.className} mt-3 text-[27px] font-semibold leading-[1.5] text-[#173D30] sm:text-[32px]`}
                        >
                            এই জীবনীটি খুঁজে পাওয়া যায়নি
                        </h1>
                        <p className="mx-auto mt-3 max-w-[440px] text-sm sm:text-base leading-[1.95] text-[#6C7A72]">
                            ঠিকানাটি হয়তো বদলে গেছে, অথবা জীবনীটি এখনো সংগ্রহে
                            যোগ হয়নি। নিচের তালিকা থেকে অন্য কোনো নবী-রাসূলের
                            জীবনী বেছে নিন।
                        </p>

                        <OrnamentDivider className="my-6" />

                        <div className="flex flex-col justify-center gap-2.5 sm:flex-row">
                            <Link
                                href="/deen-islam/history"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B5A43] px-5 py-2.5 text-sm font-semibold text-[#FFF9E9] transition hover:bg-[#144534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8]"
                            >
                                <ArrowLeft size={14} />
                                সব জীবনী দেখুন
                            </Link>
                            <Link
                                href="/deen-islam/history#themes"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9CDB5] px-5 py-2.5 text-sm font-semibold text-[#5E6E65] transition hover:border-[#B79A58] hover:bg-[#F7F2E6] hover:text-[#1B4536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                            >
                                <Compass size={14} />
                                বিষয়ভিত্তিক পাঠ
                            </Link>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#EEE7D7] pt-5 text-xs sm:text-sm text-[#8A928C]">
                            <span className="inline-flex items-center gap-1.5">
                                <BookOpen size={12} className="text-[#B08B45]" />
                                কুরআনি রেফারেন্সসহ
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <StarSeal className="h-3.5 w-3.5 text-[#C6A15B]" />
                                সূত্র আলাদা চিহ্নিত
                            </span>
                        </div>
                    </div>
                </div>

                <p className="mt-5 text-xs sm:text-sm text-[#8A928C]">
                    <Link
                        href="/deen-islam/quran"
                        className="font-medium text-[#1B5A43] underline decoration-[#C6A15B]/40 underline-offset-4 transition hover:text-[#8A6B31]"
                    >
                        কুরআন লাইব্রেরি
                    </Link>
                    -তে সরাসরি সূরা ও আয়াত দেখতে পারেন।
                </p>
            </div>
        </main>
    );
}
