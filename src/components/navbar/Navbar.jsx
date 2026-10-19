"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    useCallback,
    useEffect,
    useId,
    useLayoutEffect,
    useRef,
    useState,
} from "react";

import { brand, primaryNav } from "@/config/navigation";
import NavItem from "./NavItem";
import MobileDrawer from "./MobileDrawer";
import { BrandMark, MenuIcon } from "./icons";

export default function Navbar() {
    const pathname = usePathname();

    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [lastPath, setLastPath] = useState(pathname);

    const listRef = useRef(null);
    const pillRef = useRef(null);
    const drawerId = useId();

    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // Preserve existing route-change behavior.
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setMenuOpen(false);
    }

    // Compact navbar on scroll.
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Sliding active navigation indicator.
    const moveTo = useCallback((el) => {
        const pill = pillRef.current;
        if (!pill) return;

        if (!el) {
            pill.style.opacity = "0";
            return;
        }

        const wasHidden = pill.style.opacity !== "1";

        if (wasHidden) {
            pill.style.transition = "none";
        }

        pill.style.width = `${el.offsetWidth}px`;
        pill.style.transform = `translateX(${el.offsetLeft}px)`;

        if (wasHidden) {
            pill.getBoundingClientRect();
            pill.style.transition = "";
        }

        pill.style.opacity = "1";
    }, []);

    const restToActive = useCallback(() => {
        const active = listRef.current?.querySelector(
            '[aria-current="page"]'
        );

        moveTo(active?.closest("li") ?? null);
    }, [moveTo]);

    useLayoutEffect(() => {
        restToActive();

        window.addEventListener("resize", restToActive);

        return () => {
            window.removeEventListener("resize", restToActive);
        };
    }, [pathname, restToActive]);

    const isActive = (item) =>
        item.ready &&
        (item.href === "/"
            ? pathname === "/"
            : pathname === item.href ||
            pathname.startsWith(`${item.href}/`));

    return (
        <>
            <header
                className="pointer-events-none sticky top-0 z-50 w-full"
            >
                {/* Removed max-width and padding to make it full width */}
                <div
                    className="pointer-events-auto relative w-full shadow-none"
                    style={{
                        background:
                            "linear-gradient(125deg, rgba(103,232,249,.38), rgba(255,255,255,.09) 32%, rgba(129,140,248,.22) 72%, rgba(255,255,255,.08))",
                    }}
                >
                    {/* Removed borders (border-white/[0.045] -> border-none) */}
                    <div
                        className={`relative grid grid-cols-[1fr_auto_1fr] items-center gap-2 overflow-hidden border-none bg-[#080B12]/95 px-3 py-5 backdrop-blur-2xl backdrop-saturate-150 sm:px-5 lg:px-6`}
                    >
                        {/* Ambient light */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -left-20 -top-24 h-36 w-64 rounded-full bg-cyan-400/[0.055] blur-3xl"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-20 -top-28 h-40 w-64 rounded-full bg-violet-500/[0.055] blur-3xl"
                        />

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent"
                        />

                        {/* Brand */}
                        <div className="relative z-10 flex min-w-0 items-center pl-5 sm:pl-8 lg:pl-15">
                            <Link
                                href={brand.href}
                                aria-label={`${brand.name} home`}
                                className="group inline-flex min-w-0 items-center gap-3 rounded-xl py-1 pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                            >
                                <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[13px] border border-cyan-200/[0.17] bg-gradient-to-br from-cyan-300/[0.13] via-[#121b2c] to-violet-500/[0.10] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 group-hover:border-cyan-200/35 group-hover:shadow-[0_0_28px_-8px_rgba(34,211,238,0.5)] motion-reduce:transition-none">
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.09]"
                                    />
                                    <BrandMark width={21} height={21} />
                                </span>

                                <span className="flex min-w-0 flex-col gap-1">
                                    <span className="truncate text-[15px] font-bold tracking-[0.17em] text-white transition-colors group-hover:text-cyan-50 sm:text-[16px]">
                                        {brand.name}
                                    </span>

                                    <span className="hidden whitespace-nowrap text-[8px] font-semibold tracking-[0.15em] text-zinc-500 sm:block">
                                        LEARN
                                        <span className="mx-1 text-cyan-400">·</span>
                                        BUILD
                                        <span className="mx-1 text-violet-400">·</span>
                                        IMPACT
                                    </span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop navigation */}
                        <nav
                            aria-label="Primary navigation"
                            className="relative z-10 hidden lg:block"
                        >
                            <ul
                                ref={listRef}
                                className="relative flex items-center gap-1 rounded-2xl border border-white/[0.055] bg-white/[0.025] p-1"
                                onMouseLeave={restToActive}
                                onBlur={(event) => {
                                    if (
                                        !event.currentTarget.contains(event.relatedTarget)
                                    ) {
                                        restToActive();
                                    }
                                }}
                            >
                                <span
                                    ref={pillRef}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-0 top-1 h-[calc(100%-8px)] rounded-xl bg-gradient-to-b from-white/[0.10] to-white/[0.045] opacity-0 ring-1 ring-inset ring-white/[0.09] shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                                />

                                {primaryNav.map((item) => (
                                    <li
                                        key={item.id}
                                        className="relative"
                                        onMouseEnter={(event) =>
                                            moveTo(event.currentTarget)
                                        }
                                        onFocus={(event) =>
                                            moveTo(event.currentTarget)
                                        }
                                    >
                                        <NavItem
                                            item={item}
                                            active={isActive(item)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Right side */}
                        <div className="relative z-10 col-start-3 flex items-center justify-self-end">
                            <button
                                type="button"
                                onClick={() => setMenuOpen(true)}
                                aria-label="Open navigation menu"
                                aria-haspopup="dialog"
                                aria-expanded={menuOpen}
                                aria-controls={drawerId}
                                className="grid h-10 w-10 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-zinc-200 transition-all duration-200 hover:border-cyan-200/25 hover:bg-cyan-300/[0.07] hover:text-cyan-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-cyan-300 motion-reduce:transition-none lg:hidden"
                            >
                                <MenuIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <MobileDrawer
                id={drawerId}
                open={menuOpen}
                onClose={closeMenu}
                isActive={isActive}
            />
        </>
    );
}