import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const BASE_URL =
    "https://cdn.jsdelivr.net/gh/kafelanetwork/hadith-api@main";

const COLLECTIONS = {
    bukhari: {
        name: "সহিহ বুখারি",
        folder: "Bukhari",
        meta: "bukhari.json",
        total: 7563,
    },
    muslim: {
        name: "সহিহ মুসলিম",
        folder: "Muslim",
        meta: "muslim.json",
        total: 7453,
    },
    abudawood: {
        name: "সুনান আবু দাউদ",
        folder: "AbuDaud",
        meta: "abudaud.json",
        total: 5274,
    },
    tirmidhi: {
        name: "জামে আত-তিরমিজি",
        folder: "At-tirmizi",
        meta: "at-tirmizi.json",
        total: 3956,
    },
    nasai: {
        name: "সুনান আন-নাসাঈ",
        folder: "Al-Nasai",
        meta: "nasa'i.json",
        total: 5758,
    },
    ibnmajah: {
        name: "সুনান ইবনে মাজাহ",
        folder: "Ibne-Mazah",
        meta: "ibnemajah.json",
        total: 4341,
    },
};


let hadithIndexPromise;

async function getHadithIndex() {
    if (!hadithIndexPromise) {
        const filePath = path.join(
            process.cwd(),
            "data",
            "hadith-search-index.json"
        );

        hadithIndexPromise = fs
            .readFile(filePath, "utf8")
            .then((content) => JSON.parse(content))
            .catch((error) => {
                hadithIndexPromise = null;
                throw error;
            });
    }

    return hadithIndexPromise;
}

function normalizeSearchText(value = "") {
    return value
        .normalize("NFKC")
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .toLocaleLowerCase("bn")
        .trim();
}


export async function GET(request) {
    const { searchParams } = new URL(request.url);

    const action = searchParams.get("action") || "collections";
    const collectionId = searchParams.get("collection") || "";
    const number = Number(searchParams.get("number"));

    try {
        if (action === "collections") {
            return NextResponse.json({
                success: true,
                collections: Object.entries(COLLECTIONS).map(
                    ([id, collection]) => ({
                        id,
                        ...collection,
                    })
                ),
            });
        }

        const collection = COLLECTIONS[collectionId];

        if (!collection) {
            return NextResponse.json(
                {
                    success: false,
                    message: "হাদিসের কিতাব পাওয়া যায়নি।",
                },
                { status: 404 }
            );
        }


        if (action === "search") {
            const query = searchParams.get("q")?.trim() || "";
            const page = Math.max(
                1,
                Number.parseInt(searchParams.get("page") || "1", 10) || 1
            );
            const limit = 10;

            if (query.length < 2) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "কমপক্ষে ২টি অক্ষর দিয়ে সার্চ করুন।",
                    },
                    { status: 400 }
                );
            }

            if (query.length > 100) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "সর্বোচ্চ ১০০টি অক্ষর লিখতে পারবেন।",
                    },
                    { status: 400 }
                );
            }

            try {
                const allHadiths = await getHadithIndex();
                const normalizedQuery = normalizeSearchText(query);

                const matchedHadiths = allHadiths.filter((hadith) => {
                    if (hadith.collectionId !== collectionId) {
                        return false;
                    }

                    const arabicText = normalizeSearchText(hadith.ar);
                    const banglaText = normalizeSearchText(hadith.bn);

                    return (
                        arabicText.includes(normalizedQuery) ||
                        banglaText.includes(normalizedQuery)
                    );
                });

                const total = matchedHadiths.length;
                const totalPages = Math.ceil(total / limit);
                const start = (page - 1) * limit;

                const hadiths = matchedHadiths.slice(
                    start,
                    start + limit
                );

                return NextResponse.json({
                    success: true,
                    collection: {
                        id: collectionId,
                        name: collection.name,
                    },
                    query,
                    page,
                    limit,
                    total,
                    totalPages,
                    hadiths,
                });
            } catch (error) {
                console.error("Hadith search error:", error);

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "সার্চ ডেটা পড়া যাচ্ছে না। Index ফাইলটি তৈরি হয়েছে কি না পরীক্ষা করুন।",
                    },
                    { status: 500 }
                );
            }
        }


        if (action === "list") {
            const page = Math.max(
                1,
                Number.parseInt(searchParams.get("page") || "1", 10) || 1
            );

            const limit = 10;
            const chapterId = searchParams.get("chapter");

            let start = (page - 1) * limit + 1;
            let end = Math.min(start + limit - 1, collection.total);
            let total = collection.total;

            if (chapterId) {
                const chapterResponse = await fetch(
                    `${BASE_URL}/${collection.folder}/Meta/${collection.meta}`,
                    { next: { revalidate: 86400 } }
                );

                if (!chapterResponse.ok) {
                    throw new Error("Chapter metadata fetch failed");
                }

                const chapterData = await chapterResponse.json();
                const chapter = chapterData[chapterId];

                if (!chapter) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "অধ্যায়টি পাওয়া যায়নি।",
                        },
                        { status: 404 }
                    );
                }

                const toEnglishDigits = (value) =>
                    value
                        .replace(/[০-৯]/g, (digit) =>
                            String("০১২৩৪৫৬৭৮৯".indexOf(digit))
                        )
                        .replace(/[٠-٩]/g, (digit) =>
                            String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
                        );

                const range = toEnglishDigits(
                    chapter.hadis_range || ""
                ).match(/(\d+)\s*[-–—]\s*(\d+)/);

                if (!range) {
                    throw new Error("Invalid chapter hadith range");
                }

                const chapterStart = Number(range[1]);
                const chapterEnd = Math.min(
                    Number(range[2]),
                    collection.total
                );

                total = chapterEnd - chapterStart + 1;
                start = chapterStart + (page - 1) * limit;
                end = Math.min(start + limit - 1, chapterEnd);

                if (
                    !Number.isSafeInteger(chapterStart) ||
                    !Number.isSafeInteger(chapterEnd) ||
                    total < 1 ||
                    page > Math.ceil(total / limit)
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "এই অধ্যায়ে আর কোনো হাদিস নেই।",
                        },
                        { status: 404 }
                    );
                }
            }

            const numbers = Array.from(
                { length: end - start + 1 },
                (_, index) => start + index
            );

            const hadiths = await Promise.all(
                numbers.map(async (number) => {
                    const response = await fetch(
                        `${BASE_URL}/${collection.folder}/hadith/${number}.json`,
                        { next: { revalidate: 3600 } }
                    );

                    if (!response.ok) {
                        throw new Error(`Hadith ${number} fetch failed`);
                    }

                    const result = await response.json();
                    const hadith = result.hadith;

                    if (!hadith?.ar?.trim() || !hadith?.bn?.trim()) {
                        return null;
                    }

                    return {
                        ...hadith,
                        number,
                    };
                })
            );

            return NextResponse.json({
                success: true,
                collection: {
                    id: collectionId,
                    name: collection.name,
                },
                chapterId: chapterId || null,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hadiths: hadiths.filter(Boolean),
            });
        }



        if (action === "hadith") {
            if (
                !Number.isSafeInteger(number) ||
                number < 1 ||
                number > collection.total
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "সঠিক হাদিস নম্বর দিন।",
                    },
                    { status: 400 }
                );
            }

            const response = await fetch(
                `${BASE_URL}/${collection.folder}/hadith/${number}.json`,
                { next: { revalidate: 3600 } }
            );

            if (!response.ok) {
                throw new Error("Hadith data fetch failed");
            }

            const result = await response.json();
            const hadith = result.hadith;

            if (
                !hadith ||
                !hadith.ar?.trim() ||
                !hadith.bn?.trim()
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "এই হাদিসের আরবি বা বাংলা পাঠ পাওয়া যায়নি।",
                    },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                collection: {
                    id: collectionId,
                    name: collection.name,
                },
                hadith,
            });
        }


        if (action === "search") {
            const query = searchParams.get("q")?.trim();
            const page = Math.max(1, Number(searchParams.get("page")) || 1);
            const limit = 10;

            if (!query || query.length < 2) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "কমপক্ষে ২টি অক্ষর দিয়ে খুঁজুন।",
                    },
                    { status: 400 }
                );
            }

            if (query.length > 100) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "সর্বোচ্চ ১০০টি অক্ষর লিখতে পারবেন।",
                    },
                    { status: 400 }
                );
            }

            // প্রথমে নির্দিষ্ট হাদিসের নম্বর দিয়ে খোঁজার সুবিধা।
            const hadithNumber = Number(query);

            if (
                /^\d+$/.test(query) &&
                Number.isSafeInteger(hadithNumber) &&
                hadithNumber >= 1 &&
                hadithNumber <= collection.total
            ) {
                const response = await fetch(
                    `${BASE_URL}/${collection.folder}/hadith/${hadithNumber}.json`,
                    { next: { revalidate: 3600 } }
                );

                if (response.ok) {
                    const result = await response.json();
                    const hadith = result.hadith;

                    if (hadith?.ar?.trim() && hadith?.bn?.trim()) {
                        return NextResponse.json({
                            success: true,
                            collection: {
                                id: collectionId,
                                name: collection.name,
                            },
                            query,
                            page: 1,
                            limit,
                            total: 1,
                            totalPages: 1,
                            hadiths: [{ ...hadith, number: hadithNumber }],
                        });
                    }
                }
            }

            return NextResponse.json({
                success: true,
                collection: {
                    id: collectionId,
                    name: collection.name,
                },
                query,
                page: 1,
                limit,
                total: 0,
                totalPages: 0,
                hadiths: [],
                message:
                    "শব্দ দিয়ে পূর্ণাঙ্গ অনুসন্ধানের জন্য হাদিসের ডেটাসেট ইনডেক্স করা প্রয়োজন।",
            });
        }

        if (action === "chapters") {
            const response = await fetch(
                `${BASE_URL}/${collection.folder}/Meta/${collection.meta}`,
                { next: { revalidate: 86400 } }
            );

            if (!response.ok) {
                throw new Error("Chapter data fetch failed");
            }

            const result = await response.json();

            return NextResponse.json({
                success: true,
                collection: {
                    id: collectionId,
                    name: collection.name,
                },
                chapters: Object.entries(result).map(([id, chapter]) => ({
                    id,
                    ...chapter,
                })),
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "এই API action সমর্থিত নয়।",
            },
            { status: 400 }
        );
    } catch (error) {
        console.error("Hadith API error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    "হাদিসের তথ্য আনা যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।",
            },
            { status: 502 }
        );
    }
}
