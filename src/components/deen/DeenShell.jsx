"use client";

import { usePathname } from "next/navigation";
import DeenSidebar from "@/components/deen/DeenSidebar";

export default function DeenShell({ children }) {
    const pathname = usePathname();
    const isHome = pathname === "/deen-islam";
    // The learning academy brings its own persistent sidebar.
    const isLearningAcademy =
        pathname === "/deen-islam/learning" ||
        pathname.startsWith("/deen-islam/learning/");
    const hideDeenSidebar = isHome || isLearningAcademy;
    // Hadith pages sit directly beside the fixed Deen sidebar. The root layout
    // adds horizontal page padding, so cancel only its left gutter here.
    const isHadithSection =
        pathname === "/deen-islam/hadith" ||
        pathname.startsWith("/deen-islam/hadith/");

    return (
        <div className="relative min-h-screen">
            {!hideDeenSidebar && <DeenSidebar />}

            <div
                className={`min-w-0 ${hideDeenSidebar ? "" : "lg:pl-[260px]"} ${!hideDeenSidebar && isHadithSection ? "lg:-ml-12" : ""}`}
            >
                {children}
            </div>
        </div>
    );
}