
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Search,
    ArrowRight,
    Layers3,
    RefreshCw,
    LibraryBig,
    ChevronDown,
    BookMarked,
} from "lucide-react";

export default function HadithTopicsPage() {
    const [collections, setCollections] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadChapters() {
        setLoading(true);
        setError("");

        try {
            // প্রথমে সব হাদিসের কিতাব আনা হচ্ছে
            const collectionsResponse = await fetch(
                "/api/hadith?action=collections",
                { cache: "no-store" }
            );

            if (!collectionsResponse.ok) {
                throw new Error("হাদিসের কিতাবগুলো আনা যায়নি।");
            }

            const collectionsData = await collectionsResponse.json();

            if (
                !collectionsData.success ||
                !Array.isArray(collectionsData.collections)
            ) {
                throw new Error("কিতাবের তথ্য সঠিক নয়।");
            }

            setCollections(collectionsData.collections);

            // প্রতিটি কিতাবের আসল অধ্যায় আনা হচ্ছে
            const chapterResponses = await Promise.all(
                collectionsData.collections.map(async (collection) => {
                    const response = await fetch(
                        `/api/hadith?action=chapters&collection=${encodeURIComponent(
                            collection.id
                        )}`,
                        { cache: "no-store" }
                    );

                    if (!response.ok) {
                        throw new Error(
                            `${collection.name} এর অধ্যায় আনা যায়নি।`
                        );
                    }

                    const data = await response.json();

                    if (!data.success || !Array.isArray(data.chapters)) {
                        throw new Error(
                            `${collection.name} এর অধ্যায়ের তথ্য সঠিক নয়।`
                        );
                    }

                    return data.chapters.map((chapter) => ({
                        ...chapter,
                        id: String(chapter.id),
                        collectionId: collection.id,
                        collectionName: collection.name,
                    }));
                })
            );

            setChapters(chapterResponses.flat());
        } catch (err) {
            console.error("Hadith chapters loading error:", err);
            setError(
                err.message ||
                "অধ্যায়গুলো লোড করা যায়নি। আবার চেষ্টা করুন।"
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadChapters();
    }, []);

    // অধ্যায়ের আসল metadata থেকে শিরোনাম বের করা
    function getChapterTitle(chapter) {
        return (
            chapter.chapter_name_bn ||
            chapter.chapter_title_bn ||
            chapter.title_bn ||
            chapter.name_bn ||
            chapter.chapter_name ||
            chapter.chapter_title ||
            chapter.title ||
            chapter.name ||
            `অধ্যায় ${chapter.id}`
        );
    }

    function getChapterRange(chapter) {
        return (
            chapter.hadis_range ||
            chapter.hadith_range ||
            chapter.range ||
            ""
        );
    }

    // সার্চ ও কিতাবের ফিল্টার
    const filteredChapters = useMemo(() => {
        const query = search.trim().toLocaleLowerCase("bn");

        return chapters.filter((chapter) => {
            const matchesCollection =
                selectedCollection === "all" ||
                chapter.collectionId === selectedCollection;

            const searchableText = [
                getChapterTitle(chapter),
                chapter.id,
                chapter.collectionName,
                getChapterRange(chapter),
                chapter.chapter_name_ar || "",
                chapter.chapter_name_en || "",
            ]
                .join(" ")
                .toLocaleLowerCase("bn");

            const matchesSearch =
                !query || searchableText.includes(query);

            return matchesCollection && matchesSearch;
        });
    }, [chapters, search, selectedCollection]);

    // একই কিতাবের অধ্যায় একসঙ্গে দেখানো
    const groupedChapters = useMemo(() => {
        const groups = new Map();

        for (const chapter of filteredChapters) {
            if (!groups.has(chapter.collectionId)) {
                groups.set(chapter.collectionId, {
                    id: chapter.collectionId,
                    name: chapter.collectionName,
                    chapters: [],
                });
            }

            groups.get(chapter.collectionId).chapters.push(chapter);
        }

        return Array.from(groups.values());
    }, [filteredChapters]);

    return (
        <main className="min-h-screen bg-[#080D18] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <header className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-300">
                        <BookMarked size={16} />
                        হাদিস লাইব্রেরি
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                        বিষয়ভিত্তিক হাদিস
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                        হাদিসের কিতাব ও অধ্যায়গুলো এক জায়গায় দেখুন।
                        পছন্দের অধ্যায় খুঁজে নিয়ে সংশ্লিষ্ট হাদিস পড়ুন।
                    </p>
                </header>

                {/* Statistics */}
                {!loading && !error && (
                    <div className="mb-6 grid grid-cols-2 gap-3 sm:max-w-lg">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <LibraryBig
                                    size={17}
                                    className="text-emerald-300"
                                />
                                <span className="text-sm">হাদিসের কিতাব</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold">
                                {collections.length}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Layers3
                                    size={17}
                                    className="text-emerald-300"
                                />
                                <span className="text-sm">মোট অধ্যায়</span>
                            </div>
                            <p className="mt-2 text-2xl font-bold">
                                {chapters.length.toLocaleString("bn-BD")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Search and filter */}
                <div className="mb-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_260px]">
                    <div className="relative">
                        <Search
                            size={19}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="অধ্যায়ের নাম বা বিষয় খুঁজুন..."
                            aria-label="অধ্যায় খুঁজুন"
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/10"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedCollection}
                            onChange={(event) =>
                                setSelectedCollection(event.target.value)
                            }
                            aria-label="হাদিসের কিতাব নির্বাচন করুন"
                            className="w-full appearance-none rounded-2xl border border-white/10 bg-[#101827] px-4 py-3.5 pr-10 text-sm text-slate-200 outline-none focus:border-emerald-400/50"
                        >
                            <option value="all">সব কিতাব</option>

                            {collections.map((collection) => (
                                <option
                                    key={collection.id}
                                    value={collection.id}
                                >
                                    {collection.name}
                                </option>
                            ))}
                        </select>

                        <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-16 text-center">
                        <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-emerald-400/20 border-t-emerald-400" />
                        <p className="font-medium">
                            হাদিসের অধ্যায়গুলো লোড হচ্ছে...
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            সব কিতাবের অধ্যায় আনতে কিছুটা সময় লাগতে পারে।
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-6 text-center">
                        <p className="font-medium text-red-300">{error}</p>
                        <button
                            type="button"
                            onClick={loadChapters}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                        >
                            <RefreshCw size={16} />
                            আবার চেষ্টা করুন
                        </button>
                    </div>
                )}

                {/* Chapter lists */}
                {!loading && !error && (
                    <>
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <p className="text-sm text-slate-400">
                                পাওয়া গেছে{" "}
                                <span className="font-semibold text-white">
                                    {filteredChapters.length.toLocaleString(
                                        "bn-BD"
                                    )}
                                </span>{" "}
                                টি অধ্যায়
                            </p>

                            {(search || selectedCollection !== "all") && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setSelectedCollection("all");
                                    }}
                                    className="text-sm text-emerald-300 hover:text-emerald-200"
                                >
                                    ফিল্টার মুছুন
                                </button>
                            )}
                        </div>

                        {groupedChapters.length > 0 ? (
                            <div className="space-y-8">
                                {groupedChapters.map((group) => (
                                    <section key={group.id}>
                                        <div className="mb-4 flex items-center gap-3 border-b border-white/[0.08] pb-3">
                                            <div className="rounded-xl bg-emerald-400/10 p-2.5 text-emerald-300">
                                                <BookOpen size={21} />
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-semibold sm:text-xl">
                                                    {group.name}
                                                </h2>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {group.chapters.length.toLocaleString(
                                                        "bn-BD"
                                                    )}{" "}
                                                    টি অধ্যায়
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {group.chapters.map(
                                                (chapter, index) => (
                                                    <Link
                                                        key={`${group.id}-${chapter.id}`}
                                                        href={`/deen-islam/hadith/${encodeURIComponent(
                                                            group.id
                                                        )}?chapter=${encodeURIComponent(
                                                            chapter.id
                                                        )}`}
                                                        className="group flex min-h-[92px] items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:border-emerald-400/30 hover:bg-emerald-400/[0.045]"
                                                    >
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-slate-400 transition group-hover:border-emerald-400/20 group-hover:text-emerald-300">
                                                            {(
                                                                index + 1
                                                            ).toLocaleString(
                                                                "bn-BD"
                                                            )}
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="text-sm font-medium leading-6 text-slate-200 transition group-hover:text-emerald-200">
                                                                {getChapterTitle(
                                                                    chapter
                                                                )}
                                                            </h3>

                                                            {getChapterRange(
                                                                chapter
                                                            ) && (
                                                                    <p className="mt-1 text-xs text-slate-500">
                                                                        হাদিস নম্বর:{" "}
                                                                        {getChapterRange(
                                                                            chapter
                                                                        )}
                                                                    </p>
                                                                )}
                                                        </div>

                                                        <ArrowRight
                                                            size={17}
                                                            className="mt-1 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                                                        />
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-5 py-16 text-center">
                                <Search
                                    size={30}
                                    className="mx-auto mb-4 text-slate-500"
                                />
                                <h2 className="font-semibold">
                                    কোনো অধ্যায় পাওয়া যায়নি
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    অন্য নাম দিয়ে খুঁজুন অথবা সব কিতাব নির্বাচন
                                    করুন।
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
