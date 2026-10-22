"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Printer } from "lucide-react";

export default function StoryActions() {
    const [copied, setCopied] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;

        const timer = window.setTimeout(() => setCopied(false), 2200);
        return () => window.clearTimeout(timer);
    }, [copied]);

    async function copyLink() {
        setFailed(false);

        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
        } catch {
            setCopied(false);
            setFailed(true);
        }
    }

    return (
        <div className="rounded-2xl border border-[#E2D8C2] bg-white/70 p-4">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#8A7440]">
                পাঠের সহায়ক
            </p>

            <div className="mt-3 grid gap-2">
                <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8CDB5] bg-[#FBF8F0] px-3 py-2.5 text-sm font-semibold text-[#1C4939] transition hover:border-[#B79A58] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? "লিংক কপি হয়েছে" : "লিংক কপি করুন"}
                </button>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#61736A] transition hover:bg-[#F0EBDD] hover:text-[#1C4939] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    <Printer size={15} />
                    প্রিন্ট করুন
                </button>
            </div>

            <p aria-live="polite" className="mt-2 min-h-[1rem] text-xs sm:text-sm text-[#8A7440]">
                {failed ? "কপি করা যায়নি—ঠিকানার বাক্স থেকে লিংকটি কপি করুন।" : ""}
            </p>
        </div>
    );
}
