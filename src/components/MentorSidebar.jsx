
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BriefcaseBusiness,
    MessageCircle,
    Code2,
    BookOpen,
    Brain,
    Lightbulb,
    Mic,
    CalendarDays,
    Sparkles,
    PanelLeftClose,
} from "lucide-react";

const mentorItems = [
    { name: "Career", href: "/mentor/career", icon: BriefcaseBusiness },
    { name: "Ask AI", href: "/mentor/chat", icon: MessageCircle },
    { name: "Code", href: "/mentor/code", icon: Code2 },
    { name: "Learn", href: "/mentor/learn", icon: BookOpen },
    { name: "Interview", href: "/mentor/interviewer", icon: Mic },

    { name: "Problem Solver", href: "/mentor/problem-solver", icon: Lightbulb },
    { name: "Study Planner", href: "/mentor/study-planner", icon: CalendarDays },
];

export default function MentorSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex w-full shrink-0 flex-col overflow-hidden border-b border-white/[0.07] bg-[#080B12]/95 text-white backdrop-blur-xl lg:sticky lg:top-0 lg:h-full lg:w-[272px] lg:border-b-0 lg:border-r">
            <div className="hidden h-[76px] shrink-0 items-center gap-3 border-b border-white/[0.07] px-5 lg:flex">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <Sparkles size={18} className="text-cyan-300" />
                </div>

                <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold tracking-wide">
                        Mentor Space
                    </h2>
                    <p className="mt-0.5 truncate text-[10px] tracking-[0.06em] text-slate-500">
                        AI Learning Tools
                    </p>
                </div>
            </div>

            <div className="hidden px-3 pb-2 pt-5 lg:block">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Workspace
                </p>
            </div>

            <nav
                aria-label="Mentor navigation"
                className="flex flex-1 items-center gap-1.5 overflow-x-auto px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:items-stretch lg:overflow-y-auto lg:overscroll-contain lg:px-3 lg:pb-3 lg:pt-0"
            >
                {mentorItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`group relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300/70 motion-reduce:transition-none lg:w-full ${isActive
                                ? "bg-gradient-to-r from-cyan-400/[0.14] to-cyan-400/[0.03] font-medium text-cyan-100 ring-1 ring-inset ring-cyan-400/20"
                                : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute bottom-2 left-0 top-2 hidden w-[3px] rounded-r-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.45)] lg:block" />
                            )}

                            <Icon
                                size={18}
                                strokeWidth={isActive ? 2.2 : 1.8}
                                className={`shrink-0 transition-colors ${isActive
                                    ? "text-cyan-300"
                                    : "text-slate-500 group-hover:text-slate-200"
                                    }`}
                            />

                            <span className="truncate leading-5">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden shrink-0 border-t border-white/[0.07] px-3 py-3 lg:block">
                <div className="rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10">
                            <Sparkles size={15} className="text-cyan-300" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-200">
                                Keep Learning
                            </p>
                            <p className="mt-1 text-[10px] text-slate-500">
                                One step at a time
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
