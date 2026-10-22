
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Bookmark,
    BookOpen,
    ChevronRight,
    Search,
    Menu,
    X,
} from "lucide-react";

import {
    DEFAULT_FOOTER,
    HOME_HREF,
    SECTIONS,
    getSectionKey,
    isItemActive,
} from "@/config/deen-sidebar";

// অন্য বিভাগে যাওয়ার ছোট তালিকা দরকার না হলে false করে দাও
const SHOW_OTHER_SECTIONS = true;

export default function DeenSidebar() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");

    useEffect(() => {
        const updateHash = () => setHash(window.location.hash);

        updateHash();

        window.addEventListener("hashchange", updateHash);

        return () => {
            window.removeEventListener("hashchange", updateHash);
        };
    }, [pathname]);
    const [mobileOpen, setMobileOpen] = useState(false);

    const sectionKey = getSectionKey(pathname);
    const isHadithSection =
        pathname === "/deen-islam/hadith" ||
        pathname.startsWith("/deen-islam/hadith/");
    const section = SECTIONS[sectionKey] ?? null;
    const SectionIcon = section?.icon;
    const footer = section?.footer ?? DEFAULT_FOOTER;

    const otherSections = Object.entries(SECTIONS).filter(
        ([key]) => key !== sectionKey
    );

    const close = () => setMobileOpen(false);

    const sidebarContent = (
        <>
            {/* লোগো */}
            <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/10 px-5">
                <Link
                    href={HOME_HREF}
                    onClick={close}
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
                    onClick={close}
                    aria-label="Close sidebar"
                    className="rounded-lg p-2 text-emerald-100/70 transition hover:bg-white/10 lg:hidden"
                >
                    <X size={20} />
                </button>
            </div>

            {/* DeenIslam হোম */}
            <div className="px-4 pt-9">
                <Link
                    href={HOME_HREF}
                    onClick={close}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 text-[13px] font-medium text-emerald-50/80 transition hover:border-[#D8BC79]/30 hover:bg-white/[0.07] hover:text-white"
                >
                    <ArrowLeft
                        size={16}
                        className="transition group-hover:-translate-x-0.5 group-hover:text-[#E6CC8D]"
                    />
                    DeenIslam হোম
                </Link>
            </div>

            {/* বর্তমান বিভাগ */}
            {section && (
                <>
                    <div className="px-4 pt-6">
                        <div className="flex items-center gap-3 rounded-2xl border border-[#D8BC79]/15 bg-white/[0.035] p-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D8BC79]/10 text-[#E6CC8D]">
                                <SectionIcon size={19} strokeWidth={1.6} />
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-[#FFF8E7]">
                                    {section.title}
                                </p>
                                <p className="mt-0.5 truncate text-[11px] text-emerald-50/50">
                                    {section.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 pt-6">
                        <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#D8BC79]/75">
                            এই বিভাগে
                        </p>

                        <nav
                            aria-label={`${section.title} navigation`}
                            className="space-y-1.5"
                        >
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const active = isItemActive(item, pathname, hash);

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

                                        {active ? (
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
                                        title="এই অংশটি শীঘ্রই আসছে"
                                        className={classes}
                                    >
                                        {contents}
                                    </div>
                                ) : (
                                    <Link
                                        key={item.href}
                                        href={item.href}

                                        onClick={() => {
                                            if (item.href.includes("#")) {
                                                setHash(`#${item.href.split("#")[1]}`);
                                            } else {
                                                setHash("");
                                            }

                                            close();
                                        }}

                                        aria-current={active ? "page" : undefined}
                                        className={classes}
                                    >
                                        {contents}
                                    </Link>
                                );
                            })}
                        </nav>


                    </div>
                </>
            )}

            {/* অন্যান্য বিভাগ */}
            {SHOW_OTHER_SECTIONS && (
                <div className="px-4 pt-7">
                    <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#D8BC79]/75">
                        অন্যান্য বিভাগ
                    </p>

                    <div className="flex flex-wrap gap-2 px-1">
                        {otherSections.map(([key, other]) => {
                            const OtherIcon = other.icon;

                            const pill =
                                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px]";

                            return other.comingSoon ? (
                                <span
                                    key={key}
                                    aria-disabled="true"
                                    className={`${pill} cursor-not-allowed border-white/5 text-emerald-50/30`}
                                >
                                    <OtherIcon size={12} />
                                    {other.title}
                                </span>
                            ) : (
                                <Link
                                    key={key}
                                    href={`/deen-islam/${key}`}
                                    onClick={close}
                                    className={`${pill} border-white/10 text-emerald-50/70 transition hover:border-[#D8BC79]/30 hover:text-white`}
                                >
                                    <OtherIcon size={12} />
                                    {other.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* নিচের কার্ড */}
            <div className="mt-auto p-4 pt-8">
                <div className="rounded-2xl border border-[#D8BC79]/15 bg-white/[0.035] p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D8BC79]/10 text-[#E6CC8D]">
                        <Bookmark size={17} />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-white/90">
                        {footer.title}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-emerald-50/50">
                        {footer.text}
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
            {/* মোবাইল বোতাম */}
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open DeenIslam navigation"
                aria-expanded={mobileOpen}
                className="fixed bottom-5 left-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#D8BC79]/30 bg-[#0B3528] text-[#E6CC8D] shadow-xl transition hover:bg-[#14523B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79] lg:hidden"
            >
                <Menu size={21} />
            </button>

            {/* ডেস্কটপ Sidebar */}
            <aside className={`${isHadithSection ? "page-scrollbar-hidden " : ""}fixed left-0 top-0 z-40 hidden h-dvh w-[260px] flex-col overflow-y-auto border-r border-white/[0.08] bg-[#0B3025] lg:top-[5.625rem] lg:flex lg:h-[calc(100dvh-5.625rem)]`}>
                {sidebarContent}
            </aside>

            {/* মোবাইল ড্রয়ার */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={close}
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
