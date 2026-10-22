"use client";

import {
    BookOpen,
    HeartHandshake,
    MoonStar,
    ScrollText,
    Sparkles,
    Sun,
} from "lucide-react";
import { bnSerif } from "@/lib/deen-fonts";
import { ArchMotif, GeometricSeal } from "./Ornaments";

const SUGGESTIONS = [
    {
        category: "নামাজ",
        icon: MoonStar,
        question: "নামাজে ভুল হলে কী করতে হবে?",
    },
    {
        category: "কুরআন",
        icon: BookOpen,
        question: "কুরআনে ধৈর্য সম্পর্কে কী বলা হয়েছে?",
    },
    {
        category: "হাদিস",
        icon: ScrollText,
        question: "সহিহ হাদিস অনুযায়ী বাবা-মায়ের অধিকার কী?",
    },
    {
        category: "রোজা",
        icon: Sun,
        question: "রোজা ভঙ্গের কারণগুলো কী?",
    },
    {
        category: "দোয়া",
        icon: Sparkles,
        question: "দোয়া কবুলের জন্য কী করব?",
    },
    {
        category: "আদব",
        icon: HeartHandshake,
        question: "ইসলামে সততার গুরুত্ব কী?",
    },
];

export default function WelcomePanel({ onSuggestion, disabled }) {
    return (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.45]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 14% 8%, rgba(198,155,82,.12), transparent 26%), radial-gradient(circle at 88% 22%, rgba(30,79,74,.09), transparent 30%)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cg fill='none' stroke='%231E4F4A' stroke-width='.8'%3E%3Cpath d='M48 0 96 48 48 96 0 48Z M48 14 82 48 48 82 14 48Z M0 0 96 96 M96 0 0 96'/%3E%3C/g%3E%3C/svg%3E\")",
                }}
            />

            <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-5 text-center sm:px-6 sm:py-12">
                <div className="relative flex h-12 w-12 items-end justify-center sm:h-24 sm:w-28">
                    <ArchMotif className="absolute -top-3 hidden h-20 w-40 opacity-80 sm:block" />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#C69B52]/35 bg-[#FFFBF5] shadow-[0_18px_40px_-30px_rgba(21,59,55,.7)] sm:h-[72px] sm:w-[72px]">
                        <GeometricSeal className="h-11 w-11 sm:h-16 sm:w-16" />
                    </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#C69B52]/25 bg-[#FBF1E8]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A6424] sm:mt-5">
                    <Sparkles size={12} aria-hidden="true" />
                    ইলমের আলোয় প্রশ্ন করুন
                </div>

                <h2
                    className={`${bnSerif.className} mt-3 text-[26px] leading-tight text-[#153B37] sm:mt-4 sm:text-[36px]`}
                >
                    আসসালামু আলাইকুম
                </h2>

                <p className="mt-2 max-w-xl text-[12px] leading-6 text-[#5E7368] sm:mt-3 sm:text-sm sm:leading-7">
                    ইসলাম সম্পর্কে আপনার প্রশ্ন লিখুন। EDUKIND উপযুক্ত কুরআন
                    আয়াত ও হাদিস রেকর্ড খুঁজে এনে উত্তরটি সূত্রসহ সাজিয়ে
                    দেবে — এবং যে বিষয় যাচাই করা যায়নি, সেটি স্পষ্ট করে বলবে।
                </p>

                <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-2 text-left sm:mt-7 sm:gap-2.5 lg:grid-cols-3">
                    {SUGGESTIONS.map(({ category, icon: Icon, question }) => (
                        <button
                            key={question}
                            type="button"
                            onClick={() => onSuggestion(question)}
                            disabled={disabled}
                            className="group flex min-h-[70px] items-start gap-3 rounded-2xl border border-[#DDE8E1] bg-white/80 px-3.5 py-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#C69B52]/45 hover:bg-[#FFFDF8] hover:shadow-[0_16px_30px_-24px_rgba(21,59,55,.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                        >
                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#1E4F4A]/10 bg-[#1E4F4A]/[0.05] text-[#1E4F4A] transition group-hover:border-[#C69B52]/35 group-hover:bg-[#FBF1E8] group-hover:text-[#8A6424]">
                                <Icon size={16} aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                                <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A17B3D]">
                                    {category}
                                </span>
                                <span className="mt-1 block text-[12px] font-medium leading-5 text-[#35584A]">
                                    {question}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                <p className="mt-5 text-[10px] leading-5 text-[#95A49B]">
                    নমুনা প্রশ্নে ক্লিক করলে প্রশ্নটি সরাসরি পাঠানো হবে। আপনি
                    নিচের বাক্সে নিজের প্রশ্নও লিখতে পারেন।
                </p>
            </div>
        </div>
    );
}
