
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import MentorSidebar from "@/components/MentorSidebar";

function MentorChrome({ children }) {
    const pathname = usePathname();

    const hideSidebarRoutes = [
        "/mentor/chat",
        "/mentor/learn",
        "/mentor/code",
        "/mentor/problem-solver",
    ];

    // The AI Interviewer section has its own shared layout/sidebar, so the
    // mentor sidebar must be hidden for every interviewer route.
    const isInterviewerRoute =
        pathname === "/mentor/interviewer" ||
        pathname?.startsWith("/mentor/interviewer/");

    const shouldHideSidebar =
        isInterviewerRoute || hideSidebarRoutes.includes(pathname);

    return (
        <div className="flex h-[calc(100dvh-5.5rem)] flex-col overflow-hidden bg-[#0B1120] text-white lg:h-[calc(100dvh-5.625rem)] lg:flex-row">
            {!shouldHideSidebar && <MentorSidebar />}

            <main className="page-scrollbar-hidden min-h-0 min-w-0 flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}

export default function MentorLayout({ children }) {
    return (
        <Suspense
            fallback={
                <div className="flex h-[calc(100dvh-5.5rem)] items-center justify-center bg-[#0B1120] text-white lg:h-[calc(100dvh-5.625rem)]">
                    <span className="text-sm text-slate-400">Loading...</span>
                </div>
            }
        >
            <MentorChrome>{children}</MentorChrome>
        </Suspense>
    );
}
