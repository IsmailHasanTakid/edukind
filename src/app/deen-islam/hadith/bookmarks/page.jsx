
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, BookmarkX, BookOpen } from "lucide-react";
import HadithBookmarkButton from "@/components/deen/HadithBookmarkButton";

const STORAGE_KEY = "edukind-saved-hadith-v1";

export default function HadithBookmarksPage() {
    const [hadiths, setHadiths] = useState([]);
    const [ready, setReady] = useState(false);

    function loadBookmarks() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            setHadiths(Array.isArray(saved) ? saved : []);
        } catch {
            setHadiths([]);
        }

        setReady(true);
    }

    useEffect(() => {
        loadBookmarks();

        function handleStorageChange(event) {
            if (event.key === STORAGE_KEY) {
                loadBookmarks();
            }
        }

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    function removeBookmark(hadith) {
        const updated = hadiths.filter(
            (item) =>
                !(
                    item.collectionId === hadith.collectionId &&
                    Number(item.number) === Number(hadith.number)
                )
        );

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setHadiths(updated);
    }

    return (
        <main className="min-h-screen bg-[#080A12] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/deen-islam/hadith"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    হাদিস হোমে ফিরে যান
                </Link>

                <header className="mb-8">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                        <Bookmark size={23} />
                    </div>

                    <h1 className="text-2xl font-bold sm:text-4xl">
                        আমার সংরক্ষিত হাদিস
                    </h1>

                    <p className="mt-3 text-sm text-slate-400">
                        তোমার পছন্দের হাদিসগুলো এখানে সংরক্ষিত থাকবে।
                    </p>

                    {ready && (
                        <p className="mt-3 text-xs text-violet-300">
                            মোট {hadiths.length}টি সংরক্ষিত হাদিস
                        </p>
                    )}
                </header>

                {!ready ? (
                    <p className="py-12 text-center text-sm text-slate-400">
                        সংরক্ষিত হাদিস লোড হচ্ছে...
                    </p>
                ) : hadiths.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-14 text-center">
                        <BookmarkX
                            size={32}
                            className="mx-auto text-slate-500"
                        />
                        <h2 className="mt-4 font-semibold">
                            এখনো কোনো হাদিস সেভ করোনি
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                            সার্চ পেজে গিয়ে পছন্দের হাদিস সেভ করো।
                        </p>
                        <Link
                            href="/deen-islam/hadith/search"
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold hover:bg-violet-400"
                        >
                            <BookOpen size={16} />
                            হাদিস খুঁজুন
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {hadiths.map((hadith) => (
                            <article
                                key={`${hadith.collectionId}-${hadith.number}`}
                                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-7"
                            >
                                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                    <span className="rounded-lg bg-violet-400/10 px-3 py-2 text-xs text-violet-300">
                                        {hadith.collectionName}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">
                                            হাদিস নং: {hadith.number}
                                        </span>

                                        <HadithBookmarkButton
                                            hadith={hadith}
                                            collectionId={hadith.collectionId}
                                            collectionName={hadith.collectionName}
                                        />
                                    </div>
                                </div>

                                <p
                                    lang="ar"
                                    dir="rtl"
                                    className="text-right text-lg leading-[2.2] text-slate-100 sm:text-xl"
                                >
                                    {hadith.ar}
                                </p>

                                <div className="my-5 h-px bg-white/[0.07]" />

                                <p className="text-xs font-medium text-cyan-300">
                                    বাংলা অনুবাদ
                                </p>

                                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                                    {hadith.bn}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => removeBookmark(hadith)}
                                    className="mt-5 inline-flex items-center gap-2 text-xs text-red-300 transition hover:text-red-200"
                                >
                                    <BookmarkX size={15} />
                                    সংরক্ষিত তালিকা থেকে সরান
                                </button>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
