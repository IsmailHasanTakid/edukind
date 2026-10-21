
import Link from "next/link";
import {
    ArrowUpRight,
    Brain,
    BriefcaseBusiness,
    CalendarCheck,
    Mic,
    Code2,
    GraduationCap,
    Lightbulb,
    MessageCircle,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const mentorFeatures = [
    {
        title: "Ask AI Mentor",
        description:
            "Ask questions, explore ideas, and get personalized explanations.",
        href: "/mentor/chat",
        icon: MessageCircle,
        accent: "violet",
        label: "YOUR AI COMPANION",
    },
    {
        title: "Learn with AI",
        description:
            "Understand difficult concepts through guided, step-by-step learning.",
        href: "/mentor/learn",
        icon: GraduationCap,
        accent: "cyan",
        label: "LEARN ANYTHING",
    },
    {
        title: "Code Mentor",
        description:
            "Understand code, explore programming concepts, and improve your skills.",
        href: "/mentor/code",
        icon: Code2,
        accent: "emerald",
        label: "BUILD WITH CONFIDENCE",
    },
    {
        title: "Problem Solver",
        description:
            "Break complex problems into smaller steps and learn how to solve them.",
        href: "/mentor/problem-solver",
        icon: Lightbulb,
        accent: "amber",
        label: "THINK DEEPER",
    },
    {
        title: "AI Study Planner",
        description:
            "Organize your goals and create a structured learning roadmap.",
        href: "/mentor/study-planner",
        icon: CalendarCheck,
        accent: "pink",
        label: "PLAN YOUR GROWTH",
    },
    {
        title: "Career Guidance",
        description:
            "Explore career paths, identify skills, and plan your next steps.",
        href: "/mentor/career",
        icon: BriefcaseBusiness,
        accent: "blue",
        label: "SHAPE YOUR FUTURE",
    },
    {
        title: "AI Interviewer",
        description:
            "Master your next interview with AI-powered practice, adaptive questions, and personalized performance insights.",
        href: "/mentor/interviewer",
        icon: Mic,
        accent: "blue",
        label: "YOUR NEXT OPPORTUNITY STARTS HERE",
    },


];

const accentStyles = {
    violet: {
        icon: "bg-violet-400/10 text-violet-300 ring-violet-300/15",
        glow: "group-hover:bg-violet-500/[0.09]",
        line: "from-violet-400/70",
    },
    cyan: {
        icon: "bg-cyan-400/10 text-cyan-300 ring-cyan-300/15",
        glow: "group-hover:bg-cyan-500/[0.08]",
        line: "from-cyan-400/70",
    },
    emerald: {
        icon: "bg-emerald-400/10 text-emerald-300 ring-emerald-300/15",
        glow: "group-hover:bg-emerald-500/[0.08]",
        line: "from-emerald-400/70",
    },
    amber: {
        icon: "bg-amber-400/10 text-amber-300 ring-amber-300/15",
        glow: "group-hover:bg-amber-500/[0.08]",
        line: "from-amber-400/70",
    },
    pink: {
        icon: "bg-pink-400/10 text-pink-300 ring-pink-300/15",
        glow: "group-hover:bg-pink-500/[0.08]",
        line: "from-pink-400/70",
    },
    purple: {
        icon: "bg-purple-400/10 text-purple-300 ring-purple-300/15",
        glow: "group-hover:bg-purple-500/[0.08]",
        line: "from-purple-400/70",
    },
    blue: {
        icon: "bg-blue-400/10 text-blue-300 ring-blue-300/15",
        glow: "group-hover:bg-blue-500/[0.08]",
        line: "from-blue-400/70",
    },
};

function FeatureCard({ feature }) {
    const Icon = feature.icon;
    const accent = accentStyles[feature.accent];

    return (
        <Link
            href={feature.href}
            className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1220] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#101729] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300 motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
        >
            {/* Subtle ambient glow */}
            <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl transition-colors duration-500 ${accent.glow}`}
            />

            {/* Top accent line */}
            <div
                aria-hidden="true"
                className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${accent.line} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            {/* Icon and arrow */}
            <div className="relative flex items-start justify-between gap-3">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${accent.icon}`}
                >
                    <Icon
                        size={24}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] text-zinc-500 transition-all duration-300 group-hover:border-white/[0.14] group-hover:text-white">
                    <ArrowUpRight
                        size={18}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </span>
            </div>

            {/* Card content */}
            <div className="relative mt-6 flex-1">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-zinc-500 sm:text-[10px]">
                    {feature.label}
                </p>

                <h2 className="text-[17px] font-semibold tracking-[-0.035em] text-zinc-100 transition-colors duration-300 group-hover:text-white sm:text-lg">
                    {feature.title}
                </h2>

                <p className="mt-2 max-w-sm text-[13px] leading-6 text-zinc-400 sm:text-sm">
                    {feature.description}
                </p>
            </div>
        </Link>
    );
}

export default function MentorPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080B14] text-white">
            {/* Background atmosphere */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 h-[360px] w-[650px] -translate-x-1/2 rounded-full bg-violet-600/[0.09] blur-[120px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-cyan-500/[0.04] blur-[110px]"
            />

            <section className="relative mx-auto w-full max-w-7xl px-4 pb-8 pt-2 sm:px-6 sm:pb-20 sm:pt-2 lg:px-8 lg:pt-2">

                <div className="mb-5 mt-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6 sm:mt-8">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                            YOUR TOOLKIT
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">
                            Explore your possibilities
                        </h2>
                    </div>

                    <p className="hidden text-xs text-zinc-500 sm:block">
                        Choose where you want to begin
                    </p>
                </div>

                {/* Feature cards */}

                {/* Feature cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {mentorFeatures.map((feature) => (
                        <div
                            key={feature.href}
                            className={
                                feature.title === "AI Interviewer"
                                    ? "sm:col-span-2 lg:col-span-3"
                                    : ""
                            }
                        >
                            <FeatureCard feature={feature} />
                        </div>
                    ))}
                </div>


                {/* Footer */}
                <footer className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-white/[0.06] pt-6 text-center sm:flex-row sm:gap-3">
                    <ShieldCheck
                        size={16}
                        strokeWidth={1.6}
                        className="text-zinc-500"
                        aria-hidden="true"
                    />

                    <p className="text-xs leading-5 text-zinc-500">
                        Your learning journey, your pace. One step at a time.
                    </p>
                </footer>
            </section>
        </main>
    );
}
