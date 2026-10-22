import Link from "next/link";
import { notFound } from "next/navigation";
import QuranReadingView from "@/components/deen/learning/QuranReadingView";
import { getSurah, getSurahList, TOTAL_SURAHS } from "@/lib/quran";

function isValidSurah(number) {
    return Number.isInteger(number) && number >= 1 && number <= TOTAL_SURAHS;
}

export async function generateMetadata({ params }) {
    const { surah } = await params;
    const number = Number(surah);

    if (!isValidSurah(number)) {
        return { title: "Read Quran | Quran Learning Academy" };
    }

    try {
        const surahs = await getSurahList();
        const current = surahs.find((item) => item.number === number);

        return {
            title: `${current?.englishName || `Surah ${number}`} | Read Quran | Quran Learning Academy`,
            description: `Read Surah ${
                current?.englishName || number
            } with verified Arabic text, Bengali translation, and recitation audio.`,
        };
    } catch {
        return { title: "Read Quran | Quran Learning Academy" };
    }
}

function QuranLoadError() {
    return (
        <main className="min-h-full bg-[#F5F8F6] px-5 py-14 sm:px-8">
            <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-6 py-8 text-center">
                <h1 className="text-xl font-semibold text-amber-900 sm:text-2xl">
                    This surah could not be loaded
                </h1>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                    The AlQuran Cloud request failed. Check the network
                    connection and try again, or return to the surah list.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <Link
                        href="/deen-islam/learning/quran"
                        className="rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B]"
                    >
                        Back to surah list
                    </Link>
                    <Link
                        href="/deen-islam/learning"
                        className="rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B]"
                    >
                        Academy overview
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default async function LearningSurahPage({ params }) {
    const { surah } = await params;
    const number = Number(surah);

    if (!isValidSurah(number)) notFound();

    let data;
    let surahs;

    try {
        [data, surahs] = await Promise.all([getSurah(number), getSurahList()]);
    } catch (error) {
        console.error("Could not load Quran surah:", error);
        return <QuranLoadError />;
    }

    const prev = surahs.find((item) => item.number === number - 1) || null;
    const next = surahs.find((item) => item.number === number + 1) || null;

    return (
        <QuranReadingView
            info={data.info}
            ayahs={data.ayahs}
            translator={data.translator}
            reciter={data.reciter}
            showBismillah={number !== 1 && number !== 9}
            prev={prev}
            next={next}
        />
    );
}
