
"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

const STORAGE_KEY = "edukind-saved-hadith-v1";

export default function HadithBookmarkButton({
    hadith,
    collectionId,
    collectionName,
}) {
    const [saved, setSaved] = useState(false);
    const [ready, setReady] = useState(false);

    const hadithNumber = Number(hadith?.number);

    useEffect(() => {
        try {
            const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            setSaved(
                stored.some(
                    (item) =>
                        item.collectionId === collectionId &&
                        Number(item.number) === hadithNumber
                )
            );
        } catch {
            setSaved(false);
        } finally {
            setReady(true);
        }
    }, [collectionId, hadithNumber]);

    function toggleBookmark() {
        if (!ready || !hadith?.ar || !hadith?.bn || !hadithNumber) {
            return;
        }

        try {
            const stored = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            const exists = stored.some(
                (item) =>
                    item.collectionId === collectionId &&
                    Number(item.number) === hadithNumber
            );

            let updated;

            if (exists) {
                updated = stored.filter(
                    (item) =>
                        !(
                            item.collectionId === collectionId &&
                            Number(item.number) === hadithNumber
                        )
                );
            } else {
                updated = [
                    ...stored,
                    {
                        collectionId,
                        collectionName,
                        number: hadithNumber,
                        ar: hadith.ar,
                        bn: hadith.bn,
                        savedAt: new Date().toISOString(),
                    },
                ];
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setSaved(!exists);
        } catch {
            window.alert("হাদিস সেভ করা যায়নি। আবার চেষ্টা করুন।");
        }
    }

    return (
        <button
            type="button"
            onClick={toggleBookmark}
            disabled={!ready}
            aria-pressed={saved}
            title={saved ? "সেভ করা হাদিস থেকে সরান" : "হাদিস সেভ করুন"}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${saved
                    ? "border-violet-400/30 bg-violet-400/10 text-violet-300"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-violet-400/30 hover:text-white"
                }`}
        >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {saved ? "সেভ করা হয়েছে" : "হাদিস সেভ করুন"}
        </button>
    );
}
