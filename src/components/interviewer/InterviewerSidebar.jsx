"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
    ArrowUpRight,
    BrainCircuit,
    ChartNoAxesCombined,
    History,
    LayoutDashboard,
    Plus,
    Sparkles,
} from "lucide-react";

const OVERVIEW_PATH = "/mentor/interviewer";
const HISTORY_HASH = "#interview-history";

const BASE_ITEM_CLASS =
    "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-3 text-sm transition";
const INACTIVE_ITEM_CLASS =
    "text-slate-400 hover:bg-white/[0.04] hover:text-white";
const ACTIVE_ITEM_CLASS =
    "border border-violet-400/20 bg-violet-500/[0.12] font-medium text-white";

function navClass(isActive, extra = "") {
    return `${BASE_ITEM_CLASS} ${
        isActive ? ACTIVE_ITEM_CLASS : INACTIVE_ITEM_CLASS
    } ${extra}`;
}

function matchesPath(pathname, href) {
    return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

export default function InterviewerSidebar() {
    const pathname = usePathname();
    const [hash, setHash] = useState("");

    useEffect(() => {
        const syncHash = () => setHash(window.location.hash);

        syncHash();
        window.addEventListener("hashchange", syncHash);
        window.addEventListener("popstate", syncHash);

        return () => {
            window.removeEventListener("hashchange", syncHash);
            window.removeEventListener("popstate", syncHash);
        };
    }, [pathname]);

    const isHistory =
        pathname === OVERVIEW_PATH
            ? hash === HISTORY_HASH
            : matchesPath(pathname, `${OVERVIEW_PATH}/history`);
    const isOverview = pathname === OVERVIEW_PATH && !isHistory;
    const isNewInterview =
        matchesPath(pathname, `${OVERVIEW_PATH}/setup`) ||
        matchesPath(pathname, `${OVERVIEW_PATH}/room`);
    const isProgress =
        matchesPath(pathname, `${OVERVIEW_PATH}/progress`) ||
        matchesPath(pathname, `${OVERVIEW_PATH}/result`);

    return (
        <aside className="flex w-full shrink-0 flex-col overflow-hidden border-b border-white/[0.07] bg-[#0A0C15]/80 lg:sticky lg:top-0 lg:h-[calc(100dvh-5.625rem)] lg:w-[250px] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
            <Link
                href="/mentor"
                className="mb-10 hidden items-center gap-3 lg:flex"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-cyan-400/10">
                    <BrainCircuit className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                    <p className="text-sm font-bold tracking-[0.14em]">
                        EDUKIND
                    </p>
                    <p className="text-[10px] tracking-[0.2em] text-violet-300">
                        AI INTERVIEWER
                    </p>
                </div>
            </Link>

            <p className="mb-3 hidden px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 lg:block">
                Workspace
            </p>

            <nav className="flex gap-1 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:py-0">
                <Link
                    href={OVERVIEW_PATH}
                    onClick={() => setHash("")}
                    aria-current={isOverview ? "page" : undefined}
                    className={navClass(isOverview)}
                >
                    <LayoutDashboard className="h-[18px] w-[18px] text-violet-300" />
                    Overview
                    {isOverview && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                </Link>

                <Link
                    href={`${OVERVIEW_PATH}/setup`}
                    aria-current={isNewInterview ? "page" : undefined}
                    className={navClass(isNewInterview, "lg:w-full")}
                >
                    <Plus className="h-[18px] w-[18px]" />
                    New Interview
                    {isNewInterview && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                </Link>

                <Link
                    href={`${OVERVIEW_PATH}${HISTORY_HASH}`}
                    onClick={() => setHash(HISTORY_HASH)}
                    aria-current={isHistory ? "page" : undefined}
                    className={navClass(isHistory)}
                >
                    <History className="h-[18px] w-[18px]" />
                    Interview History
                    {isHistory && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                </Link>

                <Link
                    href={`${OVERVIEW_PATH}/progress`}
                    aria-current={isProgress ? "page" : undefined}
                    className={navClass(isProgress)}
                >
                    <ChartNoAxesCombined className="h-[18px] w-[18px] text-cyan-300" />
                    My Progress
                    {isProgress && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                </Link>
            </nav>

            <div className="mt-auto hidden lg:block">
                <div className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.13] to-cyan-500/[0.05] p-4">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-500/15 blur-2xl" />
                    <Sparkles className="relative mb-3 h-6 w-6 text-violet-300" />
                    <p className="relative text-sm font-semibold">
                        Level up your skills
                    </p>
                    <p className="relative mt-2 text-xs leading-5 text-slate-400">
                        Practice consistently and turn your weak areas into
                        strengths.
                    </p>
                    <Link
                        href="/mentor/interviewer/progress"
                        className="relative mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-300"
                    >
                        View progress{" "}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                <p className="mt-5 text-center text-[10px] tracking-wide text-slate-600">
                    LEARN · BUILD · IMPACT
                </p>
            </div>
        </aside>
    );
}
