const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const WEEKDAYS_BN = [
    "রবিবার",
    "সোমবার",
    "মঙ্গলবার",
    "বুধবার",
    "বৃহস্পতিবার",
    "শুক্রবার",
    "শনিবার",
];

const GREGORIAN_MONTHS_BN = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
];

const HIJRI_MONTHS_BN = {
    1: "মুহাররম",
    2: "সফর",
    3: "রবিউল আউয়াল",
    4: "রবিউস সানি",
    5: "জমাদিউল আউয়াল",
    6: "জমাদিউস সানি",
    7: "রজব",
    8: "শাবান",
    9: "রমজান",
    10: "শাওয়াল",
    11: "জিলকদ",
    12: "জিলহজ",
};

export function toBn(value) {
    return String(value ?? "").replace(/\d/g, (digit) => BN_DIGITS[Number(digit)]);
}

export function formatLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function formatApiDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");

    return `${day}-${month}-${date.getFullYear()}`;
}

export function dateKeyToApiDate(dateKey) {
    if (!dateKey || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return formatApiDate(new Date());
    }

    const [year, month, day] = dateKey.split("-");
    return `${day}-${month}-${year}`;
}

export function parseApiDate(value) {
    if (!value || typeof value !== "string") return null;
    const parts = value.split("-");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year) return null;

    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatGregorianBn(date = new Date(), includeWeekday = true) {
    const prefix = includeWeekday ? `${WEEKDAYS_BN[date.getDay()]}, ` : "";
    return `${prefix}${toBn(date.getDate())} ${GREGORIAN_MONTHS_BN[date.getMonth()]} ${toBn(date.getFullYear())}`;
}

export function formatShortGregorianBn(date) {
    return `${toBn(date.getDate())} ${GREGORIAN_MONTHS_BN[date.getMonth()]} ${toBn(date.getFullYear())}`;
}

export function getHijriMonthBn(monthNumber) {
    return HIJRI_MONTHS_BN[Number(monthNumber)] ?? `মাস ${toBn(monthNumber)}`;
}

export function formatHijriBn(hijri) {
    if (!hijri?.day || !hijri?.month?.number || !hijri?.year) return "হিজরি তারিখ পাওয়া যায়নি";

    return `${toBn(hijri.day)} ${getHijriMonthBn(hijri.month.number)} ${toBn(hijri.year)} হিজরি`;
}

export function formatTimeParts(value) {
    const clean = String(value ?? "").split(" ")[0];
    const [rawHour, rawMinute] = clean.split(":").map(Number);

    if (!Number.isFinite(rawHour) || !Number.isFinite(rawMinute)) {
        return { hour: "--", minute: "--", meridiem: "" };
    }

    const meridiem = rawHour >= 12 ? "PM" : "AM";
    const hour = rawHour % 12 || 12;

    return {
        hour: toBn(hour),
        minute: toBn(String(rawMinute).padStart(2, "0")),
        meridiem,
    };
}

export function formatCountdown(totalMinutes) {
    const minutes = Math.max(0, Math.round(totalMinutes));

    if (minutes === 0) return "এখনই";
    if (minutes < 60) return `${toBn(minutes)} মিনিট`;

    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;

    if (remainder === 0) return `${toBn(hours)} ঘণ্টা`;
    return `${toBn(hours)} ঘণ্টা ${toBn(remainder)} মিনিট`;
}

export function daysBetween(start, end) {
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    return Math.round((endDate.getTime() - startDate.getTime()) / 86400000);
}

export function formatDaysUntil(days) {
    if (days === 0) return "আজ";
    if (days === 1) return "আগামীকাল";
    if (days > 1) return `${toBn(days)} দিন বাকি`;

    return "অতিবাহিত";
}

export { WEEKDAYS_BN, GREGORIAN_MONTHS_BN, HIJRI_MONTHS_BN };
