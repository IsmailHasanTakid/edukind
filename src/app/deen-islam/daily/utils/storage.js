export const STORAGE_KEYS = Object.freeze({
    favorites: "edukind:daily-dua-favorites:v1",
    location: "edukind:daily-prayer-location:v1",
    customHabits: "edukind:daily-amal-custom-habits:v1",
    amalProgress: "edukind:daily-amal-progress:v1",
    adhkarProgress: "edukind:daily-adhkar-progress:v1",
});

export function readStoredJson(key, fallback = null) {
    if (typeof window === "undefined") return fallback;

    try {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function writeStoredJson(key, value) {
    if (typeof window === "undefined") return false;

    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}
