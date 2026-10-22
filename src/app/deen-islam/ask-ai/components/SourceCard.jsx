"use client";

import Link from "next/link";
import {
    BookOpen,
    ExternalLink,
    ScrollText,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { arabic } from "@/lib/deen-fonts";
import CopyButton from "./CopyButton";
import { referenceForCopy } from "../utils/copy";

function bnNumber(value) {
    return new Intl.NumberFormat("bn-BD").format(Number(value));
}

function gradeTone(grade) {
    if (!grade) {
        return "border-[#C69B52]/25 bg-[#FBF1E8] text-[#8A6424]";
    }

    if (/জঈফ|জইফ|দুর্বল|ضعيف|da.?if|weak/i.test(grade)) {
        return "border-amber-300/70 bg-amber-50 text-amber-800";
    }

    if (/সহি|সহীহ|হাসান|sahih|hasan/i.test(grade)) {
        return "border-emerald-300/60 bg-emerald-50 text-emerald-800";
    }

    return "border-[#C69B52]/25 bg-[#FBF1E8] text-[#8A6424]";
}

export default function SourceCard({ reference }) {
    const isQuran = reference.kind === "quran";
    const Icon = isQuran ? BookOpen : ScrollText;

    return (
        <article className="overflow-hidden rounded-2xl border border-[#DCE8E0] bg-white/85 shadow-[0_10px_30px_-26px_rgba(21,59,55,0.55)]">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E8F0EA] bg-[#F7FAF7] px-4 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E4F4A]/10 bg-[#1E4F4A]/[0.06] text-[#1E4F4A]">
                        <Icon size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7A8B82]">
                            {isQuran ? "কুরআন সূত্র" : "হাদিস সূত্র"}
                        </p>
                        <h4 className="mt-0.5 text-sm font-semibold leading-6 text-[#153B37]">
                            {isQuran
                                ? `সূরা ${reference.surahName} · ${bnNumber(reference.surahNumber)}:${bnNumber(reference.ayahNumber)}`
                                : `${reference.collectionName} · হাদিস ${bnNumber(reference.number)}`}
                        </h4>
                        {isQuran && reference.surahMeaning ? (
                            <p className="text-[11px] text-[#7A8B82]">
                                {reference.surahMeaning}
                            </p>
                        ) : null}
                    </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/50 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-800">
                    <ShieldCheck size={12} aria-hidden="true" />
                    রেকর্ড মিলেছে
                </span>
            </header>

            <div className="space-y-4 px-4 py-4">
                <div
                    dir="rtl"
                    lang="ar"
                    className={`${arabic.className} rounded-xl border border-[#C69B52]/15 bg-[#FFFBF5] px-4 py-4 text-right text-[20px] leading-[2.05] text-[#153B37] sm:text-[22px]`}
                >
                    {reference.arabic}
                </div>

                {reference.translation?.text ? (
                    <div
                        lang={
                            reference.translation.language === "en"
                                ? "en"
                                : "bn"
                        }
                        className="rounded-xl border border-[#E4ECE7] bg-[#FBFCFA] px-4 py-3 text-[13px] leading-7 text-[#3E5B4C]"
                    >
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8B82]">
                            অনুবাদ · {reference.translation.translator}
                        </p>
                        {reference.translation.text}
                    </div>
                ) : null}

                {isQuran && reference.alternateTranslation?.text ? (
                    <details className="group rounded-xl border border-[#E4ECE7] bg-white px-4 py-3 text-[12px] text-[#527066]">
                        <summary className="cursor-pointer list-none font-medium text-[#1E4F4A] marker:content-none">
                            English translation ({reference.alternateTranslation.translator})
                            <span className="ml-1 inline-block transition group-open:rotate-180">
                                ⌄
                            </span>
                        </summary>
                        <p className="mt-2 border-t border-[#EDF2EE] pt-2 leading-6" lang="en">
                            {reference.alternateTranslation.text}
                        </p>
                    </details>
                ) : null}

                {!isQuran ? (
                    <div className="flex flex-wrap items-center gap-2">
                        {reference.narrator ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4ECE7] bg-white px-2.5 py-1 text-[11px] text-[#527066]">
                                <UserRound size={12} aria-hidden="true" />
                                {reference.narrator}
                            </span>
                        ) : null}

                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${gradeTone(reference.grade)}`}
                        >
                            গ্রেড: {reference.grade || "উৎসে উল্লেখ নেই"}
                        </span>
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EDF2EE] pt-3">
                    <p className="max-w-[70%] text-[10px] leading-5 text-[#8A9A91]">
                        {isQuran
                            ? `উৎস: ${reference.sourceName} · আরবি ও অনুবাদ আলাদা এডিশন থেকে আনা হয়েছে।`
                            : reference.gradeNote ||
                              "গ্রেডটি উৎস ডেটাসেটের প্রদত্ত তথ্য অনুযায়ী দেখানো হচ্ছে।"}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                        <CopyButton
                            text={referenceForCopy(reference)}
                            label="সূত্র কপি"
                            copiedLabel="সূত্র কপি হয়েছে"
                        />

                        {reference.sourceUrl ? (
                            <a
                                href={reference.sourceUrl}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#1E4F4A]/15 bg-white px-3 py-1.5 text-[11px] font-medium text-[#527066] transition hover:border-[#1E4F4A]/35 hover:text-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2"
                            >
                                মূল রেকর্ড
                                <ExternalLink size={12} aria-hidden="true" />
                            </a>
                        ) : null}

                        {reference.appUrl ? (
                            <Link
                                href={reference.appUrl}
                                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#1E4F4A]/15 bg-white px-3 py-1.5 text-[11px] font-medium text-[#527066] transition hover:border-[#1E4F4A]/35 hover:text-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2"
                            >
                                অ্যাপে দেখুন
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        </article>
    );
}
