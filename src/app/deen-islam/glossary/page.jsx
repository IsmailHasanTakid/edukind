"use client";

import { useMemo, useState } from "react";
import { glossaryData } from "./data";
import {
    Search,
    BookOpen,
    Sparkles,
    ArrowRight,
    ChevronUp,
    GraduationCap,
    Brain,
    RotateCcw,
    Compass,
    Bookmark,
    CircleCheck,
    CircleHelp,
    Layers3,
    MoveUpRight,
    X,
    ShieldCheck,
} from "lucide-react";

const categories = [
    { name: "সব শব্দ", icon: Layers3 },
    { name: "আকিদা", icon: Compass },
    { name: "ইবাদত", icon: BookOpen },
    { name: "আত্মশুদ্ধি", icon: Sparkles },
    { name: "কুরআন ও হাদিস", icon: GraduationCap },
];

export default function GlossaryPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("সব শব্দ");
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [quizIndex, setQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const filteredTerms = useMemo(() => {
        const query = search.trim().toLowerCase();

        return glossaryData.filter((item) => {
            const matchesCategory =
                activeCategory === "সব শব্দ" ||
                item.category === activeCategory;

            const searchableValues = [
                item.term,
                item.arabic,
                item.transliteration,
                item.meaning,
                item.category,
            ];

            const matchesSearch =
                !query ||
                searchableValues.some((value) =>
                    String(value ?? "").toLowerCase().includes(query)
                );

            return matchesCategory && matchesSearch;
        });
    }, [search, activeCategory]);

    const quiz = glossaryData[quizIndex % glossaryData.length];

    function resetQuiz() {
        setQuizIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
    }

    function nextQuestion() {
        setQuizIndex((current) => (current + 1) % glossaryData.length);
        setSelectedAnswer(null);
        setShowResult(false);
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#F7F8F3] text-[#173C2F]">
            {/* Premium Hero */}
            <section className="relative isolate overflow-hidden bg-[#092D23] text-white">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.09]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #E8D7A3 1px, transparent 0)",
                        backgroundSize: "30px 30px",
                    }}
                />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full border border-[#D8C38A]/15"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-20 h-[300px] w-[300px] rounded-full border border-[#D8C38A]/15"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-40 left-[25%] h-[350px] w-[350px] rounded-full bg-emerald-400/10 blur-[100px]"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-[8%] top-16 h-56 w-56 rounded-full bg-[#D7B968]/10 blur-[90px]"
                />

                <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#DCC78C]">
                        <span className="h-px w-8 bg-[#DCC78C]" />
                        EDUKIND · DEEN & KNOWLEDGE
                    </div>

                    <div className="mt-9 grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCC78C]/25 bg-white/[0.055] px-3.5 py-2 text-xs font-medium text-[#F0E4BE] backdrop-blur-md">
                                <Sparkles size={14} />
                                Your Islamic Learning Library
                            </div>

                            <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-[1.35] tracking-tight sm:text-4xl lg:text-[50px]">
                                জ্ঞানের আলোয়
                                <span className="mt-1 block text-[#E8D39B]">
                                    ইসলামকে জানুন
                                </span>
                            </h1>

                            <p className="mt-5 max-w-xl text-sm leading-8 text-[#D3E1D7]/75 sm:text-base sm:leading-9">
                                গুরুত্বপূর্ণ ইসলামিক পরিভাষার অর্থ, সহজ
                                ব্যাখ্যা, বাস্তব উদাহরণ ও অনুশীলনের মাধ্যমে
                                জ্ঞান অর্জন করুন নিজের গতিতে।
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <a
                                    href="#glossary"
                                    className="group inline-flex min-h-12 items-center gap-2.5 rounded-xl bg-[#E5D09A] px-5 py-3 text-sm font-semibold text-[#173C2F] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#F0DDAA]"
                                >
                                    শেখা শুরু করুন
                                    <ArrowRight
                                        size={17}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </a>
                                <a
                                    href="#quiz"
                                    className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                >
                                    <Brain size={17} />
                                    জ্ঞান যাচাই করুন
                                </a>
                            </div>

                            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#D3E1D7]/70">
                                <span className="flex items-center gap-2">
                                    <BookOpen size={16} className="text-[#E5D09A]" />
                                    {glossaryData.length}টি শেখার শব্দ
                                </span>
                                <span className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-[#E5D09A]" />
                                    উৎস যাচাইয়ের প্রতি গুরুত্ব
                                </span>
                            </div>
                        </div>

                        <div className="relative mx-auto hidden w-full max-w-sm lg:block">
                            <div className="absolute inset-5 rounded-[2rem] bg-[#D8C38A]/10 blur-2xl" />
                            <div className="relative rounded-[2rem] border border-[#DCC78C]/20 bg-white/[0.045] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#DCC78C]">
                                            A moment to reflect
                                        </p>
                                        <p className="mt-1 text-xs text-white/50">
                                            Learn · Reflect · Practice
                                        </p>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCC78C]/20 bg-[#DCC78C]/10 text-[#E8D39B]">
                                        <BookOpen size={19} />
                                    </div>
                                </div>

                                <div className="px-2 py-10 text-center">
                                    <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#DCC78C]/30 bg-[#DCC78C]/[0.06]">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#DCC78C]/20 text-5xl text-[#E8D39B]">
                                            ع
                                        </div>
                                    </div>
                                    <p
                                        dir="rtl"
                                        lang="ar"
                                        className="mt-7 text-4xl leading-relaxed text-[#F2E6C5]"
                                    >
                                        وَقُل رَّبِّ زِدْنِي عِلْمًا
                                    </p>
                                    <p className="mt-4 text-sm text-white/70">
                                        হে আমার রব, আমার জ্ঞান বৃদ্ধি করুন।
                                    </p>
                                    <p className="mt-3 text-[11px] tracking-wide text-[#DCC78C]">
                                        সূরা ত্ব-হা · ২০:১১৪
                                    </p>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/10 px-4 py-3">
                                    <span className="text-xs text-white/60">
                                        প্রতিদিন একটু শিখুন
                                    </span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative h-px bg-gradient-to-r from-transparent via-[#DCC78C]/50 to-transparent" />
            </section>

            <div className="mx-auto max-w-7xl space-y-16 px-5 py-10 sm:px-8 sm:py-14 lg:space-y-20 lg:py-16">
                {/* Search & Filter */}
                <section id="glossary" className="scroll-mt-8">
                    <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#A47D36]">
                                <span className="h-px w-6 bg-[#A47D36]" />
                                Discover & Learn
                            </div>
                            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                                ইসলামিক শব্দভান্ডার
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-7 text-[#748479]">
                                একটি শব্দ নির্বাচন করুন, তার অর্থ বুঝুন এবং
                                বিস্তারিত জেনে নিন।
                            </p>
                        </div>
                        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#DCE5D9] bg-white px-4 py-3 text-xs font-medium text-[#577163] shadow-sm">
                            <BookOpen size={16} className="text-[#A47D36]" />
                            {filteredTerms.length}টি ফলাফল
                        </div>
                    </div>

                    <div className="rounded-2xl border border-[#E0E7DC] bg-white p-3 shadow-[0_8px_35px_rgba(28,65,45,0.035)] sm:p-4">
                        <div className="relative">
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#829187]"
                                size={19}
                            />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="বাংলা, আরবি বা ইংরেজিতে খুঁজুন..."
                                aria-label="Glossary শব্দ খুঁজুন"
                                className="min-h-14 w-full rounded-xl border border-[#E4EAE1] bg-[#FAFBF8] py-4 pl-12 pr-12 text-sm text-[#193B30] outline-none transition placeholder:text-[#9AA69B] focus:border-[#3A8061] focus:bg-white focus:ring-4 focus:ring-[#2B8060]/[0.08]"
                            />
                            {search && (
                                <button
                                    type="button"
                                    aria-label="Search পরিষ্কার করুন"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#728477] transition hover:bg-[#EDF3EB]"
                                >
                                    <X size={17} />
                                </button>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                            {categories.map(({ name, icon: Icon }) => {
                                const active = activeCategory === name;

                                return (
                                    <button
                                        key={name}
                                        type="button"
                                        onClick={() => setActiveCategory(name)}
                                        className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold transition duration-200 sm:text-sm ${active
                                            ? "border-[#174D38] bg-[#174D38] text-white shadow-md shadow-[#174D38]/10"
                                            : "border-[#E2E9DF] bg-white text-[#66796C] hover:border-[#B6CEB8] hover:bg-[#F7FAF5]"
                                            }`}
                                    >
                                        <Icon size={15} />
                                        {name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Glossary Cards */}
                <section>
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A47D36]">
                                The Collection
                            </p>
                            <h2 className="mt-2 text-xl font-semibold sm:text-2xl">
                                জ্ঞানের সংগ্রহ
                            </h2>
                        </div>
                        <span className="hidden text-xs text-[#859286] sm:block">
                            Explore each word at your own pace
                        </span>
                    </div>

                    {filteredTerms.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#CAD8C9] bg-white px-6 py-16 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4E9] text-[#47765A]">
                                <Search size={24} />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold">
                                কোনো শব্দ পাওয়া যায়নি
                            </h3>
                            <p className="mt-2 text-sm text-[#7D8C7F]">
                                অন্য শব্দ দিয়ে খুঁজে দেখুন অথবা বিভাগ পরিবর্তন করুন।
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setActiveCategory("সব শব্দ");
                                }}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#174D38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#103B2A]"
                            >
                                <RotateCcw size={15} />
                                সব শব্দ দেখুন
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredTerms.map((item, index) => {
                                const isOpen = selectedTerm === item.id;

                                return (
                                    <article
                                        key={item.id}
                                        className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(25,64,43,0.09)] ${isOpen
                                            ? "border-[#A8C6AB] shadow-[0_12px_32px_rgba(25,64,43,0.06)]"
                                            : "border-[#E0E7DC] shadow-[0_4px_18px_rgba(25,64,43,0.025)] hover:border-[#B6CDB6]"
                                            }`}
                                    >
                                        <div className="h-1 bg-gradient-to-r from-[#174D38] via-[#B8A067] to-[#E9D8A8]" />

                                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="rounded-lg border border-[#E2EBDD] bg-[#F3F7EF] px-3 py-1.5 text-[11px] font-semibold text-[#3F7051]">
                                                    {item.category}
                                                </span>
                                                <span className="font-mono text-[10px] tracking-wider text-[#ADB6A9]">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                            </div>

                                            <div className="mt-6 flex items-center gap-4">
                                                <div
                                                    dir="rtl"
                                                    lang="ar"
                                                    className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-[#E9DFC4] bg-gradient-to-br from-[#FCF8EB] to-[#F5EEDB] text-3xl text-[#8B6A2F] shadow-sm transition duration-300 group-hover:border-[#D6C28D]"
                                                >
                                                    {item.arabic}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-xl font-semibold tracking-tight text-[#193B30] sm:text-2xl">
                                                        {item.term}
                                                    </h3>
                                                    <p className="mt-1.5 text-xs tracking-wide text-[#849184]">
                                                        {item.transliteration}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#A17C3B]">
                                                    Meaning & Understanding
                                                </p>
                                                <p className="mt-2 text-sm leading-7 text-[#607365]">
                                                    {item.meaning}
                                                </p>
                                            </div>

                                            {isOpen && (
                                                <div className="mt-5 space-y-4 border-t border-[#E7ECE3] pt-5">
                                                    <div>
                                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-[#24543A]">
                                                            <BookOpen size={16} />
                                                            বিস্তারিত ব্যাখ্যা
                                                        </h4>
                                                        <p className="mt-2 text-sm leading-7 text-[#637467]">
                                                            {item.explanation}
                                                        </p>
                                                    </div>

                                                    <div className="rounded-xl border border-[#E1EADD] bg-[#F6F8F2] p-4">
                                                        <h4 className="flex items-center gap-2 text-xs font-bold text-[#315E40]">
                                                            <Sparkles size={15} />
                                                            বাস্তব উদাহরণ
                                                        </h4>
                                                        <p className="mt-2 text-sm leading-7 text-[#647668]">
                                                            {item.example}
                                                        </p>
                                                    </div>

                                                    {item.reference?.url && (
                                                        <div className="rounded-xl border border-[#E8DDBE] bg-[#FCF8ED] p-4">
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#967435]">
                                                                Source Reference
                                                            </p>
                                                            <a
                                                                href={item.reference.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="mt-2 inline-flex items-start gap-2 text-sm font-semibold leading-6 text-[#326A49] underline decoration-[#B8CBAF] underline-offset-4 hover:text-[#174D38]"
                                                            >
                                                                <span>
                                                                    {item.reference.type === "quran"
                                                                        ? `কুরআন: সূরা ${item.reference.surah} (${item.reference.surahNumber}:${item.reference.ayah})`
                                                                        : `মূল উৎস: ${item.reference.surah || item.reference.type || "রেফারেন্স দেখুন"}`}
                                                                </span>
                                                                <MoveUpRight size={14} className="mt-1 shrink-0" />
                                                            </a>
                                                            <p className="mt-2 text-xs leading-6 text-[#8C8063]">
                                                                মূল উৎস ও সংশ্লিষ্ট প্রসঙ্গ যাচাই করে পড়ুন।
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                onClick={() =>
                                                    setSelectedTerm(isOpen ? null : item.id)
                                                }
                                                className={`mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${isOpen
                                                    ? "border-[#174D38] bg-[#174D38] text-white hover:bg-[#103B2A]"
                                                    : "border-[#DDE7DB] bg-white text-[#2E6847] hover:border-[#B7CFB6] hover:bg-[#F4F8F1]"
                                                    }`}
                                            >
                                                {isOpen ? "সংক্ষিপ্ত করুন" : "বিস্তারিত শিখুন"}
                                                {isOpen ? (
                                                    <ChevronUp size={17} />
                                                ) : (
                                                    <ArrowRight size={17} />
                                                )}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Learning Quiz */}
                {quiz && (
                    <section
                        id="quiz"
                        className="scroll-mt-8 overflow-hidden rounded-3xl border border-[#DCE5D8] bg-white shadow-[0_12px_45px_rgba(27,62,42,0.045)]"
                    >
                        <div className="relative overflow-hidden bg-[#103B2B] px-6 py-8 text-white sm:px-9 sm:py-10">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-8 -top-24 h-64 w-64 rounded-full border border-white/[0.07]"
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-1 -top-16 h-48 w-48 rounded-full border border-white/[0.07]"
                            />

                            <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#E4D09A]/20 bg-[#E4D09A]/10 text-[#E7D29A]">
                                        <Brain size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E4D09A]">
                                            Practice & Remember
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                                            আপনার জ্ঞান যাচাই করুন
                                        </h2>
                                        <p className="mt-2 max-w-lg text-sm leading-7 text-white/65">
                                            শেখা শব্দগুলো থেকে প্রশ্নের উত্তর দিন এবং
                                            নিজের বোঝাপড়া যাচাই করুন।
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-xs text-white/75">
                                    <CircleHelp size={16} className="text-[#E4D09A]" />
                                    প্রশ্ন {quizIndex + 1} / {glossaryData.length}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-9">
                            <div className="flex items-center justify-between gap-4">
                                <span className="inline-flex items-center gap-2 rounded-lg bg-[#F3F5EB] px-3 py-2 text-xs font-semibold text-[#507051]">
                                    <GraduationCap size={15} />
                                    Quick Knowledge Check
                                </span>
                                <button
                                    type="button"
                                    onClick={resetQuiz}
                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#7B8A7D] transition hover:bg-[#F3F6F0] hover:text-[#315E40]"
                                >
                                    <RotateCcw size={14} />
                                    আবার শুরু
                                </button>
                            </div>

                            <h3 className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-[#203F30] sm:text-xl">
                                {quiz.question}
                            </h3>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {quiz.options.map((option, index) => {
                                    const isCorrect = index === quiz.answer;
                                    const isSelected = index === selectedAnswer;

                                    let style =
                                        "border-[#E2E8DE] bg-white text-[#4E6657] hover:border-[#A8C6AA] hover:bg-[#F8FAF5]";

                                    if (showResult && isCorrect) {
                                        style =
                                            "border-[#78B58C] bg-[#EDF7EE] text-[#245D3B]";
                                    } else if (showResult && isSelected && !isCorrect) {
                                        style =
                                            "border-[#DCA49A] bg-[#FFF1ED] text-[#914B40]";
                                    } else if (isSelected) {
                                        style =
                                            "border-[#538864] bg-[#F0F6ED] text-[#285D3C]";
                                    }

                                    return (
                                        <button
                                            key={`${quizIndex}-${option}`}
                                            type="button"
                                            disabled={showResult}
                                            onClick={() => setSelectedAnswer(index)}
                                            className={`flex min-h-[62px] items-center gap-3 rounded-xl border p-4 text-left text-sm leading-6 transition duration-200 ${style}`}
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-current/15 text-xs font-bold">
                                                {String.fromCharCode(65 + index)}
                                            </span>
                                            <span className="flex-1">{option}</span>
                                            {showResult && isCorrect && (
                                                <CircleCheck size={18} className="shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {showResult && (
                                <div
                                    role="status"
                                    className="mt-5 rounded-xl border border-[#DDE8D8] bg-[#F5F8F0] p-4 text-sm leading-7 text-[#45664B]"
                                >
                                    <p className="font-semibold">
                                        {selectedAnswer === quiz.answer
                                            ? "সঠিক উত্তর! খুব ভালো করেছেন।"
                                            : "চেষ্টা চালিয়ে যান। সঠিক উত্তরটি দেখে নিন।"}
                                    </p>
                                    {selectedAnswer !== quiz.answer && (
                                        <p className="mt-1">
                                            সঠিক উত্তর: {quiz.options[quiz.answer]}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="mt-6 flex flex-col gap-3 border-t border-[#E9EDE5] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs leading-6 text-[#879386]">
                                    ধীরে শিখুন, বুঝে উত্তর দিন।
                                </p>
                                {!showResult ? (
                                    <button
                                        type="button"
                                        disabled={selectedAnswer === null}
                                        onClick={() => setShowResult(true)}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#174D38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#103B2A] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        উত্তর যাচাই করুন
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={nextQuestion}
                                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#174D38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#103B2A]"
                                    >
                                        পরের প্রশ্ন
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* Learning Principles */}
                <section className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#E1E8DC] bg-white p-5 sm:p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF4E9] text-[#42754F]">
                            <BookOpen size={20} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold">
                            অর্থ বুঝে শিখুন
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-[#78887A]">
                            শুধু শব্দ মুখস্থ নয়, তার অর্থ ও প্রাসঙ্গিকতা বুঝুন।
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E1E8DC] bg-white p-5 sm:p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F8F0DB] text-[#9A7837]">
                            <Compass size={20} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold">
                            মূল উৎস অনুসরণ করুন
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-[#78887A]">
                            ধর্মীয় বিষয়ে মূল আয়াত ও নির্ভরযোগ্য ব্যাখ্যা যাচাই করুন।
                        </p>
                    </div>

                    <div className="rounded-2xl border border-[#E1E8DC] bg-white p-5 sm:p-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF0F7] text-[#596D9A]">
                            <GraduationCap size={20} />
                        </div>
                        <h3 className="mt-4 text-sm font-semibold">
                            অনুশীলনের মাধ্যমে শিখুন
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-[#78887A]">
                            কুইজের মাধ্যমে নিজের বোঝাপড়া যাচাই করুন।
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-[#DFE6DA] pt-7">
                    <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                        <div>
                            <p className="text-sm font-semibold tracking-wide text-[#315640]">
                                EDUKIND <span className="text-[#A47D36]">·</span> Deen & Islam
                            </p>
                            <p className="mt-1 text-xs leading-6 text-[#899589]">
                                ইসলামিক জ্ঞান অর্জন করুন যত্ন, বোঝাপড়া ও যাচাইয়ের মাধ্যমে।
                            </p>
                        </div>
                        <a
                            href="#glossary"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-[#477354] transition hover:text-[#174D38]"
                        >
                            উপরে ফিরে যান
                            <ArrowRight size={14} className="-rotate-90" />
                        </a>
                    </div>
                    <p className="mt-5 text-center text-[10px] leading-6 text-[#A0AA9E]">
                        ইসলামিক শিক্ষামূলক কনটেন্ট। নির্দিষ্ট ধর্মীয় বিধানের ক্ষেত্রে
                        নির্ভরযোগ্য আলেমের পরামর্শ নিন।
                    </p>
                </footer>
            </div>
        </main>
    );
}