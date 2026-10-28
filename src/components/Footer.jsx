
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

const BRAND = "EDUKIND";
const TAGLINE = "Learn · Build · Impact";
const AUTHOR = "Ismail Hasan Takid";

const COLUMNS = [
    {
        title: "Platform",
        links: [
            { label: "Home", href: "/" },
            { label: "AI Mentor", href: "/mentor" },
            { label: "Learning", href: "/learning" },
            { label: "DeenIslam", href: "/deen-islam" },
            { label: "Humanity Hub", href: "/humanity", soon: true },
            { label: "Explore", href: "/explore", soon: true },
        ],
    },
    {
        title: "AI Mentor",
        links: [
            { label: "Ask AI", href: "/mentor/chat" },
            { label: "Learn with AI", href: "/mentor/learn" },
            { label: "Code Mentor", href: "/mentor/code" },
            { label: "Problem Solver", href: "/mentor/problem-solver" },
            { label: "Study Planner", href: "/mentor/study-planner" },
            { label: "Career Guidance", href: "/mentor/career" },
        ],
    },
    {
        title: "Learning",
        links: [
            { label: "Knowledge Library", href: "/learning/library" },
            { label: "Study Notes", href: "/learning/notes" },
            { label: "Cheat Sheets", href: "/learning/cheatsheets" },
            { label: "University Companion", href: "/learning/university" },
            { label: "Concept Maps", href: "/learning/concept-maps" },
            { label: "Tech Insights", href: "/learning/insights" },
        ],
    },
    {
        title: "Community",
        links: [
            { label: "কুরআন লাইব্রেরি", href: "/deen-islam/quran" },
            { label: "হাদিস লাইব্রেরি", href: "/deen-islam/hadith" },
            { label: "সব ইসলামিক বিভাগ", href: "/deen-islam" },
            { label: "Donate blood", href: "/humanity", soon: true },
            { label: "Find blood", href: "/humanity", soon: true },
            { label: "Volunteer", href: "/humanity", soon: true },
        ],
    },
];

const FOOTER_PAGES = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
];

const SOCIAL_LINKS = [
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "GitHub", href: "https://github.com/IsmailHasanTakid" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ismail-hasan-takid" },
];

function SocialIcon({ name }) {
    if (name === "Facebook") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z" />
            </svg>
        );
    }

    if (name === "GitHub") {
        return (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.3a11.5 11.5 0 0 1 6.2 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.7.2 3 .1 3.3.8.9 1.2 2 1.2 3.4 0 4.7-2.8 5.8-5.5 6.1.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" />
            </svg>
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9h3ZM6.5 7.6a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V19h-3V9h2.9v1.4h.1a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.8 2 3.8 4.6Z" />
        </svg>
    );
}

function SocialButton({ social }) {
    return (
        <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.label}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-slate-400 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
        >
            <SocialIcon name={social.label} />
        </a>
    );
}

function FooterLink({ link }) {
    if (link.soon) {
        return (
            <span
                aria-disabled="true"
                className="inline-flex cursor-default items-center gap-1.5 text-[13px] text-slate-600"
            >
                {link.label}
                <span className="rounded-full border border-white/10 px-1.5 py-px text-[9px] font-medium uppercase tracking-wide text-slate-500">
                    Soon
                </span>
            </span>
        );
    }

    return (
        <Link
            href={link.href}
            className="group inline-flex text-[13px] text-slate-400 transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
        >
            <span className="relative">
                {link.label}
                <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-violet-300 to-cyan-300 transition-all duration-300 group-hover:w-full"
                />
            </span>
        </Link>
    );
}


export default function Footer() {
    const [year, setYear] = useState(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);


    function backToTop() {
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: reduceMotion ? "auto" : "smooth",
        });
    }

    return (
        <footer
            aria-label="Site footer"
            className="relative isolate w-full overflow-hidden border-t border-white/[0.07] bg-[#05070E] text-white"
        >
            {/* Top accent */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent"
            />

            {/* Ambient glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 45% 50% at 10% 0%, rgba(124,58,237,0.12), transparent 70%), radial-gradient(ellipse 35% 40% at 95% 5%, rgba(34,211,238,0.06), transparent 70%)",
                }}
            />

            <div className="mx-auto max-w-6xl px-5 pb-4 pt-8 sm:px-6 sm:pb-5 sm:pt-9">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,3fr)] lg:gap-10">
                    {/* Brand */}
                    <div>
                        <Link
                            href="/"
                            aria-label={`${BRAND} home`}
                            className="inline-flex items-center gap-2.5 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                        >
                            <span
                                aria-hidden="true"
                                className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 via-indigo-400 to-cyan-300 text-base font-bold text-[#05070E] shadow-[0_8px_24px_-12px_rgba(139,92,246,0.8)]"
                            >
                                {BRAND.charAt(0)}
                            </span>

                            <span className="text-lg font-semibold tracking-[0.12em]">
                                {BRAND}
                            </span>
                        </Link>

                        <p className="mt-3 max-w-[280px] text-[13px] leading-6 text-slate-400">
                            AI Mentor, শেখার উপকরণ, ইসলামিক জ্ঞান আর
                            মানবতার কাজ, সব এক জায়গায়।
                        </p>

                        <p className="mt-3 text-[10px] font-medium tracking-[0.17em] text-violet-200/70">
                            {TAGLINE}
                        </p>

                        {/* Social icons */}
                        <div className="mt-4 flex items-center gap-2">
                            {SOCIAL_LINKS.map((social) => (
                                <SocialButton
                                    key={social.label}
                                    social={social}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Navigation with watermark */}
                    <nav
                        aria-label="Footer"
                        className="relative isolate grid grid-cols-2 gap-x-5 gap-y-7 overflow-hidden sm:grid-cols-4 sm:gap-x-4"
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
                        >
                            <span className="select-none whitespace-nowrap text-[clamp(4rem,10vw,9rem)] font-bold tracking-[0.12em] text-white/[0.025]">
                                {BRAND}
                            </span>
                        </div>

                        {COLUMNS.map((col) => (
                            <div key={col.title} className="relative z-10">
                                <h3 className="text-[12px] font-semibold tracking-wide text-white">
                                    {col.title}
                                </h3>

                                <ul className="mt-3 space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={`${col.title}-${link.label}`}>
                                            <FooterLink link={link} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="mt-7 flex flex-col gap-4 border-t border-white/[0.07] pt-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 text-[11px] leading-5 text-slate-500">
                        <p>
                            © {year} {BRAND}. Built by{" "}
                            <span className="text-slate-300">{AUTHOR}</span>.
                        </p>

                        <p className="text-slate-600">
                            AI can make mistakes. Verify important facts.
                        </p>
                    </div>

                    {/* Informational links — pages not created yet */}
                    <nav
                        aria-label="Legal and information"
                        className="flex flex-wrap items-center gap-x-4 gap-y-2"
                    >
                        {FOOTER_PAGES.map((page) => (
                            <span
                                key={page.label}
                                title="Coming soon"
                                className="inline-flex items-center gap-1.5 text-[11px] text-slate-500"
                            >
                                {page.label}
                                <span className="text-[8px] uppercase tracking-wide text-slate-600">
                                    Soon
                                </span>
                            </span>
                        ))}
                    </nav>

                    <button
                        type="button"
                        onClick={backToTop}
                        aria-label="Back to top"
                        className="group inline-flex h-9 w-fit shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] pl-3.5 pr-2.5 text-xs text-slate-300 transition duration-300 hover:border-violet-300/40 hover:bg-white/[0.07] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
                    >
                        Back to top

                        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-violet-400/20">
                            <ArrowUp size={13} />
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}
