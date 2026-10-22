import { bangla } from "@/lib/deen-fonts";
import AskAiWorkspace from "./components/AskAiWorkspace";

export const metadata = {
    title: "ইসলাম সম্পর্কে জানুন | EDUKIND DeenIslam",
    description:
        "কুরআন ও নির্ভরযোগ্য হাদিসের সূত্রসহ ইসলামিক প্রশ্নের উত্তর খুঁজুন। যাচাইকৃত উৎস, স্পষ্ট ব্যাখ্যা এবং সীমাবদ্ধতার নোটসহ।",
};

export default function AskAiPage() {
    return (
        <main
            lang="bn"
            className={`${bangla.className} -mx-12 min-h-[calc(100dvh-5.625rem)] bg-[#FFFBF5] text-[#153B37]`}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(198,155,82,.10),transparent_28%),radial-gradient(circle_at_86%_18%,rgba(30,79,74,.09),transparent_32%),linear-gradient(180deg,#FFFBF5_0%,#FBF7EF_100%)]"
            />
            <AskAiWorkspace />
        </main>
    );
}
