import Link from "next/link";
import { notFound } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronRight,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { bangla, bnSerif, arabic, serif } from "@/lib/deen-fonts";
import StoryActions from "../components/StoryActions";
import TrackStoryVisit from "../components/TrackStoryVisit";
import PageFooter from "../components/PageFooter";
import {
    IslamicPattern,
    OrnamentDivider,
    StarSeal,
    bengaliNumber,
} from "../components/Ornaments";
import {
    STORIES,
    STORY_MAP,
    THEME_MAP,
    formatRef,
    quranHref,
    toBn,
} from "../data/prophets";

export function generateStaticParams() {
    return STORIES.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const story = STORY_MAP[slug];

    if (!story) {
        return { title: "জীবনী পাওয়া যায়নি | DeenIslam" };
    }

    return {
        title: `${story.name} (${story.shortHonorific}) — ইসলামের ইতিহাস | DeenIslam`,
        description: story.summary,
        openGraph: {
            title: `${story.name} (${story.shortHonorific}) — ${story.title}`,
            description: story.summary,
            type: "article",
        },
    };
}

function RefChip({ reference, subtle = false }) {
    return (
        <Link
            href={quranHref(reference)}
            title="কুরআন রিডারে সূরাটি খুলুন"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs sm:text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 ${
                subtle
                    ? "border-[#E7DECC] bg-[#FBF7EC] text-[#7E6737] hover:border-[#C6A15B]/70 hover:bg-[#F5EEDD]"
                    : "border-[#D9CAAE] bg-[#F8F2E4] text-[#7E6737] hover:border-[#B08B45] hover:bg-[#F3EAD5]"
            }`}
        >
            {formatRef(reference)}
            <ArrowUpRight size={11} />
        </Link>
    );
}

function StoryHero({ story }) {
    return (
        <section className="relative isolate overflow-hidden bg-[#062A21] text-white">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_16%,rgba(198,161,91,0.19),transparent_45%),radial-gradient(ellipse_at_5%_90%,rgba(18,125,91,0.28),transparent_52%),linear-gradient(132deg,#05231B_0%,#083326_54%,#0B3D2E_100%)]"
            />
            <IslamicPattern
                stroke="#D8BC79"
                opacity={0.095}
                size={126}
                className="[mask-image:linear-gradient(105deg,black_10%,transparent_80%)]"
            />
            <div
                aria-hidden="true"
                className={`${arabic.className} pointer-events-none absolute -right-8 top-20 hidden text-[14rem] leading-none text-white/[0.03] lg:block`}
            >
                {story.arabicName}
            </div>

            <div className="relative mx-auto max-w-[1180px] px-5 pb-14 pt-8 sm:px-8 sm:pb-16 sm:pt-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <nav
                        aria-label="ব্রেডক্রাম্ব"
                        className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-[#C5D7CC]/70"
                    >
                        <Link
                            href="/deen-islam"
                            className="transition hover:text-[#F0DDA8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                        >
                            DeenIslam
                        </Link>
                        <ChevronRight size={12} aria-hidden="true" />
                        <Link
                            href="/deen-islam/history"
                            className="transition hover:text-[#F0DDA8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                        >
                            ইসলামের ইতিহাস
                        </Link>
                        <ChevronRight size={12} aria-hidden="true" />
                        <span className="text-[#E8D6A4]" aria-current="page">
                            {story.name}
                        </span>
                    </nav>

                    <Link
                        href="/deen-islam/history"
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#D5E4DA]/80 transition hover:border-[#D8BC79]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                    >
                        <ArrowLeft size={13} />
                        সব জীবনী
                    </Link>
                </div>

                <div className="mt-9 grid gap-9 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-end">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D8BC79]/30 bg-[#D8BC79]/10 px-3 py-1.5 text-xs sm:text-sm font-semibold tracking-[0.14em] text-[#F0DDA8]">
                                <Sparkles size={11} />
                                {story.category}
                            </span>
                            {story.themes.map((themeId) => (
                                <span
                                    key={themeId}
                                    className="rounded-full border border-white/[0.12] px-2.5 py-1 text-xs sm:text-sm text-[#D5E4DA]/75"
                                >
                                    {THEME_MAP[themeId]?.label}
                                </span>
                            ))}
                        </div>

                        <h1
                            className={`${bnSerif.className} mt-5 text-[34px] font-bold leading-[1.35] text-[#FFF9E9] sm:text-[46px]`}
                        >
                            {story.name}
                            <span className="ml-2 align-middle text-[18px] font-semibold text-[#E8D6A4] sm:text-[22px]">
                                ({story.shortHonorific})
                            </span>
                        </h1>

                        <p
                            className={`${serif.className} mt-1 text-sm sm:text-base font-medium tracking-[0.18em] text-[#C6A15B] uppercase`}
                        >
                            {story.englishName} · {story.honorific}
                        </p>

                        <h2
                            className={`${bnSerif.className} mt-5 max-w-[720px] text-[20px] font-semibold leading-[1.6] text-[#F4E7C1] sm:text-[24px]`}
                        >
                            {story.title}
                        </h2>

                        <p className="mt-4 max-w-[720px] text-sm sm:text-base leading-[2] text-[#D8E5DD]/82">
                            {story.summary}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/10 pt-5 text-xs sm:text-sm text-[#C1D3C8]/75">
                            <span className="inline-flex items-center gap-1.5">
                                <ShieldCheck
                                    size={13}
                                    className="text-[#D8BC79]"
                                />
                                {toBn(story.refs.length)}টি কুরআনি রেফারেন্স
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Check size={13} className="text-[#D8BC79]" />
                                সীরাত আলাদা চিহ্নিত
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Check size={13} className="text-[#D8BC79]" />
                                কাল্পনিক তারিখ নেই
                            </span>
                        </div>
                    </div>

                    <div className="relative hidden rounded-t-[130px] border border-[#D8BC79]/25 bg-white/[0.04] px-6 pb-6 pt-9 text-center backdrop-blur-sm lg:block">
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-4 top-4 h-[calc(100%-16px)] rounded-t-[115px] border border-[#D8BC79]/10"
                        />
                        <div className="relative">
                            <StarSeal className="mx-auto h-10 w-10 text-[#D8BC79]/80" />
                            <p
                                dir="rtl"
                                lang="ar"
                                className={`${arabic.className} mt-4 text-[52px] leading-none text-[#F0DDA8]`}
                            >
                                {story.arabicName}
                            </p>
                            <p className="mt-3 text-xs sm:text-sm leading-5 text-[#D5E4DA]/75">
                                {story.epithet}
                            </p>
                            <div
                                aria-hidden="true"
                                className="mx-auto my-4 h-px w-16 bg-gradient-to-r from-transparent via-[#D8BC79]/50 to-transparent"
                            />
                            <p className="text-xs sm:text-sm tracking-[0.16em] text-[#C6A15B]">
                                {toBn(story.refs.length)} REF · QURAN
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F8F5EC] via-[#F8F5EC]/45 to-transparent"
            />
        </section>
    );
}

function TocLinks({ story, compact = false }) {
    const links = [
        ...story.sections.map((section, index) => ({
            id: section.id,
            label: section.title,
            number: bengaliNumber(index + 1),
        })),
        { id: "lessons", label: "শিক্ষা ও চিন্তা", number: "✦" },
        { id: "references", label: "কুরআনি রেফারেন্স", number: "✦" },
    ];

    if (compact) {
        return (
            <nav aria-label="এই পাঠের অংশ" className="mb-8 lg:hidden">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#987B3F]">
                    এই পাঠে
                </p>
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            className="shrink-0 rounded-full border border-[#DED3BE] bg-[#FFFDF8] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#63736A] transition hover:border-[#C6A15B]/70 hover:text-[#1B4536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        );
    }

    return (
        <nav
            aria-label="এই পাঠের অংশ"
            className="rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-5"
        >
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#987B3F]">
                এই পাঠে
            </p>
            <ol className="mt-3 space-y-0.5">
                {links.map((link) => (
                    <li key={link.id}>
                        <a
                            href={`#${link.id}`}
                            className="group flex items-start gap-2.5 rounded-lg px-2 py-2 text-xs sm:text-sm leading-5 text-[#63736A] transition hover:bg-[#F7F2E6] hover:text-[#1B4536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                        >
                            <span
                                className={`${serif.className} mt-0.5 w-4 shrink-0 text-xs sm:text-sm font-semibold text-[#B08B45]`}
                            >
                                {link.number}
                            </span>
                            <span>{link.label}</span>
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

function RelatedStories({ story }) {
    const related = story.related
        .map((slug) => STORY_MAP[slug])
        .filter(Boolean);

    return (
        <section className="mt-14 border-t border-[#E4DAC6] pt-10">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#987B3F]">
                        আরও পড়ুন
                    </p>
                    <h2
                        className={`${bnSerif.className} mt-2 text-[24px] font-semibold text-[#173D30]`}
                    >
                        সম্পর্কিত জীবনী
                    </h2>
                </div>
                <Link
                    href="/deen-islam/history"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B5A43] transition hover:gap-2.5 hover:text-[#8A6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    সব জীবনী
                    <ArrowRight size={13} />
                </Link>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {related.map((entry) => (
                    <Link
                        key={entry.slug}
                        href={`/deen-islam/history/${entry.slug}`}
                        className="group rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[#C6A15B]/65 hover:shadow-[0_16px_34px_rgba(25,60,45,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F5EC] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-xs sm:text-sm tracking-wide text-[#A08347]">
                                    {entry.category}
                                </p>
                                <h3
                                    className={`${bnSerif.className} mt-1 text-base sm:text-lg font-semibold text-[#1B4536]`}
                                >
                                    {entry.name} ({entry.shortHonorific})
                                </h3>
                            </div>
                            <span
                                dir="rtl"
                                lang="ar"
                                className={`${arabic.className} text-2xl leading-none text-[#C6A15B]`}
                            >
                                {entry.arabicName}
                            </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs sm:text-sm leading-[1.85] text-[#748279]">
                            {entry.title}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#1B5A43] transition group-hover:gap-2">
                            পড়ুন
                            <ArrowRight size={12} />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

function PrevNext({ story }) {
    const index = STORIES.findIndex((entry) => entry.slug === story.slug);
    const previous = index > 0 ? STORIES[index - 1] : null;
    const next = index >= 0 && index < STORIES.length - 1 ? STORIES[index + 1] : null;

    return (
        <nav
            aria-label="জীবনীর মধ্যে চলাচল"
            className="mt-10 grid gap-3 sm:grid-cols-2"
        >
            {previous ? (
                <Link
                    href={`/deen-islam/history/${previous.slug}`}
                    className="group rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4 text-left transition hover:border-[#C6A15B]/65 hover:shadow-[0_12px_28px_rgba(25,60,45,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#8A928C]">
                        <ArrowLeft size={11} />
                        পূর্ববর্তী জীবনী
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-3">
                        <span
                            className={`${bnSerif.className} text-sm sm:text-base font-semibold text-[#1B4536]`}
                        >
                            {previous.name} ({previous.shortHonorific})
                        </span>
                        <span
                            dir="rtl"
                            lang="ar"
                            className={`${arabic.className} text-xl text-[#C6A15B]`}
                        >
                            {previous.arabicName}
                        </span>
                    </span>
                </Link>
            ) : (
                <Link
                    href="/deen-islam/history"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4 transition hover:border-[#C6A15B]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                >
                    <span>
                        <span className="block text-xs sm:text-sm text-[#8A928C]">
                            শুরু থেকে দেখুন
                        </span>
                        <span
                            className={`${bnSerif.className} mt-1 block text-sm sm:text-base font-semibold text-[#1B4536]`}
                        >
                            সব জীবনী
                        </span>
                    </span>
                    <ArrowRight size={15} className="text-[#A08347]" />
                </Link>
            )}

            {next ? (
                <Link
                    href={`/deen-islam/history/${next.slug}`}
                    className="group rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4 text-right transition hover:border-[#C6A15B]/65 hover:shadow-[0_12px_28px_rgba(25,60,45,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 sm:col-start-2"
                >
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#8A928C]">
                        পরবর্তী জীবনী
                        <ArrowRight size={11} />
                    </span>
                    <span className="mt-1.5 flex items-center justify-between gap-3">
                        <span
                            dir="rtl"
                            lang="ar"
                            className={`${arabic.className} text-xl text-[#C6A15B]`}
                        >
                            {next.arabicName}
                        </span>
                        <span
                            className={`${bnSerif.className} text-sm sm:text-base font-semibold text-[#1B4536]`}
                        >
                            {next.name} ({next.shortHonorific})
                        </span>
                    </span>
                </Link>
            ) : (
                <Link
                    href="/deen-islam/history"
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4 transition hover:border-[#C6A15B]/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60 sm:col-start-2"
                >
                    <span>
                        <span className="block text-xs sm:text-sm text-[#8A928C]">
                            সংগ্রহে ফিরে যান
                        </span>
                        <span
                            className={`${bnSerif.className} mt-1 block text-sm sm:text-base font-semibold text-[#1B4536]`}
                        >
                            সব জীবনী
                        </span>
                    </span>
                    <ArrowRight size={15} className="text-[#A08347]" />
                </Link>
            )}
        </nav>
    );
}

export default async function StoryPage({ params }) {
    const { slug } = await params;
    const story = STORY_MAP[slug];

    if (!story) {
        notFound();
    }

    return (
        <main
            lang="bn"
            className={`${bangla.className} -mx-12 min-h-screen bg-[#F8F5EC] text-[#173D30]`}
        >
            <style>{`
                @media (prefers-reduced-motion: no-preference) {
                    html { scroll-behavior: smooth; }
                }
            `}</style>

            <TrackStoryVisit slug={story.slug} />
            <StoryHero story={story} />

            <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
                    <article className="min-w-0">
                        <TocLinks story={story} compact />

                        <div className="rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-5 sm:p-6">
                            <div className="flex gap-3.5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D9CAAE] bg-[#F7F2E6] text-[#1B5A43]">
                                    <ShieldCheck size={16} />
                                </span>
                                <div>
                                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#987B3F]">
                                        পাঠের আগে · সূত্র-নোট
                                    </p>
                                    <p className="mt-2 text-sm sm:text-base leading-[1.95] text-[#67766D]">
                                        {story.sourceNote}
                                    </p>
                                    <p className="mt-2 text-xs sm:text-sm leading-5 text-[#8A928C]">
                                        এটি একটি পাঠ-সারসংক্ষেপ, সম্পূর্ণ
                                        তাফসির বা ফতোয়া নয়। বিস্তারিত জানতে
                                        সংশ্লিষ্ট সূরা ও নির্ভরযোগ্য তাফসির
                                        দেখুন।
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-10">
                            {story.sections.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="scroll-mt-28 border-t border-[#E4DAC6] pt-10 first:border-t-0 first:pt-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`${serif.className} text-sm sm:text-base font-semibold text-[#B08B45]`}
                                        >
                                            {bengaliNumber(index + 1).padStart(
                                                2,
                                                "০"
                                            )}
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="h-px flex-1 bg-gradient-to-r from-[#C6A15B]/45 to-transparent"
                                        />
                                        <span className="text-[11px] sm:text-xs font-medium tracking-[0.16em] text-[#A89B80]">
                                            পাঠের অংশ
                                        </span>
                                    </div>

                                    <h2
                                        className={`${bnSerif.className} mt-3 text-[22px] font-semibold leading-[1.55] text-[#173D30] sm:text-[26px]`}
                                    >
                                        {section.title}
                                    </h2>

                                    <div className="mt-4 space-y-4">
                                        {section.body.map((paragraph) => (
                                            <p
                                                key={paragraph.slice(0, 40)}
                                                className="text-sm sm:text-base leading-[2.05] text-[#45574D]"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>

                                    {section.refs?.length > 0 && (
                                        <div className="mt-5 flex flex-wrap items-center gap-2">
                                            <span className="text-xs sm:text-sm font-medium text-[#8A928C]">
                                                রেফারেন্স:
                                            </span>
                                            {section.refs.map((reference) => (
                                                <RefChip
                                                    key={`${reference.s}-${reference.from}-${reference.to ?? ""}`}
                                                    reference={reference}
                                                    subtle
                                                />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>

                        <section
                            id="lessons"
                            className="scroll-mt-28 mt-12 border-t border-[#E4DAC6] pt-10"
                        >
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#987B3F]">
                                শিক্ষা ও চিন্তা
                            </p>
                            <h2
                                className={`${bnSerif.className} mt-2 text-[24px] font-semibold text-[#173D30] sm:text-[28px]`}
                            >
                                এই জীবনী থেকে যা শেখা যায়
                            </h2>

                            <OrnamentDivider className="my-6 justify-start" />

                            <div className="grid gap-3 sm:grid-cols-2">
                                {story.lessons.map((lesson, index) => (
                                    <article
                                        key={lesson.title}
                                        className="rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-5"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span
                                                className={`${serif.className} text-lg font-semibold text-[#C6A15B]/70`}
                                            >
                                                {bengaliNumber(index + 1)}
                                            </span>
                                            <span className="rounded-full border border-[#E3D8C2] bg-[#F7F2E6] px-2.5 py-1 text-[11px] sm:text-xs text-[#8A6B31]">
                                                {THEME_MAP[lesson.theme]?.short}
                                            </span>
                                        </div>
                                        <h3
                                            className={`${bnSerif.className} mt-2 text-base sm:text-lg font-semibold leading-snug text-[#1B4536]`}
                                        >
                                            {lesson.title}
                                        </h3>
                                        <p className="mt-2 text-sm sm:text-base leading-[1.9] text-[#6C7A72]">
                                            {lesson.text}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section
                            id="references"
                            className="scroll-mt-28 mt-12 border-t border-[#E4DAC6] pt-10"
                        >
                            <div className="flex flex-wrap items-end justify-between gap-3">
                                <div>
                                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#987B3F]">
                                        সূত্র
                                    </p>
                                    <h2
                                        className={`${bnSerif.className} mt-2 text-[24px] font-semibold text-[#173D30] sm:text-[28px]`}
                                    >
                                        যাচাইকৃত কুরআনি রেফারেন্স
                                    </h2>
                                </div>
                                <Link
                                    href="/deen-islam/quran"
                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B5A43] transition hover:gap-2.5 hover:text-[#8A6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                                >
                                    কুরআন লাইব্রেরি
                                    <ArrowUpRight size={13} />
                                </Link>
                            </div>

                            <p className="mt-3 text-sm sm:text-base leading-[1.9] text-[#6C7A72]">
                                প্রতিটি রেফারেন্সে সূরার নাম ও আয়াত নম্বর
                                দেওয়া হয়েছে। লিংকটি কুরআন রিডারে সংশ্লিষ্ট
                                সূরাটি খোলে; আয়াতের পাঠ এখানে উদ্ধৃত করা
                                হয়নি।
                            </p>

                            <div className="mt-5 divide-y divide-[#EEE7D7] overflow-hidden rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8]">
                                {story.refs.map((reference, index) => (
                                    <Link
                                        key={`${reference.s}-${reference.from}-${reference.to ?? ""}`}
                                        href={quranHref(reference)}
                                        className="group flex items-start gap-4 px-4 py-4 transition hover:bg-[#F9F4E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C6A15B]/60"
                                    >
                                        <span
                                            className={`${serif.className} mt-0.5 w-6 shrink-0 text-sm sm:text-base font-semibold text-[#C6A15B]`}
                                        >
                                            {toBn(index + 1).padStart(2, "০")}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm sm:text-base font-semibold text-[#1B4536]">
                                                {formatRef(reference)}
                                            </span>
                                            <span className="mt-0.5 block text-xs sm:text-sm leading-5 text-[#7A8780]">
                                                {reference.note}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            size={14}
                                            className="mt-1 shrink-0 text-[#B0A080] transition group-hover:text-[#1B5A43]"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </section>

                        <RelatedStories story={story} />
                        <PrevNext story={story} />
                    </article>

                    <aside className="hidden lg:block">
                        <div className="sticky top-[6.5rem] space-y-4">
                            <TocLinks story={story} />
                            <StoryActions />

                            <div className="rounded-2xl border border-[#E3D8C2] bg-[#F7F2E6] p-4">
                                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#8A6B31]">
                                    সূত্র-নোট
                                </p>
                                <p className="mt-2 text-xs sm:text-sm leading-[1.9] text-[#6C7A72]">
                                    {story.sourceNote}
                                </p>
                                <Link
                                    href="/deen-islam/history#sources"
                                    className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B5A43] transition hover:gap-2 hover:text-[#8A6B31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B]/60"
                                >
                                    সূত্র ও নীতি
                                    <ArrowRight size={12} />
                                </Link>
                            </div>

                            <div className="rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8] p-4">
                                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#987B3F]">
                                    এই পাঠে
                                </p>
                                <p className="mt-2 text-xs sm:text-sm leading-[1.9] text-[#748279]">
                                    {toBn(story.sections.length)}টি মূল অংশ,{" "}
                                    {toBn(story.lessons.length)}টি শিক্ষা এবং{" "}
                                    {toBn(story.refs.length)}টি কুরআনি
                                    রেফারেন্স।
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-[#8A928C]">
                                    <Check size={12} className="text-[#1B5A43]" />
                                    নবী-রাসূলদের কোনো চিত্র নেই
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <PageFooter />
        </main>
    );
}
