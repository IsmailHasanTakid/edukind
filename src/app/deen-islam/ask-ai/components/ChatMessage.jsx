"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    AlertCircle,
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    Info,
    LoaderCircle,
    RefreshCw,
    ScrollText,
    Sparkles,
} from "lucide-react";
import CopyButton from "./CopyButton";
import SourceCard from "./SourceCard";
import { answerForCopy, referencesForCopy } from "../utils/copy";

const markdownComponents = {
    p: ({ children }) => (
        <p className="my-2 leading-7 text-[#3E5B4C]">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="font-semibold text-[#153B37]">{children}</strong>
    ),
    ul: ({ children }) => (
        <ul className="my-2 list-disc space-y-1 pl-5 text-[#3E5B4C]">
            {children}
        </ul>
    ),
    ol: ({ children }) => (
        <ol className="my-2 list-decimal space-y-1 pl-5 text-[#3E5B4C]">
            {children}
        </ol>
    ),
    li: ({ children }) => <li className="pl-0.5 leading-6">{children}</li>,
    h1: ({ children }) => (
        <h3 className="mb-2 mt-4 text-base font-semibold text-[#153B37]">
            {children}
        </h3>
    ),
    h2: ({ children }) => (
        <h3 className="mb-2 mt-4 text-base font-semibold text-[#153B37]">
            {children}
        </h3>
    ),
    h3: ({ children }) => (
        <h4 className="mb-1.5 mt-3 text-sm font-semibold text-[#153B37]">
            {children}
        </h4>
    ),
    blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-[#C69B52]/50 bg-[#FBF1E8]/60 px-3 py-1 text-[#5E7368]">
            {children}
        </blockquote>
    ),
    a: ({ href, children }) => {
        const safeHref =
            typeof href === "string" && /^https?:\/\//i.test(href)
                ? href
                : null;

        return safeHref ? (
            <a
                href={safeHref}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[#1E4F4A] underline decoration-[#C69B52]/50 underline-offset-2 hover:text-[#153B37]"
            >
                {children}
            </a>
        ) : (
            <span className="text-[#1E4F4A]">{children}</span>
        );
    },
    code: ({ children }) => (
        <code className="rounded bg-[#F1F6F2] px-1 py-0.5 font-mono text-[0.9em] text-[#153B37]">
            {children}
        </code>
    ),
};

function Markdown({ children }) {
    return (
        <div className="text-[13px] leading-7">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}

function AnswerHeader({ result }) {
    const quranCount = result.quranReferences?.length || 0;
    const hadithCount = result.hadithReferences?.length || 0;

    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8F0EA] pb-3.5">
            <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C69B52]/30 bg-[#FBF1E8] text-[#8A6424]">
                    <Sparkles size={17} aria-hidden="true" />
                </span>
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A17B3D]">
                        EDUKIND · ইসলামিক সহায়ক
                    </p>
                    <p className="text-[11px] text-[#7A8B82]">
                        {quranCount || hadithCount
                            ? `${quranCount}টি কুরআন · ${hadithCount}টি হাদিস সূত্র`
                            : "সূত্র-সংযুক্ত নয়"}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <CopyButton
                    text={answerForCopy(result)}
                    label="উত্তর কপি"
                    copiedLabel="উত্তর কপি হয়েছে"
                />
                {quranCount || hadithCount ? (
                    <CopyButton
                        text={referencesForCopy(result)}
                        label="সূত্র কপি"
                        copiedLabel="সূত্র কপি হয়েছে"
                    />
                ) : null}
            </div>
        </div>
    );
}

function AnswerSection({ title, icon: Icon, children, tone = "normal" }) {
    const toneClass =
        tone === "note"
            ? "border-[#C69B52]/30 bg-[#FBF1E8]/60"
            : tone === "warning"
              ? "border-amber-300/60 bg-amber-50/70"
              : tone === "danger"
                ? "border-rose-300/50 bg-rose-50/60"
                : "border-[#E4ECE7] bg-white/70";

    return (
        <section className={`rounded-2xl border px-4 py-3.5 ${toneClass}`}>
            <h3 className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527066]">
                {Icon ? <Icon size={14} aria-hidden="true" /> : null}
                {title}
            </h3>
            {children}
        </section>
    );
}

function RetrievalNotice({ result }) {
    const quranCount = result.quranReferences?.length || 0;
    const hadithCount = result.hadithReferences?.length || 0;
    const quranStatus = result.retrieval?.quran?.status;
    const hadithStatus = result.retrieval?.hadith?.status;

    if (quranCount || hadithCount) {
        return (
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7A8B82]">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/50 bg-emerald-50 px-2.5 py-1 font-medium text-emerald-800">
                    <CheckCircle2 size={12} aria-hidden="true" />
                    উৎস রেকর্ড মিলিয়ে দেখা হয়েছে
                </span>
                {quranStatus === "empty" && hadithCount ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E3D3B4] bg-[#FBF1E8] px-2.5 py-1 text-[#8A6424]">
                        <Info size={12} aria-hidden="true" />
                        এই উত্তরে কুরআন সূত্র মেলেনি
                    </span>
                ) : null}
                {hadithStatus === "empty" && quranCount ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E3D3B4] bg-[#FBF1E8] px-2.5 py-1 text-[#8A6424]">
                        <Info size={12} aria-hidden="true" />
                        এই উত্তরে হাদিস সূত্র মেলেনি
                    </span>
                ) : null}
            </div>
        );
    }

    const unavailable =
        quranStatus === "unavailable" || hadithStatus === "unavailable";
    const notes = [
        result.retrieval?.quran?.note,
        result.retrieval?.hadith?.note,
    ].filter(Boolean);

    return (
        <div
            className={`rounded-2xl border px-4 py-3.5 ${
                unavailable
                    ? "border-amber-300/60 bg-amber-50/70"
                    : "border-[#E3D3B4] bg-[#FBF1E8]/65"
            }`}
        >
            <p className="flex items-center gap-2 text-[12px] font-semibold text-[#7A5A20]">
                <AlertTriangle size={15} aria-hidden="true" />
                {unavailable
                    ? "সূত্র যাচাই করা যায়নি"
                    : "এই উত্তরে যাচাইকৃত সূত্র সংযুক্ত হয়নি"}
            </p>
            <p className="mt-1 text-[11px] leading-6 text-[#7A6A4D]">
                {notes.length
                    ? notes.join(" ")
                    : "উত্তরটি সাধারণ ব্যাখ্যা হিসেবে পড়ুন; কোনো নির্দিষ্ট কুরআন আয়াত বা হাদিস রেকর্ড যাচাই করে দেখানো হয়নি।"}
            </p>
        </div>
    );
}

export default function ChatMessage({
    message,
    onRetry,
    sending,
}) {
    if (message.role === "user") {
        return (
            <article className="flex justify-end">
                <div className="max-w-[92%] rounded-2xl rounded-br-md bg-[#153B37] px-4 py-3 text-[13px] leading-6 text-[#FFFBF5] shadow-[0_14px_28px_-26px_rgba(21,59,55,.9)] sm:max-w-[80%]">
                    <p className="whitespace-pre-wrap break-words">
                        {message.text}
                    </p>
                </div>
            </article>
        );
    }

    if (message.status === "loading") {
        return (
            <article
                className="rounded-2xl border border-[#DCE8E0] bg-white/80 px-4 py-4 shadow-[0_14px_30px_-30px_rgba(21,59,55,.55)]"
                aria-busy="true"
                aria-live="polite"
            >
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#527066]">
                    <LoaderCircle
                        size={16}
                        className="animate-spin motion-reduce:animate-none"
                        aria-hidden="true"
                    />
                    কুরআন ও হাদিস সূত্র যাচাই করে উত্তর তৈরি হচ্ছে…
                </div>
                <div className="mt-4 space-y-2.5" aria-hidden="true">
                    <div className="h-2.5 w-3/4 animate-pulse rounded-full bg-[#E9F0EB]" />
                    <div className="h-2.5 w-full animate-pulse rounded-full bg-[#E9F0EB]" />
                    <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-[#E9F0EB]" />
                </div>
                <p className="mt-3 text-[10px] text-[#8A9A91]">
                    উত্তর কখনো কখনো ১০–২০ সেকেন্ড সময় নিতে পারে।
                </p>
            </article>
        );
    }

    if (message.status === "error") {
        return (
            <article className="rounded-2xl border border-rose-200 bg-rose-50/65 px-4 py-4">
                <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                        <AlertCircle size={17} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-rose-800">
                            উত্তরটি তৈরি করা যায়নি
                        </p>
                        <p className="mt-1 text-[11px] leading-6 text-rose-700/90">
                            {message.error ||
                                "একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন।"}
                        </p>
                        <button
                            type="button"
                            onClick={() => onRetry(message)}
                            disabled={sending}
                            className="mt-3 inline-flex min-h-9 items-center gap-2 rounded-full border border-rose-300 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-rose-800 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
                        >
                            <RefreshCw size={13} aria-hidden="true" />
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    const result = message.result;
    if (!result) return null;

    const quranReferences = result.quranReferences || [];
    const hadithReferences = result.hadithReferences || [];

    return (
        <article className="overflow-hidden rounded-2xl border border-[#DCE8E0] bg-[#FFFDF8]/95 p-4 shadow-[0_18px_38px_-34px_rgba(21,59,55,.55)] sm:p-5">
            <AnswerHeader result={result} />

            <div className="space-y-3.5">
                <AnswerSection title="সংক্ষিপ্ত উত্তর" icon={Sparkles}>
                    <Markdown>{result.answer}</Markdown>
                </AnswerSection>

                {result.explanation ? (
                    <AnswerSection title="ব্যাখ্যা" icon={BookOpen}>
                        <Markdown>{result.explanation}</Markdown>
                    </AnswerSection>
                ) : null}

                {result.scholarlyNotes ? (
                    <AnswerSection
                        title="গুরুত্বপূর্ণ সতর্কতা"
                        icon={Info}
                        tone="note"
                    >
                        <Markdown>{result.scholarlyNotes}</Markdown>
                    </AnswerSection>
                ) : null}

                <RetrievalNotice result={result} />

                {quranReferences.length || hadithReferences.length ? (
                    <section aria-labelledby={`sources-${message.id}`}>
                        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                            <h3
                                id={`sources-${message.id}`}
                                className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#527066]"
                            >
                                <BookOpen size={14} aria-hidden="true" />
                                যাচাইকৃত সূত্র
                            </h3>
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#8A9A91]">
                                <ScrollText size={12} aria-hidden="true" />
                                উৎস রেকর্ড থেকে সরাসরি
                            </span>
                        </div>

                        <div className="space-y-3">
                            {quranReferences.map((reference) => (
                                <SourceCard
                                    key={`quran-${reference.id}`}
                                    reference={reference}
                                />
                            ))}
                            {hadithReferences.map((reference) => (
                                <SourceCard
                                    key={`hadith-${reference.id}`}
                                    reference={reference}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                {result.limitations ? (
                    <AnswerSection
                        title="সীমাবদ্ধতা ও যাচাইয়ের নোট"
                        icon={AlertTriangle}
                        tone="warning"
                    >
                        <Markdown>{result.limitations}</Markdown>
                    </AnswerSection>
                ) : null}

                {result.disclaimer ? (
                    <p className="px-1 text-[10px] leading-5 text-[#8A9A91]">
                        {result.disclaimer}
                    </p>
                ) : null}
            </div>
        </article>
    );
}
