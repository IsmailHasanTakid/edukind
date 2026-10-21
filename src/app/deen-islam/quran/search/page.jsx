import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Search } from "lucide-react";
import { searchAyahs } from "@/lib/quran";
import { arabic, bangla, bnSerif } from "@/lib/deen-fonts";

export const metadata = { title: "আয়াত খুঁজুন | DeenIslam" };

const PER_PAGE = 15;
const bn = (n) => n.toLocaleString("bn-BD");

const SCRIPT_LABEL = {
    arabic: "আরবি টেক্সটে",
    bangla: "বাংলা অনুবাদে",
    english: "ইংরেজি অনুবাদে",
};

const EXAMPLES = ["ধৈর্য", "রহমত", "patience", "الصبر"];

function Highlight({ text, query }) {
    const q = query.trim();
    if (!q) return text;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));

    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <mark
                key={i}
                className="rounded bg-[#F6E3A1] px-0.5 text-inherit"
            >
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

function pageHref(q, page) {
    return `/deen-islam/quran/search?q=${encodeURIComponent(q)}&page=${page}`;
}

export default async function AyahSearchPage({ searchParams }) {
    const params = await searchParams;
    const q = String(params?.q ?? "").trim().slice(0, 80);
    const page = Math.max(1, Number.parseInt(params?.page, 10) || 1);

    const tooShort = q.length > 0 && q.length < 2;
    const result = q.length >= 2 ? await searchAyahs(q) : null;

    const totalPages = result ? Math.max(1, Math.ceil(result.count / PER_PAGE)) : 1;
    const currentPage = Math.min(page, totalPages);
    const visible = result
        ? result.matches.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)
        : [];

    return (
        <main
            className={`${bangla.className} min-h-screen bg-[linear-gradient(180deg,#F7FAF8_0%,#EDF5EF_45%,#F8F3E6_100%)] text-[#1B3A2F]`}
        >
            {/* হেডার ও সার্চ ফর্ম */}
            <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#0B3B2D] via-[#0F4D3A] to-[#14614A]">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-[0.09]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23E8C872' stroke-width='1'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='20' y='20' width='40' height='40' transform='rotate(45 40 40)'/%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />
                <div className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#E8C872]/20 blur-[100px]" />

                <div className="mx-auto max-w-3xl px-5 pb-10 pt-8 sm:px-8">
                    <nav
                        aria-label="breadcrumb"
                        className="flex items-center gap-2 text-xs text-[#C9D8CF]"
                    >
                        <Link href="/deen-islam" className="transition hover:text-white">
                            DeenIslam
                        </Link>
                        <ChevronRight size={13} />
                        <Link
                            href="/deen-islam/quran"
                            className="transition hover:text-white"
                        >
                            কুরআন
                        </Link>
                        <ChevronRight size={13} />
                        <span className="text-[#E8C872]">সার্চ</span>
                    </nav>

                    <h1
                        className={`${bnSerif.className} mt-6 text-3xl font-bold leading-snug text-white sm:text-4xl`}
                    >
                        আয়াত খুঁজুন
                    </h1>
                    <p className="mt-2 text-sm text-[#D5E2DA]">
                        আরবি, বাংলা বা ইংরেজি শব্দ লিখে পুরো কুরআনে খুঁজুন
                    </p>

                    <form
                        action="/deen-islam/quran/search"
                        className="mt-6 flex w-full items-center rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.28)] ring-1 ring-[#E8C872]/30"
                    >
                        <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
                        <input
                            name="q"
                            type="search"
                            defaultValue={q}
                            maxLength={80}
                            placeholder="যেমন: ধৈর্য, patience, الصبر"
                            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-gradient-to-br from-[#16B072] to-[#0D8453] px-5 text-sm font-semibold text-white transition hover:brightness-110"
                        >
                            খুঁজুন <ArrowRight size={16} />
                        </button>
                    </form>
                </div>
            </section>

            {/* ফলাফল */}
            <section className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
                {/* শুরুর অবস্থা */}
                {!q && (
                    <div className="text-center">
                        <p className="text-sm text-[#7C8A82]">
                            একটি শব্দ লিখে সার্চ করো। কয়েকটা উদাহরণ:
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                            {EXAMPLES.map((example) => (
                                <Link
                                    key={example}
                                    href={`/deen-islam/quran/search?q=${encodeURIComponent(example)}`}
                                    className="rounded-full border border-[#DCE4DF] bg-white px-4 py-2 text-sm text-[#1F6B4C] transition hover:-translate-y-0.5 hover:border-[#119A62]/50"
                                >
                                    {example}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {tooShort && (
                    <p className="text-center text-sm text-[#7C8A82]">
                        কমপক্ষে ২টি অক্ষর লিখো।
                    </p>
                )}

                {result && result.count === 0 && (
                    <div className="rounded-2xl border border-[#E3EAE5] bg-white/90 px-6 py-12 text-center">
                        <p className="text-base font-semibold">
                            &ldquo;{q}&rdquo; এর জন্য কোনো আয়াত পাওয়া যায়নি
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#7C8A82]">
                            অনুবাদের শব্দ ভিন্ন হতে পারে। অন্য শব্দ বা শব্দের ছোট অংশ
                            দিয়ে চেষ্টা করো (যেমন &ldquo;ধৈর্যশীল&rdquo;-এর বদলে
                            &ldquo;ধৈর্য&rdquo;)।
                        </p>
                    </div>
                )}

                {result && result.count > 0 && (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#7C8A82]">
                            <p>
                                <span className="font-semibold text-[#1F6B4C]">
                                    {bn(result.count)}টি
                                </span>{" "}
                                আয়াত পাওয়া গেছে · {SCRIPT_LABEL[result.script]}
                            </p>
                            <p>
                                পৃষ্ঠা {bn(currentPage)} / {bn(totalPages)}
                            </p>
                        </div>

                        <div className="mt-4 space-y-3.5">
                            {visible.map((m) => (
                                <article
                                    key={`${m.surah}-${m.number}`}
                                    className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_4px_18px_rgba(20,60,45,0.06)] backdrop-blur"
                                >
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center rounded-full border border-[#E5D6A8] bg-[#FBF5E6] px-3 py-1 text-xs font-semibold text-[#8A6A22]">
                                            {m.surahName} · {bn(m.surah)}:{bn(m.number)}
                                        </span>

                                        <Link
                                            href={`/deen-islam/quran/${m.surah}#ayah-${m.number}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1F6B4C] transition hover:gap-2.5"
                                        >
                                            পড়ুন <ArrowRight size={14} />
                                        </Link>
                                    </div>

                                    {result.script === "arabic" ? (
                                        <p
                                            dir="rtl"
                                            lang="ar"
                                            className={`${arabic.className} text-right text-3xl leading-[2.2] text-[#12281F]`}
                                        >
                                            <Highlight text={m.text} query={q} />
                                        </p>
                                    ) : (
                                        <p className="text-[15px] leading-8 text-[#3F5148]">
                                            <Highlight text={m.text} query={q} />
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>

                        {/* পৃষ্ঠা নেভিগেশন */}
                        {totalPages > 1 && (
                            <nav
                                aria-label="পৃষ্ঠা"
                                className="mt-8 flex items-center justify-between gap-3"
                            >
                                {currentPage > 1 ? (
                                    <Link
                                        href={pageHref(q, currentPage - 1)}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#DCE4DF] bg-white px-5 py-2.5 text-sm font-medium text-[#1F6B4C] transition hover:border-[#119A62]/50"
                                    >
                                        <ArrowLeft size={15} /> আগের পৃষ্ঠা
                                    </Link>
                                ) : (
                                    <span />
                                )}

                                {currentPage < totalPages && (
                                    <Link
                                        href={pageHref(q, currentPage + 1)}
                                        className="inline-flex items-center gap-2 rounded-full border border-[#DCE4DF] bg-white px-5 py-2.5 text-sm font-medium text-[#1F6B4C] transition hover:border-[#119A62]/50"
                                    >
                                        পরের পৃষ্ঠা <ArrowRight size={15} />
                                    </Link>
                                )}
                            </nav>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}