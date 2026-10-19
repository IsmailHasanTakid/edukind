
"use client";

import Link from "next/link";

import { useEffect, useRef } from "react";
import { brand, primaryNav } from "@/config/navigation";
import NavItem from "./NavItem";
import { BrandMark, CloseIcon } from "./icons";

export default function MobileDrawer({
    id,
    open,
    onClose,
    isActive,
}) {
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onClose();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = panelRef.current?.querySelectorAll(
                'button:not([disabled]), a[href], [tabindex="0"]'
            );

            if (!focusable?.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (
                event.shiftKey &&
                (document.activeElement === first ||
                    !panelRef.current?.contains(document.activeElement))
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, onClose]);

    return (
        <div
            className={`fixed inset-0 z-[55] lg:hidden ${open ? "" : "pointer-events-none"
                }`}
            aria-hidden={!open}
            inert={!open}
        >
            {/* Backdrop */}
            <button
                type="button"
                tabIndex={-1}
                aria-label="Close navigation menu"
                onClick={onClose}
                className={`absolute inset-0 h-full w-full bg-black/65 backdrop-blur-[5px] transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"
                    }`}
            />

            {/* Drawer */}
            <div
                ref={panelRef}
                id={id}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`absolute inset-y-2.5 right-2.5 w-[min(90vw,390px)] rounded-[25px] bg-gradient-to-br from-cyan-200/25 via-white/[0.07] to-violet-300/20 p-px shadow-[0_30px_100px_-25px_rgba(0,0,0,0.95)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${open ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
                    }`}
            >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] bg-[#080B12]/[0.98]">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-cyan-400/[0.07] blur-3xl"
                    />

                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-violet-500/[0.06] blur-3xl"
                    />

                    <div
                        aria-hidden="true"
                        className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent"
                    />

                    {/* Drawer header */}
                    <div className="relative flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4">
                        <Link
                            href={brand.href}
                            onClick={onClose}
                            className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
                            aria-label={`${brand.name} home`}
                        >
                            <span className="grid h-10 w-10 place-items-center rounded-[13px] border border-cyan-200/[0.16] bg-gradient-to-br from-cyan-300/[0.12] to-violet-500/[0.09]">
                                <BrandMark width={21} height={21} />
                            </span>

                            <span className="flex flex-col gap-1">
                                <span className="text-sm font-bold tracking-[0.17em] text-white">
                                    {brand.name}
                                </span>

                                <span className="text-[8px] font-semibold tracking-[0.12em] text-zinc-500">
                                    LEARN · BUILD · IMPACT
                                </span>
                            </span>
                        </Link>

                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close menu"
                            className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-zinc-300 transition-colors hover:border-cyan-200/20 hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300 motion-reduce:transition-none"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Navigation links */}
                    <nav
                        aria-label="Primary mobile navigation"
                        className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-5"
                    >
                        <div className="mb-4 flex items-center justify-between px-1">
                            <span className="text-[10px] font-bold tracking-[0.17em] text-zinc-500">
                                YOUR DESTINATIONS
                            </span>

                            <span className="h-px w-10 bg-gradient-to-r from-cyan-300/40 to-transparent" />
                        </div>

                        <ul className="flex flex-col gap-1.5">
                            {primaryNav.map((item, index) => (
                                <li
                                    key={item.id}
                                    style={{
                                        transitionDelay: open
                                            ? `${70 + index * 35}ms`
                                            : "0ms",
                                    }}
                                    className={`transition-[opacity,transform] duration-300 motion-reduce:transition-none ${open
                                        ? "translate-y-0 opacity-100"
                                        : "translate-y-2 opacity-0"
                                        }`}
                                >
                                    <NavItem
                                        item={item}
                                        active={isActive(item)}
                                        onNavigate={onClose}
                                        variant="mobile"
                                    />
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Drawer footer */}
                    <div className="relative shrink-0 border-t border-white/[0.07] px-5 py-5">
                        <div className="flex items-center gap-3 rounded-xl border border-white/[0.055] bg-white/[0.02] px-3.5 py-3">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cyan-200/[0.10] bg-cyan-300/[0.045]">
                                <BrandMark width={17} height={17} />
                            </span>

                            <div className="flex min-w-0 flex-col gap-1">
                                <span className="text-[11px] font-semibold tracking-wide text-zinc-300">
                                    Built for what comes next.
                                </span>

                                <span className="text-[9px] tracking-[0.12em] text-zinc-600">
                                    LEARN · BUILD · IMPACT
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
