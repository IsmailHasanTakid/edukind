"use client";

import Link from "next/link";
import { ArrowRight, Droplets, HandHeart, HeartPulse, Search } from "lucide-react";

const HUMANITY_HREF = "/humanity";

/*
 * /humanity route তৈরি হলে শুধু এটা true করুন।
 * false থাকলে কার্ড ও বাটন "Soon" অবস্থায় দেখাবে, ক্লিক করলে কোথাও যাবে না।
 */
const AVAILABLE = false;

const BLOOD_GROUPS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

const ACTIONS = [
    {
        id: "donate",
        title: "Donate blood",
        text: "ডোনার হিসেবে যুক্ত হোন। প্রয়োজনের সময় কেউ আপনাকে খুঁজে পাবে।",
        icon: Droplets,
        color: "#FB7185",
        href: HUMANITY_HREF,
        showGroups: true,
    },
    {
        id: "request",
        title: "Find blood",
        text: "রক্তের গ্রুপ ও এলাকা দিয়ে ডোনার খুঁজুন, দ্রুত অনুরোধ পাঠান।",
        icon: Search,
        color: "#FB923C",
        href: HUMANITY_HREF,
        showGroups: true,
    },
    {
        id: "volunteer",
        title: "Volunteer",
        text: "সামাজিক কাজ ও উদ্যোগে স্বেচ্ছাসেবক হয়ে পাশে দাঁড়ান।",
        icon: HandHeart,
        color: "#FBBF24",
        href: HUMANITY_HREF,
    },
];

function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function SoonBadge() {
    return (
        <span className="rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/65">
            Soon
        </span>
    );
}

function ActionPanel({ item, index }) {
    const Icon = item.icon;

    const inner = (
        <>
            {/* mouse spotlight */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), ${item.color}2a, transparent 65%)`,
                }}
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -right-16 -z-10 h-52 w-52 rounded-full opacity-[0.16] blur-3xl transition-opacity duration-500 group-hover:opacity-35"
                style={{ backgroundColor: item.color }}
            />

            <div className="flex items-start justify-between">
                <span
                    className="grid h-14 w-14 place-items-center rounded-2xl border transition duration-300 group-hover:scale-105"
                    style={{
                        borderColor: `${item.color}45`,
                        backgroundColor: `${item.color}16`,
                        boxShadow: `0 12px 34px -14px ${item.color}`,
                        color: item.color,
                    }}
                >
                    <Icon size={26} strokeWidth={1.6} />
                </span>
                {!AVAILABLE && <SoonBadge />}
            </div>

            <h3 className="mt-8 text-[24px] font-semibold tracking-[-0.03em] text-white">
                {item.title}
            </h3>
            <p className="mt-2 text-[14.5px] leading-7 text-slate-400">{item.text}</p>

            {item.showGroups && (
                <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden="true">
                    {BLOOD_GROUPS.map((g) => (
                        <span
                            key={g}
                            className="rounded-md border px-2 py-0.5 text-[11px] font-semibold tabular-nums"
                            style={{
                                borderColor: `${item.color}33`,
                                backgroundColor: `${item.color}0f`,
                                color: item.color,
                            }}
                        >
                            {g}
                        </span>
                    ))}
                </div>
            )}

            {AVAILABLE && (
                <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-white/80 transition group-hover:gap-3 group-hover:text-white">
                    শুরু করুন
                    <ArrowRight size={15} />
                </span>
            )}
        </>
    );

    const className =
        "hm-panel group relative isolate flex flex-col overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0D0A12]/80 p-6 backdrop-blur transition duration-300 sm:p-7";

    if (!AVAILABLE) {
        return (
            <div
                onMouseMove={onMove}
                style={{ "--i": index }}
                className={`${className} cursor-default hover:border-white/[0.18]`}
                aria-disabled="true"
            >
                {inner}
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            onMouseMove={onMove}
            style={{ "--i": index }}
            className={`${className} hover:-translate-y-1 hover:border-white/[0.22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-200/80`}
        >
            {inner}
        </Link>
    );
}

export default function HumanityIntro() {
    return (
        <section
            id="humanity"
            aria-label="Humanity Hub"
            className="relative isolate overflow-x-clip py-16 sm:py-24"
        >
            {/* পেছনের rose ও amber আভা */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 45% at 50% 18%, rgba(251,113,133,0.15), transparent 70%), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(251,146,60,0.08), transparent 70%)",
                }}
            />

            {/* heartbeat রেখা: এই সেকশনের একমাত্র চলমান জিনিস */}
            <svg
                aria-hidden="true"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-x-0 top-[70px] -z-10 h-[90px] w-full sm:top-[96px] sm:h-[120px]"
            >
                <defs>
                    <linearGradient id="hm-fade" x1="0" x2="1" y1="0" y2="0">
                        <stop offset="0" stopColor="#FB7185" stopOpacity="0" />
                        <stop offset="0.25" stopColor="#FB7185" stopOpacity="0.9" />
                        <stop offset="0.75" stopColor="#FB923C" stopOpacity="0.9" />
                        <stop offset="1" stopColor="#FB923C" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d="M0 60 H330 L350 60 L366 48 L382 60 H430 L448 60 L462 14 L482 106 L500 34 L514 60 H560 L574 60 L588 50 L602 60 H800 L818 60 L832 18 L852 102 L870 38 L884 60 H1200"
                    fill="none"
                    stroke="rgba(251,113,133,0.14)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                />
                <path
                    className="hm-pulse"
                    pathLength="1"
                    d="M0 60 H330 L350 60 L366 48 L382 60 H430 L448 60 L462 14 L482 106 L500 34 L514 60 H560 L574 60 L588 50 L602 60 H800 L818 60 L832 18 L852 102 L870 38 L884 60 H1200"
                    fill="none"
                    stroke="url(#hm-fade)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                />
            </svg>

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                {/* ===== শিরোনাম ===== */}
                <header className="mx-auto flex max-w-[680px] flex-col items-center text-center">
                    <span className="inline-flex items-center gap-2.5 rounded-full border border-rose-300/20 bg-rose-300/[0.08] px-4 py-1.5 text-[13px] font-medium text-rose-100/90 backdrop-blur">
                        <HeartPulse size={15} className="text-rose-300" aria-hidden="true" />
                        Humanity Hub
                    </span>

                    <h2 className="mt-5 text-balance text-[clamp(2rem,4.6vw,3.6rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">
                        Be there when someone
                        <span className="block bg-gradient-to-r from-rose-300 via-orange-200 to-amber-200 bg-clip-text text-transparent">
                            needs you most.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-[520px] text-[15px] leading-7 text-slate-400 sm:text-[16px] sm:leading-8">
                        রক্ত দিন, রক্ত খুঁজুন, কিংবা স্বেচ্ছাসেবক হয়ে পাশে দাঁড়ান। শেখার সাথে
                        সাথে মানুষের জন্য কিছু করার জায়গা।
                    </p>
                </header>

                {/* ===== তিনটা কাজ ===== */}
                <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-3">
                    {ACTIONS.map((item, i) => (
                        <ActionPanel key={item.id} item={item} index={i} />
                    ))}
                </div>

                {/* ===== নিচের CTA ===== */}
                <div className="mt-10 flex flex-col items-center gap-3">
                    {AVAILABLE ? (
                        <Link
                            href={HUMANITY_HREF}
                            className="group relative inline-flex h-[50px] items-center gap-3 overflow-hidden rounded-full border border-rose-300/30 bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 px-7 text-[15px] font-semibold text-white shadow-[0_14px_40px_-16px_rgba(244,63,94,0.85)] transition duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-200"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                            />
                            <span className="relative">Open Humanity Hub</span>
                            <ArrowRight
                                size={18}
                                className="relative transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>
                    ) : (
                        <>
                            <span
                                aria-disabled="true"
                                className="inline-flex h-[50px] cursor-default items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-7 text-[15px] font-semibold text-white/80 backdrop-blur"
                            >
                                Humanity Hub
                                <SoonBadge />
                            </span>
                            <p className="text-[13px] text-slate-500">
                                এই অংশটি তৈরি হচ্ছে। শিগগিরই চালু হবে।
                            </p>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes hm-travel {
                    from { stroke-dashoffset: 0.18; }
                    to { stroke-dashoffset: -1; }
                }
                .hm-pulse {
                    stroke-dasharray: 0.18 1;
                    animation: hm-travel 4.5s linear infinite;
                }
                @keyframes hm-rise {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .hm-panel {
                    animation: hm-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: calc(var(--i, 0) * 90ms + 100ms);
                }
                @media (prefers-reduced-motion: reduce) {
                    .hm-pulse { animation: none; stroke-dasharray: none; opacity: 0.5; }
                    .hm-panel { animation: none; }
                }
            `}</style>
        </section>
    );
}