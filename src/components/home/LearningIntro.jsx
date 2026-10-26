"use client";

import Link from "next/link";
import { Instrument_Serif } from "next/font/google";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpenText,
    Brain,
    GraduationCap,
    LibraryBig,
    Network,
    Search,
    Sparkles,
    Terminal,
} from "lucide-react";

const serif = Instrument_Serif({
    subsets: ["latin"],
    weight: "400",
    style: ["normal", "italic"],
});

const LEARNING_HREF = "/learning";

/* /learning পেজের ৬টা space। হোম পেজে শুধু নাম ও এক লাইনের পরিচয়। */
const SPACES = [
    {
        id: "library",
        title: "Knowledge Library",
        text: "Docs, tutorials and trusted resources",
        href: "/learning/library",
        icon: LibraryBig,
        color: "#A78BFA",
    },
    {
        id: "notes",
        title: "Study Notes",
        text: "Simplified concepts and revision notes",
        href: "/learning/notes",
        icon: BookOpenText,
        color: "#22D3EE",
    },
    {
        id: "cheatsheets",
        title: "Cheat Sheets",
        text: "Syntax, commands and quick references",
        href: "/learning/cheatsheets",
        icon: Terminal,
        color: "#FBBF24",
    },
    {
        id: "university",
        title: "University Companion",
        text: "CSE subjects, labs and viva preparation",
        href: "/learning/university",
        icon: GraduationCap,
        color: "#34D399",
    },
    {
        id: "maps",
        title: "Concept Maps",
        text: "See how ideas connect together",
        href: "/learning/concept-maps",
        icon: Network,
        color: "#F472B6",
    },
    {
        id: "insights",
        title: "Tech Insights",
        text: "Ideas across modern technology",
        href: "/learning/insights",
        icon: Brain,
        color: "#38BDF8",
    },
];

const byId = (id) => SPACES.find((s) => s.id === id);


const OUTER = [
    { a: 0, item: byId("library") },
    { a: 90, item: byId("notes") },
    { a: 180, item: byId("cheatsheets") },
    { a: 270, item: byId("university") },
];
const INNER = [
    { a: 0, item: byId("maps") },
    { a: 180, item: byId("insights") },
];

function OrbitIcon({ item, angle, size, duration, reverse }) {
    const Icon = item.icon;
    return (
        <div className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <span
                    title={item.title}
                    className="ln-anim flex items-center justify-center rounded-2xl border border-white/15 bg-[#0b0d17]/85 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                    style={{
                        width: size,
                        height: size,
                        color: item.color,
                        boxShadow: `0 10px 30px -12px ${item.color}99`,
                        animation: `${reverse ? "ln-spin" : "ln-spin-rev"} ${duration}s linear infinite`,
                        transform: `rotate(${-angle}deg)`,
                    }}
                >
                    <Icon size={size * 0.42} strokeWidth={1.7} />
                </span>
            </div>
        </div>
    );
}

export default function LearningIntro() {
    return (
        <section
            id="learning-intro"
            aria-label="Learning"
            className="relative isolate overflow-x-clip py-16 sm:py-24"
        >
    
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 45% 55% at 22% 50%, rgba(139,92,246,0.17), transparent 70%), radial-gradient(ellipse 40% 40% at 95% 0%, rgba(34,211,238,0.08), transparent 70%)",
                }}
            />

            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        
                <div className="order-last lg:order-first">
                    <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)]" />

        
                        <div className="absolute inset-[6%] rounded-full border border-white/[0.08]" />
                        <div className="absolute inset-[24%] rounded-full border border-dashed border-white/[0.13]" />
                        <div className="absolute inset-[40%] rounded-full border border-white/[0.08]" />

                    
                        <div
                            className="ln-anim absolute inset-[6%]"
                            style={{ animation: "ln-spin 40s linear infinite" }}
                        >
                            {OUTER.map(({ a, item }) => (
                                <OrbitIcon
                                    key={item.id}
                                    item={item}
                                    angle={a}
                                    size={50}
                                    duration={40}
                                />
                            ))}
                        </div>

                    
                        <div
                            className="ln-anim absolute inset-[24%]"
                            style={{ animation: "ln-spin-rev 28s linear infinite" }}
                        >
                            {INNER.map(({ a, item }) => (
                                <OrbitIcon
                                    key={item.id}
                                    item={item}
                                    angle={a}
                                    size={42}
                                    duration={28}
                                    reverse
                                />
                            ))}
                        </div>

                
                        <div className="relative flex h-[28%] w-[28%] flex-col items-center justify-center rounded-full border border-white/15 bg-gradient-to-b from-white/[0.12] to-white/[0.02] text-center shadow-[0_0_80px_rgba(139,92,246,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl">
                            <Sparkles size={20} className="text-violet-200" />
                            <span
                                className={`${serif.className} mt-1 text-[14px] leading-tight text-white sm:text-[16px]`}
                            >
                                Learn
                                <br />
                                <span className="italic text-slate-300">with purpose</span>
                            </span>
                        </div>
                    </div>
                </div>

                
                <div>
                    <span className="inline-flex items-center gap-3 text-[13px] font-medium text-violet-200/80">
                        <span
                            aria-hidden="true"
                            className="h-px w-9 bg-gradient-to-r from-transparent to-violet-300/60"
                        />
                        Learning
                    </span>

                    {/* Top-left section heading */}

                    <div className="absolute left-5 top-6 z-10 sm:left-8 sm:top-8 lg:left-12">
                        <h2
                            className={`${serif.className} whitespace-nowrap text-xl tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl`}
                        >
                            <span className="relative inline-block">
                                Learn anything,
                                <span className="absolute -bottom-1 left-0 h-px w-1/3 bg-gradient-to-r from-violet-400 via-indigo-300 to-transparent opacity-80" />
                            </span>{" "}
                            <span className="bg-gradient-to-r from-slate-300 via-violet-200 to-slate-400 bg-clip-text italic text-transparent">
                                at your own pace.
                            </span>
                        </h2>

                        <div className="mt-3 flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.9)]" />
                            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-slate-500 sm:text-[10px]">
                                Your journey. Your pace.
                            </span>
                        </div>
                    </div>

                    <p className="mt-5 max-w-[470px] text-[15px] leading-7 text-slate-400 sm:text-[16px] sm:leading-8">
                        নোট, চিটশিট, কনসেপ্ট ম্যাপ আর ইউনিভার্সিটির বিষয়, সব গুছিয়ে রাখা আছে।
                        নতুন কিছু শেখো, জটিল ধারণা সহজে বোঝো।
                    </p>

                    {/* সার্চ বারের আভাস: ক্লিক করলে /learning এ যায় */}
                    <Link
                        href={LEARNING_HREF}
                        className="group mt-7 flex h-12 max-w-[470px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-500 backdrop-blur-xl transition duration-300 hover:border-violet-400/50 hover:bg-white/[0.07] hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                    >
                        <Search size={17} className="shrink-0 text-slate-400" />
                        <span className="flex-1 truncate">Search topics, notes, or resources</span>
                        <kbd className="hidden rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-medium text-slate-400 sm:block">
                            Ctrl K
                        </kbd>
                    </Link>

                    {/* ৬টা space: কার্ড নয়, হালকা তালিকা */}
                    <ul className="mt-6 grid max-w-[560px] gap-x-6 sm:grid-cols-2">
                        {SPACES.map((s) => {
                            const Icon = s.icon;
                            return (
                                <li key={s.id} className="border-b border-white/[0.07]">
                                    <Link
                                        href={s.href}
                                        className="group flex items-center gap-3 py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                                    >
                                        <span
                                            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border transition duration-300 group-hover:scale-110"
                                            style={{
                                                borderColor: `${s.color}40`,
                                                backgroundColor: `${s.color}16`,
                                                color: s.color,
                                            }}
                                        >
                                            <Icon size={17} strokeWidth={1.7} />
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[14px] font-medium text-slate-100 transition group-hover:text-white">
                                                {s.title}
                                            </span>
                                            <span className="block truncate text-[12px] text-slate-500">
                                                {s.text}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            size={15}
                                            className="shrink-0 text-slate-600 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                                        />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link
                            href={LEARNING_HREF}
                            className="group relative inline-flex h-[50px] items-center gap-3 overflow-hidden rounded-full border border-violet-300/30 bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-7 text-[15px] font-semibold text-white shadow-[0_14px_40px_-16px_rgba(124,58,237,0.85)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_-14px_rgba(124,58,237,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                            />
                            <span className="relative">Explore Learning</span>
                            <ArrowRight
                                size={18}
                                className="relative transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </Link>

                        <span className="text-[12.5px] text-slate-500">
                            Resources from MDN, React and GitHub Docs
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ln-spin { to { transform: rotate(360deg); } }
                @keyframes ln-spin-rev { to { transform: rotate(-360deg); } }
                @media (prefers-reduced-motion: reduce) {
                    .ln-anim { animation: none !important; }
                }
            `}</style>
        </section>
    );
}