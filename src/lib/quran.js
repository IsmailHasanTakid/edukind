const BASE = "https://api.alquran.cloud/v1";

export const ARABIC_EDITION = "quran-uthmani";
export const BANGLA_EDITION = "bn.bengali"; // আগে যাচাই করা identifier দাও
export const AUDIO_EDITION = "ar.alafasy"; // তিলাওয়াতকারী (reciter)
export const TOTAL_SURAHS = 114;

async function request(path) {
    const res = await fetch(`${BASE}${path}`, {
        next: { revalidate: 60 * 60 * 24 },
    });

    if (!res.ok) {
        throw new Error(`Quran API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.code !== 200) {
        throw new Error(
            typeof json.data === "string" ? json.data : "Quran API returned an error"
        );
    }

    return json.data;
}

// হরকত বাদ দিয়ে তুলনার জন্য
function plain(text) {
    return text
        .normalize("NFD")
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
}

export function getSurahList() {
    return request("/surah");
}

// অডিও ব্যর্থ হলে খালি তালিকা ফেরত দেয়, পেজ ভাঙে না
async function getAudio(number) {
    try {
        const data = await request(`/surah/${number}/${AUDIO_EDITION}`);

        return {
            reciter: data.edition?.englishName ?? "",
            urls: data.ayahs.map((ayah) =>
                ayah.audio ? ayah.audio.replace(/^http:\/\//, "https://") : null
            ),
        };
    } catch {
        return { reciter: "", urls: [] };
    }
}

export async function getSurah(number) {
    const [[arabic, bangla], audio] = await Promise.all([
        request(`/surah/${number}/editions/${ARABIC_EDITION},${BANGLA_EDITION}`),
        getAudio(number),
    ]);

    // সূরা ফাতিহায় বিসমিল্লাহ নিজেই ১ম আয়াত, সূরা তাওবায় বিসমিল্লাহ নেই
    const mayHaveBismillah = number !== 1 && number !== 9;

    const ayahs = arabic.ayahs.map((ayah, index) => {
        let text = ayah.text;

        if (
            mayHaveBismillah &&
            ayah.numberInSurah === 1 &&
            plain(text).startsWith("بسم")
        ) {
            text = text.split(" ").slice(4).join(" "); // বিসমিল্লাহ = ৪টি শব্দ
        }

        return {
            number: ayah.numberInSurah,
            arabic: text,
            bangla: bangla.ayahs[index]?.text ?? "",
            audio: audio.urls[index] ?? null,
        };
    });

    return {
        info: {
            number: arabic.number,
            name: arabic.name,
            englishName: arabic.englishName,
            englishNameTranslation: arabic.englishNameTranslation,
            numberOfAyahs: arabic.numberOfAyahs,
            revelationType: arabic.revelationType,
        },
        ayahs,
        translator: bangla.edition?.englishName ?? "",
        reciter: audio.reciter,
    };
}

// ───────── আয়াত সার্চ ─────────

// এই identifier দুটো ব্যবহারের আগে /v1/edition থেকে যাচাই করে নাও
export const SEARCH_EDITIONS = {
    arabic: "quran-simple",
    bangla: BANGLA_EDITION,
    english: "en.sahih",
};

export function detectScript(query) {
    if (/[\u0600-\u06FF]/.test(query)) return "arabic";
    if (/[\u0980-\u09FF]/.test(query)) return "bangla";
    return "english";
}

export async function searchAyahs(query) {
    const script = detectScript(query);
    const edition = SEARCH_EDITIONS[script];
    const empty = { script, count: 0, matches: [] };

    const res = await fetch(
        `${BASE}/search/${encodeURIComponent(query)}/all/${edition}`,
        { next: { revalidate: 60 * 60 * 24 } }
    );

    // ফলাফল না থাকলে API ৪০৪ দিতে পারে, সেটা ত্রুটি নয়
    if (res.status === 404) return empty;

    if (!res.ok) {
        throw new Error(`Quran API error: ${res.status}`);
    }

    const json = await res.json();

    if (json.code === 404 || !json.data) return empty;

    if (json.code !== 200) {
        throw new Error("Quran search failed");
    }

    const matches = (json.data.matches ?? []).map((m) => ({
        text: m.text,
        number: m.numberInSurah,
        surah: m.surah?.number,
        surahName: m.surah?.englishName,
    }));

    return { script, count: matches.length, matches };
}