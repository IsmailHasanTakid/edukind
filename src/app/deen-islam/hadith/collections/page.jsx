
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    BookOpen,
    Search,
    LoaderCircle,
    ChevronRight,
    LibraryBig,
} from "lucide-react";

export default function HadithCollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const filtered = collections.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-[#080A12] px-4 py-7 text-white sm:px-8 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/deen-islam/hadith"
                    className="mb-7 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-emerald-300"
                >
                    <ArrowLeft size={16} />
                    Back to Hadith
                </Link>

                <header className="mb-8">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-300">
                        <LibraryBig size={27} />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                        HADITH LIBRARY
                    </p>

                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                        Hadith Collections
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/45">
                        Explore the available Hadith books and open a collection
                        to continue reading Arabic text with Bengali translation.
                    </p>
                </header>

                <label className="mb-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 focus-within:border-emerald-300/40">
                    <Search size={19} className="text-white/40" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="কিতাবের নাম দিয়ে খুঁজুন..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                    />
                </label>

                {loading ? (
                    <div className="flex justify-center gap-3 py-16 text-sm text-white/50">
                        <LoaderCircle className="animate-spin" size={20} />
                        কিতাব লোড হচ্ছে...
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-400/20 p-5 text-sm text-red-200">
                        {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 p-10 text-center text-white/50">
                        কোনো কিতাব পাওয়া যায়নি।
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((item, index) => (
                            <Link
                                key={item.id}
                                href={`/deen-islam/hadith/${item.id}`}
                                className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-emerald-300/[0.035]"
                            >
                                <div className="mb-5 flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-300/[0.08] text-emerald-300">
                                        <BookOpen size={22} />
                                    </div>
                                    <span className="text-xs text-white/30">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <h2 className="text-lg font-semibold">
                                    {item.name}
                                </h2>

                                <p className="mt-2 text-sm text-white/40">
                                    Hadith collection
                                </p>

                                <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                                    <span className="text-xs text-emerald-300">
                                        Explore collection
                                    </span>
                                    <ChevronRight
                                        size={18}
                                        className="text-white/40 transition group-hover:translate-x-1 group-hover:text-emerald-300"
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <p className="mt-7 text-xs text-white/30">
                    প্রদর্শিত সংগ্রহগুলো API থেকে পাওয়া তালিকার ওপর নির্ভরশীল।
                </p>
            </div>
        </main>
    );
}
