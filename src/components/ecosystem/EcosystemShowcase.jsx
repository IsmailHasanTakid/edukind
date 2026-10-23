"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from "lucide-react";

import { AUTOPLAY_MS, ecosystemSlides } from "./ecosystemData";

const SLIDE_COUNT = ecosystemSlides.length;

const gridTexture = [
    "linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)",
].join(", ");

const noiseTexture =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

const particles = [
    { id: "p1", left: "7%", top: "24%", size: 3, delay: "-1.2s", color: "rgba(103, 232, 249, 0.9)" },
    { id: "p2", left: "16%", top: "63%", size: 2, delay: "-3.6s", color: "rgba(196, 181, 253, 0.85)" },
    { id: "p3", left: "29%", top: "17%", size: 2, delay: "-5.1s", color: "rgba(240, 171, 252, 0.8)" },
    { id: "p4", left: "72%", top: "21%", size: 3, delay: "-2.4s", color: "rgba(147, 197, 253, 0.85)" },
    { id: "p5", left: "88%", top: "35%", size: 2, delay: "-4.3s", color: "rgba(253, 186, 116, 0.8)" },
    { id: "p6", left: "93%", top: "68%", size: 3, delay: "-0.8s", color: "rgba(253, 164, 175, 0.8)" },
    { id: "p7", left: "82%", top: "83%", size: 2, delay: "-3.1s", color: "rgba(252, 211, 77, 0.8)" },
    { id: "p8", left: "12%", top: "84%", size: 2, delay: "-6s", color: "rgba(110, 231, 183, 0.75)" },
    { id: "p9", left: "55%", top: "12%", size: 2, delay: "-2s", color: "rgba(165, 243, 252, 0.7)" },
];

function SlideCta({ slide }) {
    const { accent, accentSoft } = slide.theme;

    const sharedClassName =
        "ecosystem-cta group relative inline-flex h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full border px-5 text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl transition-[transform,filter,box-shadow] duration-300 sm:h-[52px] sm:px-6 sm:text-sm";

    const sharedStyle = {
        borderColor: `${accent}66`,
        backgroundColor: "rgba(7, 11, 25, 0.46)",
        boxShadow: `0 18px 52px -22px ${accent}99, inset 0 1px 0 rgba(255, 255, 255, 0.16)`,
    };

    const shine = (
        <span
            aria-hidden="true"
            className="ecosystem-shine pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-white/20 opacity-0 blur-md transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100"
        />
    );

    if (!slide.available || !slide.href) {
        return (
            <span
                aria-disabled="true"
                title="Humanity Hub is coming soon"
                className={`${sharedClassName} cursor-default`}
                style={sharedStyle}
            >
                <span className="relative">{slide.ctaLabel}</span>
                <span className="relative rounded-full border border-white/15 bg-white/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/65">
                    Soon
                </span>
                <span className="sr-only"> — coming soon</span>
            </span>
        );
    }

    return (
        <Link
            href={slide.href}
            className={`${sharedClassName} hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050812]`}
            style={sharedStyle}
        >
            {shine}
            <span className="relative">{slide.ctaLabel}</span>
            <span
                aria-hidden="true"
                className="relative ml-0.5 grid h-7 w-7 place-items-center rounded-full border transition-transform duration-300 group-hover:translate-x-0.5"
                style={{
                    borderColor: `${accent}59`,
                    backgroundColor: `${accent}24`,
                    color: accentSoft,
                }}
            >
                <ArrowRight size={14} />
            </span>
        </Link>
    );
}

export default function EcosystemShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [runId, setRunId] = useState(0);
    const [hoverPaused, setHoverPaused] = useState(false);
    const [focusPaused, setFocusPaused] = useState(false);

    const touchStartRef = useRef(null);

    const paused = hoverPaused || focusPaused;
    const activeSlide = ecosystemSlides[activeIndex];

    const goToSlide = useCallback((index) => {
        const nextIndex = ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;

        setActiveIndex(nextIndex);
        setRunId((current) => current + 1);
    }, []);

    const showPrevious = useCallback(() => {
        goToSlide(activeIndex - 1);
    }, [activeIndex, goToSlide]);

    const showNext = useCallback(() => {
        goToSlide(activeIndex + 1);
    }, [activeIndex, goToSlide]);

    // One timeout per cycle. Manual navigation and pause/resume both restart
    // this effect, so the timer can never stack up or go stale.
    useEffect(() => {
        if (paused) return undefined;

        const timeout = window.setTimeout(() => {
            setActiveIndex((current) => (current + 1) % SLIDE_COUNT);
            setRunId((current) => current + 1);
        }, AUTOPLAY_MS);

        return () => window.clearTimeout(timeout);
    }, [activeIndex, paused, runId]);

    const handlePointerEnter = (event) => {
        if (event.pointerType === "mouse") {
            setHoverPaused(false);
        }
    };

    const handlePointerLeave = (event) => {
        if (event.pointerType !== "mouse") return;

        setHoverPaused(false);

        // Restart both the timer and the progress animation from zero so they
        // stay perfectly in sync when the pointer leaves.
        if (!focusPaused) {
            setRunId((current) => current + 1);
        }
    };

    const handleFocus = (event) => {
        if (
            event.target instanceof HTMLElement &&
            event.target.matches(":focus-visible")
        ) {
            setFocusPaused(false);
        }
    };

    const handleBlur = (event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;

        setFocusPaused(false);

        if (!hoverPaused) {
            setRunId((current) => current + 1);
        }
    };

    const handleKeyDown = (event) => {
        if (event.metaKey || event.ctrlKey || event.altKey) return;

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showPrevious();
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showNext();
        } else if (event.key === "Home") {
            event.preventDefault();
            goToSlide(0);
        } else if (event.key === "End") {
            event.preventDefault();
            goToSlide(SLIDE_COUNT - 1);
        }
    };

    const handleTouchStart = (event) => {
        const touch = event.changedTouches[0];

        if (touch) {
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        }
    };

    const handleTouchEnd = (event) => {
        const start = touchStartRef.current;
        const touch = event.changedTouches[0];

        touchStartRef.current = null;

        if (!start || !touch) return;

        const deltaX = touch.clientX - start.x;
        const deltaY = touch.clientY - start.y;

        if (
            Math.abs(deltaX) < 52 ||
            Math.abs(deltaX) <= Math.abs(deltaY) * 1.35
        ) {
            return;
        }

        goToSlide(activeIndex + (deltaX < 0 ? 1 : -1));
    };

    return (
        <section
            aria-label="EDUKIND ecosystem showcase"
            aria-roledescription="carousel"
            onKeyDown={handleKeyDown}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative isolate -mx-12 overflow-hidden border-b border-white/[0.06] bg-[#050812] text-white"
        >
            <div className="relative flex min-h-[610px] flex-col sm:min-h-[680px] lg:min-h-[760px]">
                {/* Full-bleed artwork deck */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    {ecosystemSlides.map((slide, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={slide.id}
                                className={`ecosystem-slide absolute inset-0 ${isActive ? "is-active" : ""
                                    }`}
                            >
                                <Image
                                    src={slide.image}
                                    alt=""
                                    fill
                                    sizes="100vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    draggable={false}
                                    className="ecosystem-image select-none object-cover"
                                    style={{ objectPosition: slide.imagePosition }}
                                />
                                <div
                                    className="absolute inset-0 mix-blend-screen"
                                    style={{ background: slide.theme.ambient }}
                                />
                            </div>
                        );
                    })}

                    <div className="absolute inset-0 bg-[#050812]/15" />

                    {/* Multicolor atmospheric light at the top edge */}
                    <div
                        className="absolute inset-x-0 top-0 h-48 opacity-70 mix-blend-screen blur-3xl"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(34, 211, 238, 0.16), rgba(59, 130, 246, 0.09) 22%, rgba(168, 85, 247, 0.17) 48%, rgba(244, 63, 94, 0.11) 72%, rgba(251, 191, 36, 0.13) 100%)",
                        }}
                    />

                    {/* Cinematic light and readability treatment */}
                    <div
                        className="absolute inset-x-0 top-0 h-[38%]"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(3, 6, 16, 0.82) 0%, rgba(4, 8, 18, 0.30) 42%, rgba(4, 8, 18, 0) 100%)",
                        }}
                    />
                    <div
                        className="absolute inset-x-0 bottom-0 h-[44%]"
                        style={{
                            background:
                                "linear-gradient(0deg, rgba(3, 6, 16, 0.92) 0%, rgba(3, 6, 16, 0.38) 48%, rgba(3, 6, 16, 0) 100%)",
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(ellipse 58% 54% at 50% 46%, rgba(3, 6, 16, 0.58) 0%, rgba(3, 6, 16, 0.30) 48%, rgba(3, 6, 16, 0) 78%)",
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(3, 6, 16, 0.66) 0%, rgba(3, 6, 16, 0.10) 17%, transparent 34%, transparent 66%, rgba(3, 6, 16, 0.10) 83%, rgba(3, 6, 16, 0.66) 100%)",
                        }}
                    />

                    {/* Precision grid, kept faint and away from the copy */}
                    <div
                        className="absolute inset-0 opacity-[0.32]"
                        style={{
                            backgroundImage: gridTexture,
                            backgroundSize: "72px 72px",
                            maskImage:
                                "radial-gradient(ellipse 78% 72% at 50% 46%, #000 12%, transparent 76%)",
                            WebkitMaskImage:
                                "radial-gradient(ellipse 78% 72% at 50% 46%, #000 12%, transparent 76%)",
                        }}
                    />

                    <div
                        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                        style={{ backgroundImage: noiseTexture }}
                    />

                    {particles.map((particle) => (
                        <span
                            key={particle.id}
                            className="ecosystem-particle absolute rounded-full"
                            style={{
                                left: particle.left,
                                top: particle.top,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.color,
                                boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
                                animationDelay: particle.delay,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
                    <div className="flex flex-1 items-center justify-center py-16 sm:py-20 lg:py-24">
                        <div className="grid w-full max-w-[1040px]">
                            {ecosystemSlides.map((slide, index) => {
                                const isActive = index === activeIndex;
                                const { accent, accentSoft } = slide.theme;

                                return (
                                    <div
                                        key={slide.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${SLIDE_COUNT}: ${slide.shortLabel}`}
                                        aria-hidden={!isActive}
                                        inert={!isActive}
                                        className={`ecosystem-pane col-start-1 row-start-1 flex w-full flex-col items-center justify-center text-center ${isActive ? "is-active" : ""
                                            }`}
                                    >
                                        <div className="inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.07] py-1.5 pl-2 pr-3.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_36px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:text-[10px]">
                                            <span
                                                aria-hidden="true"
                                                className="grid h-6 w-6 shrink-0 place-items-center rounded-full border"
                                                style={{
                                                    borderColor: `${accent}59`,
                                                    backgroundColor: `${accent}1a`,
                                                    color: accentSoft,
                                                }}
                                            >
                                                <Sparkles size={11} />
                                            </span>
                                            <span className="truncate">
                                                {slide.eyebrow}
                                            </span>
                                            <span
                                                aria-hidden="true"
                                                className="hidden h-3 w-px bg-white/20 sm:block"
                                            />
                                            <span className="hidden shrink-0 tabular-nums tracking-[0.18em] text-white/45 sm:inline">
                                                {slide.order}
                                                <span className="text-white/25">
                                                    {" "}
                                                    / 04
                                                </span>
                                            </span>
                                        </div>

                                        <h2 className="mt-6 max-w-[20ch] text-balance pb-1 text-[clamp(2.35rem,5.2vw,4.8rem)] font-semibold leading-[1.01] tracking-[-0.055em] text-white [text-shadow:0_2px_32px_rgba(0,0,0,0.6)] sm:mt-7">
                                            {slide.titleLead}
                                            <span
                                                className="bg-clip-text text-transparent [text-shadow:none]"
                                                style={{
                                                    backgroundImage:
                                                        slide.theme.titleGradient,
                                                }}
                                            >
                                                {slide.titleAccent}
                                            </span>
                                        </h2>

                                        <p className="mt-5 max-w-[42rem] text-pretty text-[14.5px] leading-7 text-slate-200/90 [text-shadow:0_1px_18px_rgba(0,0,0,0.7)] sm:text-[16px] sm:leading-8">
                                            {slide.description}
                                        </p>

                                        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-9 sm:flex-row">
                                            <SlideCta slide={slide} />

                                            <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                                                <span
                                                    aria-hidden="true"
                                                    className="h-1 w-1 rounded-full"
                                                    style={{
                                                        backgroundColor: accent,
                                                        boxShadow: `0 0 8px ${accent}`,
                                                    }}
                                                />
                                                {paused ? "Paused" : "Auto tour"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Slide controls */}
                    <div className="pb-7 sm:pb-9 lg:pb-10">
                        <div className="mx-auto w-full max-w-[820px]">
                            <div
                                aria-hidden="true"
                                className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent sm:mb-5"
                            />

                            <div className="flex items-center gap-2.5 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={showPrevious}
                                    aria-label="Previous slide"
                                    className="ecosystem-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.055] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050812] motion-reduce:transition-none sm:h-12 sm:w-12"
                                >
                                    <ChevronLeft size={17} aria-hidden="true" />
                                </button>

                                <div
                                    role="group"
                                    aria-label="Choose an ecosystem slide"
                                    className="flex min-w-0 flex-1 items-stretch gap-1.5 sm:gap-2.5"
                                >
                                    {ecosystemSlides.map((slide, index) => {
                                        const isActive = index === activeIndex;

                                        return (
                                            <button
                                                key={slide.id}
                                                type="button"
                                                onClick={() => goToSlide(index)}
                                                aria-label={`Show slide ${index + 1} of ${SLIDE_COUNT}: ${slide.shortLabel}`}
                                                aria-current={
                                                    isActive ? "true" : undefined
                                                }
                                                className="group relative min-h-[44px] min-w-0 flex-1 rounded-lg px-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050812]"
                                            >
                                                <span className="mb-2 flex items-center justify-between gap-2">
                                                    <span
                                                        className={`text-[8px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 sm:text-[9px] ${isActive
                                                            ? "text-white/80"
                                                            : "text-white/35 group-hover:text-white/60"
                                                            }`}
                                                    >
                                                        {slide.order}
                                                    </span>
                                                    <span
                                                        className={`hidden truncate text-[9px] font-medium tracking-[0.08em] transition-colors duration-300 sm:block ${isActive
                                                            ? "text-white/70"
                                                            : "text-white/25 group-hover:text-white/50"
                                                            }`}
                                                    >
                                                        {slide.shortLabel}
                                                    </span>
                                                </span>

                                                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                                                    {isActive && (
                                                        <span
                                                            key={`${activeIndex}-${runId}`}
                                                            aria-hidden="true"
                                                            className="ecosystem-progress absolute inset-0 rounded-full"
                                                            style={{
                                                                backgroundImage: `linear-gradient(90deg, ${slide.theme.accent}, ${slide.theme.secondary})`,
                                                                boxShadow: `0 0 12px ${slide.theme.accent}80`,
                                                                animationDuration: `${AUTOPLAY_MS}ms`,
                                                                animationPlayState:
                                                                    paused
                                                                        ? "paused"
                                                                        : "running",
                                                            }}
                                                        />
                                                    )}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button"
                                    onClick={showNext}
                                    aria-label="Next slide"
                                    className="ecosystem-arrow grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.055] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#050812] motion-reduce:transition-none sm:h-12 sm:w-12"
                                >
                                    <ChevronRight size={17} aria-hidden="true" />
                                </button>
                            </div>

                            <p
                                className="sr-only"
                                aria-live={paused ? "polite" : "off"}
                                aria-atomic="true"
                            >
                                Slide {activeIndex + 1} of {SLIDE_COUNT}:{" "}
                                {activeSlide.shortLabel}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent"
            />

            <style>{`
                .ecosystem-slide {
                    opacity: 0;
                    transition: opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1);
                }

                .ecosystem-slide.is-active {
                    opacity: 1;
                }

                .ecosystem-image {
                    transform: scale(1);
                    transition: transform 9000ms cubic-bezier(0.16, 1, 0.3, 1);
                }

                .ecosystem-slide.is-active .ecosystem-image {
                    transform: scale(1.035);
                }

                .ecosystem-pane {
                    opacity: 0;
                    transform: translateY(14px) scale(0.995);
                    pointer-events: none;
                    transition:
                        opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
                        transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
                }

                .ecosystem-pane.is-active {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                .ecosystem-progress {
                    transform-origin: left center;
                    animation-name: ecosystem-progress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }

                .ecosystem-particle {
                    animation: ecosystem-twinkle 7s ease-in-out infinite;
                }

                @keyframes ecosystem-progress {
                    from {
                        transform: scaleX(0);
                    }
                    to {
                        transform: scaleX(1);
                    }
                }

                @keyframes ecosystem-twinkle {
                    0%,
                    100% {
                        opacity: 0.22;
                        transform: scale(0.8);
                    }
                    50% {
                        opacity: 0.85;
                        transform: scale(1.15);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ecosystem-slide {
                        transition-duration: 200ms;
                    }

                    .ecosystem-image {
                        transition: none;
                        transform: none !important;
                    }

                    .ecosystem-pane {
                        transform: none !important;
                        transition-duration: 200ms;
                    }

                    .ecosystem-particle {
                        animation: none !important;
                        opacity: 0.4 !important;
                    }

                    .ecosystem-shine {
                        display: none !important;
                    }

                    .ecosystem-cta,
                    .ecosystem-arrow {
                        transition-duration: 0.01ms !important;
                    }

                    .ecosystem-cta:hover,
                    .ecosystem-arrow:hover {
                        transform: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
