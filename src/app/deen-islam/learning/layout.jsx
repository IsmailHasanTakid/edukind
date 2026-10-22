import LearningSidebar from "@/components/deen/learning/LearningSidebar";
import { bangla } from "@/lib/deen-fonts";

export const metadata = {
    title: "Quran Learning Academy | EDUKIND DeenIslam",
    description:
        "A focused Quran learning space for courses, Quran reading, progress, and AI-assisted learning.",
};

export default function LearningLayout({ children }) {
    return (
        <div
            className={`${bangla.className} -mx-12 flex min-h-[calc(100dvh-5rem)] flex-col bg-[#F5F8F6] text-[#173B2D] lg:flex-row`}
        >
            <LearningSidebar />
            <main className="min-w-0 flex-1">{children}</main>
        </div>
    );
}
