"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Brain,
    GraduationCap,
    Play,
    Sparkles,
    Users,
} from "lucide-react";

const PRIMARY_HREF = "/learning";
const SECONDARY_HREF = "#ecosystem";

const features = [
    {
        id: "mentor",
        icon: Brain,
        title: "AI Mentor",
        text: "Personalized guidance",
        href: "/mentor",
        color: "#B8A5FF",
    },
    {
        id: "islamic",
        icon: BookOpen,
        title: "Islamic Learning",
        text: "Authentic knowledge",
        href: "/deen-islam",
        color: "#7DD3C7",
    },
    {
        id: "learning",
        icon: GraduationCap,
        title: "Learning Hub",
        text: "Build your skills",
        href: "/learning",
        color: "#93C5FD",
    },
    {
        id: "humanity",
        icon: Users,
        title: "Humanity Hub",
        text: "Create real impact",
        href: "/humanity",
        color: "#F0A6C8",
    },
];

const COLORS = [
    "165,180,252", // Ice blue
    "139,92,246",  // Violet
    "45,212,191",  // Teal
    "244,114,182", // Rose
];

function HeroConstellation({ hostRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const host = hostRef.current;

        if (!canvas || !host) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        let width = 0;
        let height = 0;
        let raf = 0;
        let particles = [];

        const mouse = { x: -9999, y: -9999 };

        function resize() {
            const rect = host.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            width = rect.width;
            height = rect.height;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const count = Math.min(
                48,
                Math.max(20, Math.floor((width * height) / 30000))
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.1 + 0.4,
                color: COLORS[
                    Math.floor(Math.random() * COLORS.length)
                ],
                phase: Math.random() * Math.PI * 2,
            }));
        }

        function frame(time) {
            ctx.clearRect(0, 0, width, height);

            for (const p of particles) {
                if (!reduceMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = width;
                    if (p.x > width) p.x = 0;
                    if (p.y < 0) p.y = height;
                    if (p.y > height) p.y = 0;

                    const dx = p.x - mouse.x;
                    const dy = p.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < 100) {
                        const force = (1 - distance / 100) * 0.3;
                        p.x += (dx / distance) * force;
                        p.y += (dy / distance) * force;
                    }
                }

                const opacity =
                    0.25 +
                    0.25 * Math.sin(time / 1100 + p.phase);

                ctx.beginPath();
                ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let i = 0; i < particles.length; i++) {
                const a = particles[i];

                for (let j = i + 1; j < particles.length; j++) {
                    const b = particles[j];
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 105) {
                        const opacity =
                            (1 - distance / 105) * 0.09;

                        ctx.beginPath();
                        ctx.strokeStyle =
                            `rgba(${a.color}, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }

                const dx = a.x - mouse.x;
                const dy = a.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle =
                        `rgba(167,139,250,${(1 - distance / 130) * 0.18})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            if (!reduceMotion) {
                raf = requestAnimationFrame(frame);
            }
        }

        function onMove(event) {
            const rect = host.getBoundingClientRect();

            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        }

        function onLeave() {
            mouse.x = -9999;
            mouse.y = -9999;
        }

        function onVisibilityChange() {
            cancelAnimationFrame(raf);

            if (!document.hidden) {
                raf = requestAnimationFrame(frame);
            }
        }

        resize();
        raf = requestAnimationFrame(frame);

        const observer = new ResizeObserver(resize);
        observer.observe(host);

        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerleave", onLeave);
        document.addEventListener(
            "visibilitychange",
            onVisibilityChange
        );

        return () => {
            cancelAnimationFrame(raf);
            observer.disconnect();
            host.removeEventListener("pointermove", onMove);
            host.removeEventListener("pointerleave", onLeave);
            document.removeEventListener(
                "visibilitychange",
                onVisibilityChange
            );
        };
    }, [hostRef]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
        />
    );
}

export default function HeroSection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const element = sectionRef.current;

        if (!element) return;

        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) return;

        let raf = 0;

        function onMove(event) {
            const rect = element.getBoundingClientRect();

            cancelAnimationFrame(raf);

            raf = requestAnimationFrame(() => {
                element.style.setProperty(
                    "--mx",
                    `${event.clientX - rect.left}px`
                );

                element.style.setProperty(
                    "--my",
                    `${event.clientY - rect.top}px`
                );

                element.style.setProperty("--spot", "1");
            });
        }

        function onLeave() {
            element.style.setProperty("--spot", "0");
        }

        element.addEventListener("pointermove", onMove);
        element.addEventListener("pointerleave", onLeave);

        return () => {
            cancelAnimationFrame(raf);
            element.removeEventListener("pointermove", onMove);
            element.removeEventListener("pointerleave", onLeave);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            aria-label="EDUKIND hero"
            className="hero-section relative isolate -mx-12 overflow-visible text-white"
        >
            {/* 1. Midnight base */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-20 -bottom-40 -z-20 bg-[#080A12]"
            />

            {/* 2. Dark, controlled aurora */}
            <div
                aria-hidden="true"
                className="hero-aurora pointer-events-none absolute inset-x-0 -top-20 -bottom-40 -z-10 overflow-hidden"
            >
                {/* Indigo */}
                <div className="aurora aurora-indigo absolute -right-[8%] -top-[12%] h-[520px] w-[520px] rounded-full" />

                {/* Violet */}
                <div className="aurora aurora-violet absolute left-[22%] top-[5%] h-[480px] w-[480px] rounded-full" />

                {/* Teal */}
                <div className="aurora aurora-teal absolute -left-[12%] top-[35%] h-[460px] w-[460px] rounded-full" />

                {/* Rose */}
                <div className="aurora aurora-rose absolute right-[12%] top-[40%] h-[350px] w-[350px] rounded-full" />

                {/* Ice blue */}
                <div className="aurora aurora-blue absolute bottom-[0%] left-[38%] h-[380px] w-[380px] rounded-full" />
            </div>

            {/* 3. Subtle grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-40"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(190,195,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(190,195,255,0.035) 1px, transparent 1px)",
                    backgroundSize: "68px 68px",
                    WebkitMaskImage:
                        "radial-gradient(ellipse 75% 65% at 48% 35%, black 5%, transparent 100%)",
                    maskImage:
                        "radial-gradient(ellipse 75% 65% at 48% 35%, black 5%, transparent 100%)",
                }}
            />

            {/* 4. Mouse spotlight */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
                style={{
                    opacity: "var(--spot, 0)",
                    background:
                        "radial-gradient(420px circle at var(--mx, 70%) var(--my, 35%), rgba(139,92,246,0.07), transparent 70%)",
                }}
            />

            {/* 5. Cinematic image on the right */}
            <div
                className="hero-art pointer-events-none absolute -top-12 right-[-10%] z-0 h-[calc(100%+3rem)] w-[85%]"
                aria-hidden="true"
            >
                <div className="hero-art-fade absolute inset-0">
                    <Image
                        src="/images/hero-illustration.png"
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 1280px) 76vw, (min-width: 1024px) 76vw, 100vw"
                        className="select-none object-cover object-[80%_25%] scale-90"
                        draggable={false}
                    />
                </div>

                {/* Dark overlay: protects text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#080A12] via-[#080A12]/65 via-30% to-transparent" />

                {/* Soft cinematic vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,transparent_20%,rgba(8,10,18,0.20)_72%,#080A12_100%)]" />
            </div>

            {/* 6. Gentle bottom transition */}
            <div
                aria-hidden="true"
                className="hero-bottom-glow pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[35%]"
            />

            {/* 7. Floating particles */}
            <HeroConstellation hostRef={sectionRef} />

            <style>{`
                .hero-section {
                    --mx: 70%;
                    --my: 30%;
                    --spot: 0;
                    clip-path: inset(0 0 -260px 0);
                    background: #080A12;
                }

                .hero-aurora {
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        #000 0%,
                        #000 55%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        #000 0%,
                        #000 55%,
                        transparent 100%
                    );
                }

                .aurora {
                    filter: blur(125px);
                    opacity: 0.16;
                    will-change: transform;
                    animation: aurora-float 26s ease-in-out infinite;
                }

                .aurora-indigo {
                    background: #4338CA;
                    opacity: 0.21;
                }

                .aurora-violet {
                    background: #7C3AED;
                    opacity: 0.17;
                    animation-delay: -6s;
                }

                .aurora-teal {
                    background: #0F766E;
                    opacity: 0.16;
                    animation-delay: -11s;
                }

                .aurora-rose {
                    background: #9F315F;
                    opacity: 0.12;
                    animation-delay: -4s;
                }

                .aurora-blue {
                    background: #7DD3FC;
                    opacity: 0.08;
                    animation-delay: -15s;
                }

                .hero-art-fade {
                    -webkit-mask-image: linear-gradient(
                        to bottom,
                        #000 0%,
                        #000 52%,
                        transparent 100%
                    );
                    mask-image: linear-gradient(
                        to bottom,
                        #000 0%,
                        #000 52%,
                        transparent 100%
                    );
                }

                .hero-bottom-glow {
                    background: radial-gradient(
                        ellipse 65% 100% at 45% 100%,
                        rgba(67,56,202,0.10),
                        rgba(15,118,110,0.035) 48%,
                        transparent 78%
                    );
                    animation: bottom-breathe 12s ease-in-out infinite;
                }

                @keyframes aurora-float {
                    0%, 100% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    50% {
                        transform: translate3d(3%, -4%, 0) scale(1.08);
                    }
                }

                @keyframes bottom-breathe {
                    0%, 100% { opacity: 0.65; }
                    50% { opacity: 1; }
                }

                @keyframes hero-rise {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-item {
                    animation: hero-rise 850ms cubic-bezier(0.22, 1, 0.36, 1) both;
                    animation-delay: calc(var(--i, 0) * 100ms + 80ms);
                }

                @keyframes hero-shimmer {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }

                .hero-shimmer {
                    background-size: 200% auto;
                    animation: hero-shimmer 9s linear infinite;
                }

                .hero-dot {
                    animation: hero-dot-pulse 2s ease-out infinite;
                }

                @keyframes hero-dot-pulse {
                    0% {
                        box-shadow: 0 0 0 0 rgba(167,139,250,0.45);
                    }
                    100% {
                        box-shadow: 0 0 0 8px rgba(167,139,250,0);
                    }
                }

                @media (min-width: 1024px) {
                    .hero-art {
                        -webkit-mask-image: linear-gradient(
                            to right,
                            transparent 0%,
                            rgba(0,0,0,0.3) 12%,
                            rgba(0,0,0,0.8) 35%,
                            #000 58%
                        );
                        mask-image: linear-gradient(
                            to right,
                            transparent 0%,
                            rgba(0,0,0,0.3) 12%,
                            rgba(0,0,0,0.8) 35%,
                            #000 58%
                        );
                    }
                }

                @media (max-width: 1023px) {
                    .hero-art {
                        top: 0;
                        bottom: auto;
                        height: 560px;
                        opacity: 0.42;
                        -webkit-mask-image: linear-gradient(
                            to bottom,
                            #000 0%,
                            rgba(0,0,0,0.8) 30%,
                            transparent 100%
                        );
                        mask-image: linear-gradient(
                            to bottom,
                            #000 0%,
                            rgba(0,0,0,0.8) 30%,
                            transparent 100%
                        );
                    }

                    .hero-art > div:nth-child(2) {
                        background: linear-gradient(
                            to right,
                            rgba(8,10,18,0.8),
                            rgba(8,10,18,0.15)
                        );
                    }
                }

                @media (max-width: 639px) {
                    .hero-art {
                        height: 440px;
                        right: -20%;
                        width: 110%;
                        opacity: 0.34;
                    }

                    .aurora {
                        filter: blur(95px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .hero-item,
                    .aurora,
                    .hero-shimmer,
                    .hero-dot,
                    .hero-bottom-glow {
                        animation: none !important;
                    }
                }
            `}</style>

            {/* Main content */}
            <div className="px-12">
                <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1760px] flex-col justify-start px-5 pb-10 pt-10 sm:px-10 lg:min-h-[800px] lg:px-[5%] lg:py-14 xl:min-h-[850px]">
                    <div className="max-w-[720px]">
                        {/* Badge */}
                        <div
                            className="hero-item inline-flex items-center gap-3 rounded-full border border-violet-300/15 bg-[#11121F]/75 py-2 pl-3 pr-5 text-[11px] font-medium uppercase tracking-[0.17em] shadow-[0_8px_35px_rgba(0,0,0,0.20)] backdrop-blur-xl sm:text-xs"
                            style={{ "--i": 0 }}
                        >
                            <span
                                className="hero-dot h-2 w-2 rounded-full bg-violet-300"
                                aria-hidden="true"
                            />

                            <Sparkles
                                size={17}
                                className="text-violet-300"
                                aria-hidden="true"
                            />

                            <span>
                                <span className="font-semibold text-white">
                                    AI Powered
                                </span>{" "}
                                <span className="text-slate-400">
                                    Learning Platform
                                </span>
                            </span>
                        </div>

                        {/* Headline */}
                        <h1
                            className="hero-item mt-5 text-[clamp(2.8rem,6.5vw,5.7rem)] font-semibold leading-[1.02] tracking-[-0.055em]"
                            style={{ "--i": 1 }}
                        >
                            <span className="block text-[#F4F4F8]">
                                Learn. Grow.
                            </span>

                            <span className="hero-shimmer block bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text pb-2 text-transparent">
                                Make an Impact.
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="hero-item mt-4 max-w-[550px] text-[15px] leading-8 text-slate-300 sm:text-[17px] sm:leading-9 lg:mt-5"
                            style={{ "--i": 2 }}
                        >
                            EDUKIND হলো তোমার এক-জায়গার শেখার সঙ্গী — AI
                            Mentor, ইসলামিক জ্ঞান, দক্ষতা উন্নয়ন এবং মানবতার
                            জন্য কাজ করার সুযোগ।
                        </p>

                        {/* CTA buttons */}
                        <div
                            className="hero-item mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10"
                            style={{ "--i": 3 }}
                        >
                            <Link
                                href={PRIMARY_HREF}
                                className="group relative inline-flex h-[54px] items-center justify-center gap-3 overflow-hidden rounded-full border border-violet-300/25 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-8 text-[15px] font-semibold text-white shadow-[0_12px_40px_-15px_rgba(124,58,237,0.75)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_-12px_rgba(124,58,237,0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:h-[58px]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                                />

                                <span className="relative">
                                    Start Learning
                                </span>

                                <ArrowRight
                                    size={19}
                                    className="relative transition-transform duration-300 group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </Link>

                            <Link
                                href={SECONDARY_HREF}
                                className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-white/[0.12] bg-[#11121F]/65 px-7 text-[15px] font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#19172A]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:h-[58px]"
                            >
                                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] transition group-hover:border-violet-300/25 group-hover:bg-violet-400/10">
                                    <Play
                                        size={13}
                                        className="ml-0.5 fill-current"
                                        aria-hidden="true"
                                    />
                                </span>

                                Watch How It Works
                            </Link>
                        </div>
                    </div>

                    {/* Feature strip */}
                    <ul
                        className="hero-item mt-12 grid grid-cols-2 gap-x-5 gap-y-7 sm:mt-14 sm:grid-cols-4 lg:mt-20 lg:max-w-[800px] lg:gap-0"
                        style={{ "--i": 4 }}
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <li
                                    key={feature.id}
                                    className={
                                        index === 0
                                            ? "lg:pl-0 lg:pr-5"
                                            : "lg:border-l lg:border-white/[0.10] lg:pl-6 lg:pr-5"
                                    }
                                >
                                    <Link
                                        href={feature.href}
                                        className="group flex flex-col gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                                    >
                                        <span
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-[#11131F]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl transition duration-300 group-hover:-translate-y-1"
                                            style={{
                                                borderColor: `${feature.color}30`,
                                                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
                                            }}
                                        >
                                            <Icon
                                                size={23}
                                                strokeWidth={1.6}
                                                style={{ color: feature.color }}
                                                className="transition duration-300 group-hover:scale-110"
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span>
                                            <span className="block text-sm font-medium text-slate-100 transition group-hover:text-white">
                                                {feature.title}
                                            </span>

                                            <span className="mt-1 block text-xs leading-5 text-slate-400">
                                                {feature.text}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}