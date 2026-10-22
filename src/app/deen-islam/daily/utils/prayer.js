export const PRAYER_SEQUENCE = [
    { key: "Fajr", id: "fajr", label: "ফজর", icon: "sunrise" },
    { key: "Dhuhr", id: "dhuhr", label: "যোহর", icon: "sun" },
    { key: "Asr", id: "asr", label: "আসর", icon: "cloud-sun" },
    { key: "Maghrib", id: "maghrib", label: "মাগরিব", icon: "sunset" },
    { key: "Isha", id: "isha", label: "ইশা", icon: "moon-star" },
];

export function timeToMinutes(value) {
    const clean = String(value ?? "").split(" ")[0];
    const [hours, minutes] = clean.split(":").map(Number);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
    return hours * 60 + minutes;
}

export function getZonedMinutes(timeZone, now = new Date()) {
    if (timeZone) {
        try {
            const parts = new Intl.DateTimeFormat("en-GB", {
                timeZone,
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
            }).formatToParts(now);

            const hour = Number(
                parts.find((part) => part.type === "hour")?.value
            );
            const minute = Number(
                parts.find((part) => part.type === "minute")?.value
            );

            if (Number.isFinite(hour) && Number.isFinite(minute)) {
                return (hour % 24) * 60 + minute;
            }
        } catch {
            // Fall back to the browser's local time below.
        }
    }

    return now.getHours() * 60 + now.getMinutes();
}

export function getNextPrayer(timings, now = new Date(), timeZone) {
    if (!timings) return null;

    const nowMinutes = getZonedMinutes(timeZone, now);

    for (const prayer of PRAYER_SEQUENCE) {
        const minutes = timeToMinutes(timings[prayer.key]);
        if (minutes === null) continue;

        if (minutes >= nowMinutes) {
            return {
                ...prayer,
                time: timings[prayer.key],
                minutesUntil: minutes - nowMinutes,
                tomorrow: false,
            };
        }
    }

    const firstPrayer = PRAYER_SEQUENCE[0];
    const firstMinutes = timeToMinutes(timings[firstPrayer.key]);

    if (firstMinutes === null) return null;

    return {
        ...firstPrayer,
        time: timings[firstPrayer.key],
        minutesUntil: 1440 - nowMinutes + firstMinutes,
        tomorrow: true,
    };
}
