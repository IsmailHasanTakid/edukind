"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Atom,
    Bookmark,
    BookMarked,
    BookOpen,
    Compass,
    HeartHandshake,
    LayoutGrid,
    Mic,
    ScrollText,
    Search,
    Sparkles,
} from "lucide-react";

const HOME_HREF = "/deen-islam";
const HADITH_HREF = "/deen-islam/hadith";
const COLLECTIONS_HREF = `${HADITH_HREF}/collections`;
const SEARCH_HREF = `${HADITH_HREF}/search`;
const BOOKMARKS_HREF = `${HADITH_HREF}/bookmarks`;
const QURAN_HREF = "/deen-islam/quran";

const HADITH_SUBROUTES = new Set([
    "collections",
    "search",
    "bookmarks",
    "topics",
]);

function isPathActive(pathname, href) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

function SoonBadge({ children }) {
    return (
        <span className="shrink-0 rounded-md bg-[#f5a623] px-2 py-0.5 text-[10px] font-semibold leading-4 text-[#242424]">
            {children}
        </span>
    );
}

function NavItem({
    icon: Icon,
    label,
    href,
    active = false,
    badge,
    accent = false,
    disabled = false,
}) {
    const base =
        "group flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 text-[15px] transition-colors duration-200";

    const tone = active
        ? "bg-[#10151a] font-medium text-[#6ee7b7]"
        : disabled
            ? accent
                ? "cursor-not-allowed text-[#6ee7b7]"
                : "cursor-not-allowed text-[#b9bfbc]"
            : accent
                ? "text-[#6ee7b7] hover:bg-white/[0.055] hover:text-[#a7f3d0]"
                : "text-[#d7dbd9] hover:bg-white/[0.055] hover:text-white";

    const iconTone = active
        ? "text-[#5eead4]"
        : disabled
            ? accent
                ? "text-[#6ee7b7]"
                : "text-[#929894]"
            : "text-[#a4aaa7] transition-colors group-hover:text-[#c6f6e3]";

    const contents = (
        <>
            <Icon size={20} strokeWidth={1.65} className={`shrink-0 ${iconTone}`} />

            <span className="min-w-0 flex-1">{label}</span>

            {badge ? <SoonBadge>{badge}</SoonBadge> : null}

            {active ? (
                <span
                    className={`h-2 w-2 shrink-0 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.75)] ${badge ? "ml-1" : "ml-auto"
                        }`}
                />
            ) : null}
        </>
    );

    if (disabled || !href) {
        return (
            <div
                aria-disabled="true"
                title="শীঘ্রই আসছে"
                className={`${base} ${tone}`}
            >
                {contents}
            </div>
        );
    }

    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${base} ${tone}`}
        >
            {contents}
        </Link>
    );
}

function SubNavItem({ href, label, active = false }) {
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`group flex min-h-9 items-center gap-2 rounded-xl px-3 py-1.5 text-[14px] transition-colors duration-200 ${active
                ? "bg-[#10151a] font-medium text-[#6ee7b7]"
                : "text-[#c9cecb] hover:bg-white/[0.045] hover:text-white"
                }`}
        >
            <span className="min-w-0 flex-1">{label}</span>

            {active ? (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80] shadow-[0_0_8px_rgba(74,222,128,0.65)]" />
            ) : null}
        </Link>
    );
}

function SectionHeading({ children }) {
    return (
        <p className="px-3 text-[13px] font-medium text-[#a6aca8]">
            {children}
        </p>
    );
}

export default function HadithSidebar() {
    const pathname = usePathname() || "";

    const isHome = pathname === HOME_HREF;
    const isHadithRoot = pathname === HADITH_HREF;
    const isCollections = isPathActive(pathname, COLLECTIONS_HREF);
    const isSearch = pathname === SEARCH_HREF;
    const isBookmarks = pathname === BOOKMARKS_HREF;
    const isQuran = isPathActive(pathname, QURAN_HREF);

    const hadithSegments = pathname.split("/").filter(Boolean);
    const isHadithDetail =
        pathname.startsWith(`${HADITH_HREF}/`) &&
        !HADITH_SUBROUTES.has(hadithSegments[2]);

    return (
        <aside className="flex w-full shrink-0 flex-col overflow-y-auto rounded-2xl border border-white/[0.14] bg-gradient-to-b from-[#2d302f] via-[#292c2c] to-[#242726] p-4 text-[#d7dbd9] shadow-[0_18px_60px_rgba(0,0,0,0.35)] [scrollbar-color:#646a67_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-track]:bg-transparent sm:p-5 lg:sticky lg:top-0 lg:h-dvh lg:w-[280px] lg:min-h-0">
            <Link
                href={HOME_HREF}
                aria-label="DeenIslam হোম"
                className="flex items-center gap-3 px-1 py-1"
            >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b8f80] to-[#276b5f] text-[#a7f3d0] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_20px_rgba(20,80,68,0.35)]">
                    <BookMarked size={24} strokeWidth={1.7} />
                </span>

                <span className="min-w-0">
                    <span className="block text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[#f4f6f5]">
                        DeenIslam
                    </span>
                    <span className="mt-0.5 block text-[10px] font-medium tracking-[0.12em] text-[#a6aca8]">
                        ISLAMIC KNOWLEDGE
                    </span>
                </span>
            </Link>

            <div className="mt-7">
                <SectionHeading>এই বিভাগে</SectionHeading>

                <nav aria-label="Hadith navigation" className="mt-2.5 space-y-1">
                    <NavItem
                        href={HOME_HREF}
                        icon={LayoutGrid}
                        label="DeenIslam হোম"
                        active={isHome}
                    />

                    <div className="space-y-1">
                        <NavItem
                            href={HADITH_HREF}
                            icon={BookOpen}
                            label="হাদিস"
                            active={isHadithDetail}
                        />

                        <div className="ml-[21px] space-y-1 border-l border-white/[0.18] pl-[10px]">
                            <SubNavItem
                                href={HADITH_HREF}
                                label="সূত্রসহ সংগ্রহ"
                                active={isHadithRoot}
                            />
                            <SubNavItem
                                href={COLLECTIONS_HREF}
                                label="হাদিস গ্রন্থসমূহ"
                                active={isCollections}
                            />
                        </div>
                    </div>

                    <NavItem
                        href="/deen-islam/hadith/search"
                        icon={Search}
                        label="হাদিস খুঁজুন"

                        active={isSearch}
                    />
                    <NavItem
                        icon={Compass}
                        label="বিষয়ভিত্তিক"
                        href="/deen-islam/hadith/topics"
                        active={pathname === "/deen-islam/hadith/topics"}
                    />
                    <NavItem
                        href={BOOKMARKS_HREF}
                        icon={Bookmark}
                        label="বুকমার্ক"
                        active={isBookmarks}
                    />
                </nav>
            </div>

            <div className="mt-7">
                <SectionHeading>অন্যান্য বিভাগ</SectionHeading>

                <nav aria-label="অন্যান্য বিভাগ" className="mt-2.5 space-y-1">
                    <NavItem
                        href={QURAN_HREF}
                        icon={BookOpen}
                        label="আল-কুরআন"
                        active={isQuran}
                    />
                    <NavItem
                        icon={Atom}
                        label="AI Islamic Assistant"
                        accent
                        disabled
                    />
                    <NavItem icon={Mic} label="AI Lessons" disabled />
                    <NavItem
                        icon={HeartHandshake}
                        label="দোয়া ও যিকির"
                        disabled
                    />
                    <NavItem
                        icon={ScrollText}
                        label="ইসলামের ইতিহাস"
                        disabled
                    />
                </nav>
            </div>

            <div className="mt-auto pt-8">
                <div className="relative overflow-hidden rounded-2xl border border-[#4d8b7a]/25 bg-[#18231f] p-4">
                    <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-emerald-300/[0.09] blur-2xl" />

                    <Sparkles
                        className="relative h-5 w-5 text-[#6ee7b7]"
                        strokeWidth={1.7}
                    />

                    <p className="relative mt-3 text-sm font-semibold text-[#f4f6f5]">
                        জ্ঞান অর্জন করুন
                    </p>
                    <p className="relative mt-1.5 text-[11px] leading-5 text-[#a6aca8]">
                        নির্ভরযোগ্য সূত্র থেকে হাদিস পড়ুন ও শিখুন।
                    </p>
                </div>
            </div>
        </aside>
    );
}
