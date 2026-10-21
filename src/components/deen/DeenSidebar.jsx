
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookOpen,
    ChevronRight,
    LayoutDashboard,
    Menu,
    X,
    Sparkles,
    BookMarked,
    Heart,
    GraduationCap,
    History,
    Bookmark,
} from "lucide-react";
import { useState } from "react";

const navigation = [
    {
        label: "প্রধান পাতা",
        href: "/deen-islam",
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: "আল-কুরআন",
        href: "/deen-islam/quran",
        icon: BookOpen,
    },
    {
        label: "হাদিস",
        href: "/deen-islam/hadith",
        icon: BookMarked,
        comingSoon: true,
    },
    {
        label: "AI Islamic Assistant",
        href: "/deen-islam/ai-assistant",
        icon: Sparkles,
        comingSoon: true,
    },
    {
        label: "AI Lessons",
        href: "/deen-islam/ai-lessons",
        icon: GraduationCap,
        comingSoon: true,
    },
    {
        label: "দোয়া ও যিকির",
        href: "/deen-islam/duas",
        icon: Heart,
        comingSoon: true,
    },
    {
        label: "ইসলামের ইতিহাস",
        href: "/deen-islam/history",
        icon: History,
        comingSoon: true,
    },
];

export default function DeenSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (item) => {
        if (item.exact) return pathname === item.href;

        return (
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`)
        );
    };

    const sidebarContent = (
        <>
            <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
                <Link
                    href="/deen-islam"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3"
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8BC79]/30 bg-[#D8BC79]/10 text-[#E6CC8D]">
                        <BookOpen size={21} strokeWidth={1.6} />
                    </span>

                    <span>
                        <span className="block text-lg font-semibold tracking-tight text-[#FFF8E7]">
                            DeenIslam
                        </span>
                        <span className="mt-0.5 block text-[9px] tracking-[0.18em] text-emerald-100/50">
                            ISLAMIC KNOWLEDGE
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close sidebar"
                    className="rounded-lg p-2 text-emerald-100/70 transition hover:bg-white/10 lg:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="px-4 pt-7">
                <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#D8BC79]/75">
                    LEARN & EXPLORE
                </p>

                <nav
                    aria-label="DeenIslam navigation"
                    className="space-y-1.5"
                >
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        const classes = `group flex min-h-11 items-center gap-3 rounded-xl border px-3.5 py-3 transition duration-200 ${active
                                ? "border-[#D8BC79]/25 bg-[#D8BC79]/10 text-[#F0DDA8]"
                                : item.comingSoon
                                    ? "cursor-not-allowed border-transparent text-emerald-50/35"
                                    : "border-transparent text-emerald-50/70 hover:border-white/10 hover:bg-white/[0.06] hover:text-white"
                            }`;

                        const contents = (
                            <>
                                <Icon
                                    size={18}
                                    strokeWidth={1.7}
                                    className={
                                        active
                                            ? "text-[#E6CC8D]"
                                            : "transition-colors group-hover:text-[#E6CC8D]"
                                    }
                                />

                                <span className="min-w-0 flex-1 text-[13px] font-medium">
                                    {item.label}
                                </span>

                                {item.comingSoon ? (
                                    <span className="text-[9px] text-emerald-100/35">
                                        SOON
                                    </span>
                                ) : active ? (
                                    <ChevronRight
                                        size={15}
                                        className="text-[#D8BC79]"
                                    />
                                ) : null}
                            </>
                        );

                        return item.comingSoon ? (
                            <div
                                key={item.href}
                                aria-disabled="true"
                                title="এই বিভাগটি শীঘ্রই আসছে"
                                className={classes}
                            >
                                {contents}
                            </div>
                        ) : (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={classes}
                            >
                                {contents}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-4">
                <div className="rounded-2xl border border-[#D8BC79]/15 bg-white/[0.035] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D8BC79]/10 text-[#E6CC8D]">
                        <Bookmark size={17} />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-white/90">
                        জ্ঞানের পথে এগিয়ে চলুন
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-50/50">
                        প্রতিদিন কিছু শিখুন, জীবনে ধারণ করুন।
                    </p>
                </div>

                <p className="mt-4 text-center text-[10px] text-emerald-50/30">
                    DEENISLAM · LEARN WITH PURPOSE
                </p>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile trigger */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open DeenIslam navigation"
                aria-expanded={mobileOpen}
                className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#D8BC79]/30 bg-[#0B3528] text-[#E6CC8D] shadow-xl transition hover:bg-[#14523B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79] lg:hidden"
            >
                <Menu size={21} />
            </button>

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col overflow-y-auto border-r border-white/[0.08] bg-[#0B3025] lg:flex">
                {sidebarContent}
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <aside className="absolute inset-y-0 left-0 flex w-[min(290px,85vw)] flex-col overflow-y-auto border-r border-white/10 bg-[#0B3025] shadow-2xl">
                        {sidebarContent}
                    </aside>
                </div>
            )}
        </>
    );
}
