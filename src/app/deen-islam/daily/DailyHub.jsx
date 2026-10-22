"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ExternalLink } from "lucide-react";
import { bangla } from "@/lib/deen-fonts";
import { DEFAULT_HABITS, MAX_CUSTOM_HABITS } from "./data/amal";
import { ADHKAR_PERIODS } from "./data/adhkar";
import { DUAS } from "./data/duas";
import {
    CITY_OPTIONS,
    DEFAULT_LOCATION,
    fetchHijriContext,
    fetchPrayerTimes,
    getCityLocation,
} from "./services/aladhan";
import {
    formatLocalDateKey,
    formatShortGregorianBn,
} from "./utils/dates";
import { getNextPrayer } from "./utils/prayer";
import { STORAGE_KEYS } from "./utils/storage";
import { useStoredJson } from "./utils/useStoredJson";
import DailyHeader from "./components/DailyHeader";
import SummaryCards from "./components/SummaryCards";
import SectionNav from "./components/SectionNav";
import AmalTracker from "./components/AmalTracker";
import PrayerTimesSection from "./components/PrayerTimesSection";
import DuaSection from "./components/DuaSection";
import AdhkarSection from "./components/AdhkarSection";
import HijriCalendarSection from "./components/HijriCalendarSection";
import GuidesSection from "./components/GuidesSection";

const EMPTY_ARRAY = Object.freeze([]);
const CITY_IDS = new Set(CITY_OPTIONS.map((city) => city.id));
const DUA_IDS = new Set(DUAS.map((dua) => dua.id));
const ADHKAR_TARGETS = new Map(
    ADHKAR_PERIODS.flatMap((period) =>
        period.items.map((item) => [
            `${period.id}:${item.id}`,
            item.target,
        ])
    )
);

function normalizeStoredLocation(value) {
    if (!value || typeof value !== "object") return null;

    if (value.type === "city" && CITY_IDS.has(value.id)) {
        return getCityLocation(value.id);
    }

    if (
        value.type === "coords" &&
        Number.isFinite(value.latitude) &&
        Number.isFinite(value.longitude)
    ) {
        return {
            type: "coords",
            id: "coords",
            label: "আপনার বর্তমান অবস্থান",
            city: "",
            latitude: Number(value.latitude.toFixed(4)),
            longitude: Number(value.longitude.toFixed(4)),
        };
    }

    return null;
}

function normalizeStoredHabits(value) {
    if (!Array.isArray(value)) return EMPTY_ARRAY;

    const seen = new Set();

    return value
        .filter((habit) => {
            if (!habit || typeof habit !== "object") return false;
            if (typeof habit.id !== "string") return false;
            if (!habit.id.startsWith("custom-")) return false;
            if (typeof habit.label !== "string") return false;
            return habit.label.trim().length > 0;
        })
        .map((habit) => ({
            id: habit.id,
            label: habit.label.trim().slice(0, 60),
            description:
                typeof habit.description === "string" &&
                habit.description.trim()
                    ? habit.description.trim().slice(0, 90)
                    : "নিজের নির্ধারিত আমল",
            icon: "sparkles",
            custom: true,
        }))
        .filter((habit) => {
            if (seen.has(habit.id)) return false;
            seen.add(habit.id);
            return true;
        })
        .slice(0, MAX_CUSTOM_HABITS);
}

function normalizeCompleted(value, validIds) {
    if (!Array.isArray(value)) return [];

    return Array.from(
        new Set(
            value.filter(
                (id) => typeof id === "string" && validIds.has(id)
            )
        )
    );
}

function getErrorMessage(error, fallback) {
    const message = error?.message;
    return typeof message === "string" && /[\u0980-\u09FF]/.test(message)
        ? message
        : fallback;
}

function normalizeAdhkarCounts(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }

    return Object.fromEntries(
        Object.entries(value)
            .filter(([, count]) => Number.isFinite(count) && count > 0)
            .map(([id, count]) => {
                const target = ADHKAR_TARGETS.get(id);
                return [id, target ? Math.min(count, target) : count];
            })
    );
}

export default function DailyHub() {
    const [now, setNow] = useState(null);
    const [dateKey, setDateKey] = useState(null);
    const dateKeyRef = useRef(null);

    const [storedLocation, locationReady, setStoredLocation] =
        useStoredJson(STORAGE_KEYS.location, null);

    const [storedFavorites, favoritesReady, setStoredFavorites] =
        useStoredJson(STORAGE_KEYS.favorites, EMPTY_ARRAY);

    const [storedHabits, , setStoredHabits] = useStoredJson(
        STORAGE_KEYS.customHabits,
        EMPTY_ARRAY
    );

    const [storedAmal, amalLoaded, setStoredAmal] = useStoredJson(
        STORAGE_KEYS.amalProgress,
        null
    );

    const [storedAdhkar, adhkarLoaded, setStoredAdhkar] = useStoredJson(
        STORAGE_KEYS.adhkarProgress,
        null
    );

    const [prayersStatus, setPrayersStatus] = useState("loading");
    const [prayerData, setPrayerData] = useState(null);
    const [prayerError, setPrayerError] = useState("");
    const [prayerRefresh, setPrayerRefresh] = useState(0);

    const [hijriStatus, setHijriStatus] = useState("loading");
    const [hijriData, setHijriData] = useState(null);
    const [hijriError, setHijriError] = useState("");
    const [hijriRefresh, setHijriRefresh] = useState(0);

    const [geoLoading, setGeoLoading] = useState(false);
    const [locationNotice, setLocationNotice] = useState(null);

    const [duaFilter, setDuaFilter] = useState("all");
    const [duaSearch, setDuaSearch] = useState("");

    useEffect(() => {
        const tick = () => {
            const current = new Date();
            const key = formatLocalDateKey(current);

            if (dateKeyRef.current !== key) {
                dateKeyRef.current = key;
                setDateKey(key);
                setPrayersStatus("loading");
                setPrayerData(null);
                setPrayerError("");
                setHijriStatus("loading");
                setHijriError("");
            }

            setNow(current);
        };

        tick();
        const interval = window.setInterval(tick, 30000);

        const handleVisibility = () => {
            if (!document.hidden) tick();
        };
        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            window.clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const location = useMemo(() => {
        if (!locationReady) return DEFAULT_LOCATION;
        return normalizeStoredLocation(storedLocation) ?? DEFAULT_LOCATION;
    }, [storedLocation, locationReady]);

    const favorites = useMemo(() => {
        if (!Array.isArray(storedFavorites)) return EMPTY_ARRAY;

        return Array.from(
            new Set(
                storedFavorites.filter(
                    (id) => typeof id === "string" && DUA_IDS.has(id)
                )
            )
        );
    }, [storedFavorites]);

    const customHabits = useMemo(
        () => normalizeStoredHabits(storedHabits),
        [storedHabits]
    );

    const allHabits = useMemo(
        () => [...DEFAULT_HABITS, ...customHabits],
        [customHabits]
    );

    const amalReady = amalLoaded && dateKey !== null;

    const validAmalCompleted = useMemo(() => {
        if (!dateKey || storedAmal?.date !== dateKey) return EMPTY_ARRAY;

        const validIds = new Set(allHabits.map((habit) => habit.id));
        return normalizeCompleted(storedAmal.completed, validIds);
    }, [dateKey, storedAmal, allHabits]);

    const adhkarReady = adhkarLoaded && dateKey !== null;

    const adhkarCounts = useMemo(() => {
        if (!dateKey || storedAdhkar?.date !== dateKey) {
            return {};
        }

        return normalizeAdhkarCounts(storedAdhkar.counts);
    }, [dateKey, storedAdhkar]);

    useEffect(() => {
        if (!locationReady || !location || !dateKey) return;

        const controller = new AbortController();

        fetchPrayerTimes({
            location,
            dateKey,
            signal: controller.signal,
        })
            .then((data) => {
                if (controller.signal.aborted) return;
                setPrayerData(data);
                setPrayersStatus("success");
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setPrayerData(null);
                setPrayerError(
                    getErrorMessage(
                        error,
                        "নামাজের সময় লোড করা যায়নি। ইন্টারনেট সংযোগ বা এলাকা যাচাই করে আবার চেষ্টা করুন।"
                    )
                );
                setPrayersStatus("error");
            });

        return () => controller.abort();
    }, [location, locationReady, dateKey, prayerRefresh]);

    useEffect(() => {
        if (!dateKey) return;

        const controller = new AbortController();

        fetchHijriContext(dateKey, controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setHijriData(data);
                setHijriStatus("success");
            })
            .catch((error) => {
                if (controller.signal.aborted) return;
                setHijriError(
                    getErrorMessage(
                        error,
                        "হিজরি তারিখ লোড করা যায়নি। ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।"
                    )
                );
                setHijriStatus("error");
            });

        return () => controller.abort();
    }, [dateKey, hijriRefresh]);

    const nextPrayer = useMemo(() => {
        if (!prayerData?.timings || !now) return null;
        return getNextPrayer(prayerData.timings, now, prayerData.timezone);
    }, [prayerData, now]);

    const dateLabel = now ? formatShortGregorianBn(now) : null;

    const handleToggleFavorite = (id) => {
        setStoredFavorites((current) => {
            const list = Array.isArray(current)
                ? current.filter(
                      (entry) => DUA_IDS.has(entry)
                  )
                : [];

            return list.includes(id)
                ? list.filter((entry) => entry !== id)
                : [...list, id];
        });
    };

    const handleOpenFavorites = () => {
        setDuaFilter("favorites");
        setDuaSearch("");

        window.requestAnimationFrame(() => {
            document
                .getElementById("duas")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const handleViewAllDuas = () => {
        setDuaFilter("all");
        setDuaSearch("");
    };

    const handleLocationChange = (nextLocation) => {
        setPrayersStatus("loading");
        setPrayerData(null);
        setPrayerError("");
        setStoredLocation(nextLocation);
        setLocationNotice(null);
    };

    const handleUseGeolocation = () => {
        if (!navigator.geolocation) {
            setLocationNotice(
                "এই ব্রাউজারে অবস্থান সেবা পাওয়া যাচ্ছে না। শহর নির্বাচন করুন।"
            );
            return;
        }

        setGeoLoading(true);
        setLocationNotice(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                setPrayersStatus("loading");
                setPrayerData(null);
                setPrayerError("");
                setStoredLocation({
                    type: "coords",
                    id: "coords",
                    label: "আপনার বর্তমান অবস্থান",
                    city: "",
                    latitude: Number(latitude.toFixed(4)),
                    longitude: Number(longitude.toFixed(4)),
                });
                setLocationNotice(
                    "বর্তমান অবস্থান অনুযায়ী নামাজের সময় আপডেট করা হয়েছে। স্থানীয় মসজিদের সময়সূচির সঙ্গে মিলিয়ে নিন।"
                );
                setGeoLoading(false);
            },
            (error) => {
                const message =
                    error?.code === 1
                        ? "অবস্থানের অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংস থেকে অনুমতি দিন বা শহর নির্বাচন করুন।"
                        : error?.code === 3
                          ? "অবস্থান নির্ধারণে সময় শেষ হয়ে গেছে। আবার চেষ্টা করুন বা শহর নির্বাচন করুন।"
                          : "বর্তমান অবস্থান পাওয়া যায়নি। শহর নির্বাচন করে নামাজের সময় দেখুন।";

                setLocationNotice(message);
                setGeoLoading(false);
            },
            {
                enableHighAccuracy: false,
                timeout: 12000,
                maximumAge: 600000,
            }
        );
    };

    const refreshPrayers = () => {
        setPrayersStatus("loading");
        setPrayerData(null);
        setPrayerError("");
        setPrayerRefresh((value) => value + 1);
    };

    const refreshHijri = () => {
        setHijriStatus("loading");
        setHijriError("");
        setHijriRefresh((value) => value + 1);
    };

    const writeAmal = (updater) => {
        if (!dateKey) return;

        setStoredAmal((current) => {
            const validIds = new Set(allHabits.map((habit) => habit.id));
            const base =
                current?.date === dateKey
                    ? normalizeCompleted(current.completed, validIds)
                    : [];

            return {
                date: dateKey,
                completed: Array.from(new Set(updater(base))),
            };
        });
    };

    const handleToggleAmal = (id) => {
        writeAmal((current) =>
            current.includes(id)
                ? current.filter((entry) => entry !== id)
                : [...current, id]
        );
    };

    const handleResetAmal = () => {
        writeAmal(() => []);
    };

    const handleRestoreAmal = (ids) => {
        if (!Array.isArray(ids)) return;

        const validIds = new Set(allHabits.map((habit) => habit.id));
        writeAmal((current) => [
            ...current,
            ...ids.filter((id) => validIds.has(id)),
        ]);
    };

    const handleAddCustomHabit = (value) => {
        const label = String(value ?? "")
            .trim()
            .replace(/\s+/g, " ");

        if (!label) {
            return { ok: false, message: "আমলটির নাম লিখুন।" };
        }

        if (label.length > 60) {
            return {
                ok: false,
                message: "আমলের নাম ৬০ অক্ষরের মধ্যে রাখুন।",
            };
        }

        if (customHabits.length >= MAX_CUSTOM_HABITS) {
            return {
                ok: false,
                message: `সর্বোচ্চ ${MAX_CUSTOM_HABITS}টি নিজের আমল যোগ করা যাবে।`,
            };
        }

        const normalized = label.toLocaleLowerCase("bn");
        const duplicate = allHabits.some(
            (habit) =>
                habit.label.trim().toLocaleLowerCase("bn") === normalized
        );

        if (duplicate) {
            return {
                ok: false,
                message: "এই নামে একটি আমল ইতিমধ্যে তালিকায় আছে।",
            };
        }

        const habit = {
            id: `custom-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
            label,
            description: "নিজের নির্ধারিত আমল",
            icon: "sparkles",
            custom: true,
        };

        setStoredHabits((current) => [
            ...normalizeStoredHabits(current),
            habit,
        ]);
        return { ok: true };
    };

    const handleRemoveCustomHabit = (id) => {
        setStoredHabits((current) =>
            normalizeStoredHabits(current).filter(
                (habit) => habit.id !== id
            )
        );
        writeAmal((current) =>
            current.filter((entry) => entry !== id)
        );
    };

    const writeAdhkar = (updater) => {
        if (!dateKey) return;

        setStoredAdhkar((current) => {
            const base =
                current?.date === dateKey
                    ? normalizeAdhkarCounts(current.counts)
                    : {};

            return { date: dateKey, counts: updater(base) };
        });
    };

    const handleIncrementAdhkar = (key) => {
        const target = ADHKAR_TARGETS.get(key);
        if (!target) return;

        writeAdhkar((current) => {
            const value = current[key] ?? 0;
            const nextValue = Math.min(target, value + 1);

            if (nextValue === value) return current;
            return { ...current, [key]: nextValue };
        });
    };

    const handleDecrementAdhkar = (key) => {
        if (!ADHKAR_TARGETS.has(key)) return;

        writeAdhkar((current) => {
            const value = current[key] ?? 0;
            const nextCounts = { ...current };

            if (value <= 1) {
                delete nextCounts[key];
            } else {
                nextCounts[key] = value - 1;
            }

            return nextCounts;
        });
    };

    const handleResetAdhkarItems = (ids) => {
        if (!Array.isArray(ids)) return;

        writeAdhkar((current) => {
            const nextCounts = { ...current };
            for (const id of ids) delete nextCounts[id];
            return nextCounts;
        });
    };

    const handleRestoreAdhkar = (snapshot) => {
        if (!snapshot || typeof snapshot !== "object") return;

        writeAdhkar((current) => {
            const nextCounts = { ...current };

            for (const [id, value] of Object.entries(snapshot)) {
                if (Number.isFinite(value) && value > 0) {
                    nextCounts[id] = value;
                }
            }

            return nextCounts;
        });
    };

    return (
        <div
            className={`${bangla.className} -mx-12 min-h-screen bg-[#FFFBF5] text-[#153B37] antialiased`}
        >
            <DailyHeader
                now={now}
                hijri={hijriData?.hijri ?? null}
                hijriStatus={hijriStatus}
            />

            <div className="relative mx-auto max-w-[1280px] px-4 pb-14 sm:px-6 lg:px-8">
                <SummaryCards
                    amal={{
                        ready: amalReady,
                        completedCount: validAmalCompleted.length,
                        totalCount: allHabits.length,
                    }}
                    nextPrayer={nextPrayer}
                    prayersStatus={prayersStatus}
                    favoritesCount={favorites.length}
                    favoritesReady={favoritesReady}
                    onOpenFavorites={handleOpenFavorites}
                />

                <SectionNav onOpenFavorites={handleOpenFavorites} />

                <AmalTracker
                    completed={validAmalCompleted}
                    ready={amalReady}
                    customHabits={customHabits}
                    onToggle={handleToggleAmal}
                    onAddCustomHabit={handleAddCustomHabit}
                    onRemoveCustomHabit={handleRemoveCustomHabit}
                    onReset={handleResetAmal}
                    onRestore={handleRestoreAmal}
                    dateLabel={dateLabel}
                />

                <PrayerTimesSection
                    status={prayersStatus}
                    data={prayerData}
                    error={prayerError}
                    nextPrayer={nextPrayer}
                    location={location}
                    onLocationChange={handleLocationChange}
                    onUseGeolocation={handleUseGeolocation}
                    geoLoading={geoLoading}
                    notice={locationNotice}
                    onRefresh={refreshPrayers}
                />

                <DuaSection
                    favorites={favorites}
                    favoritesReady={favoritesReady}
                    onToggleFavorite={handleToggleFavorite}
                    filter={duaFilter}
                    onFilterChange={setDuaFilter}
                    search={duaSearch}
                    onSearchChange={setDuaSearch}
                    onViewAll={handleViewAllDuas}
                />

                <AdhkarSection
                    counts={adhkarCounts}
                    ready={adhkarReady}
                    onIncrement={handleIncrementAdhkar}
                    onDecrement={handleDecrementAdhkar}
                    onResetItems={handleResetAdhkarItems}
                    onRestore={handleRestoreAdhkar}
                    dateLabel={dateLabel}
                />

                <HijriCalendarSection
                    status={hijriStatus}
                    data={hijriData}
                    error={hijriError}
                    now={now}
                    onRefresh={refreshHijri}
                />

                <GuidesSection />

                <footer className="mt-14 border-t border-[#E4D2B8] pt-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold text-[#153B37]">
                                দৈনন্দিন ইসলামিক জীবন
                            </p>
                            <p className="mt-1.5 text-xs sm:text-sm leading-6 text-[#718078]">
                                নামাজের সময় ও হিজরি তারিখ Aladhan API থেকে
                                লোড হয়। দোয়া, যিকির ও গাইডের সূত্র Sunnah.com
                                এবং Quran.com-এ যাচাই করা হয়েছে। কোনো অনুমানভিত্তিক
                                ধর্মীয় পাঠ বা তারিখ যুক্ত করা হয়নি।
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm">
                                <a
                                    href="https://aladhan.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                                >
                                    Aladhan API
                                    <ExternalLink
                                        size={10}
                                        aria-hidden="true"
                                    />
                                </a>
                                <a
                                    href="https://sunnah.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                                >
                                    Sunnah.com
                                    <ExternalLink
                                        size={10}
                                        aria-hidden="true"
                                    />
                                </a>
                                <a
                                    href="https://quran.com/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#1E4F4A] underline decoration-[#C69B52]/45 underline-offset-4 transition hover:text-[#8A6A2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                                >
                                    Quran.com
                                    <ExternalLink
                                        size={10}
                                        aria-hidden="true"
                                    />
                                </a>
                            </div>
                            <p className="mt-2 text-[11px] sm:text-xs leading-5 text-[#839088]">
                                ফেভারিট, আমল, যিকিরের গণনা ও এলাকা এই
                                ব্রাউজারের localStorage-এ সংরক্ষিত থাকে।
                                ধর্মীয় মাসআলায় নির্ভরযোগ্য আলেমের পরামর্শ
                                নিন।
                            </p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Link
                                href="/deen-islam"
                                className="inline-flex min-h-10 items-center rounded-full border border-[#D8C4A8] bg-white px-4 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                            >
                                DeenIslam হোম
                            </Link>
                            <button
                                type="button"
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                                className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#1E4F4A] px-4 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                            >
                                <ArrowUp size={13} aria-hidden="true" />
                                উপরে ফিরুন
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
