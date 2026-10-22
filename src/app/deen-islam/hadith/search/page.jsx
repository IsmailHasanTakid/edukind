
"use client";
import HadithBookmarkButton from "@/components/deen/HadithBookmarkButton";
import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Search,
    BookOpen,
    LoaderCircle,
    Languages,
    X,
} from "lucide-react";

const collections = [
    { id: "all", name: "সব কিতাব" },
    { id: "bukhari", name: "সহিহ বুখারি" },
    { id: "muslim", name: "সহিহ মুসলিম" },
    { id: "abudawood", name: "সুনান আবু দাউদ" },
    { id: "tirmidhi", name: "জামে আত-তিরমিজি" },
    { id: "nasai", name: "সুনান আন-নাসাঈ" },
    { id: "ibnmajah", name: "সুনান ইবনে মাজাহ" },
];

export default function HadithSearchPage() {
    const [query, setQuery] = useState("");
    const [collection, setCollection] = useState("all");
    const [results, setResults] = useState([]);
    const [searchedQuery, setSearchedQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    async function handleSearch(event) {
        event.preventDefault();

        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setError("কমপক্ষে ২টি অক্ষর লিখে সার্চ করুন।");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);
        setSearched(true);
        setSearchedQuery(trimmedQuery);

        try {
            const selectedCollections =
                collection === "all"
                    ? collections.filter((item) => item.id !== "all")
                    : collections.filter((item) => item.id === collection);

            const responses = await Promise.all(
                selectedCollections.map(async (item) => {
                    const params = new URLSearchParams({
                        action: "search",
                        collection: item.id,
                        q: trimmedQuery,
                    });

                    const response = await fetch(
                        `/api/hadith?${params.toString()}`
                    );

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        throw new Error(
                            data.message || "সার্চ করতে সমস্যা হয়েছে।"
                        );
                    }

                    return (data.hadiths || []).map((hadith) => ({
                        ...hadith,
                        collectionId: item.id,
                        collectionName: item.name,
                    }));
                })
            );

            setResults(responses.flat());
        } catch (err) {
            setError(
                err.message || "হাদিস খুঁজতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
            );
        } finally {
            setLoading(false);
        }
    }

    function clearSearch() {
        setQuery("");
        setResults([]);
        setSearchedQuery("");
        setError("");
        setSearched(false);
    }

    return (
        <main className="min-h-screen bg-[#080A12] px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Link
                    href="/deen-islam/hadith"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
                >
                    <ArrowLeft size={16} />
                    হাদিস হোমে ফিরে যান
                </Link>

                <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-[#101323] to-cyan-500/10 p-6 sm:p-10">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
                            <Search size={23} />
                        </div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-violet-300">
                            Hadith Explorer
                        </p>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
                            হাদিস খুঁজুন
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            বাংলা বা আরবি শব্দ দিয়ে হাদিস খুঁজে বের করুন।
                            মূল আরবি পাঠ ও বাংলা অনুবাদ একসঙ্গে পড়ুন।
                        </p>

                        <form onSubmit={handleSearch} className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 transition focus-within:border-violet-400/60">
                                <Search
                                    size={20}
                                    className="shrink-0 text-slate-500"
                                />

                                <input
                                    value={query}
                                    onChange={(event) =>
                                        setQuery(event.target.value)
                                    }
                                    placeholder="বাংলা বা আরবি শব্দ লিখুন..."
                                    aria-label="হাদিস খুঁজুন"
                                    className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-500 sm:text-base"
                                />

                                {query && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        aria-label="সার্চ মুছুন"
                                        className="text-slate-500 hover:text-white"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <select
                                    value={collection}
                                    onChange={(event) =>
                                        setCollection(event.target.value)
                                    }
                                    aria-label="হাদিসের কিতাব নির্বাচন করুন"
                                    className="min-h-12 flex-1 rounded-xl border border-white/10 bg-[#111525] px-4 text-sm text-slate-200 outline-none focus:border-violet-400/60"
                                >
                                    {collections.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-violet-500 px-7 text-sm font-semibold transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        <LoaderCircle
                                            size={18}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Search size={18} />
                                    )}
                                    {loading ? "খোঁজা হচ্ছে..." : "হাদিস খুঁজুন"}
                                </button>
                            </div>
                        </form>

                        <p className="mt-4 text-xs text-slate-500">
                            বাংলা শব্দ, আরবি শব্দ অথবা হাদিস নম্বর দিয়ে চেষ্টা করুন।
                        </p>
                    </div>
                </section>

                <section className="mt-8">
                    {loading && (
                        <div className="flex flex-col items-center py-16 text-center">
                            <LoaderCircle
                                size={30}
                                className="animate-spin text-violet-400"
                            />
                            <p className="mt-4 text-sm text-slate-400">
                                হাদিস খোঁজা হচ্ছে...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div
                            role="alert"
                            className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-300"
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && searched && results.length > 0 && (
                        <>
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        সার্চের ফলাফল
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        “{searchedQuery}” অনুসন্ধানের ফল
                                    </p>
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                                    {results.length}টি হাদিস
                                </span>
                            </div>

                            <div className="space-y-4">
                                {results.map((hadith, index) => (
                                    <article
                                        key={`${hadith.collectionId}-${hadith.number}-${index}`}
                                        className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-violet-400/30 sm:p-7"
                                    >
                                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                            <span className="inline-flex items-center gap-2 rounded-lg bg-violet-400/10 px-3 py-2 text-xs font-medium text-violet-300">
                                                <BookOpen size={14} />
                                                {hadith.collectionName}
                                            </span>

                                            <span className="text-xs text-slate-500">
                                                হাদিস নং: {hadith.number}
                                            </span>
                                            <HadithBookmarkButton
                                                hadith={hadith}
                                                collectionId={hadith.collectionId}
                                                collectionName={hadith.collectionName}
                                            />
                                        </div>

                                        <p
                                            lang="ar"
                                            dir="rtl"
                                            className="text-right text-lg leading-[2.2] text-slate-100 sm:text-xl sm:leading-[2.3]"
                                        >
                                            {hadith.ar}
                                        </p>

                                        <div className="my-5 h-px bg-white/[0.07]" />

                                        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-cyan-300">
                                            <Languages size={15} />
                                            বাংলা অনুবাদ
                                        </div>

                                        <p
                                            lang="bn"
                                            className="text-sm leading-7 text-slate-300 sm:text-base sm:leading-8"
                                        >
                                            {hadith.bn}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}

                    {!loading && !error && searched && results.length === 0 && (
                        <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-12 text-center">
                            <Search
                                size={30}
                                className="mx-auto text-slate-600"
                            />
                            <h2 className="mt-4 font-semibold text-slate-200">
                                কোনো হাদিস পাওয়া যায়নি
                            </h2>
                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                                বর্তমান সার্চ API এখনো বাংলা ও আরবি শব্দের
                                পূর্ণাঙ্গ অনুসন্ধান সমর্থন করে না। শুধু হাদিস
                                নম্বর দিয়ে চেষ্টা করতে পারেন।
                            </p>
                        </div>
                    )}

                    {!searched && !loading && (
                        <div className="py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-400">
                                <BookOpen size={24} />
                            </div>
                            <h2 className="mt-4 font-semibold text-slate-200">
                                আপনার অনুসন্ধান শুরু করুন
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                বাংলা বা আরবি শব্দ লিখে হাদিস খুঁজুন।
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
