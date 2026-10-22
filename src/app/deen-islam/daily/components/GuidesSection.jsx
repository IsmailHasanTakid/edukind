"use client";

import { useState } from "react";
import {
    BookOpen,
    ChevronDown,
    ExternalLink,
    Info,
    Sparkles,
} from "lucide-react";
import { bnSerif } from "@/lib/deen-fonts";
import { GUIDES } from "../data/guides";
import { DeenIcon } from "./icons";
import SectionHeading from "./SectionHeading";

function GuideCard({ guide, expanded, onToggle }) {
    const panelId = `guide-panel-${guide.id}`;
    const buttonId = `guide-trigger-${guide.id}`;

    return (
        <article
            className={`self-start overflow-hidden rounded-2xl border transition ${
                expanded
                    ? "border-[#C8B08B] bg-[#FBF1E8] shadow-[0_16px_36px_rgba(21,59,55,0.09)]"
                    : "border-[#EADCCB] bg-[#FFF8EF] hover:border-[#D8C4A8] hover:shadow-[0_10px_24px_rgba(21,59,55,0.06)]"
            }`}
        >
            <h3>
                <button
                    type="button"
                    id={buttonId}
                    onClick={onToggle}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    className="flex w-full items-center gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C69B52] sm:p-5"
                >
                    <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                            expanded
                                ? "border-[#1E4F4A] bg-[#1E4F4A] text-[#E8CE96]"
                                : "border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]"
                        }`}
                    >
                        <DeenIcon
                            name={guide.icon}
                            size={19}
                            strokeWidth={1.7}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="min-w-0 flex-1">
                        <span
                            className={`${bnSerif.className} block text-base sm:text-lg font-bold leading-6 ${
                                expanded ? "text-[#1E4F4A]" : "text-[#153B37]"
                            }`}
                        >
                            {guide.title}
                        </span>
                        <span className="mt-0.5 block text-xs sm:text-sm leading-5 text-[#718078]">
                            {guide.description}
                        </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-2">
                        <span className="hidden rounded-full border border-[#E4D2B8] bg-white px-2 py-0.5 text-[11px] sm:text-xs font-semibold text-[#8A6A2F] sm:inline">
                            {guide.sections.length} অংশ
                        </span>
                        <span
                            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-transform duration-300 ${
                                expanded
                                    ? "rotate-180 border-[#1E4F4A] bg-white text-[#1E4F4A]"
                                    : "border-[#D8C4A8] bg-white text-[#8A6A2F]"
                            }`}
                        >
                            <ChevronDown size={15} aria-hidden="true" />
                        </span>
                    </span>
                </button>
            </h3>

            {expanded ? (
                <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="border-t border-[#E4D2B8] px-4 pb-5 pt-4 sm:px-5"
                >
                    <p className="text-sm sm:text-base leading-7 text-[#405A52]">
                        {guide.intro}
                    </p>

                    <div className="mt-4 space-y-4">
                        {guide.sections.map((section) => (
                            <div
                                key={section.heading}
                                className="rounded-xl border border-[#E4D2B8] bg-[#FFF8EF] p-3.5"
                            >
                                <h4 className="flex items-center gap-2 text-sm font-bold text-[#153B37]">
                                    <Sparkles
                                        size={12}
                                        className="shrink-0 text-[#8A6A2F]"
                                        aria-hidden="true"
                                    />
                                    {section.heading}
                                </h4>

                                <ul className="mt-2 space-y-1.5">
                                    {section.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-start gap-2 text-xs sm:text-sm leading-6 text-[#5B6F67]"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#C69B52]"
                                            />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>

                                {section.references.length > 0 ? (
                                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-[#EADCCB] pt-2.5">
                                        {section.references.map((reference) => (
                                            <a
                                                key={`${reference.label}-${reference.url}`}
                                                href={reference.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-7 items-center gap-1 rounded-full border border-[#DCC7A9] bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-[#6F5322] transition hover:border-[#C69B52] hover:bg-[#FFFBF5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-1"
                                            >
                                                {reference.label}
                                                <ExternalLink
                                                    size={9}
                                                    aria-hidden="true"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </article>
    );
}

export default function GuidesSection() {
    const [expandedIds, setExpandedIds] = useState(
        GUIDES.length > 0 ? [GUIDES[0].id] : []
    );

    const toggleGuide = (id) => {
        setExpandedIds((current) =>
            current.includes(id)
                ? current.filter((entry) => entry !== id)
                : [...current, id]
        );
    };

    const closeAll = () => setExpandedIds([]);

    return (
        <section
            id="guides"
            aria-labelledby="guides-heading"
            className="scroll-mt-24 pt-12 sm:pt-16"
        >
            <SectionHeading
                eyebrow="GUIDE · ESSENTIALS"
                title="ইসলামিক গাইড"
                description="অজু, গোসল, নামাজ, দৈনন্দিন আদব ও দোয়া-যিকিরের সংক্ষিপ্ত নির্দেশনা—সূত্রসহ।"
                icon={BookOpen}
                headingId="guides-heading"
                action={
                    expandedIds.length > 0 ? (
                        <button
                            type="button"
                            onClick={closeAll}
                            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D8C4A8] bg-white px-4 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                        >
                            <ChevronDown
                                size={13}
                                className="rotate-180"
                                aria-hidden="true"
                            />
                            সব গাইড বন্ধ করুন
                        </button>
                    ) : (
                        <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#E4D2B8] bg-[#FBF1E8] px-4 text-xs sm:text-sm font-medium text-[#6F5322]">
                            <Info size={12} aria-hidden="true" />
                            যেকোনো গাইডে চাপ দিয়ে পড়ুন
                        </span>
                    )
                }
            />

            <div className="mt-5 grid items-start gap-3 lg:grid-cols-2">
                {GUIDES.map((guide) => (
                    <GuideCard
                        key={guide.id}
                        guide={guide}
                        expanded={expandedIds.includes(guide.id)}
                        onToggle={() => toggleGuide(guide.id)}
                    />
                ))}
            </div>

            <div className="mt-4 flex flex-col gap-1.5 rounded-xl border border-[#EADCCB] bg-[#FFF8EF] px-3.5 py-3 text-xs sm:text-sm leading-5 text-[#718078]">
                <p>
                    গাইডগুলো সংক্ষিপ্ত সাধারণ নির্দেশনার জন্য; এটি ফিকহি ফতোয়া
                    নয়। মাজহাব ও ব্যক্তিগত অবস্থাভেদে বিধান ভিন্ন হতে পারে।
                </p>
                <p>
                    প্রতিটি অংশের সঙ্গে কুরআন ও হাদিসের রেফারেন্স দেওয়া হয়েছে।
                    বিস্তারিত জানতে নির্ভরযোগ্য আলেমের পরামর্শ নিন।
                </p>
            </div>
        </section>
    );
}
