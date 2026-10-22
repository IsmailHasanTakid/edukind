import Link from "next/link";
import {
    ArrowRight,
    Bookmark,
    Check,
    Clock3,
    Heart,
    LoaderCircle,
    MoonStar,
} from "lucide-react";
import { formatCountdown, formatTimeParts, toBn } from "../utils/dates";

function ProgressBar({ value, dark = false }) {
    return (
        <div
            className={`mt-3 h-1.5 overflow-hidden rounded-full ${
                dark ? "bg-white/15" : "bg-[#E8DCCB]"
            }`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-label="আজকের আমলের অগ্রগতি"
        >
            <div
                className={`h-full rounded-full transition-[width] duration-500 ${
                    dark
                        ? "bg-gradient-to-r from-[#E8CE96] to-[#C69B52]"
                        : "bg-gradient-to-r from-[#1E4F4A] to-[#4D8B7C]"
                }`}
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

export default function SummaryCards({
    amal,
    nextPrayer,
    prayersStatus,
    favoritesCount,
    favoritesReady,
    onOpenFavorites,
}) {
    const percent =
        amal.totalCount > 0
            ? Math.round((amal.completedCount / amal.totalCount) * 100)
            : 0;

    const prayerTime = nextPrayer ? formatTimeParts(nextPrayer.time) : null;

    return (
        <section
            aria-label="আজকের সারসংক্ষেপ"
            className="relative z-10 -mt-8 grid gap-3.5 sm:-mt-10 sm:grid-cols-3"
        >
            <article className="rounded-2xl border border-[#EADCCB] bg-[#FFFBF5] p-4 shadow-[0_16px_40px_rgba(21,59,55,0.12)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE8E2] bg-[#EAF3EF] text-[#1E4F4A]">
                        <Check size={19} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-[#EAF3EF] px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#1E4F4A]">
                        আজকের আমল
                    </span>
                </div>

                <p className="mt-4 text-xs sm:text-sm font-medium text-[#6A7D75]">
                    সম্পন্ন হয়েছে
                </p>

                {amal.ready ? (
                    <>
                        <p className="mt-1 flex items-baseline gap-1.5 text-[#153B37]">
                            <span className="text-3xl font-bold tracking-tight">
                                {toBn(amal.completedCount)}
                            </span>
                            <span className="text-sm sm:text-base text-[#6A7D75]">
                                / {toBn(amal.totalCount)} টি
                            </span>
                        </p>
                        <ProgressBar value={percent} />
                        <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-xs sm:text-sm text-[#6A7D75]">
                                {amal.completedCount === 0
                                    ? "আজ এখনও শুরু করেননি"
                                    : percent === 100
                                      ? "সব আমল চিহ্নিত হয়েছে"
                                      : `${toBn(percent)}% সম্পন্ন`}
                            </span>
                            <Link
                                href="#amal"
                                className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                            >
                                দেখুন <ArrowRight size={13} aria-hidden="true" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="mt-3 space-y-2" aria-hidden="true">
                        <div className="h-7 w-24 animate-pulse rounded-md bg-[#EFE5D8]" />
                        <div className="h-1.5 w-full animate-pulse rounded-full bg-[#EFE5D8]" />
                    </div>
                )}
            </article>

            <article className="rounded-2xl border border-[#2D6A60] bg-[#1E4F4A] p-4 text-white shadow-[0_16px_40px_rgba(21,59,55,0.2)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-[#E8CE96]">
                        <MoonStar size={19} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-[#E8CE96]/25 bg-[#E8CE96]/10 px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#F2DFB0]">
                        পরবর্তী নামাজ
                    </span>
                </div>

                {prayersStatus === "loading" ? (
                    <div className="mt-4 flex items-center gap-2 text-sm sm:text-base text-[#DCE8E2]/75">
                        <LoaderCircle
                            size={17}
                            className="animate-spin"
                            aria-hidden="true"
                        />
                        নামাজের সময় লোড হচ্ছে…
                    </div>
                ) : prayersStatus === "error" ? (
                    <div className="mt-4">
                        <p className="text-sm sm:text-base leading-6 text-[#F3D8D3]">
                            নামাজের সময় লোড করা যায়নি।
                        </p>
                        <Link
                            href="#prayer-times"
                            className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#E8CE96] hover:text-white"
                        >
                            আবার চেষ্টা করুন{" "}
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </div>
                ) : nextPrayer && prayerTime ? (
                    <>
                        <p className="mt-4 flex items-baseline gap-2">
                            <span className="text-2xl font-bold tracking-tight text-[#FFF8E7]">
                                {nextPrayer.label}
                            </span>
                            <span className="text-lg font-semibold text-[#E8CE96]">
                                {prayerTime.hour}:{prayerTime.minute}
                                <span className="ml-1 text-xs sm:text-sm font-medium text-[#DCE8E2]/70">
                                    {prayerTime.meridiem}
                                </span>
                            </span>
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#DCE8E2]/75">
                            <Clock3 size={13} aria-hidden="true" />
                            {nextPrayer.tomorrow ? "আগামীকাল · " : ""}
                            {formatCountdown(nextPrayer.minutesUntil)} বাকি
                        </div>
                        <Link
                            href="#prayer-times"
                            className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#E8CE96] transition hover:gap-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8CE96] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E4F4A]"
                        >
                            সব সময় দেখুন{" "}
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </>
                ) : (
                    <p className="mt-4 text-sm sm:text-base text-[#DCE8E2]/75">
                        সময় নির্ধারণের জন্য এলাকা নির্বাচন করুন।
                    </p>
                )}
            </article>

            <article className="rounded-2xl border border-[#E8D4B8] bg-[#FBF1E8] p-4 shadow-[0_16px_40px_rgba(21,59,55,0.1)] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E4CDA8] bg-[#FFF8EF] text-[#8A6A2F]">
                        <Bookmark size={19} strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-[#FFF8EF] px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#8A6A2F]">
                        সংরক্ষিত দোয়া
                    </span>
                </div>

                <p className="mt-4 flex items-baseline gap-1.5 text-[#153B37]">
                    <span className="text-3xl font-bold tracking-tight">
                        {favoritesReady ? toBn(favoritesCount) : "—"}
                    </span>
                    <span className="text-sm sm:text-base text-[#6A7D75]">টি দোয়া</span>
                </p>

                <p className="mt-1 text-xs sm:text-sm leading-5 text-[#6A7D75]">
                    {favoritesReady && favoritesCount > 0
                        ? "আপনার পছন্দের দোয়াগুলো এক জায়গায়।"
                        : "দোয়া কার্ডের বুকমার্ক আইকনে চাপ দিয়ে সংরক্ষণ করুন।"}
                </p>

                <button
                    type="button"
                    onClick={onOpenFavorites}
                    className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#D9C09A] bg-[#FFF8EF] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#6F5322] transition hover:border-[#C69B52] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                >
                    <Heart size={13} aria-hidden="true" />
                    ফেভারিট দেখুন
                </button>
            </article>
        </section>
    );
}
