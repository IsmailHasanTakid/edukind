"use client";

import { usePathname } from "next/navigation";
import DeenSidebar from "@/components/deen/DeenSidebar";

export default function DeenShell({ children }) {
    const pathname = usePathname();
    const isHome = pathname === "/deen-islam";

    return (
        <div className="relative min-h-screen">
            {!isHome && <DeenSidebar />}

            <div className={`min-w-0 ${isHome ? "" : "lg:pl-[260px]"}`}>
                {children}
            </div>
        </div>
    );
}