import fs from "node:fs/promises";
import path from "node:path";
import { TOPIC_LEXICON } from "./topics";

const QURAN_BASE = "https://api.alquran.cloud/v1";
const QURAN_EDITIONS = {
    arabic: "quran-uthmani",
    arabicSearch: "quran-simple",
    bangla: "bn.bengali",
    english: "en.sahih",
};
const QURAN_SOURCE_NAME = "AlQuran Cloud";
const HADITH_INDEX_PATH = path.join(
    process.cwd(),
    "data",
    "hadith-search-index.json"
);
const HADITH_SOURCE_NAME = "kafelanetwork/hadith-api";

const HADITH_FOLDERS = {
    bukhari: "Bukhari",
    muslim: "Muslim",
    abudawood: "AbuDaud",
    tirmidhi: "At-tirmizi",
    nasai: "Al-Nasai",
    ibnmajah: "Ibne-Mazah",
};

const ARABIC_DIACRITICS =
    /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

const STOPWORDS = new Set(
    [
        // Bengali question scaffolding
        "কী",
        "কি",
        "কীভাবে",
        "কিভাবে",
        "কেন",
        "কোথায়",
        "কখন",
        "কে",
        "কোন",
        "কোনটি",
        "এবং",
        "বা",
        "ও",
        "এর",
        "এই",
        "সেই",
        "একটি",
        "একটা",
        "আমি",
        "আমার",
        "আমরা",
        "আমাদের",
        "তুমি",
        "আপনি",
        "আপনার",
        "সে",
        "তিনি",
        "তারা",
        "করা",
        "করতে",
        "করবে",
        "করেছেন",
        "করে",
        "হয়",
        "হয়েছে",
        "হবে",
        "হলে",
        "করব",
        "করবেন",
        "করেন",
        "থেকে",
        "জন্য",
        "সাথে",
        "সম্পর্কে",
        "বিষয়ে",
        "বলা",
        "বলেছেন",
        "বলেন",
        "উচিত",
        "নাকি",
        "ব্যক্তি",
        "কোনো",
        "কিছু",
        "আছে",
        "নেই",
        "যায়",
        "যেতে",
        "পারে",
        "পারেন",
        "উপর",
        "মধ্যে",
        "ইসলাম",
        "ইসলামে",
        "ইসলামিক",
        "মুসলিম",
        "কুরআন",
        "কুরআনে",
        "কোরআন",
        "হাদিস",
        "হাদীস",
        "সহিহ",
        "সহীহ",
        "অনুযায়ী",
        "সময়",
        // English question scaffolding
        "what",
        "does",
        "do",
        "say",
        "says",
        "about",
        "islam",
        "islamic",
        "in",
        "the",
        "a",
        "an",
        "of",
        "to",
        "and",
        "or",
        "for",
        "on",
        "from",
        "how",
        "why",
        "when",
        "where",
        "which",
        "who",
        "should",
        "can",
        "could",
        "would",
        "please",
        "tell",
        "me",
        "according",
        "quran",
        "hadith",
        "sahih",
        "authentic",
        "muslim",
        "muslims",
        "regarding",
        "related",
        "rule",
        "ruling",
        "rulings",
        "importance",
        "meaning",
        "benefit",
        "benefits",
        "test",
        "question",
        "questions",
        "answer",
        "help",
        "information",
        "explain",
        "explanation",
        "want",
        "know",
        "need",
        "there",
        "is",
        "are",
        "was",
        "were",
        "be",
        "been",
        "being",
        "have",
        "has",
        "had",
        "this",
        "that",
        "these",
        "those",
        "it",
        "its",
        "as",
        "at",
        "by",
        "with",
        "not",
        "no",
        "yes",
        "if",
        // Arabic question scaffolding
        "ما",
        "ماذا",
        "عن",
        "في",
        "من",
        "هل",
        "هو",
        "هي",
        "الاسلام",
        "الإسلام",
        "القرآن",
        "الحديث",
        "الصحيح",
        "حكم",
        "أحكام",
    ].map(normalizeForComparison)
);

let hadithIndexPromise = null;

export function normalizeSearchText(value = "") {
    return String(value)
        .normalize("NFKC")
        .replace(ARABIC_DIACRITICS, "")
        .replace(/[\u200c\u200d]/g, " ")
        .toLocaleLowerCase("en")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeForComparison(value = "") {
    return normalizeSearchText(value);
}

function containsTrigger(haystack, trigger) {
    const normalizedTrigger = normalizeForComparison(trigger);

    if (!normalizedTrigger) return false;

    // Latin terms get a word-boundary check so "fast" does not match
    // "breakfast". Bengali and Arabic are matched as substrings because
    // inflected forms are common.
    if (/^[a-z0-9\s'-]+$/.test(normalizedTrigger)) {
        const escaped = normalizedTrigger.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`).test(haystack);
    }

    return haystack.includes(normalizedTrigger);
}

function uniqueTerms(terms, limit) {
    const seen = new Set();
    const output = [];

    for (const rawTerm of terms) {
        const term = normalizeForComparison(rawTerm);

        if (!term || term.length < 3 || STOPWORDS.has(term) || seen.has(term)) {
            continue;
        }

        seen.add(term);
        output.push(term);

        if (output.length >= limit) break;
    }

    return output;
}

export function buildQueryPlan(question) {
    const normalizedQuestion = normalizeSearchText(question);
    const matchedTopics = TOPIC_LEXICON.filter((topic) =>
        topic.triggers.some((trigger) =>
            containsTrigger(normalizedQuestion, trigger)
        )
    );

    const questionTokens = normalizedQuestion
        .split(" ")
        .filter((token) => token.length >= 3 && !STOPWORDS.has(token));

    const quranTerms = uniqueTerms(
        [
            ...matchedTopics.flatMap((topic) => topic.quranTerms),
            ...questionTokens,
        ],
        5
    );

    const hadithTerms = uniqueTerms(
        [
            ...matchedTopics.flatMap((topic) => topic.hadithTerms),
            ...questionTokens,
        ],
        9
    );

    return {
        normalizedQuestion,
        topics: matchedTopics.map(({ id, label }) => ({ id, label })),
        questionTokens,
        quranTerms,
        hadithTerms,
    };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 5500) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    } finally {
        clearTimeout(timer);
    }
}

function clipText(value, maxLength) {
    const text = typeof value === "string" ? value.trim() : "";

    if (text.length <= maxLength) {
        return { text, clipped: false };
    }

    return {
        text: `${text.slice(0, maxLength).trimEnd()}…`,
        clipped: true,
    };
}

function quranEditionForTerm(term) {
    if (/[\u0600-\u06FF]/.test(term)) return QURAN_EDITIONS.arabicSearch;
    if (/[\u0980-\u09FF]/.test(term)) return QURAN_EDITIONS.bangla;
    return QURAN_EDITIONS.english;
}

async function fetchQuranAyah(surahNumber, ayahNumber) {
    const editions = [
        QURAN_EDITIONS.arabic,
        QURAN_EDITIONS.bangla,
        QURAN_EDITIONS.english,
    ].join(",");

    const response = await fetchWithTimeout(
        `${QURAN_BASE}/ayah/${surahNumber}:${ayahNumber}/editions/${editions}`,
        { next: { revalidate: 60 * 60 * 24 } }
    );

    if (!response.ok) {
        throw new Error(`Quran ayah request failed: ${response.status}`);
    }

    const json = await response.json();

    if (json.code !== 200 || !Array.isArray(json.data)) {
        throw new Error("Quran ayah response was not valid");
    }

    const arabic = json.data.find(
        (entry) => entry.edition?.identifier === QURAN_EDITIONS.arabic
    );
    const bangla = json.data.find(
        (entry) => entry.edition?.identifier === QURAN_EDITIONS.bangla
    );
    const english = json.data.find(
        (entry) => entry.edition?.identifier === QURAN_EDITIONS.english
    );

    if (
        !arabic?.text ||
        !/[\u0600-\u06FF]/.test(arabic.text) ||
        arabic.surah?.number !== Number(surahNumber) ||
        arabic.numberInSurah !== Number(ayahNumber)
    ) {
        return null;
    }

    const arabicText = clipText(arabic.text, 2200);
    const banglaText = clipText(bangla?.text || "", 2600);
    const englishText = clipText(english?.text || "", 2600);

    return {
        id: `Q-${surahNumber}-${ayahNumber}`,
        kind: "quran",
        surahNumber: arabic.surah.number,
        surahName: arabic.surah.englishName,
        surahNameArabic: arabic.surah.name,
        surahMeaning: arabic.surah.englishNameTranslation,
        ayahNumber: arabic.numberInSurah,
        arabic: arabicText.text,
        arabicClipped: arabicText.clipped,
        translation: banglaText.text
            ? {
                  language: "bn",
                  text: banglaText.text,
                  clipped: banglaText.clipped,
                  edition: QURAN_EDITIONS.bangla,
                  translator:
                      bangla.edition?.englishName || "Muhiuddin Khan",
              }
            : null,
        alternateTranslation: englishText.text
            ? {
                  language: "en",
                  text: englishText.text,
                  clipped: englishText.clipped,
                  edition: QURAN_EDITIONS.english,
                  translator:
                      english.edition?.englishName || "Saheeh International",
              }
            : null,
        sourceName: QURAN_SOURCE_NAME,
        sourceUrl: `https://quran.com/${surahNumber}/${ayahNumber}`,
        verification: "exact-ayah-match",
        verified: true,
    };
}

function sourceStatus(parts) {
    if (parts.every((part) => part.status === "unavailable")) {
        return "unavailable";
    }

    if (parts.some((part) => part.status === "ok")) {
        return "ok";
    }

    return "empty";
}

export async function retrieveQuranEvidence(plan) {
    if (!plan.quranTerms.length) {
        return {
            status: "empty",
            references: [],
            note: "প্রশ্ন থেকে কুরআন অনুসন্ধানের মতো নির্দিষ্ট শব্দ পাওয়া যায়নি।",
        };
    }

    const searchResults = await Promise.allSettled(
        plan.quranTerms.map(async (term) => {
            const edition = quranEditionForTerm(term);
            const response = await fetchWithTimeout(
                `${QURAN_BASE}/search/${encodeURIComponent(term)}/all/${edition}`,
                { next: { revalidate: 60 * 60 * 24 } }
            );

            if (response.status === 404) {
                return { status: "empty", matches: [], term };
            }

            if (!response.ok) {
                throw new Error(`Quran search failed: ${response.status}`);
            }

            const json = await response.json();

            if (json.code === 404 || !json.data) {
                return { status: "empty", matches: [], term };
            }

            if (json.code !== 200) {
                throw new Error("Quran search returned an invalid response");
            }

            const matches = (json.data.matches || [])
                .slice(0, 2)
                .map((match) => ({
                    surahNumber: match.surah?.number,
                    ayahNumber: match.numberInSurah,
                }))
                .filter(
                    (match) =>
                        Number.isSafeInteger(match.surahNumber) &&
                        Number.isSafeInteger(match.ayahNumber)
                );

            return {
                status: matches.length ? "ok" : "empty",
                matches,
                term,
            };
        })
    );

    const successfulSearches = searchResults
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);

    const failedSearches = searchResults.length - successfulSearches.length;

    const uniqueMatches = [];
    const seenMatches = new Set();

    for (const search of successfulSearches) {
        for (const match of search.matches) {
            const key = `${match.surahNumber}:${match.ayahNumber}`;

            if (!seenMatches.has(key)) {
                seenMatches.add(key);
                uniqueMatches.push(match);
            }
        }
    }

    const selectedMatches = uniqueMatches.slice(0, 4);
    const ayahResults = await Promise.allSettled(
        selectedMatches.map((match) =>
            fetchQuranAyah(match.surahNumber, match.ayahNumber)
        )
    );

    const references = ayahResults
        .filter(
            (result) =>
                result.status === "fulfilled" && result.value !== null
        )
        .map((result) => result.value);

    const failedAyahs = ayahResults.filter(
        (result) => result.status === "rejected"
    ).length;
    const status = sourceStatus(
        successfulSearches.length
            ? successfulSearches
            : [{ status: "unavailable" }]
    );

    if (status === "unavailable" && !references.length) {
        return {
            status: "unavailable",
            references: [],
            note: "কুরআন অনুসন্ধান সেবা এই মুহূর্তে উত্তর দিতে পারেনি।",
        };
    }

    if (!references.length) {
        return {
            status: "empty",
            references: [],
            note: "প্রশ্নের সঙ্গে সরাসরি মেলে এমন কুরআন আয়াত পাওয়া যায়নি।",
        };
    }

    const notes = [];
    if (failedSearches > 0 || failedAyahs > 0) {
        notes.push(
            "কুরআন সূত্রের কিছু অনুসন্ধান সম্পূর্ণ হয়নি; শুধু সফলভাবে আনা আয়াতগুলো দেখানো হচ্ছে।"
        );
    }

    return {
        status: "ok",
        references,
        note: notes.join(" "),
    };
}

async function getHadithIndex() {
    if (!hadithIndexPromise) {
        hadithIndexPromise = fs
            .readFile(HADITH_INDEX_PATH, "utf8")
            .then((content) =>
                JSON.parse(content).map((hadith) => ({
                    ...hadith,
                    _bn: normalizeSearchText(hadith.bn || ""),
                    _ar: normalizeSearchText(hadith.ar || ""),
                    _narrator: normalizeSearchText(hadith.narrator || ""),
                    _collection: normalizeSearchText(
                        hadith.collectionName || ""
                    ),
                }))
            )
            .catch((error) => {
                hadithIndexPromise = null;
                throw error;
            });
    }

    return hadithIndexPromise;
}

function gradeWeight(grade = "") {
    if (/সহি|সহীহ|হাসান|sahih|hasan/i.test(grade)) return 1.2;
    if (/জঈফ|জইফ|দুর্বল|ضعيف|da.?if|weak/i.test(grade)) return -2;
    return 0;
}

function scoreHadith(hadith, plan) {
    let score = 0;
    let distinctHits = 0;

    for (const term of plan.hadithTerms) {
        let matched = false;
        const lengthBonus = Math.min(term.length, 8) * 0.45;

        if (hadith._bn.includes(term)) {
            score += 3 + lengthBonus;
            matched = true;
        }

        if (hadith._ar.includes(term)) {
            score += 3.5 + lengthBonus;
            matched = true;
        }

        if (hadith._narrator.includes(term)) {
            score += 1.5;
            matched = true;
        }

        if (hadith._collection.includes(term)) {
            score += 1;
            matched = true;
        }

        if (matched) distinctHits += 1;
    }

    if (!distinctHits) return 0;

    if (
        plan.normalizedQuestion.length >= 8 &&
        hadith._bn.includes(plan.normalizedQuestion)
    ) {
        score += 12;
    }

    if (distinctHits > 1) {
        score += (distinctHits - 1) * 1.8;
    }

    score += gradeWeight(hadith.grade);

    if (hadith.collectionId === "bukhari" || hadith.collectionId === "muslim") {
        score += 0.35;
    }

    // Prefer compact, focused records when relevance is otherwise equal.
    score -= Math.min((hadith.bn?.length || 0) / 4000, 1.5);

    return score;
}

function hadithRecordUrl(hadith) {
    const folder = HADITH_FOLDERS[hadith.collectionId];

    return folder
        ? `https://cdn.jsdelivr.net/gh/kafelanetwork/hadith-api@main/${folder}/hadith/${hadith.number}.json`
        : null;
}

export async function retrieveHadithEvidence(plan) {
    if (!plan.hadithTerms.length) {
        return {
            status: "empty",
            references: [],
            note: "প্রশ্ন থেকে হাদিস অনুসন্ধানের মতো নির্দিষ্ট শব্দ পাওয়া যায়নি।",
        };
    }

    let hadiths;

    try {
        hadiths = await getHadithIndex();
    } catch (error) {
        console.error(
            "Ask AI hadith index unavailable:",
            error?.code || error?.name || "unknown"
        );

        return {
            status: "unavailable",
            references: [],
            note: "হাদিস ডেটাসেট এই মুহূর্তে পড়া যাচ্ছে না; কোনো হাদিস উদ্ধৃতি তৈরি করা হয়নি।",
        };
    }

    const ranked = hadiths
        .map((hadith) => ({
            hadith,
            score: scoreHadith(hadith, plan),
        }))
        .filter((entry) => entry.score >= 4.2)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    if (!ranked.length) {
        return {
            status: "empty",
            references: [],
            note: "প্রশ্নের সঙ্গে সরাসরি মেলে এমন হাদিস রেকর্ড পাওয়া যায়নি।",
        };
    }

    const references = ranked.map(({ hadith }) => {
        const arabic = clipText(hadith.ar, 2400);
        const translation = clipText(hadith.bn, 2400);
        const grade = (hadith.grade || "").trim();

        return {
            id: `H-${hadith.collectionId}-${hadith.number}`,
            kind: "hadith",
            collectionId: hadith.collectionId,
            collectionName: hadith.collectionName,
            number: hadith.number,
            narrator: (hadith.narrator || "").trim() || null,
            grade: grade || null,
            gradeSource: grade ? "dataset" : null,
            gradeNote: grade
                ? "গ্রেডটি উৎস ডেটাসেটে যেভাবে দেওয়া আছে, সেভাবেই দেখানো হচ্ছে।"
                : "উৎস ডেটাসেটে এই রেকর্ডের গ্রেড দেওয়া নেই।",
            arabic: arabic.text,
            arabicClipped: arabic.clipped,
            translation: {
                language: "bn",
                text: translation.text,
                clipped: translation.clipped,
                edition: "kafelanetwork/hadith-api · Bengali",
            },
            sourceName: HADITH_SOURCE_NAME,
            sourceUrl: hadithRecordUrl(hadith),
            appUrl: `/deen-islam/hadith/${hadith.collectionId}`,
            verification: "exact-dataset-record",
            verified: true,
        };
    });

    return {
        status: "ok",
        references,
        note: "হাদিস রেকর্ডগুলো স্থানীয় ডেটাসেট থেকে হুবহু মিলিয়ে নেওয়া হয়েছে। গ্রেড স্বাধীনভাবে পুনঃযাচাই করা হয়নি।",
    };
}

export async function retrieveEvidence(question) {
    const plan = buildQueryPlan(question);
    const [quran, hadith] = await Promise.all([
        retrieveQuranEvidence(plan),
        retrieveHadithEvidence(plan),
    ]);

    return {
        plan,
        quran,
        hadith,
    };
}
