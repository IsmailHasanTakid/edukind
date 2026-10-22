"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { copyText } from "../utils/copy";

export default function CopyButton({
    text,
    label = "কপি করুন",
    copiedLabel = "কপি হয়েছে",
    compact = false,
    className = "",
}) {
    const [status, setStatus] = useState("idle");
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    async function handleCopy() {
        if (timerRef.current) clearTimeout(timerRef.current);

        try {
            await copyText(text);
            setStatus("copied");
        } catch {
            setStatus("error");
        }

        timerRef.current = setTimeout(() => setStatus("idle"), 2200);
    }

    const Icon =
        status === "copied" ? Check : status === "error" ? TriangleAlert : Copy;
    const visibleLabel =
        status === "copied"
            ? copiedLabel
            : status === "error"
              ? "কপি ব্যর্থ"
              : label;

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label={visibleLabel}
            title={visibleLabel}
            className={`inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2 ${
                status === "copied"
                    ? "border-[#1E4F4A]/20 bg-[#E8F1EC] text-[#1E4F4A]"
                    : status === "error"
                      ? "border-rose-300/60 bg-rose-50 text-rose-700"
                      : "border-[#1E4F4A]/15 bg-white/70 text-[#527066] hover:border-[#1E4F4A]/35 hover:text-[#153B37]"
            } ${compact ? "h-8 min-h-8 w-8 px-0" : ""} ${className}`}
        >
            <Icon size={compact ? 13 : 14} aria-hidden="true" />
            <span className={compact ? "sr-only" : ""}>{visibleLabel}</span>
        </button>
    );
}
