import { getDuaById } from "./duas";

function fromDua(id, target, note) {
    const dua = getDuaById(id);

    if (!dua) {
        throw new Error(`Adhkar source dua not found: ${id}`);
    }

    return {
        id: `adhkar-${dua.id}`,
        title: dua.title,
        arabic: dua.arabic,
        transliteration: dua.transliteration,
        meaning: dua.meaning,
        reference: dua.reference,
        sourceUrl: dua.sourceUrl,
        target,
        note,
    };
}

const EXTRA_ADHKAR = {
    "bika-asbahna": {
        id: "bika-asbahna",
        title: "সকালে আল্লাহর কাছে সমর্পণ",
        arabic:
            "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration:
            "আল্লাহুম্মা বিকা আসবাহনা, ওয়া বিকা আমসাইনা, ওয়া বিকা নাহইয়া, ওয়া বিকা নামুতু, ওয়া ইলাইকান নুশুর।",
        meaning:
            "হে আল্লাহ! আপনার অনুগ্রহে আমরা সকালে পৌঁছেছি, আপনার অনুগ্রহে সন্ধ্যায় পৌঁছাই, আপনারই দ্বারা বাঁচি ও মরি এবং আপনারই কাছে প্রত্যাবর্তন।",
        reference: "সুনান আবু দাউদ ৫০৬৮ (সহিহ)",
        sourceUrl: "https://sunnah.com/abudawud:5068",
        target: 1,
    },
    "bika-amsayna": {
        id: "bika-amsayna",
        title: "সন্ধ্যায় আল্লাহর কাছে সমর্পণ",
        arabic:
            "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        transliteration:
            "আল্লাহুম্মা বিকা আমসাইনা, ওয়া বিকা নাহইয়া, ওয়া বিকা নামুতু, ওয়া ইলাইকান নুশুর।",
        meaning:
            "হে আল্লাহ! আপনার অনুগ্রহে আমরা সন্ধ্যায় পৌঁছেছি, আপনারই দ্বারা বাঁচি ও মরি এবং আপনারই কাছে প্রত্যাবর্তন।",
        reference: "সুনান আবু দাউদ ৫০৬৮ (সহিহ)",
        sourceUrl: "https://sunnah.com/abudawud:5068",
        target: 1,
    },
    "bismillah-protection": {
        id: "bismillah-protection",
        title: "ক্ষতি থেকে সুরক্ষার যিকির",
        arabic:
            "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        transliteration:
            "বিসমিল্লাহিল্লাজি লা ইয়াদুররু মাআসমিহি শাইউন ফিল আরদি ওয়া লা ফিস সামাই ওয়া হুয়াস সামিউল আলিম।",
        meaning:
            "আল্লাহর নামে, যাঁর নামের সাথে আসমান ও জমিনের কোনো কিছু ক্ষতি করতে পারে না; তিনি সর্বশ্রোতা, সর্বজ্ঞ।",
        reference: "সুনান আবু দাউদ ৫০৮৮ (সহিহ)",
        sourceUrl: "https://sunnah.com/abudawud:5088",
        target: 3,
        note: "সকালে ও সন্ধ্যায় তিনবার পড়ার কথা হাদিসে এসেছে।",
    },
    "subhanallah-bihamdihi": {
        id: "subhanallah-bihamdihi",
        title: "সুবহানাল্লাহি ওয়া বিহামদিহি",
        arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        transliteration: "সুবহানাল্লাহি ওয়া বিহামদিহি।",
        meaning: "আল্লাহ পবিত্র এবং সমস্ত প্রশংসা তাঁরই।",
        reference: "সহিহ মুসলিম ২৬৯২",
        sourceUrl: "https://sunnah.com/muslim:2692",
        target: 100,
        note: "সকালে ও সন্ধ্যায় একশবার পড়ার ফজিলত বর্ণিত হয়েছে।",
    },
    "astaghfirullah": {
        id: "astaghfirullah",
        title: "ইস্তিগফার",
        arabic: "أَسْتَغْفِرُ اللَّهَ",
        transliteration: "আস্তাগফিরুল্লাহ।",
        meaning: "আমি আল্লাহর কাছে ক্ষমা প্রার্থনা করছি।",
        reference: "সহিহ মুসলিম ২৭০২এ",
        sourceUrl: "https://sunnah.com/muslim:2702a",
        target: 100,
        note: "নবী ﷺ দিনে একশবার ইস্তিগফার করতেন বলে হাদিসে এসেছে।",
    },
    "tahlil-100": {
        id: "tahlil-100",
        title: "তাহলিল",
        arabic:
            "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        transliteration:
            "লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারিকা লাহ, লাহুল মুলকু ওয়া লাহুল হামদু ওয়া হুয়া আলা কুল্লি শাইয়িন কাদির।",
        meaning:
            "আল্লাহ ছাড়া কোনো ইলাহ নেই; তিনি এক, তাঁর কোনো শরিক নেই। রাজত্ব তাঁরই, প্রশংসাও তাঁরই এবং তিনি সব কিছুর উপর সর্বশক্তিমান।",
        reference: "সহিহ বুখারি ৩২৯৩",
        sourceUrl: "https://sunnah.com/bukhari:3293",
        target: 100,
        note: "দিনে একশবার পড়ার কথা হাদিসে এসেছে।",
    },
};

export const MORNING_ADHKAR = [
    fromDua("morning-remembrance", 1),
    EXTRA_ADHKAR["bika-asbahna"],
    fromDua("sayyidul-istighfar", 1),
    EXTRA_ADHKAR["bismillah-protection"],
    EXTRA_ADHKAR["subhanallah-bihamdihi"],
    EXTRA_ADHKAR["astaghfirullah"],
    EXTRA_ADHKAR["tahlil-100"],
];

export const EVENING_ADHKAR = [
    fromDua("evening-remembrance", 1),
    EXTRA_ADHKAR["bika-amsayna"],
    fromDua("sayyidul-istighfar", 1),
    EXTRA_ADHKAR["bismillah-protection"],
    EXTRA_ADHKAR["subhanallah-bihamdihi"],
    EXTRA_ADHKAR["astaghfirullah"],
    EXTRA_ADHKAR["tahlil-100"],
];

export const ADHKAR_PERIODS = [
    {
        id: "morning",
        label: "সকালের যিকির",
        shortLabel: "সকাল",
        description: "ফজরের পর দিনের শুরুতে পড়ার যিকির",
        items: MORNING_ADHKAR,
    },
    {
        id: "evening",
        label: "সন্ধ্যার যিকির",
        shortLabel: "সন্ধ্যা",
        description: "আসরের পর সন্ধ্যায় পড়ার যিকির",
        items: EVENING_ADHKAR,
    },
];

export function getAdhkarItems(period) {
    return period === "evening" ? EVENING_ADHKAR : MORNING_ADHKAR;
}
