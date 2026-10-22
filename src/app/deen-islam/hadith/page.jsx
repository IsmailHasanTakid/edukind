
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BookOpen,
    Bookmark,
    CalendarDays,
    ChevronRight,
    LoaderCircle,
    Search,
    Sparkles,
} from "lucide-react";

export default function HadithPage() {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadCollections() {
            try {
                const response = await fetch("/api/hadith");
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "কিতাব লোড করা যায়নি");
                }

                setCollections(result.collections || []);
            } catch (err) {
                setError(err.message || "তথ্য লোড করতে সমস্যা হয়েছে");
            } finally {
                setLoading(false);
            }
        }

        loadCollections();
    }, []);

    const filteredCollections = collections.filter((collection) =>
        collection.name.toLowerCase().includes(search.toLowerCase()) ||
        collection.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#080A12] text-white">
            <div className="mx-auto flex max-w-[1600px]">
                <main className="min-w-0 flex-1 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
                    <header className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-emerald-300">
                                DEEN ISLAM / HADITH
                            </p>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                Hadith Library
                            </h1>
                            <p className="mt-2 text-sm text-white/45">
                                Explore authentic Hadith collections and learn.
                            </p>
                        </div>

                        <Link
                            href="/deen-islam/quran"
                            className="hidden items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/65 transition hover:bg-white/5 sm:flex"
                        >
                            <BookOpen size={16} />
                            Quran
                        </Link>
                    </header>

                    <section className="relative mb-8 overflow-hidden rounded-3xl border border-emerald-300/15 bg-gradient-to-br from-emerald-500/[0.13] via-[#101B21] to-violet-500/[0.08] p-6 sm:p-9">
                        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-emerald-400/[0.08] blur-3xl" />

                        <div className="relative max-w-2xl">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.08] px-3 py-1.5 text-xs text-emerald-200">
                                <Sparkles size={13} />
                                Your Hadith Journey
                            </span>

                            <h2 className="mt-5 text-2xl font-semibold leading-tight sm:text-4xl">
                                Discover the wisdom of
                                <span className="block text-emerald-300">
                                    Prophetic Traditions
                                </span>
                            </h2>

                            <p className="mt-4 max-w-lg text-sm leading-6 text-white/55">
                                Explore Hadith collections, read Arabic texts with
                                available Bengali translations, and discover
                                authentic Islamic teachings.
                            </p>

                            <Link
                                href="/deen-islam/hadith/collections"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-[#08120F] transition hover:bg-emerald-200"
                            >
                                Explore Collections
                                <ChevronRight size={17} />
                            </Link>
                        </div>
                    </section>

                    <section className="mb-9">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                                <h2 className="text-lg font-semibold">Explore Collections</h2>
                                <p className="mt-1 text-sm text-white/40">
                                    Browse the available Hadith books.
                                </p>
                            </div>
                            <Link
                                href="/deen-islam/hadith/collections"
                                className="text-sm text-emerald-300 hover:text-emerald-200"
                            >
                                View all
                            </Link>
                        </div>

                        <label className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 focus-within:border-emerald-300/40">
                            <Search size={19} className="shrink-0 text-white/40" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="কিতাবের নাম দিয়ে খুঁজুন..."
                                className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                            />
                        </label>

                        {loading ? (
                            <div className="flex items-center justify-center gap-3 py-16 text-sm text-white/50">
                                <LoaderCircle className="animate-spin" size={20} />
                                কিতাব লোড হচ্ছে...
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] p-5 text-sm text-red-200">
                                {error}
                                <button
                                    onClick={() => window.location.reload()}
                                    className="ml-3 underline"
                                >
                                    আবার চেষ্টা করুন
                                </button>
                            </div>
                        ) : filteredCollections.length === 0 ? (
                            <p className="rounded-2xl border border-white/10 p-8 text-center text-sm text-white/50">
                                কোনো কিতাব পাওয়া যায়নি।
                            </p>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredCollections.map((collection, index) => (
                                    <Link
                                        key={collection.id}
                                        href={`/deen-islam/hadith/${collection.id}`}
                                        className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/25 hover:bg-emerald-300/[0.04]"
                                    >
                                        <div className="mb-5 flex items-start justify-between">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.07] text-emerald-300">
                                                <BookOpen size={22} />
                                            </div>
                                            <span className="text-xs text-white/30">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold">
                                            {collection.name}
                                        </h3>

                                        <p className="mt-2 text-xs leading-5 text-white/40">
                                            Arabic text and Bengali translation,
                                            where available.
                                        </p>

                                        <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                                            <span className="text-xs text-white/45">
                                                Hadith Collection
                                            </span>
                                            <ChevronRight
                                                size={18}
                                                className="text-white/30 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="grid gap-4 sm:grid-cols-2">
                        <Link
                            href="/deen-islam/hadith/search"
                            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-emerald-300/25"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                                <Search size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium">Search Hadith</h3>
                                <p className="mt-1 text-xs text-white/40">
                                    Find a Hadith by keyword or reference.
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-white/35" />
                        </Link>

                        <Link
                            href="/deen-islam/hadith/bookmarks"
                            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-emerald-300/25"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                <Bookmark size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-medium">Saved Hadith</h3>
                                <p className="mt-1 text-xs text-white/40">
                                    Keep your favourite Hadith in one place.
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-white/35" />
                        </Link>
                    </section>

                    <footer className="mt-10 border-t border-white/[0.07] pt-5 text-xs leading-5 text-white/30">
                        <div className="flex items-center gap-2">
                            <CalendarDays size={14} />
                            Learn with reliable sources and references.
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
