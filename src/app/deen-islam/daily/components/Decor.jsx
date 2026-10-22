import { Sparkles } from "lucide-react";

export function GeometricPattern({ className = "", opacity = 1 }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{
                opacity,
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='88' viewBox='0 0 88 88'%3E%3Cg fill='none' stroke='%23C69B52' stroke-width='0.8'%3E%3Cpath d='M44 0 88 44 44 88 0 44Z'/%3E%3Cpath d='M44 14 74 44 44 74 14 44Z'/%3E%3Ccircle cx='44' cy='44' r='5'/%3E%3Cpath d='M0 0 88 88M88 0 0 88'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
        />
    );
}

export function ArchOrnament({ className = "" }) {
    return (
        <div
            aria-hidden="true"
            className={`relative overflow-hidden rounded-t-[50%] rounded-b-2xl border border-[#E8CE96]/30 bg-[#0F332E] ${className}`}
        >
            <GeometricPattern className="opacity-[0.13]" />
            <div className="absolute inset-x-6 top-5 bottom-5 rounded-t-[50%] rounded-b-xl border border-[#E8CE96]/20" />
            <div className="absolute inset-x-12 top-10 bottom-10 rounded-t-[50%] rounded-b-lg border border-[#E8CE96]/10" />
            <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
                <span className="flex h-10 w-10 rotate-45 items-center justify-center border border-[#E8CE96]/55 bg-[#E8CE96]/[0.06]">
                    <Sparkles
                        size={17}
                        className="-rotate-45 text-[#E8CE96]"
                        aria-hidden="true"
                    />
                </span>
                <p
                    dir="rtl"
                    lang="ar"
                    className="mt-5 text-2xl leading-relaxed text-[#F2DFB0] sm:text-3xl"
                >
                    رَبِّ زِدْنِي عِلْمًا
                </p>
                <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-[#E8CE96]/65 to-transparent" />
                <p className="mt-3 text-sm leading-6 text-[#E8E1D1]/75">
                    হে আমার রব, আমার জ্ঞান বাড়িয়ে দাও
                </p>
                <p className="mt-1 text-xs sm:text-sm tracking-[0.16em] text-[#E8CE96]/65">
                    সূরা ত্বহা ২০:১১৪
                </p>
            </div>
        </div>
    );
}

export function OrnamentDivider({ className = "" }) {
    return (
        <div
            aria-hidden="true"
            className={`flex items-center justify-center gap-3 text-[#B78C45] ${className}`}
        >
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#C69B52]/55 sm:w-24" />
            <span className="text-sm">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#C69B52]/55 sm:w-24" />
        </div>
    );
}
