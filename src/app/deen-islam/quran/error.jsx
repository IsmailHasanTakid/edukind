// src/app/deen-islam/quran/error.jsx
"use client";

export default function Error({ reset }) {
    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
            <h1 className="text-xl font-semibold text-[#1B3A2F]">
                কুরআন লোড করা যায়নি
            </h1>
            <p className="mt-2 max-w-sm text-sm text-[#7C8A82]">
                সার্ভারে সাময়িক সমস্যা হতে পারে। একটু পরে আবার চেষ্টা করো।
            </p>
            <button
                onClick={() => reset()}
                className="mt-5 rounded-full bg-[#119A62] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0D8453]"
            >
                আবার চেষ্টা করুন
            </button>
        </main>
    );
}