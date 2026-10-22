import QuranLearningView from "@/components/deen/learning/QuranLearningView";
import { getSurahList } from "@/lib/quran";

export const metadata = {
    title: "Read Quran | Quran Learning Academy | EDUKIND",
    description:
        "Read verified Quranic Arabic with Bengali translation, recitation audio, bookmarks, and saved reading position.",
};

export default async function LearningQuranPage() {
    let surahs = [];
    let loadError = false;

    try {
        surahs = await getSurahList();
    } catch (error) {
        console.error("Could not load Quran surah list:", error);
        loadError = true;
    }

    return (
        <QuranLearningView
            surahs={Array.isArray(surahs) ? surahs : []}
            loadError={loadError}
        />
    );
}
