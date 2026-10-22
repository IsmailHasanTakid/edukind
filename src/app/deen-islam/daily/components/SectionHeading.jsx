export default function SectionHeading({
    eyebrow,
    title,
    description,
    icon: Icon,
    action,
    tone = "light",
    headingId,
    className = "",
}) {
    const isDark = tone === "dark";

    return (
        <div
            className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
        >
            <div className="max-w-2xl">
                {eyebrow ? (
                    <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-xs ${
                            isDark ? "text-[#E8CE96]/80" : "text-[#8A6A2F]"
                        }`}
                    >
                        {eyebrow}
                    </p>
                ) : null}

                <div className="mt-2 flex items-start gap-3">
                    {Icon ? (
                        <span
                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                                isDark
                                    ? "border-[#E8CE96]/25 bg-[#E8CE96]/10 text-[#E8CE96]"
                                    : "border-[#E4D2B8] bg-[#FBF1E8] text-[#1E4F4A]"
                            }`}
                        >
                            <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
                        </span>
                    ) : null}

                    <h2
                        id={headingId}
                        className={`text-2xl font-bold leading-tight tracking-tight sm:text-[28px] ${
                            isDark ? "text-[#FFF8E7]" : "text-[#153B37]"
                        }`}
                    >
                        {title}
                    </h2>
                </div>

                {description ? (
                    <p
                        className={`mt-2 max-w-xl text-sm sm:text-base leading-7 ${
                            isDark ? "text-[#DCE8E2]/75" : "text-[#5B6F67]"
                        }`}
                    >
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}
