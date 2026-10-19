
import Link from "next/link";

const base =
    "relative z-10 inline-flex items-center gap-2 " +
    "font-medium tracking-[-0.025em] " +
    "transition-all duration-300 ease-out motion-reduce:transition-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-4 " +
    "focus-visible:outline-cyan-300";

const sizes = {
    desktop:
        "h-10 rounded-xl px-4 text-[13px] xl:text-[14px]",
    mobile:
        "h-[54px] w-full rounded-xl px-4 text-[14px]",
};

export default function NavItem({
    item,
    active = false,
    onNavigate,
    variant = "desktop",
}) {
    const size = sizes[variant] ?? sizes.desktop;
    const isMobile = variant === "mobile";

    if (!item.ready) {
        return (
            <span
                aria-disabled="true"
                title="Coming soon"
                className={`${base} ${size} cursor-not-allowed text-zinc-600/80`}
            >
                <span>{item.label}</span>

                <span className="sr-only"> (coming soon)</span>

                {isMobile && (
                    <span className="ml-auto rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                        Soon
                    </span>
                )}
            </span>
        );
    }

    return (
        <Link
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`${base} ${size} ${active
                ? isMobile
                    ? "bg-gradient-to-r from-cyan-300/[0.12] via-blue-400/[0.06] to-transparent text-white ring-1 ring-inset ring-cyan-200/[0.12]"
                    : "bg-white/[0.045] text-white"
                : isMobile
                    ? "text-zinc-400 hover:bg-white/[0.045] hover:text-white"
                    : "text-zinc-400 hover:bg-white/[0.035] hover:text-white"
                }`}
        >
            <span
                className={`relative transition-transform duration-300 ${!isMobile && !active
                    ? "group-hover:translate-y-[-1px]"
                    : ""
                    }`}
            >
                {item.label}
            </span>

            {active && !isMobile && (
                <>
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-4 bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent"
                    />

                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-5 bottom-0 h-2 bg-cyan-300/20 blur-md"
                    />
                </>
            )}

            {active && isMobile && (
                <span
                    aria-hidden="true"
                    className="absolute bottom-3 left-0 top-3 w-[2px] rounded-full bg-gradient-to-b from-cyan-300 to-violet-400 shadow-[0_0_10px_rgba(103,232,249,0.3)]"
                />
            )}
        </Link>
    );
}
