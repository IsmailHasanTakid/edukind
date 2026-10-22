import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    BookOpenText,
    Check,
    Droplets,
    Fish,
    Flame,
    GraduationCap,
    HeartHandshake,
    Landmark,
    Leaf,
    ScrollText,
    ShieldCheck,
    Ship,
    Sparkles,
    X,
} from "lucide-react";
import { bangla, bnSerif, serif } from "@/lib/deen-fonts";
import HistoryExplorer from "./components/HistoryExplorer";
import PageFooter from "./components/PageFooter";
import {
    EVENTS,
    STORIES,
    THEME_MAP,
    WISDOM,
    formatRef,
} from "./data/prophets";
import {
    IslamicPattern,
    OrnamentDivider,
    StarSeal,
    bengaliNumber,
} from "./components/Ornaments";

export const metadata = {
    title: "নবী-রাসূলদের ইতিহাস | DeenIslam",
    description:
        "আদম থেকে মুহাম্মদ (সা.) পর্যন্ত নির্বাচিত নবী-রাসূলদের কুরআন-ভিত্তিক জীবনী, ঘটনা, শিক্ষা ও যাচাইকৃত সূত্রের সংগ্রহ।",
};

const EVENT_ICONS = {
    "first-revelation": BookOpenText,
    "fire-saved": Flame,
    kaaba: Landmark,
    ark: Ship,
    sea: Droplets,
    fish: Fish,
    reunion: HeartHandshake,
    ants: Leaf,
};

const SOURCE_PRINCIPLES = [
    {
        title: "কুরআনই মূল ভিত্তি",
        text: "প্রতিটি জীবনীর মূল কাঠামো কুরআনের বর্ণনার ওপর দাঁড়ানো। সূরা ও আয়াত নম্বর আল-কুরআন ক্লাউড API-এর সঙ্গে মিলিয়ে যাচাই করা হয়েছে; এখানে আয়াতের পাঠ উদ্ধৃত করা হয়নি, কেবল সঠিক রেফারেন্স দেওয়া হয়েছে।",
    },
    {
        title: "কুরআন বনাম কালপঞ্জি",
        text: "ঘটনাগুলো কুরআনে যেভাবে বর্ণিত হয়েছে, সেই বর্ণনার ক্রমে সাজানো। এটি কোনো সর্বজনস্বীকৃত ঐতিহাসিক কালপঞ্জি নয়। সাল, যুদ্ধের তারিখ বা ভৌগোলিক অবস্থান অনুমান করে বসানো হয়নি।",
    },
    {
        title: "সীরাত আলাদাভাবে চিহ্নিত",
        text: "যেখানে কুরআন বিস্তারিত দেয় না—যেমন প্রথম ওহির গুহার নাম বা মদিনার সনদ—সেখানে তা সীরাত/হাদিসের বর্ণনা হিসেবে চিহ্নিত। কোনো হাদিস উদ্ধৃতি বা হাদিস নম্বর অনুমান থেকে দেওয়া হয়নি।",
    },
];

const NOT_INCLUDED = [
    "কল্পনা করে বানানো তারিখ বা ঘটনার কালপঞ্জি",
    "সূত্র ছাড়া হাদিস উদ্ধৃতি বা নম্বর",
    "নবী-রাসূলদের কোনো দৃশ্যমান চিত্র",
    "বিতর্কিত বিবরণকে সর্বসম্মত সত্য হিসেবে উপস্থাপন",
];

function QuranicEvents() {
    return (
        <section
            id="quranic-events"
            aria-labelledby="quranic-events-title"
            className="relative isolate scroll-mt-24 overflow-hidden bg-[#0A2230] text-white"
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(198,161,91,0.16),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(18,125,91,0.22),transparent_50%),linear-gradient(125deg,#081C27_0%,#0A2230_55%,#0C2B35_100%)]"
            />
            <IslamicPattern
                stroke="#D8BC79"
                opacity={0.075}
                size={140}
                className="[mask-image:linear-gradient(115deg,transparent_0%,black_45%,transparent_100%)]"
            />

            <div className="relative mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-[650px]">
                        <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#D8BC79]">
                            <span className="h-px w-8 bg-[#D8BC79]/60" />
                            কুরআনের ঘটনা
                        </p>
                        <h2
                            id="quranic-events-title"
                            className={`${bnSerif.className} mt-3 text-[28px] font-bold leading-tight text-[#FFF9E9] sm:text-[34px]`}
                        >
                            ঘটনার ভেতরে নিদর্শন
                        </h2>
                        <p className="mt-3 max-w-[560px] text-sm sm:text-base leading-7 text-[#BED0C6]/80">
                            কুরআনে বর্ণিত আটটি পরিচিত দৃশ্য—প্রতিটি ঘটনা
                            সংশ্লিষ্ট জীবনীর নির্দিষ্ট অংশে নিয়ে যায়।
                        </p>
                    </div>

                    <p className="max-w-[310px] rounded-xl border border-[#D8BC79]/20 bg-white/[0.04] px-4 py-3 text-xs sm:text-sm leading-6 text-[#BFD2C7]/70">
                        এই তালিকা পূর্ণ ঘটনাপঞ্জি বা কালানুক্রম নয়—নির্বাচিত
                        ঘটনার পাঠ-সূচি।
                    </p>
                </div>

                <div className="mt-9 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
                    {EVENTS.map((event) => {
                        const Icon = EVENT_ICONS[event.id] ?? Sparkles;

                        return (
                            <Link
                                key={event.id}
                                href={`/deen-islam/history/${event.storySlug}#${event.anchor}`}
                                className="group flex flex-col rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#D8BC79]/35 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A2230] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8BC79]/20 bg-[#D8BC79]/10 text-[#E8D6A4]">
                                        <Icon size={18} />
                                    </span>
                                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] sm:text-xs text-[#C0D2C7]/60">
                                        {formatRef(event.ref)}
                                    </span>
                                </div>

                                <h3
                                    className={`${bnSerif.className} mt-4 text-lg sm:text-xl font-semibold leading-snug text-[#FFF9E9]`}
                                >
                                    {event.title}
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm leading-[1.9] text-[#BFD2C8]/75">
                                    {event.description}
                                </p>
                                <p className="mt-3 border-t border-white/[0.07] pt-3 text-xs sm:text-sm leading-5 text-[#D8BC79]/70">
                                    {event.note}
                                </p>

                                <span className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E8D6A4] transition group-hover:gap-2.5">
                                    জীবনীতে দেখুন
                                    <ArrowRight size={13} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function WisdomSection() {
    return (
        <section
            id="lessons"
            aria-labelledby="lessons-title"
            className="scroll-mt-24 bg-[#F8F5EC]"
        >
            <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
                <div className="mx-auto max-w-[700px] text-center">
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#987B3F]">
                        শিক্ষা ও চিন্তা
                    </p>
                    <h2
                        id="lessons-title"
                        className={`${bnSerif.className} mt-3 text-[28px] font-bold leading-tight text-[#163D2F] sm:text-[34px]`}
                    >
                        ইতিহাস থেকে জীবনের পাঠ
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-7 text-[#6C7A72]">
                        ঘটনা মুখস্থ করার জন্য নয়; কুরআন নবী-রাসূলদের
                        অভিজ্ঞতার মধ্য দিয়ে ঈমান, ধৈর্য ও দায়িত্বের পাঠ
                        দেয়।
                    </p>
                </div>

                <OrnamentDivider className="my-7" />

                <div className="grid gap-4 sm:grid-cols-2">
                    {WISDOM.map((item, index) => {
                        const story = STORIES.find(
                            (entry) => entry.slug === item.storySlug
                        );
                        const theme = THEME_MAP[item.theme];

                        return (
                            <article
                                key={item.title}
                                className="group relative overflow-hidden rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-6 transition duration-300 hover:border-[#C6A15B]/65 hover:shadow-[0_18px_40px_rgba(25,60,45,0.08)]"
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${serif.className} absolute right-5 top-3 text-5xl font-semibold text-[#C6A15B]/20`}
                                >
                                    {bengaliNumber(index + 1)}
                                </span>

                                <span className="inline-flex rounded-full border border-[#E3D8C2] bg-[#F7F2E6] px-2.5 py-1 text-xs sm:text-sm font-medium text-[#8A6B31]">
                                    {theme?.label}
                                </span>
                                <h3
                                    className={`${bnSerif.className} mt-4 text-[19px] font-semibold leading-snug text-[#1B4536]`}
                                >
                                    {item.title}
                                </h3>
                                <p className="mt-2.5 text-sm sm:text-base leading-[1.95] text-[#68776E]">
                                    {item.text}
                                </p>
                                <Link
                                    href={`/deen-islam/history/${story?.slug ?? item.storySlug}`}
                                    className="mt-4 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B5A43] transition hover:gap-2.5 hover:text-[#8A6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                                >
                                    {story?.name ?? "জীবনী"} (
                                    {story?.shortHonorific ?? "আ."})-এর ঘটনায়
                                    <ArrowRight size={13} />
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function SourcesSection() {
    return (
        <section
            id="sources"
            aria-labelledby="sources-title"
            className="scroll-mt-24 bg-[#F8F5EC]"
        >
            <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 sm:pb-20">
                <div className="grid overflow-hidden rounded-[26px] border border-[#DCD1BC] shadow-[0_20px_60px_rgba(25,60,45,0.09)] lg:grid-cols-[0.86fr_1.14fr]">
                    <div className="relative isolate overflow-hidden bg-[#0A3528] p-7 text-white sm:p-9">
                        <IslamicPattern
                            stroke="#D8BC79"
                            opacity={0.09}
                            size={112}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#1B8B63]/20 blur-3xl"
                        />

                        <div className="relative">
                            <StarSeal className="h-11 w-11 text-[#D8BC79]/80" />
                            <p className="mt-5 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#D8BC79]">
                                জ্ঞানের আমানত
                            </p>
                            <h2
                                id="sources-title"
                                className={`${bnSerif.className} mt-3 text-[26px] font-semibold leading-tight text-[#FFF9E9] sm:text-[30px]`}
                            >
                                সূত্র ও নির্ভরযোগ্যতার নীতি
                            </h2>
                            <p className="mt-3 text-sm sm:text-base leading-[1.95] text-[#C8D9CE]/80">
                                ইসলামিক ইতিহাসে নির্ভুলতা গুরুত্বপূর্ণ। এই
                                পাতায় কুরআনের বর্ণনা, কুরআনের বাইরের
                                সীরাত-বিবরণ এবং আমাদের নিজের ব্যাখ্যা—তিন
                                স্তরকে আলাদা রাখার চেষ্টা করা হয়েছে।
                            </p>

                            <Link
                                href="/deen-islam/quran"
                                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D8BC79]/35 bg-[#D8BC79]/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#F0DDA8] transition hover:bg-[#D8BC79]/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/70"
                            >
                                কুরআনে যাচাই করুন
                                <ArrowUpRight size={14} />
                            </Link>

                            <p className="mt-5 border-t border-white/10 pt-4 text-xs sm:text-sm leading-5 text-[#BFD3C7]/55">
                                রেফারেন্স যাচাইয়ের ভিত্তি: আল-কুরআন ক্লাউড
                                API-এর সূরা ও আয়াত-তথ্য, সঙ্গে সহিহ
                                ইন্টারন্যাশনাল অনুবাদের ক্রস-চেক। কোনো
                                আয়াতের পাঠ এখানে উদ্ধৃত করা হয় না।
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#FFFDF8] p-7 sm:p-9">
                        <ul className="space-y-6">
                            {SOURCE_PRINCIPLES.map((principle) => (
                                <li
                                    key={principle.title}
                                    className="flex gap-4"
                                >
                                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D9CDB5] bg-[#F7F2E6] text-[#1B5A43]">
                                        <Check size={14} />
                                    </span>
                                    <div>
                                        <h3
                                            className={`${bnSerif.className} text-base sm:text-lg font-semibold text-[#1B4536]`}
                                        >
                                            {principle.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm sm:text-base leading-[1.95] text-[#6C7A72]">
                                            {principle.text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-7 rounded-2xl border border-[#E8DCC6] bg-[#FBF6EA] p-5">
                            <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#8A6B31]">
                                <ShieldCheck size={13} />
                                এই পাতায় সচেতনভাবে নেই
                            </p>
                            <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                                {NOT_INCLUDED.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-2 text-xs sm:text-sm leading-5 text-[#748279]"
                                    >
                                        <X
                                            size={12}
                                            className="mt-1 shrink-0 text-[#A99263]"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const CONTINUE_LINKS = [
    {
        title: "কুরআন লাইব্রেরি",
        description: "সূরা, আয়াত, অনুবাদ ও তাফসির",
        href: "/deen-islam/quran",
        icon: BookOpen,
    },
    {
        title: "হাদিস লাইব্রেরি",
        description: "সূত্রসহ হাদিস সংগ্রহ",
        href: "/deen-islam/hadith",
        icon: ScrollText,
    },
    {
        title: "লার্নিং একাডেমি",
        description: "কোর্স, লেসন ও অগ্রগতি",
        href: "/deen-islam/learning",
        icon: GraduationCap,
    },
];

function ContinueExploring() {
    return (
        <section className="bg-[#F8F5EC] pb-16 sm:pb-20">
            <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
                <div className="relative isolate overflow-hidden rounded-[26px] bg-[#0B3D2E] px-6 py-9 text-white shadow-[0_24px_60px_rgba(11,61,46,0.22)] sm:px-9 sm:py-10">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_0%,rgba(198,161,91,0.18),transparent_48%),linear-gradient(120deg,#082F24_0%,#0B3D2E_60%,#11503A_100%)]"
                    />
                    <IslamicPattern
                        stroke="#D8BC79"
                        opacity={0.075}
                        size={120}
                    />

                    <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-[420px]">
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-[#D8BC79]">
                                পাঠ চালিয়ে যান
                            </p>
                            <h2
                                className={`${bnSerif.className} mt-3 text-[25px] font-semibold leading-tight text-[#FFF9E9] sm:text-[28px]`}
                            >
                                ইতিহাসের পর আরও গভীরে
                            </h2>
                            <p className="mt-2.5 text-sm sm:text-base leading-6 text-[#C6D8CD]/75">
                                কুরআন, হাদিস ও কাঠামোবদ্ধ পাঠ—আপনার শেখার
                                যাত্রা এখানেই থামে না।
                            </p>
                        </div>

                        <div className="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-[640px]">
                            {CONTINUE_LINKS.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="group rounded-2xl border border-white/[0.1] bg-white/[0.045] p-4 transition hover:border-[#D8BC79]/35 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B3D2E]"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D8BC79]/10 text-[#E8D6A4]">
                                                <Icon size={17} />
                                            </span>
                                            <ArrowUpRight
                                                size={14}
                                                className="text-[#D8BC79]/55 transition group-hover:text-[#F0DDA8]"
                                            />
                                        </div>
                                        <h3 className="mt-3 text-sm sm:text-base font-semibold text-[#FFF9E9]">
                                            {link.title}
                                        </h3>
                                        <p className="mt-1 text-xs sm:text-sm leading-5 text-[#C6D8CD]/60">
                                            {link.description}
                                        </p>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-center">
                    <a
                        href="#explore"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs sm:text-sm font-medium text-[#7D8A82] transition hover:text-[#1B5A43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                    >
                        জীবনী সংগ্রহে ফিরে যান
                        <ArrowUpRight size={13} />
                    </a>
                </div>
            </div>
        </section>
    );
}

export default function HistoryPage() {
    return (
        <main
            lang="bn"
            className={`${bangla.className} -mx-12 min-h-screen overflow-hidden bg-[#F8F5EC] text-[#173D30]`}
        >
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    html { scroll-behavior: smooth; }
                }
            `}</style>

            <HistoryExplorer stories={STORIES} />
            <QuranicEvents />
            <WisdomSection />
            <SourcesSection />
            <ContinueExploring />
            <PageFooter />
        </main>
    );
}
