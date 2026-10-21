import {
    BookMarked,
    BookOpen,
    Bookmark,
    GraduationCap,
    Heart,
    History,
    Info,
    LibraryBig,
    List,
    Search,
    Sparkles,
    Tag,
} from "lucide-react";

export const HOME_HREF = "/deen-islam";

const infoItem = (key) => ({
    label: "পরিচিতি",
    href: `/deen-islam/${key}`,
    icon: Info,
    exact: true,
});


export const SECTIONS = {
    quran: {
        title: "আল-কুরআন",
        subtitle: "আরবি ও বাংলা অনুবাদ",
        icon: BookOpen,
        items: [
            {
                label: "সূরার তালিকা",
                href: "/deen-islam/quran",
                icon: List,
                exact: true,
                alsoMatch: /^\/deen-islam\/quran\/\d+\/?$/,
            },
            {
                label: "সূরা খুঁজুন",
                href: "/deen-islam/quran#quran-search",
                icon: Search,
                exact: true,
            },

            {
                label: "বুকমার্ক",
                href: "/deen-islam/quran/bookmarks",
                icon: Bookmark,
            },
            {
                label: "আয়াত খুঁজুন",
                href: "/deen-islam/quran/search",
                icon: Search,
            },

        ],
        footer: {
            title: "অল্প অল্প করে পড়ুন",
            text: "নিয়মিত পড়ুন, অর্থ বুঝে পড়ুন।",
        },
    },

    hadith: {
        title: "হাদিস",
        subtitle: "সূত্রসহ সংগ্রহ",
        icon: BookMarked,
        items: [
            {
                label: "হাদিস গ্রন্থসমূহ",
                href: "/deen-islam/hadith",
                icon: List,
                exact: true,
            },
            {
                label: "হাদিস খুঁজুন",
                href: "/deen-islam/hadith/search",
                icon: Search,
                comingSoon: true,
            },
            {
                label: "বিষয়ভিত্তিক",
                href: "/deen-islam/hadith/topics",
                icon: Tag,
                comingSoon: true,
            },
            {
                label: "বুকমার্ক",
                href: "/deen-islam/hadith/bookmarks",
                icon: Bookmark,
                comingSoon: true,
            },
        ],
        footer: {
            title: "সূত্র মিলিয়ে নিন",
            text: "প্রতিটি হাদিসের গ্রন্থ ও নম্বর দেখে নিন।",
        },
    },

    "ai-assistant": {
        title: "AI Islamic Assistant",
        subtitle: "প্রশ্ন করুন, সূত্রসহ জানুন",
        icon: Sparkles,
        comingSoon: true,
        items: [infoItem("ai-assistant")],
    },

    "ai-lessons": {
        title: "AI Lessons",
        subtitle: "ধাপে ধাপে শেখা",
        icon: GraduationCap,
        comingSoon: true,
        items: [infoItem("ai-lessons")],
    },

    duas: {
        title: "দোয়া ও যিকির",
        subtitle: "অর্থসহ দোয়া",
        icon: Heart,
        comingSoon: true,
        items: [infoItem("duas")],
    },

    history: {
        title: "ইসলামের ইতিহাস",
        subtitle: "সিরাত ও গুরুত্বপূর্ণ ঘটনা",
        icon: History,
        comingSoon: true,
        items: [infoItem("history")],
    },
};

export const DEFAULT_FOOTER = {
    title: "জ্ঞানের পথে এগিয়ে চলুন",
    text: "প্রতিদিন কিছু শিখুন, জীবনে ধারণ করুন।",
};

// /deen-islam/quran/36 → "quran"
export function getSectionKey(pathname) {
    return pathname.split("/")[2] ?? null;
}



export function isItemActive(item, pathname, hash = "") {
    // Hash link: যেমন সূরা খুঁজুন
    if (item.href.includes("#")) {
        const [itemPath, itemHash] = item.href.split("#");

        return (
            pathname === itemPath &&
            hash === `#${itemHash}`
        );
    }

    // একই পেজে অন্য hash সক্রিয় থাকলে
    // সূরার তালিকাকে selected করবে না
    if (hash && pathname === item.href) {
        return false;
    }

    if (pathname === item.href) return true;

    if (item.alsoMatch?.test(pathname)) return true;

    if (item.exact) return false;

    return pathname.startsWith(`${item.href}/`);
}

