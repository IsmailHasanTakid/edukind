export function GeometricSeal({ className = "" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 160 160"
            fill="none"
            className={className}
        >
            <circle cx="80" cy="80" r="72" stroke="#C69B52" strokeOpacity=".22" />
            <circle cx="80" cy="80" r="58" stroke="#C69B52" strokeOpacity=".32" />
            <path
                d="M80 20 94 54l37 4-28 25 8 37-31-20-31 20 8-37-28-25 37-4L80 20Z"
                stroke="#1E4F4A"
                strokeOpacity=".45"
                strokeWidth="1.4"
            />
            <path
                d="m80 42 8 20 22 2-17 15 5 22-18-12-18 12 5-22-17-15 22-2 8-20Z"
                stroke="#C69B52"
                strokeWidth="1.2"
            />
            <circle cx="80" cy="80" r="5" fill="#C69B52" fillOpacity=".7" />
            <path
                d="M31 80h98M80 31v98M45 45l70 70M115 45l-70 70"
                stroke="#1E4F4A"
                strokeOpacity=".12"
            />
        </svg>
    );
}

export function ArchMotif({ className = "" }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 220 120"
            fill="none"
            className={className}
        >
            <path
                d="M10 112V66C10 32 54 10 110 10s100 22 100 56v46"
                stroke="#C69B52"
                strokeOpacity=".24"
                strokeWidth="1.3"
            />
            <path
                d="M30 112V68c0-27 35-45 80-45s80 18 80 45v44"
                stroke="#1E4F4A"
                strokeOpacity=".18"
                strokeWidth="1.1"
            />
            <path
                d="M110 23c24 15 38 34 38 53 0 22-17 36-38 36S72 98 72 76c0-19 14-38 38-53Z"
                stroke="#C69B52"
                strokeOpacity=".32"
            />
            <path
                d="M110 45c13 10 20 21 20 31 0 12-9 20-20 20s-20-8-20-20c0-10 7-21 20-31Z"
                stroke="#1E4F4A"
                strokeOpacity=".15"
            />
        </svg>
    );
}

export function CornerOrnaments() {
    return (
        <>
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-4 h-8 w-8 rounded-tl-2xl border-l border-t border-[#C69B52]/30"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-4 h-8 w-8 rounded-tr-2xl border-r border-t border-[#C69B52]/30"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 rounded-bl-2xl border-b border-l border-[#C69B52]/30"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 rounded-br-2xl border-b border-r border-[#C69B52]/30"
            />
        </>
    );
}
