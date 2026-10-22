"use client";

import {
    CalendarDays,
    CircleAlert,
    ExternalLink,
    MoonStar,
    RefreshCw,
    Sparkles,
    WifiOff,
} from "lucide-react";
import { arabic, bnSerif } from "@/lib/deen-fonts";
import { UPCOMING_EVENT_COUNT } from "../services/aladhan";
import {
    daysBetween,
    formatDaysUntil,
    formatShortGregorianBn,
    getHijriMonthBn,
    toBn,
} from "../utils/dates";
import SectionHeading from "./SectionHeading";

function CalendarSkeleton() {
    return (
        <div className="mt-5 grid gap-3.5 lg:grid-cols-[0.9fr_1.6fr]">
            <div className="h-[236px] animate-pulse rounded-2xl bg-[#F1E7DA]" />
            <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-[52px] animate-pulse rounded-xl bg-[#F1E7DA]"
                    />
                ))}
            </div>
        </div>
    );
}

export default function HijriCalendarSection({
    status,
    data,
    error,
    onRefresh,
    now,
}) {
    const hijri = data?.hijri ?? null;
    const monthNumber = hijri?.month?.number;
    const monthLabel = monthNumber
        ? getHijriMonthBn(monthNumber)
        : "হিজরি মাস";
    const monthDays = data?.monthDays ?? null;
    const events = data?.upcoming ?? [];
    const today = now ?? new Date();

    return (
        <section
            id="calendar"
            aria-labelledby="calendar-heading"
            className="scroll-mt-24 pt-12 sm:pt-16"
        >
            <SectionHeading
                eyebrow="HIJRI · CALENDAR"
                title="হিজরি ক্যালেন্ডার"
                description="আজকের হিজরি তারিখ ও সামনের গুরুত্বপূর্ণ ইসলামিক দিনগুলো দেখুন।"
                icon={CalendarDays}
                headingId="calendar-heading"
                action={
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={status === "loading"}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D8C4A8] bg-white px-4 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <RefreshCw
                            size={13}
                            className={status === "loading" ? "animate-spin" : ""}
                            aria-hidden="true"
                        />
                        রিফ্রেশ
                    </button>
                }
            />

            <div className="mt-5" aria-live="polite">
                {status === "loading" ? (
                    <div>
                        <div className="flex items-center gap-2 text-sm text-[#6A7D75]">
                            <RefreshCw
                                size={14}
                                className="animate-spin"
                                aria-hidden="true"
                            />
                            হিজরি তারিখ লোড হচ্ছে…
                        </div>
                        <CalendarSkeleton />
                    </div>
                ) : status === "error" ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-[#E8CFC7] bg-[#FFF7F4] p-5 sm:p-6"
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8CFC7] bg-white text-[#A54A3A]">
                                <WifiOff size={18} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-[#7A352B]">
                                    হিজরি তারিখ লোড করা যায়নি
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-[#8A625B]">
                                    {error ||
                                        "ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন। কোনো অনুমানভিত্তিক তারিখ দেখানো হচ্ছে না।"}
                                </p>
                                <button
                                    type="button"
                                    onClick={onRefresh}
                                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1E4F4A] px-4 text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                                >
                                    <RefreshCw size={14} aria-hidden="true" />
                                    আবার চেষ্টা করুন
                                </button>
                            </div>
                        </div>
                    </div>
                ) : hijri ? (
                    <div className="grid gap-3.5 lg:grid-cols-[0.9fr_1.6fr]">
                        <article className="relative overflow-hidden rounded-2xl border border-[#DCC7A9] bg-[#FBF1E8] p-5 shadow-[0_18px_40px_rgba(21,59,55,0.09)] sm:p-6">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full border border-[#C69B52]/18"
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-4 -top-6 h-28 w-28 rotate-45 border border-[#C69B52]/12"
                            />

                            <div className="relative">
                                <div className="flex items-start justify-between gap-3">
                                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E4CDA8] bg-[#FFF8EF] text-[#8A6A2F]">
                                        <MoonStar
                                            size={20}
                                            strokeWidth={1.6}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <span className="rounded-full border border-[#D9C09A] bg-[#FFF8EF] px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#8A6A2F]">
                                        আজকের হিজরি তারিখ
                                    </span>
                                </div>

                                <p className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#8A6A2F]">
                                    {toBn(hijri.year)} হিজরি
                                </p>

                                <div className="mt-1 flex items-end gap-2.5">
                                    <span
                                        className={`${bnSerif.className} text-5xl font-bold leading-none text-[#153B37]`}
                                    >
                                        {toBn(hijri.day)}
                                    </span>
                                    <span className="pb-1 text-lg font-semibold text-[#1E4F4A]">
                                        {monthLabel}
                                    </span>
                                </div>

                                {hijri.month?.ar ? (
                                    <p
                                        dir="rtl"
                                        lang="ar"
                                        className={`${arabic.className} mt-2 text-right text-2xl text-[#8A6A2F]/80`}
                                    >
                                        {hijri.month.ar}
                                    </p>
                                ) : null}

                                <div className="mt-5 h-px bg-[#E4D2B8]" />

                                <dl className="mt-4 grid grid-cols-2 gap-3">
                                    <div>
                                        <dt className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#8A6A2F]">
                                            হিজরি মাস
                                        </dt>
                                        <dd className="mt-0.5 text-sm font-semibold text-[#405A52]">
                                            {monthLabel}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#8A6A2F]">
                                            মাসের দিন
                                        </dt>
                                        <dd className="mt-0.5 text-sm font-semibold text-[#405A52]">
                                            {monthDays
                                                ? `${toBn(monthDays)} দিন`
                                                : "তথ্য অনুপলব্ধ"}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="mt-4 rounded-xl border border-[#E4D2B8] bg-[#FFF8EF]/85 px-3 py-2.5">
                                    <p className="text-xs sm:text-sm leading-5 text-[#6F5322]">
                                        গ্রেগরিয়ান:{" "}
                                        <strong className="font-semibold">
                                            {today
                                                ? formatShortGregorianBn(today)
                                                : "—"}
                                        </strong>
                                    </p>
                                    <p className="mt-0.5 text-[11px] sm:text-xs leading-5 text-[#839088]">
                                        Aladhan API-এর গToH গণনা অনুযায়ী
                                    </p>
                                </div>
                            </div>
                        </article>

                        <div className="rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-4 sm:p-5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <h3 className="text-sm sm:text-base font-bold text-[#153B37]">
                                        সামনের গুরুত্বপূর্ণ দিন
                                    </h3>
                                    <p className="mt-1 text-xs sm:text-sm text-[#718078]">
                                        হিজরি তারিখ থেকে গ্রেগরিয়ান তারিখে
                                        রূপান্তর করে দেখানো হয়েছে।
                                    </p>
                                </div>
                                <span className="rounded-full border border-[#E4D2B8] bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#8A6A2F]">
                                    {toBn(events.length)}টি দিন
                                </span>
                            </div>

                            {events.length > 0 ? (
                                <ul className="mt-3 divide-y divide-[#EADCCB]">
                                    {events.map((event) => {
                                        const days = today
                                            ? daysBetween(
                                                  today,
                                                  event.gregorianDate
                                              )
                                            : null;

                                        return (
                                            <li
                                                key={`${event.id}-${event.year}`}
                                                className="flex flex-col gap-1.5 py-3 first:pt-1 last:pb-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                                            >
                                                <div className="flex min-w-0 items-start gap-2.5">
                                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]">
                                                        <Sparkles
                                                            size={12}
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-[#153B37]">
                                                            {event.title}
                                                        </p>
                                                        <p className="mt-0.5 text-xs sm:text-sm text-[#718078]">
                                                            {event.hijriLabel}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex shrink-0 items-center gap-2 pl-9 sm:pl-0">
                                                    <span className="rounded-full border border-[#E4D2B8] bg-white px-2.5 py-1 text-xs sm:text-sm font-semibold text-[#405A52]">
                                                        {formatShortGregorianBn(
                                                            event.gregorianDate
                                                        )}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-[11px] sm:text-xs font-bold ${
                                                            days === 0
                                                                ? "bg-[#1E4F4A] text-white"
                                                                : "bg-[#EAF3EF] text-[#1E4F4A]"
                                                        }`}
                                                    >
                                                        {formatDaysUntil(days)}
                                                    </span>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p className="mt-4 rounded-xl border border-dashed border-[#D8C4A8] bg-[#FFFBF5] px-3.5 py-5 text-center text-sm text-[#718078]">
                                    সামনের দিনের তালিকা পাওয়া যায়নি। রিফ্রেশ
                                    করে আবার চেষ্টা করুন।
                                </p>
                            )}

                            {events.length > 0 &&
                            events.length < UPCOMING_EVENT_COUNT ? (
                                <p
                                    role="status"
                                    className="mt-3 rounded-lg border border-[#E6D6BC] bg-[#FFF8EF] px-3 py-2 text-xs sm:text-sm leading-5 text-[#8A6A2F]"
                                >
                                    কিছু গুরুত্বপূর্ণ দিনের তারিখ এই মুহূর্তে
                                    পাওয়া যায়নি। রিফ্রেশ করে আবার চেষ্টা করুন।
                                </p>
                            ) : null}

                            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#E6D6BC] bg-[#FBF1E8] px-3 py-2.5">
                                <CircleAlert
                                    size={13}
                                    className="mt-0.5 shrink-0 text-[#8A6A2F]"
                                    aria-hidden="true"
                                />
                                <p className="text-xs sm:text-sm leading-5 text-[#6F5322]">
                                    হিজরি তারিখ গণনাভিত্তিক। স্থানীয় চাঁদ দেখার
                                    ভিত্তিতে দিন এক কম-বেশি হতে পারে; স্থানীয়
                                    মসজিদ বা কর্তৃপক্ষের ঘোষণা অনুসরণ করুন।
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#D8C4A8] bg-[#FFF8EF] p-8 text-center">
                        <p className="text-sm sm:text-base text-[#6A7D75]">
                            হিজরি তারিখ পাওয়া যায়নি। রিফ্রেশ করুন।
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-3 flex flex-col gap-1 rounded-xl border border-[#EADCCB] bg-[#FFF8EF] px-3.5 py-2.5 text-xs sm:text-sm text-[#718078] sm:flex-row sm:items-center sm:justify-between">
                <span>
                    সূত্র: Aladhan API · gToH ও hToG রূপান্তর
                </span>
                <a
                    href="https://aladhan.com/calculation-methods"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1 font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                >
                    গণনা পদ্ধতি সম্পর্কে জানুন
                    <ExternalLink size={10} aria-hidden="true" />
                </a>
            </div>
        </section>
    );
}
