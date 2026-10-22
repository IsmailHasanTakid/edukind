"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BookMarked,
    BookOpen,
    BookOpenText,
    BrainCircuit,
    ChartNoAxesCombined,
    Compass,
    LayoutDashboard,
    Menu,
    UserRound,
    X,
} from "lucide-react";

const ACADEMY_HOME = "/deen-islam/learning";

const LEARNING_NAV = [
    {
        label: "Overview",
        href: ACADEMY_HOME,
        icon: LayoutDashboard,
        exact: true,
    },
    {
        label: "My Courses",
        href: `${ACADEMY_HOME}/my-courses`,
        icon: BookMarked,
    },
    {
        label: "Explore Courses",
        href: `${ACADEMY_HOME}/courses`,
        icon: Compass,
    },
    {
        label: "Read Quran",
        href: `${ACADEMY_HOME}/quran`,
        icon: BookOpenText,
    },
    {
        label: "My Progress",
        href: `${ACADEMY_HOME}/progress`,
        icon: ChartNoAxesCombined,
    },
];

const SUPPORT_NAV = [
    {
        label: "AI Learning Assistant",
        href: `${ACADEMY_HOME}/assistant`,
        icon: BrainCircuit,
    },
];

function normalizePath(path) {
    if (!path) return "";
    return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function isActiveItem(item, pathname) {
    const current = normalizePath(pathname);
    const target = normalizePath(item.href);

    if (item.exact) return current === target;

    return current === target || current.startsWith(`${target}/`);
}

function SidebarLink({ item, pathname, onNavigate }) {
    const Icon = item.icon;
    const active = isActiveItem(item, pathname);

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex min-h-11 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm sm:text-base transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 ${active
                ? "border-emerald-300/15 bg-gradient-to-r from-emerald-400/[0.14] to-transparent font-medium text-white"
                : "border-transparent text-slate-400 hover:border-white/[0.06] hover:bg-white/[0.045] hover:text-slate-100"
                }`}
        >
            {active && (
                <span
                    aria-hidden="true"
                    className="absolute inset-y-2.5 left-0 w-[3px] rounded-r-full bg-emerald-300"
                />
            )}

            <Icon
                size={18}
                strokeWidth={active ? 2.1 : 1.8}
                aria-hidden="true"
                className={`shrink-0 transition-colors ${active
                    ? "text-emerald-300"
                    : "text-slate-500 group-hover:text-emerald-200/80"
                    }`}
            />

            <span className="min-w-0 flex-1 truncate">{item.label}</span>

            {active && (
                <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/80"
                />
            )}
        </Link>
    );
}

export default function LearningSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [lastPath, setLastPath] = useState(pathname);

    // Close the drawer on browser Back/Forward as well as link navigation.
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setMobileOpen(false);
    }

    useEffect(() => {
        if (!mobileOpen) return;

        const previousOverflow = document.body.style.overflow;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileOpen]);

    const closeNavigation = () => setMobileOpen(false);

    const sidebarContent = (
        <>
            <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
                <Link
                    href={ACADEMY_HOME}
                    onClick={closeNavigation}
                    aria-label="Quran Learning Academy home"
                    className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
                >
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D9BC79]/25 bg-[#12362B] text-[#E6CE96]">
                        <BookOpen size={20} strokeWidth={1.7} aria-hidden="true" />
                        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0B1723] bg-[#D9BC79]" />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-base sm:text-lg font-bold tracking-[0.14em] text-[#F4F8F5]">
                            EDUKIND
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] sm:text-xs font-medium tracking-[0.2em] text-emerald-100/45">
                            QURAN ACADEMY
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={closeNavigation}
                    aria-label="Close Quran Academy navigation"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60 lg:hidden"
                >
                    <X size={19} aria-hidden="true" />
                </button>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-3 py-5">
                <p className="px-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Learning Space
                </p>

                <nav aria-label="Learning space navigation" className="mt-3 space-y-1">
                    {LEARNING_NAV.map((item) => (
                        <SidebarLink
                            key={item.href}
                            item={item}
                            pathname={pathname}
                            onNavigate={closeNavigation}
                        />
                    ))}
                </nav>

                <div className="mt-7 border-t border-white/[0.06] pt-5">
                    <p className="px-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Learning Support
                    </p>

                    <nav
                        aria-label="Learning support navigation"
                        className="mt-3 space-y-1"
                    >
                        {SUPPORT_NAV.map((item) => (
                            <SidebarLink
                                key={item.href}
                                item={item}
                                pathname={pathname}
                                onNavigate={closeNavigation}
                            />
                        ))}
                    </nav>
                </div>

                <div className="mt-auto pt-8">
                    <Link
                        href="/deen-islam"
                        onClick={closeNavigation}
                        className="group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/60"
                    >
                        <ArrowLeft
                            size={13}
                            aria-hidden="true"
                            className="transition-transform group-hover:-translate-x-0.5"
                        />
                        Back to DeenIslam
                    </Link>

                    <div className="mt-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-3.5">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-slate-400">
                                <UserRound size={16} aria-hidden="true" />
                            </span>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-200">
                                    Guest learner
                                </p>
                                <p className="mt-0.5 truncate text-xs sm:text-sm text-slate-500">
                                    Your learning space
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-[11px] sm:text-xs tracking-[0.16em] text-slate-600">
                        QURAN LEARNING ACADEMY
                    </p>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile top bar */}
            <div className="sticky top-20 z-30 flex items-center justify-between gap-3 border-b border-[#DCE7DF] bg-[#F7FAF8]/95 px-4 py-3 backdrop-blur-xl lg:hidden">
                <Link
                    href={ACADEMY_HOME}
                    onClick={closeNavigation}
                    className="flex min-w-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A53]"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B1723] text-[#E6CE96]">
                        <BookOpen size={17} strokeWidth={1.7} aria-hidden="true" />
                    </span>

                    <span className="min-w-0">
                        <span className="block truncate text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-[#738479]">
                            EDUKIND
                        </span>
                        <span className="block truncate text-sm font-semibold text-[#173B2D]">
                            Quran Academy
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open Quran Academy navigation"
                    aria-haspopup="dialog"
                    aria-expanded={mobileOpen}
                    aria-controls="learning-sidebar-drawer"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D5E3DA] bg-white text-[#294B3A] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B7A53]"
                >
                    <Menu size={19} aria-hidden="true" />
                </button>
            </div>

            {/* Desktop sidebar */}
            <aside className="sticky top-20 hidden h-[calc(100dvh-5rem)] w-[272px] shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0B1723] text-white lg:flex">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-48"
                    style={{
                        background:
                            "radial-gradient(ellipse at top left, rgba(52,211,153,0.10), transparent 68%)",
                    }}
                />
                <div className="relative flex min-h-0 flex-1 flex-col">
                    {sidebarContent}
                </div>
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        aria-label="Close Quran Academy navigation overlay"
                        onClick={closeNavigation}
                        className="absolute inset-0 h-full w-full bg-[#02080D]/65 backdrop-blur-sm"
                    />

                    <aside
                        id="learning-sidebar-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Quran Learning Academy navigation"
                        className="absolute inset-y-0 left-0 flex w-[min(300px,86vw)] flex-col overflow-hidden border-r border-white/10 bg-[#0B1723] text-white shadow-2xl"
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-48"
                            style={{
                                background:
                                    "radial-gradient(ellipse at top left, rgba(52,211,153,0.10), transparent 68%)",
                            }}
                        />
                        <div className="relative flex min-h-0 flex-1 flex-col">
                            {sidebarContent}
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
}
