import {
    CircleAlert,
    LocateFixed,
    MapPin,
    Navigation,
    RefreshCw,
    WifiOff,
} from "lucide-react";
import {
    CITY_OPTIONS,
    ASR_METHOD_LABEL,
    PRAYER_METHOD_LABEL,
    getCityLocation,
} from "../services/aladhan";
import { PRAYER_SEQUENCE } from "../utils/prayer";
import { formatTimeParts } from "../utils/dates";
import { DeenIcon } from "./icons";
import SectionHeading from "./SectionHeading";

function LocationOption({ city }) {
    return <option value={city.id}>{city.label}</option>;
}

function PrayerSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-4"
                    aria-hidden="true"
                >
                    <div className="h-9 w-9 animate-pulse rounded-xl bg-[#EFE2D2]" />
                    <div className="mt-4 h-4 w-14 animate-pulse rounded bg-[#EFE2D2]" />
                    <div className="mt-3 h-7 w-20 animate-pulse rounded bg-[#EFE2D2]" />
                </div>
            ))}
        </div>
    );
}

export default function PrayerTimesSection({
    status,
    data,
    error,
    nextPrayer,
    location,
    onLocationChange,
    onUseGeolocation,
    geoLoading,
    notice,
    onRefresh,
}) {
    const cityValue =
        location?.type === "city" ? location.id : "__current_location__";
    const sunrise = data?.timings?.Sunrise
        ? formatTimeParts(data.timings.Sunrise)
        : null;

    return (
        <section
            id="prayer-times"
            aria-labelledby="prayer-times-heading"
            className="scroll-mt-24 pt-12 sm:pt-16"
        >
            <SectionHeading
                eyebrow="SALAH · PRAYER TIMES"
                title="আজকের নামাজের সময়"
                description="আপনার নির্বাচিত এলাকার বাস্তব সময়সূচি। সময় পরিবর্তিত হলে রিফ্রেশ করুন।"
                icon={SunIcon}
                headingId="prayer-times-heading"
                action={
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4D2B8] bg-[#FBF1E8] px-3 py-1.5 text-xs sm:text-sm font-medium text-[#6F5322]">
                            <MapPin size={12} aria-hidden="true" />
                            {location?.label ?? "ঢাকা"}
                        </span>
                        <button
                            type="button"
                            onClick={onRefresh}
                            disabled={status === "loading"}
                            aria-label="নামাজের সময় রিফ্রেশ করুন"
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#D8C4A8] bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                        >
                            <RefreshCw
                                size={13}
                                className={status === "loading" ? "animate-spin" : ""}
                                aria-hidden="true"
                            />
                            রিফ্রেশ
                        </button>
                    </div>
                }
            />

            <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-3.5 sm:flex-row sm:items-end sm:justify-between sm:p-4">
                <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-end">
                    <label
                        htmlFor="prayer-location"
                        className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs sm:text-sm font-semibold text-[#405A52] sm:max-w-[220px]"
                    >
                        এলাকা নির্বাচন করুন
                        <span className="relative">
                            <MapPin
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A2F]"
                                aria-hidden="true"
                            />
                            <select
                                id="prayer-location"
                                value={cityValue}
                                onChange={(event) => {
                                    if (event.target.value === "__current_location__") {
                                        return;
                                    }
                                    onLocationChange(
                                        getCityLocation(event.target.value)
                                    );
                                }}
                                className="min-h-11 w-full appearance-none rounded-xl border border-[#DDCDB7] bg-white py-2 pl-9 pr-8 text-sm sm:text-base font-medium text-[#153B37] outline-none transition focus:border-[#1E4F4A] focus:ring-4 focus:ring-[#1E4F4A]/10"
                            >
                                {location?.type === "coords" ? (
                                    <option value="__current_location__">
                                        আপনার বর্তমান অবস্থান
                                    </option>
                                ) : null}
                                {CITY_OPTIONS.map((city) => (
                                    <LocationOption key={city.id} city={city} />
                                ))}
                            </select>
                        </span>
                    </label>

                    <button
                        type="button"
                        onClick={onUseGeolocation}
                        disabled={geoLoading}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#D8C4A8] bg-white px-3.5 text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFFBF5] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        {geoLoading ? (
                            <RefreshCw
                                size={14}
                                className="animate-spin"
                                aria-hidden="true"
                            />
                        ) : (
                            <LocateFixed size={14} aria-hidden="true" />
                        )}
                        আমার অবস্থান
                    </button>
                </div>

                <p className="max-w-[320px] text-xs sm:text-sm leading-5 text-[#718078]">
                    নামাজের সময় Aladhan API থেকে লোড হয়। স্থানীয় মসজিদের
                    সময়সূচির সঙ্গে মিলিয়ে নেওয়া ভালো।
                </p>
            </div>

            {notice ? (
                <div
                    role="status"
                    className="mt-3 flex items-start gap-2 rounded-xl border border-[#E6D6BC] bg-[#FBF1E8] px-3.5 py-2.5 text-xs sm:text-sm leading-5 text-[#6F5322]"
                >
                    <Navigation
                        size={14}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                    />
                    {notice}
                </div>
            ) : null}

            <div className="mt-5" aria-live="polite">
                {status === "loading" ? (
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-sm text-[#6A7D75]">
                            <RefreshCw
                                size={14}
                                className="animate-spin"
                                aria-hidden="true"
                            />
                            নামাজের সময় লোড হচ্ছে…
                        </div>
                        <PrayerSkeleton />
                    </div>
                ) : status === "error" ? (
                    <div
                        role="alert"
                        className="rounded-2xl border border-[#E8CFC7] bg-[#FFF7F4] p-5 sm:p-6"
                    >
                        <div className="flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E8CFC7] bg-white text-[#A54A3A]">
                                <WifiOff size={18} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <h3 className="text-sm sm:text-base font-bold text-[#7A352B]">
                                    নামাজের সময় লোড করা যায়নি
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-[#8A625B]">
                                    {error ||
                                        "ইন্টারনেট সংযোগ বা এলাকার তথ্য যাচাই করুন। কোনো নমুনা সময় দেখানো হচ্ছে না।"}
                                </p>
                                <button
                                    type="button"
                                    onClick={onRefresh}
                                    className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1E4F4A] px-4 text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                                >
                                    <RefreshCw size={14} aria-hidden="true" />
                                    আবার চেষ্টা করুন
                                </button>
                            </div>
                        </div>
                    </div>
                ) : data ? (
                    <>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                            {PRAYER_SEQUENCE.map((prayer) => {
                                const isNext = nextPrayer?.id === prayer.id;
                                const time = formatTimeParts(
                                    data.timings?.[prayer.key]
                                );

                                return (
                                    <article
                                        key={prayer.id}
                                        className={`group relative overflow-hidden rounded-2xl border p-4 transition duration-300 ${isNext
                                            ? "border-[#C69B52] bg-[#1E4F4A] text-white shadow-[0_16px_34px_rgba(21,59,55,0.22)]"
                                            : "border-[#EADCCB] bg-[#FFF8EF] text-[#153B37] shadow-[0_4px_16px_rgba(21,59,55,0.04)] hover:-translate-y-0.5 hover:border-[#D8C4A8] hover:shadow-[0_12px_26px_rgba(21,59,55,0.09)]"
                                            }`}
                                    >
                                        {isNext ? (
                                            <span className="absolute right-2.5 top-2.5 rounded-full bg-[#E8CE96] px-2 py-0.5 text-[11px] sm:text-xs font-bold text-[#153B37]">
                                                {nextPrayer?.tomorrow
                                                    ? "আগামীকাল"
                                                    : "পরবর্তী"}
                                            </span>
                                        ) : null}

                                        <span
                                            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${isNext
                                                ? "border-white/15 bg-white/10 text-[#E8CE96]"
                                                : "border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]"
                                                }`}
                                        >
                                            <DeenIcon
                                                name={prayer.icon}
                                                size={18}
                                                strokeWidth={1.7}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <h3
                                            className={`mt-3 text-sm sm:text-base font-bold ${isNext
                                                ? "text-[#FFF8E7]"
                                                : "text-[#153B37]"
                                                }`}
                                        >
                                            {prayer.label}
                                        </h3>

                                        <p className="mt-1 flex items-baseline gap-1">
                                            <span
                                                className={`text-2xl font-bold tracking-tight ${isNext
                                                    ? "text-[#E8CE96]"
                                                    : "text-[#1E4F4A]"
                                                    }`}
                                            >
                                                {time.hour}:{time.minute}
                                            </span>
                                            <span
                                                className={`text-xs sm:text-sm font-medium ${isNext
                                                    ? "text-[#DCE8E2]/70"
                                                    : "text-[#718078]"
                                                    }`}
                                            >
                                                {time.meridiem}
                                            </span>
                                        </p>

                                        <div
                                            className={`mt-3 h-px w-full ${isNext
                                                ? "bg-white/15"
                                                : "bg-[#EADCCB]"
                                                }`}
                                        />
                                        <p
                                            className={`mt-2 text-xs sm:text-sm ${isNext
                                                ? "text-[#DCE8E2]/65"
                                                : "text-[#718078]"
                                                }`}
                                        >
                                            {isNext
                                                ? nextPrayer?.tomorrow
                                                    ? "আগামীকালের প্রথম নামাজ"
                                                    : "পরবর্তী নামাজ"
                                                : "আজকের সময়সূচি"}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#EADCCB] bg-[#FFF8EF] px-3.5 py-2.5 text-xs sm:text-sm text-[#718078] sm:flex-row sm:items-center sm:justify-between">
                            <span className="inline-flex items-center gap-1.5">
                                <CircleAlert
                                    size={12}
                                    className="shrink-0 text-[#8A6A2F]"
                                    aria-hidden="true"
                                />
                                সূত্র: Aladhan API · {PRAYER_METHOD_LABEL} ·{" "}
                                {ASR_METHOD_LABEL}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <MapPin size={12} aria-hidden="true" />
                                {data.timezone || "স্থানীয় সময়"}
                                {sunrise
                                    ? ` · সূর্যোদয় ${sunrise.hour}:${sunrise.minute}`
                                    : ""}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-dashed border-[#D8C4A8] bg-[#FFF8EF] p-8 text-center">
                        <p className="text-sm sm:text-base text-[#6A7D75]">
                            এখন কোনো নামাজের সময় পাওয়া যায়নি। রিফ্রেশ করুন বা
                            অন্য এলাকা নির্বাচন করুন।
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

function SunIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
        </svg>
    );
}
