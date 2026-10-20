
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
    CalendarDays,
    Sparkles,
    PanelLeftClose,
} from "lucide-react";

const mentorItems = [
    { name: "Career", href: "/mentor/career", icon: BriefcaseBusiness },
    { name: "Ask AI", href: "/mentor/chat", icon: MessageCircle },
    { name: "Code", href: "/mentor/code", icon: Code2 },
    { name: "Learn", href: "/mentor/learn", icon: BookOpen },
    { name: "Memory", href: "/mentor/memory", icon: Brain },
    { name: "Problem Solver", href: "/mentor/problem-solver", icon: Lightbulb },
    { name: "Study Planner", href: "/mentor/study-planner", icon: CalendarDays },
];

export default function MentorSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-[250px] shrink-0 flex-col border-r border-white/[0.08] bg-[#080B12] text-white">
            <div className="flex h-16 items-center gap-3 border-b border-white/[0.08] px-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <Sparkles size={18} className="text-cyan-300" />
                </div>

                <div>
                    <h2 className="text-sm font-semibold tracking-wide">
                        Mentor Space
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                        AI Learning Tools
                    </p>
                </div>
            </div>

            <div className="px-4 pb-2 pt-6">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Workspace
                </p>
            </div>

            <nav
                aria-label="Mentor navigation"
                className="flex-1 space-y-1 overflow-y-auto px-3 pb-4"
            >
                {mentorItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={isActive ? "page" : undefined}
                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${isActive
                                ? "bg-cyan-400/10 font-medium text-cyan-200 ring-1 ring-inset ring-cyan-400/20"
                                : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-300" />
                            )}

                            <Icon
                                size={18}
                                strokeWidth={isActive ? 2.2 : 1.8}
                                className={
                                    isActive
                                        ? "text-cyan-300"
                                        : "text-slate-500 group-hover:text-slate-200"
                                }
                            />

                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/[0.08] p-4">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
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
