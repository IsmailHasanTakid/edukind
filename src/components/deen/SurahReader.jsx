"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Headphones,
    Pause,
    Bookmark,
    BookmarkCheck,
    SkipBack,
    SkipForward,
    Play,
    X,
} from "lucide-react";
import { arabic } from "@/lib/deen-fonts";

const bn = (n) => n.toLocaleString("bn-BD");

const SURAH_BOOKMARKS_KEY = "deen-quran-surah-bookmarks";

export default function SurahReader({
    surahNumber,
    ayahs,
    showBismillah,
    reciter,
    onAyahChange,
}) {
    const audioRef = useRef(null);
    const currentRef = useRef(null);
    const continuousRef = useRef(false);
    const rateRef = useRef(1);
    const playRef = useRef(null);

    const [current, setCurrent] = useState(null); // চলমান আয়াতের index
    const [playing, setPlaying] = useState(false);
    const [rate, setRate] = useState(1);
    const [error, setError] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [surahBookmarks, setSurahBookmarks] = useState([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(SURAH_BOOKMARKS_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setSurahBookmarks(parsed);
                }
            }
        } catch (error) {
            console.error("সূরার বুকমার্ক লোড করা যায়নি:", error);
        }
    }, []);

    const BOOKMARKS_KEY = "deen-quran-bookmarks";

    // আগে সংরক্ষিত বুকমার্ক লোড করো
    useEffect(() => {
        try {
            const saved = localStorage.getItem(BOOKMARKS_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setBookmarks(parsed);
                }
            }
        } catch (error) {
            console.error("বুকমার্ক লোড করা যায়নি:", error);
        }
    }, []);

    // বুকমার্ক যোগ অথবা সরিয়ে ফেলো
    function toggleBookmark(ayah) {
        const exists = bookmarks.some(
            (item) =>
                item.surahNumber === surahNumber &&
                item.ayahNumber === ayah.number
        );

        const updated = exists
            ? bookmarks.filter(
                (item) =>
                    !(
                        item.surahNumber === surahNumber &&
                        item.ayahNumber === ayah.number
                    )
            )
            : [
                ...bookmarks,
                {
                    surahNumber,
                    ayahNumber: ayah.number,
                    arabic: ayah.arabic,
                    bangla: ayah.bangla,
                },
            ];

        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
            setBookmarks(updated);
        } catch (error) {
            console.error("বুকমার্ক সংরক্ষণ করা যায়নি:", error);
        }
    }
    function toggleSurahBookmark() {
        const exists = surahBookmarks.some(
            (item) => item.surahNumber === surahNumber
        );

        const updated = exists
            ? surahBookmarks.filter(
                (item) => item.surahNumber !== surahNumber
            )
            : [
                ...surahBookmarks,
                {
                    surahNumber,
                    ayahCount: ayahs.length,
                    bookmarkedAt: new Date().toISOString(),
                },
            ];

        try {
            localStorage.setItem(
                SURAH_BOOKMARKS_KEY,
                JSON.stringify(updated)
            );

            setSurahBookmarks(updated);
        } catch (error) {
            console.error("সূরার বুকমার্ক সংরক্ষণ করা যায়নি:", error);
        }
    }

    const hasAudio = ayahs.some((ayah) => ayah.audio);

    // play() বাতিল হলে (দ্রুত আয়াত বদলালে) সেটা ত্রুটি নয়
    const handlePlayError = useCallback((err) => {
        if (err?.name === "AbortError") return;
        setPlaying(false);
        setError(true);
    }, []);

    const play = useCallback(
        (index, continuous) => {
            const audio = audioRef.current;
            const ayah = ayahs[index];

            if (!audio || !ayah?.audio) return;

            continuousRef.current = continuous;
            currentRef.current = index;
            setCurrent(index);
            setError(false);
            onAyahChange?.(ayah, index);

            audio.src = ayah.audio;
            audio.defaultPlaybackRate = rateRef.current;
            audio.playbackRate = rateRef.current;

            audio
                .play()
                .then(() => setPlaying(true))
                .catch(handlePlayError);
        },
        [ayahs, handlePlayError, onAyahChange]
    );

    useEffect(() => {
        playRef.current = play;
    }, [play]);

    // একটাই Audio অবজেক্ট ব্যবহার হয় (মোবাইলে ধারাবাহিক চালানোর জন্য জরুরি)
    useEffect(() => {
        const audio = new Audio();
        audio.preload = "auto";
        audioRef.current = audio;

        const handleEnded = () => {
            const i = currentRef.current;

            if (continuousRef.current && i !== null && ayahs[i + 1]?.audio) {
                playRef.current(i + 1, true);
            } else {
                currentRef.current = null;
                continuousRef.current = false;
                setCurrent(null);
                setPlaying(false);
            }
        };

        const handleError = () => {
            setPlaying(false);
            setError(true);
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("error", handleError);

        return () => {
            audio.pause();
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            audioRef.current = null;
        };
    }, [ayahs]);

    // চলমান আয়াতে স্ক্রল
    useEffect(() => {
        if (current === null) return;

        document
            .getElementById(`ayah-${ayahs[current].number}`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [current, ayahs]);

    function resume() {
        audioRef.current
            ?.play()
            .then(() => setPlaying(true))
            .catch(handlePlayError);
    }

    function pause() {
        audioRef.current?.pause();
        setPlaying(false);
    }

    function toggleAyah(index) {
        if (current === index) {
            if (playing) pause();
            else resume();
            return;
        }

        play(index, false);
    }

    function toggleSurah() {
        if (current === null) {
            const first = ayahs.findIndex((ayah) => ayah.audio);
            if (first !== -1) play(first, true);
            return;
        }

        if (playing) pause();
        else resume();
    }

    function step(delta) {
        const next = current + delta;

        if (next >= 0 && next < ayahs.length && ayahs[next].audio) {
            play(next, continuousRef.current);
        }
    }

    function stop() {
        const audio = audioRef.current;

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

        currentRef.current = null;
        continuousRef.current = false;
        setCurrent(null);
        setPlaying(false);
    }

    function cycleRate() {
        const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];

        rateRef.current = next;
        setRate(next);

        if (audioRef.current) {
            audioRef.current.defaultPlaybackRate = next;
            audioRef.current.playbackRate = next;
        }
    }

    const progress =
        current === null ? 0 : ((current + 1) / ayahs.length) * 100;

    return (
        <div>
            {/* সম্পূর্ণ সূরা বুকমার্ক */}
            <div className="mt-6 flex justify-end">
                {(() => {
                    const isBookmarked = surahBookmarks.some(
                        (item) => item.surahNumber === surahNumber
                    );

                    return (
                        <button
                            type="button"
                            onClick={toggleSurahBookmark}
                            aria-pressed={isBookmarked}
                            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${isBookmarked
                                ? "border-[#C9A14A]/50 bg-[#FBF5E6] text-[#8A6A22]"
                                : "border-[#DCE4DF] bg-white text-[#1F6B4C] hover:border-[#C9A14A] hover:bg-[#FBF5E6]"
                                }`}
                        >
                            {isBookmarked ? (
                                <BookmarkCheck size={17} />
                            ) : (
                                <Bookmark size={17} />
                            )}

                            {isBookmarked
                                ? "সূরা বুকমার্ক করা হয়েছে"
                                : "সম্পূর্ণ সূরা বুকমার্ক করুন"}
                        </button>
                    );
                })()}
            </div>
            {/* সূরা শুনুন */}
            {hasAudio && (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E3EAE5] bg-white/90 px-4 py-3 shadow-[0_4px_18px_rgba(20,60,45,0.06)] backdrop-blur">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EE] text-[#1F8A5B]">
                            <Headphones size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#1B3A2F]">
                                তিলাওয়াত শুনুন
                            </p>
                            {reciter && (
                                <p className="text-[11px] text-[#7C8A82]">{reciter}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSurah}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#16B072] to-[#0D8453] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0D8453]/20 transition hover:brightness-110"
                    >
                        {current !== null && playing ? (
                            <>
                                <Pause size={16} /> বিরতি
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                {current === null ? "সম্পূর্ণ সূরা শুনুন" : "চালিয়ে যান"}
                            </>
                        )}
                    </button>
                </div>
            )}

            {error && (
                <p
                    role="alert"
                    className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700"
                >
                    অডিও চালানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করো।
                </p>
            )}

            {/* বিসমিল্লাহ */}
            {showBismillah && (
                <p
                    dir="rtl"
                    lang="ar"
                    className={`${arabic.className} mt-8 text-center text-4xl leading-[2] text-[#1F6B4C]`}
                >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </p>
            )}

            {/* আয়াতসমূহ */}
            <div className="mt-8 space-y-4 pb-28">
                {ayahs.map((ayah, index) => {
                    const active = current === index;

                    return (
                        <article
                            key={ayah.number}
                            id={`ayah-${ayah.number}`}
                            className={`scroll-mt-24 rounded-2xl border p-5 shadow-[0_4px_18px_rgba(20,60,45,0.06)] backdrop-blur transition duration-300 sm:p-6 ${active
                                ? "border-[#119A62]/50 bg-[#F2FAF5] ring-2 ring-[#119A62]/25"
                                : "border-white/80 bg-white/90"
                                }`}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="inline-flex items-center rounded-full border border-[#E5D6A8] bg-[#FBF5E6] px-3 py-1 text-xs font-semibold text-[#8A6A22]">
                                    {bn(surahNumber)}:{bn(ayah.number)}
                                </span>

                                {ayah.audio && (
                                    <div className="flex items-center gap-2">
                                        {(() => {
                                            const isBookmarked = bookmarks.some(
                                                (item) =>
                                                    item.surahNumber === surahNumber &&
                                                    item.ayahNumber === ayah.number
                                            );

                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleBookmark(ayah)}
                                                    aria-label={
                                                        isBookmarked
                                                            ? "বুকমার্ক সরিয়ে ফেলুন"
                                                            : "আয়াত বুকমার্ক করুন"
                                                    }
                                                    aria-pressed={isBookmarked}
                                                    title={
                                                        isBookmarked
                                                            ? "বুকমার্ক সরিয়ে ফেলুন"
                                                            : "বুকমার্ক করুন"
                                                    }
                                                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${isBookmarked
                                                        ? "border-[#C9A14A]/50 bg-[#FBF5E6] text-[#A47A22]"
                                                        : "border-[#DCE4DF] bg-white text-[#718078] hover:border-[#C9A14A]/60 hover:text-[#A47A22]"
                                                        }`}
                                                >
                                                    {isBookmarked ? (
                                                        <BookmarkCheck size={17} />
                                                    ) : (
                                                        <Bookmark size={17} />
                                                    )}
                                                </button>
                                            );
                                        })()}

                                        {ayah.audio && (
                                            <button
                                                type="button"
                                                onClick={() => toggleAyah(index)}
                                                aria-label={
                                                    active && playing
                                                        ? `আয়াত ${bn(ayah.number)} বিরতি`
                                                        : `আয়াত ${bn(ayah.number)} শুনুন`
                                                }
                                                className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${active && playing
                                                    ? "border-transparent bg-[#119A62] text-white"
                                                    : "border-[#DCE4DF] bg-white text-[#1F8A5B] hover:border-[#119A62]/50"
                                                    }`}
                                            >
                                                {active && playing ? (
                                                    <Pause size={15} />
                                                ) : (
                                                    <Play size={15} className="ml-0.5" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <p
                                dir="rtl"
                                lang="ar"
                                className={`${arabic.className} text-right text-[32px] leading-[2.4] text-[#12281F] sm:text-4xl`}
                            >
                                {ayah.arabic}
                            </p>

                            <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#C9A14A]/40 to-transparent" />

                            <p className="text-[15px] leading-8 text-[#3F5148]">
                                {ayah.bangla}
                            </p>
                        </article>
                    );
                })}
            </div>

            {/* ভাসমান প্লেয়ার বার */}
            {current !== null && (
                <div className="fixed inset-x-0 bottom-20 z-30 px-4 lg:bottom-4 lg:pl-[276px]">
                    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#E8C872]/30 bg-[#0B3B2D]/95 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                    আয়াত {bn(ayahs[current].number)} / {bn(ayahs.length)}
                                </p>
                                {reciter && (
                                    <p className="truncate text-[11px] text-[#C9D8CF]">
                                        {reciter}
                                    </p>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => step(-1)}
                                disabled={current === 0}
                                aria-label="আগের আয়াত"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#E3ECE6] transition hover:bg-white/10 disabled:opacity-30"
                            >
                                <SkipBack size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={toggleSurah}
                                aria-label={playing ? "বিরতি" : "চালান"}
                                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#F6E3A1] to-[#C9993A] text-[#0B3B2D] shadow-lg transition hover:brightness-105"
                            >
                                {playing ? (
                                    <Pause size={19} />
                                ) : (
                                    <Play size={19} className="ml-0.5" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => step(1)}
                                disabled={current === ayahs.length - 1}
                                aria-label="পরের আয়াত"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#E3ECE6] transition hover:bg-white/10 disabled:opacity-30"
                            >
                                <SkipForward size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={cycleRate}
                                aria-label="গতি পরিবর্তন"
                                className="rounded-full border border-white/20 px-2.5 py-1 text-xs font-medium text-[#E8C872] transition hover:bg-white/10"
                            >
                                {rate}×
                            </button>

                            <button
                                type="button"
                                onClick={stop}
                                aria-label="বন্ধ করুন"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[#C9D8CF] transition hover:bg-white/10 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="h-1 bg-white/10">
                            <div
                                className="h-full bg-gradient-to-r from-[#F6E3A1] to-[#C9993A] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}