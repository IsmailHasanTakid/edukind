import Link from "next/link";
import {
    Hind_Siliguri,
    Amiri,
    Cormorant_Garamond,
    Noto_Serif_Bengali,
} from "next/font/google";
import {
    ArrowRight,
    BookOpen,
    BrainCircuit,
    CalendarDays,
    Check,
    GraduationCap,
    Heart,
    Landmark,
    ScrollText,
    Search,
    Sparkles,
} from "lucide-react";

const bangla = Hind_Siliguri({
    subsets: ["bengali", "latin"],
    weight: ["400", "500", "600", "700"],
});
const bnSerif = Noto_Serif_Bengali({
    subsets: ["bengali"],
    weight: ["600", "700"],
});
const arabic = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });
const serif = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["500", "600", "700"],
});

/* ───────── ডেটা ───────── */

const chips = [
    { label: "সূরা আল-ফাতিহা", href: "/deen-islam/quran" },
    { label: "নামাজের নিয়ম", href: "/deen-islam/prayer-times" },
    { label: "হাদিস", href: "/deen-islam/hadith" },
    { label: "ইসলামের ইতিহাস", href: "/deen-islam/history" },
    { label: "দোয়া", href: "/deen-islam/duas" },
    { label: "ফিকহ", href: "/deen-islam/learn" },
];

const quickCards = [
    { title: "কুরআন", desc: "আরবি, অনুবাদ, তাফসির", href: "/deen-islam/quran", icon: BookOpen, color: "from-[#1F8A5B] to-[#13694A]" },
    { title: "হাদিস", desc: "প্রামাণিক সংগ্রহ ও ব্যাখ্যা", href: "/deen-islam/hadith", icon: ScrollText, color: "from-[#DDB04A] to-[#B8862A]" },
    { title: "শিখি ইসলাম", desc: "কোর্স ও লেসন", href: "/deen-islam/learning", icon: GraduationCap, color: "from-[#7C5FD6] to-[#5A3FB0]" },
    { title: "দোয়া ও ইবাদত", desc: "দোয়া, নামাজ, রোজা", href: "/deen-islam/daily#duas", icon: Heart, color: "from-[#17A6A0] to-[#0E7C77]" },
    { title: "AI সহকারী", desc: "প্রশ্ন করুন, জানুন, শিখুন", href: "/deen-islam/learning/assistant", icon: BrainCircuit, color: "from-[#EE5A5F] to-[#C93A40]" },
    { title: "নামাজের সময়", desc: "লোকেশন ভিত্তিক সময়", href: "/deen-islam/daily#prayer-times", icon: CalendarDays, color: "from-[#5B68DB] to-[#3F4BB5]" },
];

const exploreCards = [
    {
        title: "কুরআন লাইব্রেরি",
        desc: "সকল সূরা, আয়াত, অনুবাদ ও তাফসির",
        href: "/deen-islam/quran",
        image: "/deen/quran.jpg",
        fallback: "linear-gradient(135deg,#0F4D34,#2E8B57)",
        card: "bg-[#EEF6F0] border-[#D6E7DB]",
        titleColor: "text-[#1E5A3C]",
        btn: "border-[#BFDCC8] text-[#1E7A4C]",
    },
    {
        title: "হাদিস লাইব্রেরি",
        desc: "সহিহ, সুনান ও অন্যান্য গ্রন্থ",
        href: "/deen-islam/hadith",
        image: "/deen/hadith.jpg",
        fallback: "linear-gradient(135deg,#6B3F12,#C28B3C)",
        card: "bg-[#FBF3E6] border-[#EEDDBF]",
        titleColor: "text-[#7A4A12]",
        btn: "border-[#E8CFA0] text-[#9A5E14]",
    },
    {
        title: "লার্নিং একাডেমি",
        desc: "কোর্স, লেসন, কুইজ ও অগ্রগতি",
        href: "/deen-islam/learning",
        image: "/deen/learning.jpg",
        fallback: "linear-gradient(135deg,#3B2A78,#7B5FD0)",
        card: "bg-[#F1EEFA] border-[#DDD6F2]",
        titleColor: "text-[#4B2F8F]",
        btn: "border-[#D0C6EE] text-[#5B3CA8]",
    },
    {
        title: "AI ইসলামিক সহকারী",
        desc: "প্রশ্ন করুন, রেফারেন্সসহ উত্তর পান",
        href: "/deen-islam/ask-ai",
        image: "/deen/ai.jpg",
        fallback: "linear-gradient(135deg,#0B5C6E,#2AA7BD)",
        card: "bg-[#EAF6F8] border-[#CBE6EC]",
        titleColor: "text-[#0F6B80]",
        btn: "border-[#B5DCE4] text-[#0F7C93]",
    },
    {
        title: "দৈনন্দিন ইসলামিক জীবন",
        desc: "দোয়া, নামাজ, হিজরি ক্যালেন্ডার, গাইড",
        href: "/deen-islam/daily",
        image: "/deen/daily.jpg",
        fallback: "linear-gradient(135deg,#7A3E12,#E08A3C)",
        card: "bg-[#FBF1E8] border-[#F0DCC6]",
        titleColor: "text-[#1E4F4A]",
        btn: "border-[#E9D3B8] text-[#1E4F4A]",
    },
    {
        title: "ইসলামিক ইতিহাস",
        desc: "নবী-রাসূল, সিরাত ও গুরুত্বপূর্ণ ঘটনা",
        href: "/deen-islam/history",
        image: "/deen/history.jpg",
        fallback: "linear-gradient(135deg,#8A5A2B,#D9A66B)",
        card: "bg-[#F1F3F5] border-[#DDE2E7]",
        titleColor: "text-[#1E3F5A]",
        btn: "border-[#CDD5DC] text-[#1E3F5A]",
    },
    {
        title: "নামাজের সময় ও ক্যালেন্ডার",
        desc: "লোকেশন ভিত্তিক সময় ও হিজরি ক্যালেন্ডার",
        href: "/deen-islam/daily#prayer-times",
        icon: CalendarDays,
        fallback: "linear-gradient(135deg,#0B3B2D,#14614A)",
        iconWrap: "border-[#D9C99A]/40 text-[#E8D9A8]",
        card: "bg-[#E9F5EE] border-[#CDE6D6]",
        titleColor: "text-[#13805A]",
        btn: "border-[#B5DBC5] text-[#13805A]",
    },
    {
        title: "ইসলামিক গ্লোসারী",
        desc: "আরবি ও ইসলামিক পরিভাষার অর্থ",
        href: "/deen-islam/glossary",
        image: "/deen/glossary.jpg",
        fallback: "linear-gradient(135deg,#8A6A32,#D9BF8A)",
        card: "bg-[#FAF2E6] border-[#EFE0C4]",
        titleColor: "text-[#6B4A1C]",
        btn: "border-[#E6D3AE] text-[#6B4A1C]",
    },
];

const bannerChecks = ["বিশুদ্ধ উৎস", "সহজ ভাষা", "সব বয়সের জন্য", "AI সহায়তা"];

/* ───────── ছোট কম্পোনেন্ট ───────── */

function Ornament() {
    return (
        <div
            aria-hidden="true"
            className="flex items-center justify-center gap-3 py-8 text-[#B58A3C]"
        >
            <span className="h-px w-24 bg-gradient-to-r from-transparent to-[#C9A14A]/60" />
            <span className="text-sm">✦</span>
            <span className="h-px w-24 bg-gradient-to-l from-transparent to-[#C9A14A]/60" />
        </div>
    );
}

/* পুরো পেজের ব্যাকগ্রাউন্ড: নরম গ্রেডিয়েন্ট + আলোর আভা + ইসলামিক জ্যামিতিক নকশা */
function PageBackground() {
    const pattern =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Cg fill='none' stroke='%231F6B4C' stroke-opacity='0.07' stroke-width='1'%3E%3Crect x='24' y='24' width='48' height='48'/%3E%3Crect x='24' y='24' width='48' height='48' transform='rotate(45 48 48)'/%3E%3Ccircle cx='48' cy='48' r='5'/%3E%3C/g%3E%3C/svg%3E\")";

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#F7FAF8_0%,#EDF5EF_40%,#F8F3E6_75%,#F3F7F3_100%)]" />

            {/* আলোর আভা */}
            <div className="absolute -right-48 top-[520px] h-[560px] w-[560px] rounded-full bg-[#E8C872]/25 blur-[130px]" />
            <div className="absolute -left-48 top-[980px] h-[560px] w-[560px] rounded-full bg-[#1F8A5B]/[0.12] blur-[130px]" />
            <div className="absolute right-[10%] top-[1500px] h-[420px] w-[420px] rounded-full bg-[#7C5FD6]/[0.07] blur-[120px]" />

            {/* জ্যামিতিক নকশা */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: pattern,
                    WebkitMaskImage:
                        "linear-gradient(180deg, transparent 0%, black 25%, black 85%, transparent 100%)",
                    maskImage:
                        "linear-gradient(180deg, transparent 0%, black 25%, black 85%, transparent 100%)",
                }}
            />
        </div>
    );
}

/* ───────── পেজ ───────── */

export default function DeenIslamPage() {
    return (
        <main
            className={`${bangla.className} relative isolate min-h-screen overflow-hidden text-[#1B3A2F]`}
        >
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: none; }
                }
                .fade-up { animation: fadeUp .7s cubic-bezier(.22,1,.36,1) both; }
                @media (prefers-reduced-motion: reduce) {
                    .fade-up { animation: none; }
                }
            `}</style>

            <PageBackground />

            {/* ───────── Hero ───────── */}
            <section className="relative isolate overflow-hidden">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-30 bg-cover bg-right"
                    style={{
                        backgroundImage:
                            "url(/deen/hero.jpg), linear-gradient(120deg,#0B3B2D 0%,#14503C 50%,#B98A3E 140%)",
                    }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-20 bg-gradient-to-r from-[#0B3B2D]/95 via-[#0B3B2D]/75 to-[#0B3B2D]/10"
                />
                {/* জ্যামিতিক নকশা */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 opacity-[0.09]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cg fill='none' stroke='%23E8C872' stroke-width='1'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='20' y='20' width='40' height='40' transform='rotate(45 40 40)'/%3E%3C/g%3E%3C/svg%3E\")",
                        WebkitMaskImage:
                            "linear-gradient(90deg, black 20%, transparent 75%)",
                        maskImage:
                            "linear-gradient(90deg, black 20%, transparent 75%)",
                    }}
                />
                {/* নিচে পেজের সঙ্গে মিলিয়ে যাওয়ার আভা */}
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-[#F7FAF8]/30 to-transparent"
                />

                <div className="mx-auto grid max-w-[1280px] gap-8 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:pb-28 lg:pt-12">
                    <div className="max-w-[640px]">
                        <div className="fade-up flex items-center gap-3">
                            <Landmark
                                className="h-11 w-11 text-[#E3C06B]"
                                strokeWidth={1.4}
                            />
                            <div>
                                <p
                                    className={`${serif.className} text-4xl font-semibold leading-none text-[#E8C872]`}
                                >
                                    Deen<span className="text-[#F6E7B5]">Islam</span>
                                </p>
                                <p className="mt-1 text-[11px] text-[#D5E2DA]">
                                    Islamic Knowledge &amp; Learning Platform
                                </p>
                            </div>
                        </div>

                        <h1
                            className={`${bnSerif.className} fade-up mt-8 text-4xl font-bold leading-[1.4] text-white sm:text-5xl`}
                            style={{ animationDelay: "100ms" }}
                        >
                            আল্লাহর পথে শেখা,
                            <br />
                            জীবনকে করা{" "}
                            <span className="bg-gradient-to-r from-[#F6E3A1] via-[#E8C872] to-[#C9993A] bg-clip-text text-transparent">
                                সুন্দর
                            </span>
                        </h1>

                        <p
                            className="fade-up mt-4 max-w-md text-sm leading-7 text-[#E3ECE6] sm:text-base"
                            style={{ animationDelay: "200ms" }}
                        >
                            কুরআন, হাদিস, ইসলামিক জ্ঞান, দৈনন্দিন আমল এবং AI সহায়তায়
                            আপনার ইসলাম শেখার সম্পূর্ণ প্ল্যাটফর্ম।
                        </p>

                        <form
                            action="/deen-islam/quran/search"
                            className="fade-up mt-7 flex w-full max-w-[560px] items-center rounded-full bg-white p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.28)] ring-1 ring-[#E8C872]/30"
                            style={{ animationDelay: "300ms" }}
                        >
                            <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
                            <input
                                name="q"
                                type="search"
                                placeholder="কুরআন, হাদিস, বিষয় বা প্রশ্ন খুঁজুন..."
                                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                aria-label="সার্চ করুন"
                                className="flex h-11 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16B072] to-[#0D8453] text-white transition hover:brightness-110"
                            >
                                <ArrowRight size={19} />
                            </button>
                        </form>

                        <div
                            className="fade-up mt-5 flex flex-wrap gap-2.5"
                            style={{ animationDelay: "400ms" }}
                        >
                            {chips.map((chip) => (
                                <Link
                                    key={chip.label}
                                    href={chip.href}
                                    className="rounded-full border border-white/20 bg-white/90 px-4 py-1.5 text-xs font-medium text-[#1B3A2F] transition hover:-translate-y-0.5 hover:bg-white"
                                >
                                    {chip.label}
                                </Link>
                            ))}
                        </div>
                    </div>


                    <div
                        className="fade-up hidden self-start  p-7 text-center   lg:block"
                        style={{ animationDelay: "350ms" }}
                    >
                        <div className="mx-auto my-4 h-px w-16 bg-gradient-to-r from-transparent via-[#E8C872]/70 to-transparent" />
                        <p
                            dir="rtl"
                            lang="ar"
                            className={`${arabic.className} text-4xl leading-[1.9] text-[#F6E3A1]`}
                        >
                            إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ
                        </p>
                        <p className="mt-3 text-sm text-white/90">
                            &ldquo;নিশ্চয়ই মুমিনগণ পরস্পর ভাই ভাই।&rdquo;
                        </p>
                        <p className="mt-1 text-xs text-[#C9D8CF]">
                            (সূরা হুজুরাত, ১০)
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[1280px] px-5 pb-8 sm:px-8">
                {/* ───────── Quick cards (hero-র ওপর ভাসমান) ───────── */}
                <section className="relative z-10 -mt-12 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
                    {quickCards.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="fade-up group flex min-h-[150px] flex-col rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_8px_30px_rgba(20,60,45,0.10)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(20,60,45,0.18)]"
                                style={{ animationDelay: `${450 + index * 70}ms` }}
                            >
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-black/10 ${item.color}`}
                                >
                                    <Icon size={24} strokeWidth={1.7} />
                                </div>
                                <p className="mt-4 text-[15px] font-semibold text-[#1B3A2F]">
                                    {item.title}
                                </p>
                                <p className="mt-1 flex-1 text-xs leading-5 text-[#7C8A82]">
                                    {item.desc}
                                </p>
                                <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#DCE4DF] text-[#4A5A52] transition group-hover:border-transparent group-hover:bg-[#119A62] group-hover:text-white">
                                    <ArrowRight size={14} />
                                </span>
                            </Link>
                        );
                    })}
                </section>

                <Ornament />

                {/* ───────── Explore DeenIslam ───────── */}
                <section>
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="h-6 w-6 text-[#119A62]" />
                                <h2
                                    className={`${serif.className} text-3xl font-semibold text-[#183B30]`}
                                >
                                    Explore DeenIslam
                                </h2>
                            </div>
                            <p className="mt-1 text-sm text-[#6F7F76]">
                                আপনার ইসলামিক শিক্ষার যাত্রা এখান থেকেই শুরু হোক
                            </p>
                        </div>
                        <Link
                            href="/deen-islam/topics"
                            className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#1F6B4C] transition hover:gap-2.5"
                        >
                            সব বিভাগ দেখুন <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {exploreCards.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`fade-up group overflow-hidden rounded-2xl border shadow-[0_4px_18px_rgba(20,60,45,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(20,60,45,0.18)] hover:ring-1 hover:ring-[#C9A14A]/40 ${item.card}`}
                                    style={{ animationDelay: `${index * 70}ms` }}
                                >
                                    <div className="relative flex h-[130px] items-center justify-center overflow-hidden">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                                            style={{
                                                backgroundImage: item.image
                                                    ? `url(${item.image}), ${item.fallback}`
                                                    : item.fallback,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                                        {Icon && (
                                            <div
                                                className={`relative flex h-16 w-16 items-center justify-center rounded-full border-2 backdrop-blur-sm ${item.iconWrap}`}
                                            >
                                                <Icon size={30} strokeWidth={1.5} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3
                                            className={`text-[17px] font-semibold ${item.titleColor}`}
                                        >
                                            {item.title}
                                        </h3>
                                        <p className="mt-1.5 min-h-[40px] text-[13px] leading-5 text-[#6F7F76]">
                                            {item.desc}
                                        </p>
                                        <span
                                            className={`mt-3 inline-flex items-center gap-1.5 rounded-full border bg-white px-3.5 py-1.5 text-xs font-medium transition-all group-hover:gap-2.5 ${item.btn}`}
                                        >
                                            বিস্তারিত দেখুন <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <Ornament />

                {/* ───────── CTA banner ───────── */}
                <section
                    className="relative overflow-hidden rounded-2xl shadow-[0_24px_60px_rgba(11,59,45,0.25)] ring-1 ring-[#E8C872]/30"
                    style={{
                        backgroundImage:
                            "url(/deen/banner.jpg), linear-gradient(110deg,#0B3B2D,#0F4D3A 60%,#14614A)",
                        backgroundSize: "cover",
                        backgroundPosition: "left center",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B3B2D]/90 to-[#0B3B2D]" />

                    <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between lg:pl-[28%]">
                        <div className="max-w-xl">
                            <p className="flex items-center gap-2 text-[11px] text-[#E8C872]">
                                <Landmark size={14} /> শুরু করুন এখনই
                            </p>
                            <h2
                                className={`${bnSerif.className} mt-2 text-2xl font-semibold leading-snug text-white sm:text-[26px]`}
                            >
                                আপনার ইসলামিক জ্ঞানকে আরও গভীর করুন
                            </h2>
                            <p className="mt-1.5 text-sm text-[#D5E2DA]">
                                যেকোনো প্রশ্ন করুন, শিখুন, অনুশীলন করুন — সবকিছু এক
                                জায়গায়।
                            </p>
                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                                {bannerChecks.map((text) => (
                                    <span
                                        key={text}
                                        className="flex items-center gap-1.5 text-xs text-[#E3ECE6]"
                                    >
                                        <Check size={14} className="text-[#4CD08E]" />
                                        {text}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/deen-islam/learning"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#16B072] to-[#0D8453] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-110"
                        >
                            এখনই শুরু করুন <ArrowRight size={17} />
                        </Link>
                    </div>
                </section>
            </div>

            {/* ───────── Footer strip (তোমার সাইটে আলাদা footer থাকলে এটা বাদ দাও) ───────── */}
            <footer className="border-t border-[#E3EAE5] bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-5 py-4 text-xs text-[#6F7F76] sm:flex-row sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold tracking-wide text-[#1B3A2F]">
                            EDUKIND
                        </span>
                        <span className="h-4 w-px bg-[#D8E0DB]" />
                        <span
                            className={`${serif.className} text-lg font-semibold text-[#1F6B4C]`}
                        >
                            DeenIslam
                        </span>
                    </div>
                    <p>Better Learning • A Brighter Future</p>
                    <p className="flex items-center gap-2">
                        ইসলাম জানুন | নিজেকে গড়ুন | সমাজকে গড়ুন
                        <Heart size={14} className="text-[#6F7F76]" />
                    </p>
                </div>
            </footer>
        </main>
    );
}