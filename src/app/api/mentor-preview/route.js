import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const LIMIT = 4; // client-এর LIMIT-এর সাথে একই রাখো
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_CHARS = 300;

// সহজ in-memory limiter (dev ও ছোট deploy-এর জন্য ঠিক আছে)
const hits = new Map();

function getIp(req) {
    const forwarded = req.headers.get("x-forwarded-for");
    return forwarded ? forwarded.split(",")[0].trim() : "local";
}

const SYSTEM_PROMPT = `You are EDUKIND AI Mentor, a friendly teacher for every learner, from class 6 school students to university students.
Rules:
- Match the learner's level. If the level is unclear, explain in very simple words first, then add one slightly deeper point.
- Keep answers short (about 5-8 lines) with one easy example when it helps.
- Reply in the language of the question. If it is Bangla or Banglish (Bangla in English letters), reply in Bangla script.
- Keep technical terms and code in English.
- Use fenced code blocks only for real code.
- If you are not sure, say so honestly.
- If asked who made you: you are an AI application, EDUKIND, created by Ismail Hasan Takid.`;

export async function POST(req) {
    const ip = getIp(req);
    const now = Date.now();
    const rec = hits.get(ip);
    const current = rec && rec.resetAt > now ? rec : { count: 0, resetAt: now + WINDOW_MS };

    if (current.count >= LIMIT) {
        return NextResponse.json({ error: "limit", remaining: 0 }, { status: 429 });
    }

    let message = "";
    try {
        const body = await req.json();
        message = typeof body.message === "string" ? body.message.trim() : "";
    } catch {
        return NextResponse.json({ error: "bad_request" }, { status: 400 });
    }

    if (!message || message.length > MAX_CHARS) {
        return NextResponse.json({ error: "invalid_message" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
        return NextResponse.json({ error: "missing_key" }, { status: 500 });
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b", // তোমার চালু route-এর model-ই
            temperature: 0.6,
            reasoning_effort: "low", // reasoning model, তাই চিন্তায় token কম খরচ
            max_completion_tokens: 1500,
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message },
            ],
        });

        const reply = completion.choices?.[0]?.message?.content?.trim() || "";

        // সফল হলেই count বাড়াও
        current.count += 1;
        hits.set(ip, current);

        return NextResponse.json({ reply, remaining: LIMIT - current.count });
    } catch (error) {
        console.error("mentor-preview error:", error); // কারণ terminal-এ দেখা যাবে
        return NextResponse.json({ error: "ai_failed" }, { status: 502 });
    }
}