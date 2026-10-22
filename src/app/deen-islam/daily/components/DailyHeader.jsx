import Link from "next/link";
import {
    CalendarDays,
    ChevronRight,
    MoonStar,
    Sparkles,
} from "lucide-react";
import { arabic, bnSerif, serif } from "@/lib/deen-fonts";
import {
    formatGregorianBn,
    formatHijriBn,
} from "../utils/dates";
import { ArchOrnament, GeometricPattern } from "./Decor";

export default function DailyHeader({ now, hijri, hijriStatus }) {
    const hijriLabel =
        hijriStatus === "success" && hijri
            ? formatHijriBn(hijri)
            : hijriStatus === "loading"
              ? "হিজরি তারিখ লোড হচ্ছে…"
              : "হিজরি তারিখ অনুপলব্ধ";

    return (
        <header className="relative isolate overflow-hidden bg-[#153B37] text-[#FFFBF5]">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-20"
                style={{
                    backgroundImage:
                        "radial-gradient(50rem 26rem at 12% -10%, rgba(198,155,82,0.16), transparent 62%), radial-gradient(42rem 26rem at 92% 18%, rgba(46,111,95,0.35), transparent 64%), linear-gradient(125deg, #102F2B 0%, #153B37 48%, #1E4F4A 100%)",
                }}
            />
            <GeometricPattern className="-z-10 opacity-[0.08]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-28 top-10 -z-10 h-72 w-72 rounded-full border border-[#E8CE96]/10"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-16 top-20 -z-10 h-52 w-52 rotate-45 border border-[#E8CE96]/10"
            />

            <div className="relative mx-auto max-w-[1280px] px-4 pb-14 pt-5 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
                <nav
                    aria-label="ব্রেডক্রাম্ব"
                    className="flex flex-wrap items-center gap-1.5 text-xs text-[#DCE8E2]/65 sm:text-sm"
                >
                    <Link
                        href="/deen-islam"
                        className="rounded-sm transition hover:text-[#E8CE96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8CE96] focus-visible:ring-offset-4 focus-visible:ring-offset-[#153B37]"
                    >
                        DeenIslam
                    </Link>
                    <ChevronRight size={13} aria-hidden="true" />
                    <span className="text-[#E8CE96]">দৈনন্দিন ইসলামিক জীবন</span>
                </nav>

                <div className="mt-7 grid items-center gap-8 md:grid-cols-[1.35fr_0.65fr] lg:gap-12">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#E8CE96]/20 bg-[#E8CE96]/[0.07] px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-[#E8CE96] sm:text-xs">
                            <Sparkles size={12} aria-hidden="true" />
                            YOUR DAILY ISLAMIC COMPANION
                        </div>

                        <h1
                            className={`${bnSerif.className} mt-4 text-[2rem] font-bold leading-[1.35] tracking-tight text-[#FFFBF5] sm:text-[2.65rem] lg:text-[3rem]`}
                        >
                            দৈনন্দিন{" "}
                            <span className="bg-gradient-to-r from-[#F4E1B0] via-[#E8CE96] to-[#C69B52] bg-clip-text text-transparent">
                                ইসলামিক জীবন
                            </span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm sm:text-base leading-7 text-[#DCE8E2]/80">
                            প্রতিদিনের ইবাদত, দোয়া ও ইসলামিক জীবনযাপন—এক
                            জায়গায়।
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#E8CE96]/18 bg-[#0F332E]/55 px-3.5 py-1.5 text-xs text-[#EDF4F0] sm:text-sm">
                                <CalendarDays
                                    size={14}
                                    className="text-[#E8CE96]"
                                    aria-hidden="true"
                                />
                                {now
                                    ? formatGregorianBn(now)
                                    : "আজকের তারিখ লোড হচ্ছে…"}
                            </span>

                            <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#E8CE96]/18 bg-[#0F332E]/55 px-3.5 py-1.5 text-xs text-[#EDF4F0] sm:text-sm">
                                <MoonStar
                                    size={14}
                                    className="text-[#E8CE96]"
                                    aria-hidden="true"
                                />
                                {hijriLabel}
                            </span>
                        </div>

                        <div className="mt-6 flex items-center gap-3 text-xs sm:text-sm tracking-[0.16em] text-[#DCE8E2]/45">
                            <span className={`${serif.className} text-base tracking-[0.08em] text-[#E8CE96]/75`}>
                                IBADAH
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#C69B52]/60" />
                            <span className={`${serif.className} text-base tracking-[0.08em] text-[#E8CE96]/75`}>
                                DUA
                            </span>
                            <span className="h-1 w-1 rounded-full bg-[#C69B52]/60" />
                            <span className={`${serif.className} text-base tracking-[0.08em] text-[#E8CE96]/75`}>
                                AMAL
                            </span>
                        </div>
                    </div>

                    <div className="mx-auto hidden w-full max-w-[270px] md:block lg:max-w-[300px]">
                        <ArchOrnament className="h-[260px] shadow-[0_24px_60px_rgba(0,0,0,0.22)] lg:h-[280px]" />
                    </div>
                </div>

                <p
                    dir="rtl"
                    lang="ar"
                    className={`${arabic.className} mt-7 text-right text-lg text-[#E8CE96]/45 md:hidden`}
                >
                    رَبِّ زِدْنِي عِلْمًا
                </p>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[#C69B52]/55 to-transparent" />
        </header>
    );
}
