
"use client";
import HadithBookmarkButton from "@/components/deen/HadithBookmarkButton";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
} from "lucide-react";

export default function HadithCollectionPage({ params }) {
    const { collection } = use(params);

    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [chapters, setChapters] = useState([]);
    const [chapter, setChapter] = useState("");
    const [chapterLoading, setChapterLoading] = useState(false);


    useEffect(() => {
        let cancelled = false;

        async function loadHadiths() {
            setLoading(true);
            setError("");

            try {

                const params = new URLSearchParams({
                    action: "list",
                    collection,
                    page: String(page),
                });

                if (chapter) {
                    params.set("chapter", chapter);
                }

                const response = await fetch(`/api/hadith?${params.toString()}`);


                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "হাদিস লোড করা যায়নি।"
                    );
                }

                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "তথ্য লোড করতে সমস্যা হয়েছে।");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadHadiths();

        return () => {
            cancelled = true;
        };
    }, [collection, page, chapter]);





    useEffect(() => {
        let cancelled = false;

        async function loadChapters() {
            setChapterLoading(true);


            try {
                const response = await fetch(
                    `/api/hadith?action=chapters&collection=${encodeURIComponent(collection)}`
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error("অধ্যায়ের তালিকা লোড করা যায়নি।");
                }

                if (!cancelled) {
                    setChapters(result.chapters || []);
                }
            } catch (error) {
                console.error("Chapter loading error:", error);
            } finally {
                if (!cancelled) {
                    setChapterLoading(false);
                }
            }
        }

        loadChapters();

        return () => {
            cancelled = true;
        };
    }, [collection]);

    const selectedChapter =
        chapters.find((item) => item.id === chapter) || null;
    const chapterIndex = selectedChapter
        ? chapters.findIndex((item) => item.id === chapter)
        : -1;
    const previousChapter =
        chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
    const nextChapter =
        chapterIndex >= 0 && chapterIndex < chapters.length - 1
            ? chapters[chapterIndex + 1]
            : null;
    const chapterHadithCount =
        data && data.chapterId === (chapter || null) ? data.total : null;

    function selectChapter(nextChapterId) {
        setChapter(nextChapterId);
        setPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <main className="min-h-screen bg-[#080A12] px-4 py-6 text-white sm:px-7 lg:px-10">

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <label
                    htmlFor="hadith-chapter"
                    className="mb-2 block text-sm font-medium text-slate-300"
                >
                    অধ্যায় নির্বাচন করুন
                </label>

                <select
                    id="hadith-chapter"
                    value={chapter}
                    onChange={(event) => selectChapter(event.target.value)}
                    disabled={chapterLoading}
                    className="w-full rounded-xl border border-white/10 bg-[#111525] px-4 py-3 text-sm text-white outline-none focus:border-violet-400/60"
                >
                    <option value="">
                        {chapterLoading
                            ? "অধ্যায় লোড হচ্ছে..."
                            : "সব হাদিস"}
                    </option>

                    {chapters.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.title || item.name || `অধ্যায় ${item.id}`}
                        </option>
                    ))}
                </select>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            previousChapter &&
                            selectChapter(previousChapter.id)
                        }
                        disabled={!previousChapter}
                        className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft size={15} />
                        আগের অধ্যায়
                    </button>

                    <span className="text-[11px] text-white/40">
                        {selectedChapter
                            ? `অধ্যায় ${chapterIndex + 1} / ${chapters.length}`
                            : chapters.length
                              ? `${chapters.length}টি অধ্যায়`
                              : "সব অধ্যায়"}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            nextChapter && selectChapter(nextChapter.id)
                        }
                        disabled={!nextChapter}
                        className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        পরের অধ্যায়
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>

            <div className="mx-auto max-w-5xl">
                <Link
                    href="/deen-islam/hadith/collections"
                    className="mb-6 inline-flex items-center gap-2 text-xs text-white/50 hover:text-emerald-300"
                >
                    <ArrowLeft size={15} />
                    সব কিতাব
                </Link>

                <header className="mb-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                        <BookOpen size={20} />
                    </div>

                    <h1 className="text-xl font-bold sm:text-2xl">
                        {data?.collection?.name || collection}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                        <p className="text-sm text-white/60">
                            {selectedChapter
                                ? selectedChapter.title
                                : "সব হাদিস"}
                        </p>

                        {chapterHadithCount !== null ? (
                            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                                {chapter
                                    ? `${chapterHadithCount} টি হাদিস`
                                    : `মোট ${chapterHadithCount} টি হাদিস`}
                            </span>
                        ) : chapter && loading ? (
                            <span className="text-[11px] text-white/35">
                                হাদিস সংখ্যা লোড হচ্ছে...
                            </span>
                        ) : null}
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center gap-2 py-16 text-sm text-white/50">
                        <LoaderCircle className="animate-spin" size={18} />
                        হাদিস লোড হচ্ছে...
                    </div>
                ) : error ? (
                    <p className="rounded-xl border border-red-400/20 p-4 text-sm text-red-200">
                        {error}
                    </p>
                ) : (
                    <>
                        <div className="space-y-3">
                            {data.hadiths.map((hadith) => (
                                <article
                                    key={hadith.number}
                                    className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5"
                                >
                                    <div className="mb-3 flex items-center justify-between border-b border-white/[0.07] pb-2">
                                        <span className="text-[11px] font-medium text-emerald-300">
                                            হাদিস #{hadith.number}
                                        </span>
                                        <HadithBookmarkButton
                                            hadith={hadith}
                                            collectionId={data.collection.id}
                                            collectionName={data.collection.name}
                                        />
                                        <span className="text-[10px] text-white/35">
                                            {data.collection.name}
                                        </span>
                                    </div>

                                    <p
                                        dir="rtl"
                                        lang="ar"
                                        className="text-right text-base leading-9 text-white/90 sm:text-lg sm:leading-10"
                                    >
                                        {hadith.ar}
                                    </p>

                                    <div className="my-3 h-px bg-white/[0.06]" />

                                    <p className="mb-1 text-[10px] font-semibold text-emerald-300">
                                        বাংলা অনুবাদ
                                    </p>

                                    <p
                                        lang="bn"
                                        className="text-xs leading-6 text-white/70 sm:text-sm sm:leading-7"
                                    >
                                        {hadith.bn}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] p-3">
                            <button
                                disabled={page <= 1}
                                onClick={() => {
                                    setPage((current) => current - 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-30"
                            >
                                <ChevronLeft size={15} />
                                আগের পেজ
                            </button>

                            <span className="text-xs text-white/55">
                                পেজ {data.page} / {data.totalPages}
                            </span>

                            <button
                                disabled={page >= data.totalPages}
                                onClick={() => {
                                    setPage((current) => current + 1);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="flex items-center gap-1 rounded-lg bg-emerald-300 px-3 py-2 text-xs font-semibold text-[#08120F] hover:bg-emerald-200 disabled:opacity-30"
                            >
                                পরের পেজ
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
