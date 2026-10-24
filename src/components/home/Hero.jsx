
"use client";

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
        href: "/mentor"

    },
    {
        id: "islamic",
        icon: BookOpen,
        title: "Islamic Learning",
        text: "Authentic knowledge",
        href: "/deen-islam"
    },
    {
        id: "learning",
        icon: GraduationCap,
        title: "Learning Hub",
        text: "Build your skills",
        href: "/learning"
    },
    {
        id: "humanity",
        icon: Users,
        title: "Humanity Hub",
        text: "Create real impact",
        href: "/humanity"
    },
];

export default function HeroSection() {
    return (
        <section
            aria-label="EDUKIND hero"
            className="hero-section relative isolate overflow-hidden bg-[#080b20] text-white"
        >
            {/* Multicolor Aurora Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                {/* Electric Blue */}
                <div className="absolute -right-[8%] -top-[35%] h-[650px] w-[650px] rounded-full bg-blue-600/40 blur-[130px]" />

                {/* Indigo */}
                <div className="absolute left-[12%] -top-[30%] h-[520px] w-[520px] rounded-full bg-indigo-600/35 blur-[130px]" />

                {/* Violet */}
                <div className="absolute left-[28%] top-[5%] h-[550px] w-[550px] rounded-full bg-violet-600/30 blur-[140px]" />

                {/* Purple */}
                <div className="absolute right-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/30 blur-[130px]" />

                {/* Magenta */}
                <div className="absolute right-[-10%] top-[25%] h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-[130px]" />

                {/* Pink */}
                <div className="absolute left-[38%] top-[42%] h-[380px] w-[380px] rounded-full bg-pink-500/20 blur-[130px]" />

                {/* Cyan */}
                <div className="absolute -left-[12%] top-[35%] h-[520px] w-[520px] rounded-full bg-cyan-500/25 blur-[140px]" />

                {/* Teal */}
                <div className="absolute left-[15%] -bottom-[35%] h-[550px] w-[550px] rounded-full bg-teal-500/25 blur-[140px]" />

                {/* Deep Blue */}
                <div className="absolute right-[35%] -bottom-[40%] h-[500px] w-[500px] rounded-full bg-blue-700/30 blur-[140px]" />

                {/* Soft color blending */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#080b20]/35 via-transparent to-transparent" />
            </div>
            {/* Cinematic illustration on the right */}
            <div
                className="hero-art pointer-events-none absolute -top-12 right-[-12%] z-0 h-[calc(100%+3rem)] w-[88%]"
                aria-hidden="true"
            >
                <Image
                    src="/images/hero-illustration.png"
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1280px) 76vw, (min-width: 1024px) 76vw, 100vw"
                    className="select-none object-cover object-[80%_25%] scale-90"
                    draggable={false}
                />



                {/* Gentle atmospheric glow */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_53%,transparent_28%,rgba(5,8,18,0.12)_72%)]" />

                {/* Soft fade at the bottom */}
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050812] via-[#050812]/45 to-transparent" />
            </div>

            {/* Additional smooth image masking on desktop */}
            <style>{`
        @media (min-width: 1024px) {
          .hero-art {
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.55) 20%,
    rgba(0, 0, 0, 0.85) 40%,
    #000 60%
  );

  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.55) 20%,
    rgba(0, 0, 0, 0.85) 40%,
    #000 60%
  );
}
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

        @media (prefers-reduced-motion: reduce) {
          .hero-item {
            animation: none;
          }
        }
      `}</style>

            {/* Main content */}
            <div className="relative z-10 mx-auto flex min-h-[760px] w-full max-w-[1760px] flex-col justify-start px-5 pb-10 pt-10 sm:px-10 lg:min-h-[800px] lg:px-[5%] lg:py-14 xl:min-h-[850px]">
                <div className="max-w-[720px]">
                    {/* Badge */}
                    <div
                        className="hero-item inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#0b1023]/65 py-2 pl-3 pr-5 text-[11px] font-medium uppercase tracking-[0.17em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:text-xs"
                        style={{ "--i": 0 }}
                    >
                        <Sparkles
                            size={18}
                            className="text-violet-300"
                            aria-hidden="true"
                        />
                        <span>
                            <span className="font-semibold text-white">AI Powered</span>{" "}
                            <span className="text-white/65">Learning Platform</span>
                        </span>
                    </div>

                    {/* Headline */}
                    <h1
                        className="hero-item mt-4 text-[clamp(2.8rem,6.5vw,5.7rem)] font-semibold leading-[1.02] tracking-[-0.055em]"
                        style={{ "--i": 1 }}
                    >
                        <span className="block text-white">Learn. Grow.</span>
                        <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text pb-2 text-transparent">
                            Make an Impact.
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        className="hero-item mt-3 max-w-[550px] text-[15px] leading-8 text-slate-300 sm:text-[17px] sm:leading-9 lg:mt-4"
                        style={{ "--i": 2 }}
                    >
                        EDUKIND হলো তোমার এক-জায়গার শেখার সঙ্গী — AI Mentor, ইসলামিক
                        জ্ঞান, দক্ষতা উন্নয়ন এবং মানবতার জন্য কাজ করার সুযোগ।
                    </p>

                    {/* CTA buttons */}
                    <div
                        className="hero-item mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10"
                        style={{ "--i": 3 }}
                    >
                        <Link
                            href={PRIMARY_HREF}
                            className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-[15px] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(124,58,237,0.85)] transition duration-300 hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:h-[58px]"
                        >
                            Start Learning
                            <ArrowRight
                                size={19}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>

                        <Link
                            href={SECONDARY_HREF}
                            className="group inline-flex h-[54px] items-center justify-center gap-3 rounded-full border border-white/20 bg-[#080d1b]/65 px-7 text-[15px] font-medium text-white/90 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-300/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:h-[58px]"
                        >
                            <Play
                                size={17}
                                className="fill-white"
                                aria-hidden="true"
                            />
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
                            <Link
                                href={feature.href}
                                key={feature.id}
                                className={`flex flex-col gap-3 ${index === 0
                                    ? "lg:pl-0"
                                    : "lg:border-l lg:border-white/15 lg:pl-6"
                                    } lg:pr-5`}
                            >
                                <Icon
                                    size={27}
                                    strokeWidth={1.6}
                                    className="text-violet-300"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {feature.title}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        {feature.text}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile image fade */}
            <style>{`
        @media (max-width: 1023px) {
          .hero-section {
            background-image: none;
          }

          .hero-art {
            top: 0;
            bottom: auto;
            height: 560px;
            opacity: 0.52;
            -webkit-mask-image: linear-gradient(
              to bottom,
              #000 0%,
              rgba(0,0,0,0.8) 35%,
              transparent 100%
            );
            mask-image: linear-gradient(
              to bottom,
              #000 0%,
              rgba(0,0,0,0.8) 35%,
              transparent 100%
            );
          }
        }

        @media (max-width: 639px) {
          .hero-art {
            height: 440px;
            opacity: 0.38;
          }
        }
      `}</style>
        </section>
    );
}
