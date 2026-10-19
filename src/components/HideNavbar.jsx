"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function HideNavbar() {
    const pathname = usePathname();
    const isMentorPage = pathname.startsWith("/mentor");

    return (
        <>
            <Navbar />
        </>
    );
}