
"use client";

import { useEffect } from "react";

export default function QuranSearchFocus() {
    useEffect(() => {
        if (window.location.hash !== "#quran-search") return;

        const timer = setTimeout(() => {
            const searchInput = document.getElementById("quran-search");

            if (searchInput) {
                searchInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                searchInput.focus({ preventScroll: true });
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return null;
}
