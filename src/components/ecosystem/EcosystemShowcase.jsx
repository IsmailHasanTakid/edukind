"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { AUTOPLAY_MS, ecosystemSlides } from "./ecosystemData";

const SLIDE_COUNT = ecosystemSlides.length;
const SLIDE_COUNT_LABEL = String(SLIDE_COUNT).padStart(2, "0");

function SlideCta({ slide }) {
    const { accent, accentSoft } = slide.theme;

    const sharedClassName =
        "ecosystem-cta group relative inline-flex h-11 items-center justify-center gap-2.5 overflow-hidden rounded-full border px-5 text-[13px] font-semibold text-white backdrop-blur-xl transition-[transform,filter] duration-300";

    const sharedStyle = {
        borderColor: `${accent}66`,
        backgroundColor: "rgba(7, 11, 25, 0.55)",
        boxShadow: `0 16px 44px -20px ${accent}aa, inset 0 1px 0 rgba(255,255,255,0.16)`,
    };

    if (!slide.available || !slide.href) {
        return (
            <span
                aria-disabled="true"
                className={`${sharedClassName} cursor-default`}
                style={sharedStyle}
            >
                <span>{slide.ctaLabel}</span>
                <span className="rounded-full border border-white/15 bg-white/[0.08] px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-white/65">
                    Soon
                </span>
            </span>
        );
    }

    return (
        <Link
            href={slide.href}
            className={`${sharedClassName} hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85`}
            style={sharedStyle}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-white/20 opacity-0 blur-md transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100"
            />
            <span className="relative">{slide.ctaLabel}</span>
            <span
                aria-hidden="true"
                className="relative grid h-6 w-6 place-items-center rounded-full border transition-transform duration-300 group-hover:translate-x-0.5"
                style={{
                    borderColor: `${accent}59`,
                    backgroundColor: `${accent}24`,
                    color: accentSoft,
                }}
            >
                <ArrowRight size={13} />
            </span>
        </Link>
    );
}

export default function EcosystemShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [runId, setRunId] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartRef = useRef(null);

    const activeSlide = ecosystemSlides[activeIndex];

    const goToSlide = useCallback((index) => {
        setActiveIndex(((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
        setRunId((c) => c + 1);
    }, []);

    useEffect(() => {
        if (paused) return undefined;
        const t = window.setTimeout(() => {
            setActiveIndex((c) => (c + 1) % SLIDE_COUNT);
            setRunId((c) => c + 1);
        }, AUTOPLAY_MS);
        return () => window.clearTimeout(t);
    }, [activeIndex, paused, runId]);

    const handleKeyDown = (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            goToSlide(activeIndex + 1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            goToSlide(activeIndex - 1);
        }
    };

    const handleTouchStart = (e) => {
        const t = e.changedTouches[0];
        if (t) touchStartRef.current = { x: t.clientX, y: t.clientY };
    };

    const handleTouchEnd = (e) => {
        const s = touchStartRef.current;
        const t = e.changedTouches[0];
        touchStartRef.current = null;
        if (!s || !t) return;
        const dx = t.clientX - s.x;
        const dy = t.clientY - s.y;
        if (Math.abs(dx) < 52 || Math.abs(dx) <= Math.abs(dy) * 1.35) return;
        goToSlide(activeIndex + (dx < 0 ? 1 : -1));
    };

    return (
        <section
            aria-label="EDUKIND ecosystem showcase"
            aria-roledescription="carousel"
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => {
                setPaused(false);
                setRunId((c) => c + 1);
            }}
            className="relative isolate -mx-12 overflow-hidden border-b border-white/[0.06] bg-[#050812] text-white"
        >
            {/* Atmosphere: active slide-এর রঙে পেছনের glow বদলায় */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 transition-colors duration-1000"
                style={{
                    background: `radial-gradient(ellipse 55% 45% at 20% 30%, ${activeSlide.theme.accent}1f, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(99,102,241,0.10), transparent 70%)`,
                }}
            />

            <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-8 lg:px-10 lg:py-14">
                {/* Header: বাঁদিকে লেখা, ডানদিকে ছোট বর্ণনা */}
                <header className="mb-7 flex flex-col gap-4 lg:mb-9 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-white/55">
                            <span
                                aria-hidden="true"
                                className="h-px w-8 bg-gradient-to-r from-transparent to-white/50"
                            />
                            The EDUKIND ecosystem
                        </span>

                        <h2 className="mt-3 text-balance text-[clamp(1.7rem,3.4vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
                            Everything you need to learn,
                            <span className="block bg-gradient-to-r from-sky-300 via-violet-300 to-rose-200 bg-clip-text text-transparent">
                                grow, and give back.
                            </span>
                        </h2>
                    </div>

                    <p className="max-w-[340px] text-[13.5px] leading-6 text-slate-400">
                        চারটা প্ল্যাটফর্ম, একটাই লক্ষ্য। যেকোনো একটায় ক্লিক করে
                        শুরু করো।
                    </p>
                </header>

                <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5">
                    {/* ===== Tabs ===== */}
                    <div
                        role="tablist"
                        aria-label="Choose an ecosystem slide"
                        aria-orientation="vertical"
                        className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
                    >
                        {ecosystemSlides.map((slide, index) => {
                            const isActive = index === activeIndex;
                            const { accent, secondary } = slide.theme;

                            return (
                                <button
                                    key={slide.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => goToSlide(index)}
                                    className={`eco-tab group relative min-w-[210px] shrink-0 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:min-w-0 lg:shrink ${isActive
                                        ? "border-white/[0.16] bg-white/[0.07]"
                                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.045]"
                                        }`}
                                    style={
                                        isActive
                                            ? {
                                                boxShadow: `0 20px 50px -30px ${accent}, inset 0 1px 0 rgba(255,255,255,0.08)`,
                                            }
                                            : undefined
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-[11px] font-semibold tabular-nums transition-colors duration-500"
                                            style={{
                                                borderColor: isActive ? `${accent}66` : "rgba(255,255,255,0.10)",
                                                backgroundColor: isActive ? `${accent}1f` : "rgba(255,255,255,0.03)",
                                                color: isActive ? slide.theme.accentSoft : "rgba(255,255,255,0.45)",
                                            }}
                                        >
                                            {slide.order}
                                        </span>

                                        <span
                                            className={`text-[14.5px] font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-white/55 group-hover:text-white/80"
                                                }`}
                                        >
                                            {slide.shortLabel}
                                        </span>
                                    </div>

                                    {/* শুধু বড় স্ক্রিনে active tab-এ description খোলে */}
                                    <div
                                        className={`hidden overflow-hidden transition-all duration-500 lg:block ${isActive ? "mt-3 max-h-24 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <p className="text-[12.5px] leading-5 text-slate-400">
                                            {slide.description}
                                        </p>
                                    </div>

                                    {/* Progress bar */}
                                    <span className="absolute inset-x-4 bottom-0 block h-[2px] overflow-hidden rounded-full bg-transparent">
                                        {isActive && (
                                            <span
                                                key={`${activeIndex}-${runId}`}
                                                aria-hidden="true"
                                                className="ecosystem-progress absolute inset-0 rounded-full"
                                                style={{
                                                    backgroundImage: `linear-gradient(90deg, ${accent}, ${secondary})`,
                                                    animationDuration: `${AUTOPLAY_MS}ms`,
                                                    animationPlayState: paused ? "paused" : "running",
                                                }}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* ===== Stage ===== */}
                    <div
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        className="relative isolate min-h-[420px] overflow-hidden rounded-[26px] border border-white/[0.10] bg-[#070B19] shadow-[0_40px_110px_-50px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[460px] lg:min-h-[500px] lg:rounded-[32px]"
                    >
                        {/* Images */}
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                            {ecosystemSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`ecosystem-slide absolute inset-0 ${index === activeIndex ? "is-active" : ""
                                        }`}
                                >
                                    <Image
                                        src={slide.image}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1280px) 900px, 100vw"
                                        loading="eager"
                                        draggable={false}
                                        className="ecosystem-image select-none object-cover"
                                        style={{ objectPosition: slide.imagePosition }}
                                    />
                                    <div
                                        className="absolute inset-0 mix-blend-screen"
                                        style={{ background: slide.theme.ambient }}
                                    />
                                </div>
                            ))}

                            {/* লেখা পড়ার জন্য overlay (নিচ ও বাঁদিক থেকে) */}
                            <div className="absolute inset-0 bg-[#050812]/20" />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(0deg, rgba(3,6,16,0.95) 0%, rgba(3,6,16,0.55) 38%, rgba(3,6,16,0) 70%)",
                                }}
                            />
                            <div
                                className="absolute inset-0"
                                style={{
                                    background:
                                        "linear-gradient(90deg, rgba(3,6,16,0.70) 0%, rgba(3,6,16,0.20) 45%, transparent 75%)",
                                }}
                            />
                        </div>

                        {/* Top bar: counter + arrows */}
                        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-black/30 px-3 py-1.5 text-[11px] font-medium tabular-nums tracking-[0.16em] text-white/80 backdrop-blur-xl">
                                {activeSlide.order}
                                <span className="text-white/35">/ {SLIDE_COUNT_LABEL}</span>
                            </span>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => goToSlide(activeIndex - 1)}
                                    aria-label="Previous slide"
                                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white/80 backdrop-blur-xl transition hover:border-white/35 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                                >
                                    <ChevronLeft size={17} aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goToSlide(activeIndex + 1)}
                                    aria-label="Next slide"
                                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white/80 backdrop-blur-xl transition hover:border-white/35 hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                                >
                                    <ChevronRight size={17} aria-hidden="true" />
                                </button>
                            </div>
                        </div>

                        {/* Content: নিচের-বাঁদিকে */}
                        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-9 lg:p-11">
                            <div className="grid max-w-[560px]">
                                {ecosystemSlides.map((slide, index) => {
                                    const isActive = index === activeIndex;
                                    const { accent } = slide.theme;

                                    return (
                                        <div
                                            key={slide.id}
                                            role="group"
                                            aria-roledescription="slide"
                                            aria-label={`${index + 1} of ${SLIDE_COUNT}: ${slide.shortLabel}`}
                                            aria-hidden={!isActive}
                                            inert={!isActive}
                                            className={`ecosystem-pane col-start-1 row-start-1 flex flex-col items-start ${isActive ? "is-active" : ""
                                                }`}
                                        >
                                            <span
                                                className="ecosystem-reveal inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-white/70"
                                                style={{ "--i": 0 }}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="h-1.5 w-1.5 rounded-full"
                                                    style={{
                                                        backgroundColor: accent,
                                                        boxShadow: `0 0 10px ${accent}`,
                                                    }}
                                                />
                                                {slide.eyebrow}
                                            </span>

                                            <h3
                                                className="ecosystem-reveal mt-3 text-balance pb-1 text-[clamp(1.9rem,3.8vw,3.2rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]"
                                                style={{ "--i": 1 }}
                                            >
                                                {slide.titleLead}
                                                <span
                                                    className="bg-clip-text text-transparent [text-shadow:none]"
                                                    style={{ backgroundImage: slide.theme.titleGradient }}
                                                >
                                                    {slide.titleAccent}
                                                </span>
                                            </h3>

                                            <p
                                                className="ecosystem-reveal mt-3 max-w-[30rem] text-[14px] leading-7 text-slate-200/90 [text-shadow:0_1px_16px_rgba(0,0,0,0.7)] sm:text-[15px]"
                                                style={{ "--i": 2 }}
                                            >
                                                {slide.description}
                                            </p>

                                            <div className="ecosystem-reveal mt-6" style={{ "--i": 3 }}>
                                                <SlideCta slide={slide} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .no-scrollbar { scrollbar-width: none; }
                .no-scrollbar::-webkit-scrollbar { display: none; }

                .ecosystem-slide {
                    opacity: 0;
                    transition: opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1);
                }
                .ecosystem-slide.is-active { opacity: 1; }

                .ecosystem-image {
                    transform: scale(1);
                    transition: transform 6000ms cubic-bezier(0.16, 1, 0.3, 1);
                }
                .ecosystem-slide.is-active .ecosystem-image { transform: scale(1.05); }

                .ecosystem-pane {
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: opacity 400ms ease, visibility 0s linear 400ms;
                }
                .ecosystem-pane.is-active {
                    opacity: 1;
                    visibility: visible;
                    pointer-events: auto;
                    transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1) 150ms, visibility 0s;
                }
                .ecosystem-pane.is-active .ecosystem-reveal {
                    animation: ecosystem-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: calc(var(--i, 0) * 90ms + 180ms);
                }

                .ecosystem-progress {
                    transform-origin: left center;
                    animation-name: ecosystem-progress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }

                @keyframes ecosystem-rise {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes ecosystem-progress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ecosystem-slide, .ecosystem-pane, .ecosystem-pane.is-active { transition-duration: 200ms, 0s; transition-delay: 0s; }
                    .ecosystem-image { transition: none; transform: none !important; }
                    .ecosystem-pane.is-active .ecosystem-reveal { animation: none !important; }
                }
            `}</style>
        </section>
    );
}