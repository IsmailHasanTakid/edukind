"use client";

import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight,
    ArrowUpRight,
    Play,
    Sparkles,
    BrainCircuit,
    BookOpen,
    GraduationCap,
    HeartHandshake,
    ShieldCheck,
} from "lucide-react";

const features = [
    {
        title: "AI Mentor",
        description: "Learn, code & solve with AI",
        href: "/mentor",
        icon: BrainCircuit,
        accent: "#22D3EE",
    },
    {
        title: "Islamic Learning",
        description: "Quran, Hadith & guided study",
        href: "/deen-islam",
        icon: BookOpen,
        accent: "#A78BFA",
    },
    {
        title: "Learning Hub",
        description: "Notes, resources & skills",
        href: "/learning",
        icon: GraduationCap,
        accent: "#FBBF24",
    },
    {
        title: "Humanity Hub",
        description: "Volunteer, serve & impact",
        href: "/humanity",
        icon: HeartHandshake,
        accent: "#FB7185",
    },
];

const meshGradient = [
    "radial-gradient(1100px 720px at 8% -10%, rgba(124, 58, 237, 0.54), transparent 62%)",
    "radial-gradient(880px 620px at 90% -4%, rgba(37, 99, 235, 0.52), transparent 64%)",
    "radial-gradient(760px 580px at 82% 78%, rgba(217, 70, 239, 0.36), transparent 66%)",
    "radial-gradient(720px 540px at 4% 68%, rgba(251, 113, 133, 0.24), transparent 66%)",
    "radial-gradient(700px 520px at 46% 112%, rgba(251, 191, 36, 0.25), transparent 68%)",
    "radial-gradient(620px 500px at 56% 16%, rgba(6, 182, 212, 0.32), transparent 70%)",
    "radial-gradient(520px 420px at 68% 56%, rgba(45, 212, 191, 0.20), transparent 72%)",
    "radial-gradient(640px 460px at 30% 44%, rgba(168, 85, 247, 0.20), transparent 74%)",
    "linear-gradient(180deg, #070B19 0%, #070D22 46%, #050812 100%)",
].join(", ");

const edgeChroma = [
    "radial-gradient(640px 500px at 100% 0%, rgba(37, 99, 235, 0.28), transparent 70%)",
    "radial-gradient(560px 420px at 94% 98%, rgba(217, 70, 239, 0.24), transparent 72%)",
    "radial-gradient(560px 420px at 0% 94%, rgba(251, 113, 133, 0.20), transparent 72%)",
    "radial-gradient(440px 340px at 4% 104%, rgba(251, 191, 36, 0.17), transparent 72%)",
    "radial-gradient(500px 380px at 0% 0%, rgba(124, 58, 237, 0.22), transparent 72%)",
].join(", ");

const gridTexture = [
    "linear-gradient(to right, rgba(148, 163, 184, 0.13) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(148, 163, 184, 0.13) 1px, transparent 1px)",
].join(", ");

const noiseTexture =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")";

export default function Hero() {
    return (
        <section className="relative isolate -mx-12 overflow-hidden border-b border-white/[0.06] bg-[#070B19] text-white">
            {/* Layered nine-color atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            >
                <div className="absolute inset-0" style={{ background: meshGradient }} />

                {/* Diffused color orbs, woven rather than placed as circles */}
                <div
                    className="ek-drift-a absolute -left-[14%] -top-[22%] h-[38rem] w-[38rem] rounded-full opacity-90 mix-blend-screen blur-[90px]"
                    style={{
                        background:
                            "radial-gradient(circle at 36% 36%, rgba(168, 85, 247, 0.60), rgba(37, 99, 235, 0.28) 42%, transparent 72%)",
                    }}
                />
                <div
                    className="ek-drift-b absolute -right-[10%] -top-[18%] h-[34rem] w-[34rem] rounded-full opacity-85 mix-blend-screen blur-[95px]"
                    style={{
                        background:
                            "radial-gradient(circle at 42% 42%, rgba(6, 182, 212, 0.50), rgba(37, 99, 235, 0.30) 44%, transparent 72%)",
                    }}
                />
                <div
                    className="ek-drift-c absolute -bottom-[26%] right-[4%] h-[32rem] w-[32rem] rounded-full opacity-80 mix-blend-screen blur-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle at 48% 46%, rgba(217, 70, 239, 0.46), rgba(251, 113, 133, 0.22) 46%, transparent 74%)",
                    }}
                />
                <div
                    className="ek-drift-b absolute -bottom-[24%] left-[2%] h-[28rem] w-[28rem] rounded-full opacity-75 mix-blend-screen blur-[95px]"
                    style={{
                        background:
                            "radial-gradient(circle at 48% 46%, rgba(251, 191, 36, 0.32), rgba(251, 113, 133, 0.22) 46%, transparent 74%)",
                    }}
                />
                <div
                    className="absolute left-[34%] top-[22%] h-[22rem] w-[22rem] rounded-full opacity-60 mix-blend-screen blur-[100px]"
                    style={{
                        background:
                            "radial-gradient(circle, rgba(45, 212, 191, 0.30), transparent 70%)",
                    }}
                />

                {/* Slow aurora ribbons */}
                <div
                    className="ek-aurora absolute left-1/2 top-[-20%] h-[26rem] w-[82rem] rounded-[100%] opacity-85 blur-[100px]"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.20) 20%, rgba(6, 182, 212, 0.22) 40%, rgba(168, 85, 247, 0.22) 62%, rgba(217, 70, 239, 0.18) 82%, transparent 100%)",
                    }}
                />
                <div
                    className="absolute left-1/2 top-[52%] h-[15rem] w-[62rem] -translate-x-1/2 rotate-[9deg] rounded-[100%] opacity-70 blur-[90px]"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.14) 22%, rgba(251, 113, 133, 0.18) 48%, rgba(217, 70, 239, 0.16) 72%, transparent 100%)",
                    }}
                />

                {/* Precision grid */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        backgroundImage: gridTexture,
                        backgroundSize: "64px 64px",
                        maskImage:
                            "radial-gradient(ellipse 80% 68% at 50% 44%, #000 16%, transparent 76%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 80% 68% at 50% 44%, #000 16%, transparent 76%)",
                    }}
                />

                {/* Fine star dust on the visual side */}
                <div
                    className="absolute inset-0 opacity-[0.22]"
                    style={{
                        backgroundImage:
                            "radial-gradient(rgba(186, 230, 253, 0.8) 0.8px, transparent 0.8px)",
                        backgroundSize: "26px 26px",
                        maskImage:
                            "radial-gradient(ellipse 52% 62% at 76% 48%, #000 0%, transparent 74%)",
                        WebkitMaskImage:
                            "radial-gradient(ellipse 52% 62% at 76% 48%, #000 0%, transparent 74%)",
                    }}
                />

                {/* Hairline light trails */}
                <div className="absolute left-[-12%] top-[30%] h-px w-[58%] -rotate-[14deg] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
                <div className="absolute right-[-8%] top-[20%] h-px w-[42%] rotate-[18deg] bg-gradient-to-r from-transparent via-fuchsia-300/25 to-transparent" />
                <div className="absolute bottom-[16%] right-[6%] h-px w-[34%] -rotate-[5deg] bg-gradient-to-r from-transparent via-amber-200/20 to-transparent" />

                {/* Noise-like texture, generated without assets */}
                <div
                    className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
                    style={{ backgroundImage: noiseTexture }}
                />

                {/* Calm scrim behind the copy */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(1150px 780px at 22% 42%, rgba(7, 11, 25, 0.80) 0%, rgba(7, 11, 25, 0.40) 48%, rgba(7, 11, 25, 0) 76%)",
                    }}
                />

                {/* Color returns at the edges while the center stays controlled */}
                <div
                    className="absolute inset-0 opacity-90 mix-blend-screen"
                    style={{ background: edgeChroma }}
                />

                {/* Vignette and edge lighting */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 88% 76% at 50% 44%, transparent 42%, rgba(4, 7, 16, 0.38) 80%, rgba(4, 7, 16, 0.70) 100%)",
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-300/20 to-transparent" />
            </div>

            {/* Hero composition */}
            <div className="relative mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-9 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-6 lg:px-10 lg:py-14 xl:gap-10 xl:px-14 xl:py-16">
                {/* Copy */}
                <div className="ek-copy relative z-20 flex min-w-0 flex-col items-start">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.045] py-1.5 pl-1.5 pr-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_34px_rgba(124,58,237,0.14)] backdrop-blur-xl">
                        <span className="relative grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-cyan-400/25 via-violet-500/20 to-fuchsia-500/20">
                            <Sparkles size={12} className="text-cyan-200" />
                            <span className="absolute inset-0 rounded-full border border-cyan-300/25" />
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200 sm:text-[11px]">
                            The EDUKIND ecosystem
                        </span>
                        <span className="hidden h-3 w-px bg-white/15 sm:block" />
                    </div>

                    <h1 className="mt-5 max-w-[640px] text-balance text-[clamp(2.2rem,3.55vw,3.25rem)] font-semibold leading-[1.07] tracking-[-0.05em] text-white">
                        <span className="block">Grow your mind.</span>
                        <span className="block">
                            Strengthen your{" "}
                            <span className="ek-title-shimmer inline-block bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-300 bg-clip-text pb-[0.06em] text-transparent drop-shadow-[0_0_24px_rgba(34,211,238,0.18)]">
                                purpose.
                            </span>
                        </span>
                        <span className="block">
                            Make a{" "}
                            <span className="ek-title-shimmer ek-title-shimmer-warm inline-block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-amber-300 bg-clip-text pb-[0.06em] text-transparent drop-shadow-[0_0_24px_rgba(217,70,239,0.18)]">
                                difference.
                            </span>
                        </span>
                    </h1>

                    <p className="mt-4 max-w-[540px] text-[13.5px] leading-6 text-slate-300/90 sm:text-[15px] sm:leading-7">
                        One intelligent ecosystem for your mind, faith, and impact — AI
                        mentorship, authentic Islamic knowledge, modern skills, and a
                        community built to serve.
                    </p>
                    <p className="mt-2.5 max-w-[520px] text-[11.5px] leading-5 text-slate-400/90 sm:text-xs">
                        একটি প্ল্যাটফর্মে AI-গাইডেড শিক্ষা, ইসলামিক জ্ঞান, দক্ষতা ও মানবতার পথ।
                    </p>

                    {/* Actions */}
                    <div className="mt-5 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                        <Link
                            href="/learning"
                            className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[linear-gradient(100deg,#2563EB_0%,#7C3AED_48%,#D946EF_100%)] px-6 text-sm font-semibold text-white shadow-[0_12px_38px_-8px_rgba(124,58,237,0.7),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-8px_rgba(168,85,247,0.75),inset_0_1px_0_rgba(255,255,255,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B19] sm:w-auto"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 -skew-x-12 bg-white/20 opacity-0 blur-md transition-all duration-500 group-hover:left-[110%] group-hover:opacity-100"
                            />
                            <span className="relative">Explore EDUKIND</span>
                            <ArrowRight
                                size={17}
                                className="relative transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>

                        <a
                            href="#features"
                            className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/[0.14] bg-white/[0.045] px-5 text-sm font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.075] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B19] sm:w-auto"
                        >
                            <span className="grid h-6 w-6 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-cyan-200 transition-colors duration-300 group-hover:border-cyan-300/30 group-hover:bg-cyan-300/15 group-hover:text-cyan-100">
                                <Play size={10} fill="currentColor" />
                            </span>
                            Discover features
                        </a>
                    </div>

                    {/* Four pillars */}
                    <div className="mt-5 w-full max-w-[600px]">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400/90">
                                One ecosystem · four pathways
                            </span>
                            <span className="h-px flex-1 bg-gradient-to-r from-white/[0.12] to-transparent" />
                        </div>

                        <div
                            id="features"
                            className="mt-3 grid grid-cols-4 scroll-mt-15 gap-2.5 sm:gap-3"
                        >
                            {features.map((feature) => {
                                const Icon = feature.icon;

                                return (
                                    <Link
                                        key={feature.title}
                                        href={feature.href}
                                        className="group relative flex w-full items-center gap-2.5 overflow-hidden rounded-2xl border border-white/[0.085] bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070B19] sm:p-3.5"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                                            style={{
                                                background: `radial-gradient(120px 90px at 0% 0%, ${feature.accent}20, transparent 72%)`,
                                            }}
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-50"
                                            style={{
                                                background: `linear-gradient(90deg, transparent, ${feature.accent}66, transparent)`,
                                            }}
                                        />

                                        <span
                                            className="relative grid h-9 w-full shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
                                            style={{
                                                color: feature.accent,
                                                backgroundImage: `linear-gradient(145deg, ${feature.accent}26, ${feature.accent}08)`,
                                                border: `1px solid ${feature.accent}3d`,
                                                boxShadow: `inset 0 1px 0 ${feature.accent}33, 0 0 20px ${feature.accent}12`,
                                            }}
                                        >
                                            <Icon size={18} strokeWidth={1.7} />
                                        </span>

                                        <span className="relative min-w-0 flex-1">
                                            <span className="block text-[13px] font-semibold leading-tight text-white sm:text-sm">
                                                {feature.title}
                                            </span>
                                            <span className="mt-1 block text-[10.5px] leading-4 text-slate-400 transition-colors duration-300 group-hover:text-slate-300 sm:text-[11px]">
                                                {feature.description}
                                            </span>
                                        </span>

                                        <ArrowUpRight
                                            size={14}
                                            aria-hidden="true"
                                            className="relative hidden shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/70 sm:block"
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400 sm:text-xs">
                        <span className="inline-flex items-center gap-2">
                            <span className="grid h-6 w-6 place-items-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                                <ShieldCheck size={13} />
                            </span>
                            Learn with purpose. Grow with values.
                        </span>
                        <span className="hidden h-3 w-px bg-white/10 sm:block" />
                        <span className="hidden items-center gap-1.5 sm:inline-flex">
                            <span className="h-1 w-1 rounded-full bg-cyan-300/80" />
                            Faith
                            <span className="h-1 w-1 rounded-full bg-violet-300/80" />
                            Knowledge
                            <span className="h-1 w-1 rounded-full bg-amber-300/80" />
                            Impact
                        </span>
                    </div>
                </div>

                {/* Illustration */}
                <div className="ek-visual relative mx-auto w-full min-w-0 max-w-[640px] lg:max-w-none">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10"
                    >
                        <div
                            className="absolute left-[8%] top-[10%] h-[64%] w-[64%] rounded-full blur-[62px]"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(37, 99, 235, 0.46), rgba(124, 58, 237, 0.24) 46%, transparent 72%)",
                            }}
                        />
                        <div
                            className="absolute right-[0%] top-[20%] h-[54%] w-[54%] rounded-full blur-[68px]"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(6, 182, 212, 0.34), transparent 70%)",
                            }}
                        />
                        <div
                            className="absolute bottom-[6%] right-[10%] h-[46%] w-[46%] rounded-full blur-[62px]"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(217, 70, 239, 0.30), transparent 72%)",
                            }}
                        />
                        <div
                            className="absolute bottom-[10%] left-[2%] h-[36%] w-[36%] rounded-full blur-[58px]"
                            style={{
                                background:
                                    "radial-gradient(circle, rgba(251, 191, 36, 0.22), transparent 72%)",
                            }}
                        />
                    </div>

                    <div className="relative aspect-[1.45/1] w-full">
                        {/* Orbital geometry */}
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-[88%] w-[96%] rounded-[50%] border border-cyan-200/[0.10]"
                            style={{ transform: "translate(-50%, -50%) rotate(-8deg)" }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-[76%] w-[84%] rounded-[50%] border border-dashed border-violet-200/[0.11]"
                            style={{ transform: "translate(-50%, -50%) rotate(12deg)" }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute left-1/2 top-1/2 h-[64%] w-[70%] rounded-[50%] border border-fuchsia-200/[0.08]"
                            style={{ transform: "translate(-50%, -50%) rotate(-18deg)" }}
                        />

                        {/* Floor illumination */}
                        <div
                            aria-hidden="true"
                            className="absolute bottom-[3%] left-1/2 h-[13%] w-[70%] -translate-x-1/2 rounded-[50%] blur-2xl"
                            style={{
                                background:
                                    "radial-gradient(ellipse, rgba(124, 58, 237, 0.40), rgba(6, 182, 212, 0.14) 48%, transparent 72%)",
                            }}
                        />

                        <Image
                            src="/images/hero-illustration.png"
                            alt="EDUKIND AI learning, Islamic knowledge, education and humanity ecosystem"
                            fill
                            priority
                            sizes="(max-width: 1024px) 92vw, 48vw"
                            className="object-contain object-center"
                            style={{
                                filter:
                                    "drop-shadow(0 28px 70px rgba(37, 99, 235, 0.30)) drop-shadow(0 0 28px rgba(168, 85, 247, 0.20))",
                            }}
                        />

                        {/* Floating light particles */}
                        <span
                            aria-hidden="true"
                            className="ek-twinkle absolute left-[6%] top-[24%] h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.55)]"
                        />
                        <span
                            aria-hidden="true"
                            className="ek-twinkle ek-twinkle-delay-1 absolute right-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-fuchsia-300 shadow-[0_0_12px_3px_rgba(217,70,239,0.45)]"
                        />
                        <span
                            aria-hidden="true"
                            className="ek-twinkle ek-twinkle-delay-2 absolute bottom-[26%] right-[4%] h-1 w-1 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,0.5)]"
                        />
                        <span
                            aria-hidden="true"
                            className="ek-twinkle ek-twinkle-delay-3 absolute bottom-[32%] left-[2%] h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_12px_3px_rgba(168,85,247,0.5)]"
                        />
                    </div>

                    {/* Ecosystem chip */}
                    <div className="ek-float absolute right-1 top-[-2%] hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0A1124]/70 px-3 py-2 shadow-[0_14px_38px_rgba(3,7,18,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:flex">
                        <span aria-hidden="true" className="flex -space-x-1">
                            <span className="h-2 w-2 rounded-full bg-cyan-300 ring-2 ring-[#0A1124]" />
                            <span className="h-2 w-2 rounded-full bg-violet-400 ring-2 ring-[#0A1124]" />
                            <span className="h-2 w-2 rounded-full bg-amber-300 ring-2 ring-[#0A1124]" />
                            <span className="h-2 w-2 rounded-full bg-rose-400 ring-2 ring-[#0A1124]" />
                        </span>
                        <span className="text-[10px] font-medium tracking-wide text-slate-200">
                            Four pathways · one mission
                        </span>
                    </div>

                    {/* Presence pill */}
                    <div className="absolute bottom-[0%] left-[1%] hidden items-center gap-2.5 rounded-full border border-white/10 bg-[#0A1124]/75 px-3.5 py-2 shadow-[0_12px_32px_rgba(3,7,18,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl sm:flex">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50 motion-reduce:animate-none" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        <span className="text-[11px] font-medium text-slate-200">
                            One platform. Many possibilities.
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                .ek-title-shimmer {
                    background-size: 200% auto;
                    animation: ek-title-shimmer 11s ease-in-out infinite;
                }

                .ek-title-shimmer-warm {
                    animation-delay: -4s;
                }

                .ek-drift-a {
                    animation: ek-drift-a 24s ease-in-out infinite alternate;
                }

                .ek-drift-b {
                    animation: ek-drift-b 30s ease-in-out infinite alternate;
                }

                .ek-drift-c {
                    animation: ek-drift-c 27s ease-in-out infinite alternate;
                }

                .ek-aurora {
                    transform: translateX(-50%) rotate(-8deg);
                    animation: ek-aurora 32s ease-in-out infinite alternate;
                }

                .ek-float {
                    animation: ek-float 9s ease-in-out infinite;
                }

                .ek-twinkle {
                    animation: ek-twinkle 5.5s ease-in-out infinite;
                }

                .ek-twinkle-delay-1 {
                    animation-delay: -1.4s;
                }

                .ek-twinkle-delay-2 {
                    animation-delay: -2.8s;
                }

                .ek-twinkle-delay-3 {
                    animation-delay: -4s;
                }

                .ek-copy {
                    animation: ek-enter-copy 0.85s cubic-bezier(0.22, 0.68, 0, 1) both;
                }

                .ek-visual {
                    animation: ek-enter-visual 1s 0.1s cubic-bezier(0.22, 0.68, 0, 1) both;
                }

                @keyframes ek-title-shimmer {
                    0%,
                    100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes ek-drift-a {
                    0% {
                        transform: translate3d(0, 0, 0) scale(1);
                    }
                    100% {
                        transform: translate3d(5%, 7%, 0) scale(1.1);
                    }
                }

                @keyframes ek-drift-b {
                    0% {
                        transform: translate3d(0, 0, 0) scale(1.04);
                    }
                    100% {
                        transform: translate3d(-6%, 5%, 0) scale(0.94);
                    }
                }

                @keyframes ek-drift-c {
                    0% {
                        transform: translate3d(0, 0, 0) scale(0.96);
                    }
                    100% {
                        transform: translate3d(-4%, -6%, 0) scale(1.08);
                    }
                }

                @keyframes ek-aurora {
                    0% {
                        transform: translateX(-50%) translateY(0) rotate(-8deg) scale(1);
                        opacity: 0.72;
                    }
                    100% {
                        transform: translateX(-47%) translateY(4%) rotate(-5deg) scale(1.06);
                        opacity: 0.95;
                    }
                }

                @keyframes ek-float {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-8px);
                    }
                }

                @keyframes ek-twinkle {
                    0%,
                    100% {
                        opacity: 0.35;
                        transform: scale(0.85);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.15);
                    }
                }

                @keyframes ek-enter-copy {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes ek-enter-visual {
                    from {
                        opacity: 0;
                        transform: translateY(22px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ek-title-shimmer,
                    .ek-title-shimmer-warm,
                    .ek-drift-a,
                    .ek-drift-b,
                    .ek-drift-c,
                    .ek-aurora,
                    .ek-float,
                    .ek-twinkle,
                    .ek-copy,
                    .ek-visual {
                        animation: none !important;
                    }

                    .ek-title-shimmer,
                    .ek-title-shimmer-warm {
                        background-position: 50% 50% !important;
                    }
                }
            `}</style>
        </section>
    );
}
