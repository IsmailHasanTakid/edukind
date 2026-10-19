"use client";

import { useEffect, useId, useRef } from "react";
import { searchConfig } from "@/config/navigation";
import { SearchIcon } from "./icons";

export default function SearchDialog({ open, onClose }) {
    const inputRef = useRef(null);
    const panelRef = useRef(null);
    const titleId = useId();

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab") {
                // Keep focus inside the dialog.
                const f = panelRef.current?.querySelectorAll("input, button");
                if (!f?.length) return;
                const first = f[0];
                const last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0c1017]/95 shadow-2xl shadow-black/60"
            >
                <h2 id={titleId} className="sr-only">Search NEXORA</h2>
                <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
                    <SearchIcon className="shrink-0 text-zinc-500" />
                    <input
                        ref={inputRef}
                        type="search"
                        placeholder={searchConfig.placeholder}
                        aria-label={searchConfig.placeholder}
                        className="h-14 w-full bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-white/10 px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-cyan-400"
                    >
                        Esc
                    </button>
                </div>
                <div className="px-6 py-10 text-center" role="status">
                    <p className="text-sm font-medium text-zinc-200">Search isn’t available yet</p>
                    <p className="mt-1 text-sm text-zinc-500">
                        Results will appear here once NEXORA content is searchable.
                    </p>
                </div>
            </div>
        </div>
    );
}