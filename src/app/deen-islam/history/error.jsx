"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";
import { bangla, bnSerif } from "@/lib/deen-fonts";
import { IslamicPattern, StarSeal } from "./components/Ornaments";

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error("History route error:", error);
    }, [error]);

    return (
        <main
            lang="bn"
            className={`${bangla.className} -mx-12 flex min-h-screen items-center justify-center bg-[#F8F5EC] px-5 py-16 text-[#173D30]`}
        >
            <div className="relative isolate w-full max-w-[560px] overflow-hidden rounded-[26px] border border-[#E3D8C2] bg-[#FFFDF8] shadow-[0_24px_70px_rgba(25,60,45,0.1)]">
                <div className="relative overflow-hidden bg-[#0A3528] px-6 py-8 text-center text-white sm:px-9">
                    <IslamicPattern
                        stroke="#D8BC79"
                        opacity={0.1}
                        size={112}
                    />
                    <div className="relative">
                        <StarSeal className="mx-auto h-11 w-11 text-[#D8BC79]/85" />
                        <p className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#D8BC79]">
                            সাময়িক বাধা
                        </p>
                        <h1
                            className={`${bnSerif.className} mt-2 text-[24px] font-semibold leading-snug text-[#FFF9E9] sm:text-[28px]`}
                        >
                            ইতিহাসের পাতা খোলা যায়নি
                        </h1>
                    </div>
                </div>

                <div className="px-6 py-7 text-center sm:px-9">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#E4D8C0] bg-[#F7F2E6] text-[#9A7B3E]">
                        <ShieldAlert size={19} />
                    </span>
                    <p className="mt-4 text-sm sm:text-base leading-[1.95] text-[#67766D]">
                        সার্ভারে সাময়িক সমস্যা হতে পারে। আপনার পাঠ ও সংরক্ষিত
                        তথ্য নিরাপদ আছে। আবার চেষ্টা করুন অথবা জীবনী সংগ্রহে
                        ফিরে যান।
                    </p>

                    <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1B5A43] px-5 py-2.5 text-sm font-semibold text-[#FFF9E9] transition hover:bg-[#144534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8]"
                        >
                            <RotateCcw size={14} />
                            আবার চেষ্টা করুন
                        </button>
                        <Link
                            href="/deen-islam/history"
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D9CDB5] px-5 py-2.5 text-sm font-semibold text-[#5E6E65] transition hover:border-[#B79A58] hover:bg-[#F7F2E6] hover:text-[#1B4536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                        >
                            <ArrowLeft size={14} />
                            সব জীবনী
                        </Link>
                    </div>

                    <p className="mt-5 text-xs sm:text-sm leading-5 text-[#9AA69F]">
                        সমস্যা থেকে গেলে পৃষ্ঠাটি রিফ্রেশ করুন।
                    </p>
                </div>
            </div>
        </main>
    );
}
