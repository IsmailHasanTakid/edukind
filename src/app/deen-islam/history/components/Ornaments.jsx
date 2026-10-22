const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function bengaliNumber(value) {
    return String(value).replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

function patternUrl(stroke, opacity) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1"><path d="M60 4 76 18 98 18 98 40 112 56 98 72 98 94 76 94 60 108 44 94 22 94 22 72 8 56 22 40 22 18 44 18Z"/><path d="M60 22 86 56 60 90 34 56Z"/><circle cx="60" cy="56" r="7"/><path d="M0 0 120 120M120 0 0 120" stroke-opacity="${opacity / 3}"/></g></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function IslamicPattern({
    className = "",
    stroke = "#C6A15B",
    opacity = 0.14,
    size = 120,
}) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 ${className}`}
            style={{
                backgroundImage: patternUrl(stroke, opacity),
                backgroundSize: `${size}px ${size}px`,
            }}
        />
    );
}

export function StarSeal({ className = "" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
        >
            <path d="M50 3 64 17 84 17 84 37 98 50 84 63 84 83 64 83 50 97 36 83 16 83 16 63 2 50 16 37 16 17 36 17Z" />
            <path d="M50 18 71 50 50 82 29 50Z" />
            <circle cx="50" cy="50" r="19" />
            <circle cx="50" cy="50" r="6" />
            <path d="M50 31 57 50 50 69 43 50Z" />
        </svg>
    );
}

export function OrnamentDivider({ className = "", tone = "gold" }) {
    const color = tone === "dark" ? "via-[#C6A15B]/50" : "via-[#C6A15B]/70";

    return (
        <div
            aria-hidden="true"
            className={`flex items-center justify-center gap-3 ${className}`}
        >
            <span
                className={`h-px w-16 bg-gradient-to-r from-transparent ${color} sm:w-24`}
            />
            <span className="text-[10px] text-[#C6A15B]">✦</span>
            <span
                className={`h-px w-16 bg-gradient-to-l from-transparent ${color} sm:w-24`}
            />
        </div>
    );
}

export function ArchOutline({ className = "" }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none absolute overflow-hidden ${className}`}
        >
            <div className="absolute inset-x-[8%] top-[6%] h-[88%] rounded-t-[999px] border border-[#D8BC79]/20" />
            <div className="absolute inset-x-[16%] top-[16%] h-[72%] rounded-t-[999px] border border-[#D8BC79]/10" />
            <div className="absolute bottom-0 left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-t from-transparent to-[#D8BC79]/20" />
        </div>
    );
}
