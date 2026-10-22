
import AdmZip from "adm-zip";
import fs from "node:fs";
import path from "node:path";

const REPO_URL =
    "https://github.com/kafelanetwork/hadith-api/archive/refs/heads/main.zip";

const COLLECTIONS = {
    Bukhari: { id: "bukhari", name: "সহিহ বুখারি" },
    Muslim: { id: "muslim", name: "সহিহ মুসলিম" },
    AbuDaud: { id: "abudawood", name: "সুনান আবু দাউদ" },
    "At-tirmizi": { id: "tirmidhi", name: "জামে আত-তিরমিজি" },
    "Al-Nasai": { id: "nasai", name: "সুনান আন-নাসাঈ" },
    "Ibne-Mazah": { id: "ibnmajah", name: "সুনান ইবনে মাজাহ" },
};

async function buildIndex() {
    console.log("হাদিসের ডেটাসেট ডাউনলোড হচ্ছে...");

    const response = await fetch(REPO_URL);

    if (!response.ok) {
        throw new Error(`ডাউনলোড ব্যর্থ: HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    const hadiths = [];

    for (const entry of entries) {
        const match = entry.entryName.match(
            /(?:^|\/)(Bukhari|Muslim|AbuDaud|At-tirmizi|Al-Nasai|Ibne-Mazah)\/hadith\/(\d+)\.json$/i
        );

        if (!match || entry.isDirectory) continue;

        const folder = Object.keys(COLLECTIONS).find(
            (name) => name.toLowerCase() === match[1].toLowerCase()
        );

        if (!folder) continue;

        try {
            const raw = JSON.parse(entry.getData().toString("utf8"));
            const hadith = raw.hadith;

            if (!hadith?.ar?.trim() || !hadith?.bn?.trim()) {
                continue;
            }

            hadiths.push({
                collectionId: COLLECTIONS[folder].id,
                collectionName: COLLECTIONS[folder].name,
                number: Number(match[2]),
                ar: hadith.ar,
                bn: hadith.bn,
                narrator: hadith.narrator || "",
                grade: hadith.grade || "",
            });
        } catch {
            console.warn(`একটি ফাইল পড়া যায়নি: ${entry.entryName}`);
        }

        if (hadiths.length > 0 && hadiths.length % 1000 === 0) {
            console.log(`${hadiths.length}টি হাদিস ইনডেক্স করা হয়েছে...`);
        }
    }

    hadiths.sort(
        (a, b) =>
            a.collectionId.localeCompare(b.collectionId) ||
            a.number - b.number
    );

    const outputDir = path.join(process.cwd(), "data");
    fs.mkdirSync(outputDir, { recursive: true });

    const outputFile = path.join(
        outputDir,
        "hadith-search-index.json"
    );

    fs.writeFileSync(
        outputFile,
        JSON.stringify(hadiths),
        "utf8"
    );

    console.log(`সম্পন্ন! মোট ${hadiths.length}টি হাদিস ইনডেক্স হয়েছে।`);
    console.log(`ফাইল তৈরি হয়েছে: ${outputFile}`);
}

buildIndex().catch((error) => {
    console.error("Index তৈরি করা যায়নি:", error);
    process.exitCode = 1;
});
