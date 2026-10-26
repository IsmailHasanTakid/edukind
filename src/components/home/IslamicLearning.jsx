"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const DEEN_HREF = "/deen-islam";

/* হোম পেজে শুধু ইঙ্গিত: ভেতরে কী কী আছে। বিস্তারিত DeenIslam পেজে। */
const CHIPS = [
    { label: "কুরআন", href: "/deen-islam/quran" },
    { label: "হাদিস", href: "/deen-islam/hadith" },
    { label: "দোয়া ও নামাজ", href: DEEN_HREF },
    { label: "নামাজের সময়", href: DEEN_HREF },
    { label: "ইসলামিক ইতিহাস", href: DEEN_HREF },
    { label: "লার্নিং একাডেমি", href: DEEN_HREF },
    { label: "AI সহকারী", href: DEEN_HREF },
    { label: "গ্লোসারী", href: DEEN_HREF },
];

/* public/deen/ এর চারটা ছবি */
const COLUMNS = [
    [
        {
            id: "learning",
            src: "/deen/learning.jpg",
            title: "লার্নিং একাডেমি",
            text: "কোর্স, কুইজ ও অগ্রগতি",
            color: "#A78BFA",
            height: "h-[250px] sm:h-[300px]",
        },
        {
            id: "daily",
            src: "/deen/daily.jpg",
            title: "দৈনন্দিন জীবন",
            text: "দোয়া, নামাজ, হিজরি ক্যালেন্ডার",
            color: "#FB923C",
            height: "h-[170px] sm:h-[190px]",
        },
    ],
    [
        {
            id: "ai",
            src: "/deen/ai.jpg",
            title: "AI ইসলামিক সহকারী",
            text: "রেফারেন্সসহ উত্তর",
            color: "#38BDF8",
            height: "h-[170px] sm:h-[190px]",
        },
        {
            id: "history",
            src: "/deen/history.jpg",
            title: "ইসলামিক ইতিহাস",
            text: "নবী-রাসূল ও সিরাত",
            color: "#FCD34D",
            height: "h-[250px] sm:h-[300px]",
        },
    ],
];

function Tile({ item, index }) {
    return (
        <Link
            href={DEEN_HREF}
            style={{ "--i": index }}
            className={`il-tile group relative isolate block overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0A1210] transition duration-300 hover:-translate-y-1 hover:border-white/[0.28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200/80 ${item.height}`}
        >
            <Image
                src={item.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 340px, 50vw"
                className="-z-10 select-none object-cover transition duration-[900ms] ease-out group-hover:scale-[1.07]"
                draggable={false}
            />
            <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050A09]/90 via-[#050A09]/25 to-transparent"
            />
            <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(80% 60% at 50% 100%, ${item.color}33, transparent 70%)`,
                }}
            />

            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur-md transition duration-300 group-hover:border-white/40 group-hover:bg-white/15 group-hover:text-white">
                <ArrowUpRight size={15} />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4">
                <span
                    aria-hidden="true"
                    className="mb-2 block h-[3px] w-8 rounded-full"
                    style={{ backgroundColor: item.color }}
                />
                <p className="text-[16px] font-semibold leading-snug text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]">
                    {item.title}
                </p>
                <p className="mt-0.5 text-[12.5px] leading-5 text-slate-300/90">
                    {item.text}
                </p>
            </div>
        </Link>
    );
}

export default function IslamicLearning() {
    return (
        <section
            id="islamic-learning"
            aria-label="Islamic learning"
            className="relative isolate overflow-x-clip py-16 sm:py-24"
        >
            {/* পেছনের হালকা সবুজ ও সোনালি আভা */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 55% at 78% 50%, rgba(52,211,153,0.13), transparent 70%), radial-gradient(ellipse 40% 40% at 10% 100%, rgba(252,211,77,0.06), transparent 70%)",
                }}
            />

            <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
                {/* ===== বাঁদিকে পরিচয় ===== */}
                <div className="-translate-y-7">
                    <span className="inline-flex items-center gap-3 text-[13px] font-medium text-emerald-200/80">
                        <span
                            aria-hidden="true"
                            className="h-px w-9 bg-gradient-to-r from-transparent to-emerald-300/60"
                        />
                        Islamic Learning
                    </span>

                    <h2 className="mt-4 text-balance text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-white">
                        Discover Islamic knowledge,
                        <span className="block bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                            step by step.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-[460px] text-[15px] leading-7 text-slate-400 sm:text-[16px] sm:leading-8">
                        আপনার ইসলামিক শিক্ষার যাত্রা এখান থেকেই শুরু হোক। কুরআন, হাদিস, দোয়া
                        ও ইতিহাস, সবকিছু এক জায়গায়।
                    </p>

                    {/* বিভাগের চিপ: ইউজার একনজরে বোঝে ভেতরে কী আছে */}
                    <ul className="mt-7 flex max-w-[500px] flex-wrap gap-2.5">
                        {CHIPS.map((chip) => (
                            <li key={chip.label}>
                                <Link
                                    href={chip.href}
                                    className="inline-flex items-center rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-1.5 text-[13.5px] text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-emerald-300/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200/80"
                                >
                                    {chip.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href={DEEN_HREF}
                        className="group relative mt-9 inline-flex h-[50px] items-center gap-3 overflow-hidden rounded-full border border-emerald-300/30 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 px-7 text-[15px] font-semibold text-white shadow-[0_14px_40px_-16px_rgba(16,185,129,0.8)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-14px_rgba(16,185,129,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                        />
                        <span className="relative">DeenIslam এ প্রবেশ করুন</span>
                        <ArrowRight
                            size={18}
                            className="relative transition-transform duration-300 group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </Link>
                </div>

                {/* ===== ডানদিকে ছবির কোলাজ ===== */}
                <div className="relative">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {COLUMNS.map((col, ci) => (
                            <div
                                key={ci}
                                className={`flex flex-col gap-3 sm:gap-4 ${ci === 1 ? "pt-8 sm:pt-12" : ""}`}
                            >
                                {col.map((item, ri) => (
                                    <Tile key={item.id} item={item} index={ci * 2 + ri} />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* ভাসমান গ্লাস ব্যাজ */}
                    <div className="il-badge absolute -bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-[#0A1210]/80 px-5 py-2.5 text-[13px] text-slate-200 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:flex">
                        <span
                            aria-hidden="true"
                            className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]"
                        />
                        <span>
                            <span className="font-semibold text-white">৮টি বিভাগ</span>{" "}
                            <span className="text-slate-400">একটাই জায়গায়</span>
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes il-rise {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .il-tile {
                    animation: il-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: calc(var(--i, 0) * 90ms + 100ms);
                }
                .il-badge {
                    animation: il-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) 500ms both;
                }
                @media (prefers-reduced-motion: reduce) {
                    .il-tile, .il-badge { animation: none; }
                    .il-tile img { transition: none !important; }
                }
            `}</style>
        </section>
    );
}