import { containsBengali } from "./interview";

export function getSpeechRecognition() {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function getSpeechSynthesis() {
    if (typeof window === "undefined") return null;
    return "speechSynthesis" in window ? window.speechSynthesis : null;
}

export function recognitionLanguage(language) {
    return language === "বাংলা" || language === "Bangla + English"
        ? "bn-BD"
        : "en-US";
}

export function findVoice(voices, languageCode) {
    if (!Array.isArray(voices) || voices.length === 0) return null;

    const target = String(languageCode).replace("_", "-").toLowerCase();
    const prefix = target.split("-")[0];

    const exact = voices.find(
        (voice) => String(voice.lang || "").replace("_", "-").toLowerCase() === target
    );
    if (exact) return exact;

    // Only match within the same language family. An English voice must never
    // be used to read Bengali text.
    return (
        voices.find(
            (voice) =>
                String(voice.lang || "").replace("_", "-").toLowerCase().split("-")[0] ===
                prefix
        ) || null
    );
}

export function resolveSpeechVoice(voices, language, text) {
    const needsBengali =
        language === "বাংলা" ||
        (language === "Bangla + English" && containsBengali(text));

    if (needsBengali) {
        const voice = findVoice(voices, "bn-BD") || findVoice(voices, "bn-IN");

        if (!voice) {
            return {
                error:
                    "এই browser-এ বাংলা text-to-speech voice পাওয়া যায়নি। প্রশ্নটি লিখিতভাবে পড়ো অথবা browser-এ বাংলা voice যোগ করো।",
            };
        }

        return { lang: voice.lang || "bn-BD", voice };
    }

    const voice = findVoice(voices, "en-US") || findVoice(voices, "en-GB");

    return { lang: voice?.lang || "en-US", voice: voice || null };
}

export function speakText({
    text,
    language,
    voices,
    onStart,
    onEnd,
    onError,
}) {
    const synthesis = getSpeechSynthesis();

    if (!synthesis) {
        return { error: "এই browser-এ voice playback support নেই।" };
    }

    if (!text || !String(text).trim()) {
        return { error: "পড়ার জন্য কোনো text নেই।" };
    }

    const resolved = resolveSpeechVoice(voices, language, String(text));

    if (resolved.error) {
        return { error: resolved.error };
    }

    synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = resolved.lang;
    if (resolved.voice) utterance.voice = resolved.voice;
    utterance.rate = language === "বাংলা" ? 0.95 : 1;

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = (event) => {
        const reason = event?.error;

        if (reason === "interrupted" || reason === "canceled") {
            onEnd?.();
            return;
        }

        onError?.(
            reason === "not-allowed"
                ? "Browser voice playback ব্লক করেছে। আবার চেষ্টা করো।"
                : "প্রশ্নটি শোনানো যায়নি। আবার চেষ্টা করো।"
        );
    };

    synthesis.speak(utterance);

    return { ok: true };
}

export function stopSpeaking() {
    const synthesis = getSpeechSynthesis();
    synthesis?.cancel();
}
