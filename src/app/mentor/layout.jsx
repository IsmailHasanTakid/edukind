
"use client";

import { usePathname } from "next/navigation";
import MentorSidebar from "@/components/MentorSidebar";

export default function MentorLayout({ children }) {
    const pathname = usePathname();

    const hideSidebarRoutes = [
        "/mentor/chat",
        "/mentor/learn",
        "/mentor/code",
        "/mentor/problem-solver",

    ];

    const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

    return (
        <div className="flex h-[calc(100dvh-5.5rem)] flex-col overflow-hidden bg-[#0B1120] text-white lg:h-[calc(100dvh-5.625rem)] lg:flex-row">
            {!shouldHideSidebar && <MentorSidebar />}

            <main className="min-h-0 min-w-0 flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
