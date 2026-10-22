import {
    Bookmark,
    BookOpen,
    CalendarDays,
    Check,
    ListChecks,
    MoonStar,
    Sun,
} from "lucide-react";

const LINKS = [
    { href: "#amal", label: "আজকের আমল", icon: ListChecks },
    { href: "#prayer-times", label: "নামাজের সময়", icon: Sun },
    { href: "#duas", label: "দৈনন্দিন দোয়া", icon: BookOpen },
    { href: "#adhkar", label: "সকাল-সন্ধ্যা", icon: MoonStar },
    { href: "#calendar", label: "হিজরি ক্যালেন্ডার", icon: CalendarDays },
    { href: "#guides", label: "ইসলামিক গাইড", icon: Check },
];

export default function SectionNav({ onOpenFavorites }) {
    return (
        <nav
            aria-label="পেজের বিভাগসমূহ"
            className="sticky top-0 z-30 -mx-1 mt-5 border-y border-[#EADCCB] bg-[#FFFBF5]/95 px-1 py-2 backdrop-blur-md"
        >
            <div className="page-scrollbar-hidden flex items-center gap-1.5 overflow-x-auto">
                {LINKS.map(({ href, label, icon: Icon }) => (
                    <a
                        key={href}
                        href={href}
                        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-[#5B6F67] transition hover:bg-[#F3E9DC] hover:text-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-1"
                    >
                        <Icon
                            size={13}
                            className="text-[#8A6A2F]"
                            aria-hidden="true"
                        />
                        {label}
                    </a>
                ))}

                <span
                    aria-hidden="true"
                    className="mx-1 h-4 w-px shrink-0 bg-[#E4D6C4]"
                />

                <button
                    type="button"
                    onClick={onOpenFavorites}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#D9C09A] bg-[#FBF1E8] px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#6F5322] transition hover:border-[#C69B52] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-1"
                >
                    <Bookmark size={13} aria-hidden="true" />
                    ফেভারিট
                </button>
            </div>
        </nav>
    );
}
