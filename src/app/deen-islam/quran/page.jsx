import Link from "next/link";
import QuranSearchFocus from "@/components/deen/QuranSearchFocus";
import {
    ArrowDown,
    BookOpen,
    Bookmark,
    ChevronRight,
    Compass,
    Sparkles,
} from "lucide-react";
import { getSurahList } from "@/lib/quran";
import { bangla, bnSerif, arabic } from "@/lib/deen-fonts";
import SurahBrowser from "@/components/deen/SurahBrowser";

export const metadata = {
    title: "কুরআন লাইব্রেরি | DeenIslam",
    description: "আরবি ও বাংলা অনুবাদসহ সকল সূরা পড়ুন।",
};

const bn = (n) => Number(n).toLocaleString("bn-BD");

export default async function QuranLibraryPage() {
    const surahs = await getSurahList();
    const totalAyahs = surahs.reduce(
        (sum, surah) => sum + surah.numberOfAyahs,
        0
    );

    return (
        <main
            className={`${bangla.className} min-h-screen bg-[#F8F6EF] text-[#173B2D]`}
        >
            <QuranSearchFocus />
            {/* Islamic luxury hero */}
            <section className="relative isolate overflow-hidden bg-[#092F25]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(ellipse at 12% 15%, rgba(39,111,77,.35), transparent 42%), linear-gradient(120deg,#08291F 0%,#0B392A 58%,#104633 100%)",
                    }}
                />

                {/* Subtle Islamic geometry */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full border border-[#D6B66C]/10"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-12 top-32 -z-10 h-56 w-56 rotate-45 border border-[#D6B66C]/10"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-1/2 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Cg fill='none' stroke='%23D9C18A' stroke-width='.7'%3E%3Cpath d='M36 0 72 36 36 72 0 36Z M36 12 60 36 36 60 12 36Z M0 0 72 72 M72 0 0 72'/%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                />

                <div className="mx-auto max-w-[1440px] px-5 pb-5 pt-4 sm:px-8 sm:pb-6 sm:pt-5 lg:px-12 lg:pb-7 lg:pt-6">
                    {/* Breadcrumb */}
                    <nav
                        aria-label="breadcrumb"
                        className="flex items-center gap-2 text-xs text-emerald-50/65 sm:text-sm"
                    >
                        <Link
                            href="/deen-islam"
                            className="transition-colors hover:text-[#E5CC91]"
                        >
                            DeenIslam
                        </Link>
                        <ChevronRight size={14} aria-hidden="true" />
                        <span className="text-[#E5CC91]">
                            আল-কুরআন লাইব্রেরি
                        </span>
                    </nav>

                    {/* Split hero */}
                    <div className="grid items-center gap-5 pt-5 sm:gap-6 sm:pt-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:pt-7">
                        {/* Left content */}
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-[#D9BC79] sm:text-sm">
                                <Sparkles
                                    size={15}
                                    strokeWidth={1.5}
                                    aria-hidden="true"
                                />
                                আল্লাহর কালাম
                            </div>

                            <h1
                                className={`${bnSerif.className} mt-3 text-3xl font-bold leading-[1.3] tracking-tight text-[#FFF9E9] sm:text-4xl lg:text-5xl`}
                            >
                                আল-কুরআন
                                <span className="block text-[#E5CC91]">
                                    লাইব্রেরি
                                </span>
                            </h1>

                            <p className="mt-4 text-base leading-8 text-emerald-50/85 sm:text-lg">
                                আরবি ও বাংলা অনুবাদসহ সকল সূরা পড়ুন
                            </p>

                            <div className="mt-6 h-px w-20 bg-gradient-to-r from-[#D9BC79] to-transparent" />

                            <p className="mt-6 max-w-lg text-sm leading-7 text-emerald-50/65 sm:text-base sm:leading-8">
                                পবিত্র কুরআনের প্রতিটি সূরায় খুঁজে নিন
                                হিদায়াত, জ্ঞান ও আত্মিক প্রশান্তি। আপনার
                                পছন্দের সূরা নির্বাচন করে শুরু করুন
                                কুরআনের সঙ্গে প্রতিদিনের পথচলা।
                            </p>

                            <a
                                href="#surah-library"
                                className="group mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#E3CA8D] px-5 py-3 text-sm font-semibold text-[#123B2B] transition duration-300 hover:-translate-y-0.5 hover:bg-[#F0DDAA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E3CA8D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#092F25]"
                            >
                                <BookOpen
                                    size={17}
                                    aria-hidden="true"
                                />
                                সূরা পড়তে শুরু করুন
                                <ArrowDown
                                    size={15}
                                    className="transition-transform group-hover:translate-y-0.5"
                                    aria-hidden="true"
                                />
                            </a>

                            {/* Statistics */}
                            <div className="mt-6 grid max-w-lg grid-cols-3 border-t border-[#E3CA8D]/20 pt-4 sm:mt-7 sm:pt-4">
                                {[
                                    {
                                        value: bn(surahs.length),
                                        label: "সূরা",
                                        icon: BookOpen,
                                    },
                                    {
                                        value: bn(totalAyahs),
                                        label: "আয়াত",
                                        icon: Compass,
                                    },
                                    {
                                        value: bn(30),
                                        label: "পারা",
                                        icon: Bookmark,
                                    },
                                ].map(({ value, label, icon: Icon }, index) => (
                                    <div
                                        key={label}
                                        className={`px-2 sm:px-4 ${index !== 0
                                            ? "border-l border-[#E3CA8D]/20"
                                            : "pl-0"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 text-[#D9BC79]">
                                            <Icon
                                                size={16}
                                                strokeWidth={1.5}
                                                aria-hidden="true"
                                            />
                                            <span className="text-[11px] text-emerald-50/65 sm:text-xs">
                                                {label}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-2xl font-semibold tracking-tight text-[#FFF9E9] sm:text-3xl">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right visual composition */}
                        <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
                            <div className="absolute inset-10 rounded-full bg-[#D5B46B]/10 blur-[70px]" />

                            <div className="relative overflow-hidden rounded-t-[48%] rounded-b-[1.5rem] border border-[#D9BC79]/30 bg-gradient-to-b from-[#D6C29A]/15 via-[#F0E4C8]/[0.06] to-transparent p-3 sm:rounded-t-[50%] sm:p-5">
                                <div className="relative flex min-h-[210px] flex-col items-center justify-center overflow-hidden rounded-t-[48%] rounded-b-[1.1rem] border border-[#D9BC79]/15 bg-[#0D392B]/75 px-4 py-5 sm:min-h-[250px] sm:py-6 lg:min-h-[290px]">
                                    {/* Fine concentric arches */}
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-x-[9%] top-[8%] bottom-[8%] rounded-t-[50%] rounded-b-2xl border border-[#D9BC79]/20"
                                    />
                                    <div
                                        aria-hidden="true"
                                        className="absolute inset-x-[16%] top-[14%] bottom-[8%] rounded-t-[50%] rounded-b-xl border border-[#D9BC79]/10"
                                    />

                                    <div className="relative z-10 flex h-12 w-12 rotate-45 items-center justify-center border border-[#D9BC79]/60 bg-[#D9BC79]/[0.06]">
                                        <span className="-rotate-45 text-2xl text-[#E6CE96]">
                                            ۞
                                        </span>
                                    </div>

                                    <p
                                        lang="ar"
                                        dir="rtl"
                                        className={`${arabic.className} relative z-10 mt-7 text-center text-4xl leading-relaxed text-[#F1DEB1] sm:text-5xl`}
                                    >
                                        الْقُرْآنُ الْكَرِيمُ
                                    </p>

                                    <div className="relative z-10 my-6 h-px w-20 bg-gradient-to-r from-transparent via-[#D9BC79]/70 to-transparent" />

                                    <p
                                        className={`${bnSerif.className} relative z-10 text-center text-lg text-[#FFF8E7] sm:text-xl`}
                                    >
                                        নূরের পথে, হিদায়াতের ছায়ায়
                                    </p>

                                    <p className="relative z-10 mt-3 max-w-xs text-center text-xs leading-6 text-emerald-50/60 sm:text-sm">
                                        পাঠ করুন · অনুধাবন করুন · জীবনে ধারণ করুন
                                    </p>

                                    {/* Decorative base */}
                                    <div
                                        aria-hidden="true"
                                        className="relative z-10 mt-9 h-px w-full bg-gradient-to-r from-transparent via-[#D9BC79]/45 to-transparent"
                                    />
                                    <div className="relative z-10 mt-4 flex items-center gap-3 text-[10px] tracking-[0.24em] text-[#D9BC79]/80 sm:text-xs">
                                        <span>AL-QURAN</span>
                                        <span className="h-1 w-1 rounded-full bg-[#D9BC79]" />
                                        <span>DIVINE GUIDANCE</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mx-auto mt-4 flex max-w-sm items-center justify-center gap-3 text-center text-xs text-emerald-50/55 sm:mt-5 sm:text-sm">
                                <span className="h-px w-8 bg-[#D9BC79]/35" />
                                আল্লাহর বাণীতে হৃদয়ের প্রশান্তি
                                <span className="h-px w-8 bg-[#D9BC79]/35" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#D9BC79]/50 to-transparent" />
            </section>

            {/* Search */}
            <section
                id="surah-library"
                className="mx-auto max-w-[1440px] px-5 pb-16 pt-9 sm:px-8 sm:pb-20 sm:pt-12 lg:px-12"
            >
                <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.18em] text-[#9A7B3C] sm:text-sm">
                            EXPLORE THE QURAN
                        </p>
                        <h2
                            className={`${bnSerif.className} mt-3 text-3xl font-bold tracking-tight text-[#173B2D] sm:text-4xl`}
                        >
                            সূরা সমূহ
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-[#788579] sm:text-base">
                            মক্কী ও মাদানী সকল সূরা এক জায়গায়।
                            আপনার পছন্দের সূরা খুঁজে নিন সহজেই।
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#7D8B7E] sm:text-sm">
                        <span className="h-2 w-2 rounded-full bg-[#54845C]" />
                        {bn(surahs.length)}টি সূরা উপলব্ধ
                    </div>
                </div>

                {/* Existing full-Quran search route */}
                <form
                    action="/deen-islam/quran/search"
                    className="mb-8 grid gap-4 rounded-2xl border border-[#E2D7BA] bg-[#FDFBF5] p-4 sm:p-5 lg:grid-cols-[1fr_auto] lg:items-center"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D8C18B]/50 bg-[#F5EDD9] text-[#8E7135]">
                            <BookOpen size={19} strokeWidth={1.5} aria-hidden="true" />
                        </div>
                        <div>
                            <label
                                htmlFor="quran-search"
                                className="text-sm font-bold text-[#294B37]"
                            >
                                আয়াত খুঁজুন
                            </label>
                            <p className="mt-1 text-xs leading-5 text-[#8A9388]">
                                আরবি, বাংলা বা ইংরেজি শব্দ দিয়ে অনুসন্ধান করুন
                            </p>
                        </div>
                    </div>

                    <div className="flex min-w-0 gap-2">
                        <input
                            id="quran-search"
                            name="q"
                            type="search"
                            maxLength={80}
                            placeholder="যেমন: ধৈর্য"
                            className="min-h-12 min-w-0 flex-1 rounded-xl border border-[#E1E3D8] bg-white px-4 text-sm text-[#244432] outline-none transition placeholder:text-[#A0A79D] focus:border-[#61886B] focus:ring-4 focus:ring-[#61886B]/10 lg:w-72"
                        />
                        <button
                            type="submit"
                            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#14563B] px-5 text-sm font-semibold text-white transition hover:bg-[#0D432F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14563B] focus-visible:ring-offset-2"
                        >
                            খুঁজুন
                            <ChevronRight size={16} aria-hidden="true" />
                        </button>
                    </div>
                </form>

                {/* Existing search, filters and Surah cards */}
                <SurahBrowser surahs={surahs} />

                <div className="mt-12 flex flex-col items-center text-center">
                    <div className="flex items-center gap-3 text-[#B09353]">
                        <span className="h-px w-10 bg-[#D7C69C]" />
                        <span aria-hidden="true">۞</span>
                        <span className="h-px w-10 bg-[#D7C69C]" />
                    </div>
                    <p
                        className={`${bnSerif.className} mt-4 text-sm leading-7 text-[#66796A] sm:text-base`}
                    >
                        কুরআনের আলোয় আলোকিত হোক প্রতিটি দিন
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.2em] text-[#A1A89B]">
                        DEENISLAM · QURAN LIBRARY
                    </p>
                </div>
            </section>
        </main>
    );
}