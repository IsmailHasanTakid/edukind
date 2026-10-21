
"use client";

import { useState } from "react";

export default function VoiceTestPage() {
    const [status, setStatus] = useState("Ready");
    const [text, setText] = useState(
        "আসসালামু আলাইকুম। আমি EDUKIND AI ইন্টারভিউয়ার। আজ আমরা তোমার পছন্দের বিষয় নিয়ে কথা বলব।"
    );
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [error, setError] = useState("");

    async function speakBengali() {
        setLoading(true);
        setError("");
        setStatus("বাংলা voice model লোড হচ্ছে...");

        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl("");
        }

        try {
            const { PiperWebEngine } = await import("piper-tts-web");

            const engine = new PiperWebEngine();

            setStatus("বাংলা audio তৈরি হচ্ছে...");

            const response = await engine.generate(
                text,
                "bn_BD-google-medium",
                0
            );

            // প্রথমে response-এর প্রকৃত structure পরীক্ষা করি।
            console.log("Piper generation response:", response);

            const audioFile = response?.file;

            if (!(audioFile instanceof Blob)) {
                throw new Error(
                    "Audio তৈরি হয়েছে কি না নিশ্চিত করা যায়নি। Browser Console-এ Piper response দেখো।"
                );
            }

            const url = URL.createObjectURL(audioFile);

            setAudioUrl(url);
            setStatus("বাংলা audio তৈরি হয়েছে!");
        } catch (err) {
            console.error("Bengali TTS error:", err);
            setError(err?.message || "বাংলা voice তৈরি করা যায়নি।");
            setStatus("Voice test failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#080A12] px-6 py-14 text-white">
            <div className="mx-auto max-w-2xl space-y-6">
                <p className="text-sm font-semibold tracking-widest text-cyan-400">
                    EDUKIND AI · VOICE LAB
                </p>

                <h1 className="text-3xl font-bold">
                    বাংলা AI Voice Test
                </h1>

                <p className="text-gray-400">
                    নিজের বাংলা test sentence লিখে AI voice পরীক্ষা করো।
                </p>

                <label className="block space-y-2">
                    <span className="text-sm text-gray-300">
                        যে বাক্যটি শোনাতে চাও
                    </span>

                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none focus:border-cyan-400"
                    />
                </label>

                <button
                    onClick={speakBengali}
                    disabled={loading || !text.trim()}
                    className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black disabled:opacity-50"
                >
                    {loading ? "অপেক্ষা করো..." : "বাংলা Voice তৈরি করো"}
                </button>

                <section className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-gray-400">Status</p>
                    <p>{status}</p>

                    {audioUrl && (
                        <audio
                            controls
                            preload="metadata"
                            src={audioUrl}
                            className="w-full"
                        />
                    )}

                    {error && (
                        <p className="whitespace-pre-wrap text-sm text-amber-300">
                            {error}
                        </p>
                    )}
                </section>
            </div>
        </main>
    );
}
