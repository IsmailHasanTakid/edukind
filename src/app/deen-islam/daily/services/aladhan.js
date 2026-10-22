import {
    dateKeyToApiDate,
    parseApiDate,
    formatHijriBn,
} from "../utils/dates";

const API_BASE = "https://api.aladhan.com/v1";

export const CITY_OPTIONS = [
    {
        id: "dhaka",
        label: "ঢাকা",
        city: "Dhaka",
        latitude: 23.8103,
        longitude: 90.4125,
    },
    {
        id: "chattogram",
        label: "চট্টগ্রাম",
        city: "Chattogram",
        latitude: 22.3569,
        longitude: 91.7832,
    },
    {
        id: "sylhet",
        label: "সিলেট",
        city: "Sylhet",
        latitude: 24.8949,
        longitude: 91.8687,
    },
    {
        id: "rajshahi",
        label: "রাজশাহী",
        city: "Rajshahi",
        latitude: 24.3745,
        longitude: 88.6042,
    },
    {
        id: "khulna",
        label: "খুলনা",
        city: "Khulna",
        latitude: 22.8456,
        longitude: 89.5403,
    },
    {
        id: "barishal",
        label: "বরিশাল",
        city: "Barishal",
        latitude: 22.701,
        longitude: 90.3535,
    },
    {
        id: "rangpur",
        label: "রংপুর",
        city: "Rangpur",
        latitude: 25.7439,
        longitude: 89.2752,
    },
    {
        id: "mymensingh",
        label: "ময়মনসিংহ",
        city: "Mymensingh",
        latitude: 24.7471,
        longitude: 90.4203,
    },
    {
        id: "cumilla",
        label: "কুমিল্লা",
        city: "Cumilla",
        latitude: 23.4607,
        longitude: 91.1809,
    },
    {
        id: "coxs-bazar",
        label: "কক্সবাজার",
        city: "Cox's Bazar",
        latitude: 21.4272,
        longitude: 92.0058,
    },
];

export const DEFAULT_LOCATION = {
    type: "city",
    id: CITY_OPTIONS[0].id,
    label: CITY_OPTIONS[0].label,
    city: CITY_OPTIONS[0].city,
    latitude: CITY_OPTIONS[0].latitude,
    longitude: CITY_OPTIONS[0].longitude,
};

export const PRAYER_METHOD_LABEL = "কারাচি বিশ্ববিদ্যালয় পদ্ধতি";
export const ASR_METHOD_LABEL = "হানাফি আসর";

export function getCityLocation(cityId) {
    const city = CITY_OPTIONS.find((option) => option.id === cityId);
    if (!city) return DEFAULT_LOCATION;

    return {
        type: "city",
        id: city.id,
        label: city.label,
        city: city.city,
        latitude: city.latitude,
        longitude: city.longitude,
    };
}

function cleanTimings(timings = {}) {
    return Object.fromEntries(
        Object.entries(timings).map(([key, value]) => [
            key,
            String(value ?? "").split(" ")[0],
        ])
    );
}

function readError(json, response) {
    if (!response.ok || json?.code !== 200 || !json?.data) {
        throw new Error(
            json?.data?.message ||
                "নামাজের সময়ের ডেটা পাওয়া যায়নি। ইন্টারনেট সংযোগ বা এলাকা যাচাই করুন।"
        );
    }
}

export async function fetchPrayerTimes({ location, dateKey, signal }) {
    if (!location) throw new Error("নামাজের সময় দেখতে একটি এলাকা নির্বাচন করুন।");

    const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        method: "1",
        school: "1",
        date: dateKeyToApiDate(dateKey),
    });

    const response = await fetch(`${API_BASE}/timings?${params.toString()}`, {
        cache: "no-store",
        signal,
    });
    const json = await response.json();
    readError(json, response);

    const data = json.data;

    return {
        timings: cleanTimings(data.timings),
        timezone: data.meta?.timezone ?? "",
        method: data.meta?.method?.name ?? "University of Islamic Sciences, Karachi",
        school: data.meta?.school ?? "HANAFI",
        hijri: data.date?.hijri ?? null,
        gregorian: data.date?.gregorian ?? null,
        fetchedAt: new Date().toISOString(),
    };
}

const IMPORTANT_HIJRI_DATES = [
    {
        id: "islamic-new-year",
        title: "ইসলামি নববর্ষ",
        hijriLabel: "১ মুহাররম",
        day: 1,
        month: 1,
    },
    {
        id: "ashura",
        title: "আশুরা",
        hijriLabel: "১০ মুহাররম",
        day: 10,
        month: 1,
    },
    {
        id: "ramadan",
        title: "রমজান শুরু",
        hijriLabel: "১ রমজান",
        day: 1,
        month: 9,
    },
    {
        id: "eid-al-fitr",
        title: "ঈদুল ফিতর",
        hijriLabel: "১ শাওয়াল",
        day: 1,
        month: 10,
    },
    {
        id: "arafah",
        title: "আরাফার দিন",
        hijriLabel: "৯ জিলহজ",
        day: 9,
        month: 12,
    },
    {
        id: "eid-al-adha",
        title: "ঈদুল আজহা",
        hijriLabel: "১০ জিলহজ",
        day: 10,
        month: 12,
    },
];

export const UPCOMING_EVENT_COUNT = IMPORTANT_HIJRI_DATES.length;

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchHijriToGregorian({ event, year, signal }) {
    const date = `${String(event.day).padStart(2, "0")}-${String(event.month).padStart(2, "0")}-${year}`;

    for (let attempt = 0; attempt < 2; attempt += 1) {
        if (signal?.aborted) return null;

        try {
            const response = await fetch(`${API_BASE}/hToG?date=${date}`, {
                cache: "no-store",
                signal,
            });
            const json = await response.json();
            readError(json, response);

            const gregorian = parseApiDate(json.data?.gregorian?.date);
            if (!gregorian) return null;

            return {
                ...event,
                year,
                gregorianDate: gregorian,
                gregorianLabel: json.data?.gregorian?.date ?? null,
                hijriLabel:
                    formatHijriBn(json.data?.hijri) || event.hijriLabel,
            };
        } catch (error) {
            if (signal?.aborted) return null;
            if (attempt === 0) await wait(650);
        }
    }

    return null;
}

export async function fetchHijriContext(dateKey, signal) {
    const response = await fetch(
        `${API_BASE}/gToH?date=${dateKeyToApiDate(dateKey)}`,
        {
            cache: "no-store",
            signal,
        }
    );
    const json = await response.json();
    readError(json, response);

    const hijri = json.data?.hijri;
    if (!hijri?.month?.number || !hijri?.day || !hijri?.year) {
        throw new Error("হিজরি তারিখের নির্ভরযোগ্য ডেটা পাওয়া যায়নি।");
    }

    const current = {
        day: Number(hijri.day),
        month: Number(hijri.month.number),
        year: Number(hijri.year),
    };

    const candidates = IMPORTANT_HIJRI_DATES.map((event) => {
        const isStillAhead =
            event.month > current.month ||
            (event.month === current.month && event.day >= current.day);

        return {
            ...event,
            year: isStillAhead ? current.year : current.year + 1,
        };
    });

    const upcoming = [];

    for (const event of candidates) {
        if (signal?.aborted) break;

        const resolved = await fetchHijriToGregorian({
            event,
            year: event.year,
            signal,
        });

        if (resolved) upcoming.push(resolved);
        if (!signal?.aborted) await wait(120);
    }

    upcoming.sort((a, b) => a.gregorianDate - b.gregorianDate);

    return {
        hijri,
        upcoming,
        monthDays: Number(hijri.month.days) || null,
        fetchedAt: new Date().toISOString(),
    };
}
