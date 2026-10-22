import Link from "next/link";
import { serif } from "@/lib/deen-fonts";

export default function PageFooter() {
    return (
        <footer className="border-t border-white/10 bg-[#071E17]">
            <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs sm:text-sm text-[#AFC4B8]/55 sm:flex-row sm:px-8">
                <div className="flex items-center gap-3">
                    <Link
                        href="/deen-islam"
                        className="font-semibold tracking-wide text-[#E8D6A4] transition hover:text-[#FFF3D1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                    >
                        EDUKIND
                    </Link>
                    <span className="h-4 w-px bg-white/15" />
                    <span className={`${serif.className} text-base text-[#C9B170]`}>
                        DeenIslam
                    </span>
                </div>
                <p>সূত্রসহ ইসলামিক জ্ঞান · Learn with purpose</p>
                <Link
                    href="/deen-islam/history"
                    className="text-[#AFC4B8]/45 transition hover:text-[#E8D6A4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BC79]/60"
                >
                    নবী-রাসূলদের জীবনী
                </Link>
            </div>
        </footer>
    );
}
