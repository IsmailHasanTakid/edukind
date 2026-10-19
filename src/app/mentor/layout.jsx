"use client";

import { usePathname } from "next/navigation";
import MentorSidebar from "@/components/MentorSidebar";

export default function MentorLayout({ children }) {
    const pathname = usePathname();
    const isChatPage = pathname === "/mentor/chat";

    return (
        <div className="flex min-h-[calc(100vh-64px)] bg-[#0B1120] text-white">
            {!isChatPage && <MentorSidebar />}

            <div className="min-w-0 flex-1">
                {children}
            </div>
        </div>
    );
}