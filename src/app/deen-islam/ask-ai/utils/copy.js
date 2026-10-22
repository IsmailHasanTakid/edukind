export async function copyText(text) {
    const value = String(text || "");

    if (!value) {
        throw new Error("কপি করার জন্য কোনো লেখা নেই।");
    }

    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(value);
            return;
        } catch {
            // Some browsers expose the API but deny permission. Fall back to
            // a temporary selection so the copy action still has a chance.
        }
    }

    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    let copied = false;

    try {
        copied = document.execCommand("copy");
    } finally {
        document.body.removeChild(textarea);
    }

    if (!copied) {
        throw new Error("কপি করা যায়নি।");
    }
}

export function answerForCopy(result) {
    const parts = [result.answer, result.explanation]
        .filter(Boolean)
        .join("\n\n");

    return parts;
}

export function referenceForCopy(reference) {
    if (reference.kind === "quran") {
        const lines = [
            `কুরআন — সূরা ${reference.surahName} (${reference.surahNumber}:${reference.ayahNumber})`,
            reference.arabic,
        ];

        if (reference.translation?.text) {
            lines.push(
                `অনুবাদ (${reference.translation.translator}): ${reference.translation.text}`
            );
        }

        if (reference.sourceUrl) lines.push(reference.sourceUrl);
        return lines.join("\n");
    }

    const lines = [
        `হাদিস — ${reference.collectionName}, হাদিস ${reference.number}`,
    ];

    if (reference.narrator) lines.push(`বর্ণনাকারী: ${reference.narrator}`);
    if (reference.grade) lines.push(`উৎস-প্রদত্ত গ্রেড: ${reference.grade}`);
    lines.push(reference.arabic);

    if (reference.translation?.text) {
        lines.push(`অনুবাদ: ${reference.translation.text}`);
    }

    if (reference.sourceUrl) lines.push(reference.sourceUrl);
    return lines.join("\n");
}

export function referencesForCopy(result) {
    const lines = [];

    for (const reference of result.quranReferences || []) {
        lines.push(
            `কুরআন — সূরা ${reference.surahName} (${reference.surahNumber}:${reference.ayahNumber})`
        );
        lines.push(reference.arabic);

        if (reference.translation?.text) {
            lines.push(
                `অনুবাদ (${reference.translation.translator}): ${reference.translation.text}`
            );
        }

        if (reference.sourceUrl) lines.push(reference.sourceUrl);
        lines.push("");
    }

    for (const reference of result.hadithReferences || []) {
        lines.push(
            `হাদিস — ${reference.collectionName}, হাদিস ${reference.number}`
        );

        if (reference.narrator) {
            lines.push(`বর্ণনাকারী: ${reference.narrator}`);
        }

        if (reference.grade) {
            lines.push(`উৎস-প্রদত্ত গ্রেড: ${reference.grade}`);
        }

        lines.push(reference.arabic);

        if (reference.translation?.text) {
            lines.push(`অনুবাদ: ${reference.translation.text}`);
        }

        if (reference.sourceUrl) lines.push(reference.sourceUrl);
        lines.push("");
    }

    return lines.join("\n").trim();
}
