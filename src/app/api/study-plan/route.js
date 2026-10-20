import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Step 1 limit: keeps the AI response small and fast.
const MAX_DAYS = 28;
const LEVELS = ["beginner", "intermediate", "advanced"];
const TASK_TYPES = ["lesson", "practice", "revision", "quiz"];

const SYSTEM_PROMPT = `
You are EDUKIND Study Planner, an expert learning coach who builds realistic day-by-day study plans.

Return ONLY one valid JSON object. No markdown, no code fences, no text before or after it.

JSON shape:
{
  "title": "short plan title",
  "summary": "2-3 sentence overview of the plan and how it reaches the goal",
  "days": [
    {
      "focus": "main topic of this day",
      "tasks": [
        { "title": "specific, actionable task", "type": "lesson | practice | revision | quiz", "minutes": 45 }
      ]
    }
  ]
}

RULES:
- The "days" array must contain EXACTLY the number of days requested, in order.
- Each day's total task minutes should be close to the learner's daily study time. Never exceed it by more than 10 percent.
- Use 2 to 5 tasks per day. Make every task specific (for example "Build a counter with useState"), never vague (for example "Study React").
- Types: "lesson" = learning new material, "practice" = hands-on exercises or projects, "revision" = reviewing earlier topics, "quiz" = self-test.
- Start from the learner's current level and build up gradually. Do not jump to advanced ideas early.
- Add "revision" tasks regularly (roughly every 3 to 4 days) that revisit topics from earlier days. Add a "quiz" task at the end of each week.
- Make the last day a final review or small project that proves the goal is reached.
- Write titles, focus, and summary in natural Bangla. Keep programming terms, tool names, and technical words in English.
- "minutes" must be a whole number between 10 and 240.
`;

function extractJson(text) {
    const cleaned = text.replace(/```json|```/gi, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
        throw new Error("PLAN_PARSE");
    }

    return JSON.parse(cleaned.slice(start, end + 1));
}

function normalizePlan(raw) {
    const days = Array.isArray(raw?.days) ? raw.days : [];

    const cleanDays = days
        .map((day) => {
            const tasks = (Array.isArray(day?.tasks) ? day.tasks : [])
                .map((task) => ({
                    title: String(task?.title ?? "").trim(),
                    type: TASK_TYPES.includes(task?.type) ? task.type : "lesson",
                    minutes: Math.min(
                        240,
                        Math.max(10, Math.round(Number(task?.minutes) || 30))
                    ),
                }))
                .filter((task) => task.title);

            return {
                focus: String(day?.focus ?? "").trim() || "Study day",
                tasks,
            };
        })
        .filter((day) => day.tasks.length > 0);

    if (cleanDays.length === 0) {
        throw new Error("PLAN_PARSE");
    }

    return {
        title: String(raw?.title ?? "").trim() || "Study Plan",
        summary: String(raw?.summary ?? "").trim(),
        days: cleanDays,
    };
}

function errorResponse(error) {
    console.error("Study plan error:", error);

    if (error.message === "PLAN_PARSE" || error instanceof SyntaxError) {
        return NextResponse.json(
            { error: "AI পরিকল্পনাটা ঠিকভাবে তৈরি করতে পারেনি। আবার চেষ্টা করো।" },
            { status: 502 }
        );
    }

    const status = error.status === 401 ? 401 : error.status === 429 ? 429 : 500;

    const message =
        error.status === 401
            ? "Groq API key is invalid."
            : error.status === 429
                ? "Groq rate limit or usage quota exceeded."
                : error.message || "Something went wrong with AI.";

    return NextResponse.json({ error: message }, { status });
}

export async function POST(request) {
    try {
        const body = await request.json();

        const topic = String(body.topic ?? "").trim();
        const level = LEVELS.includes(body.level) ? body.level : "beginner";
        const notes = String(body.notes ?? "").trim().slice(0, 500);
        const hoursPerDay = Number(body.hoursPerDay);
        const deadlineDays = Math.floor(Number(body.deadlineDays));

        if (topic.length < 2 || topic.length > 200) {
            return NextResponse.json(
                { error: "কী শিখতে চাও সেটা লেখো (২ থেকে ২০০ অক্ষর)।" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(hoursPerDay) || hoursPerDay < 0.5 || hoursPerDay > 12) {
            return NextResponse.json(
                { error: "প্রতিদিনের সময় ০.৫ থেকে ১২ ঘণ্টার মধ্যে দাও।" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(deadlineDays) || deadlineDays < 1) {
            return NextResponse.json(
                { error: "Deadline আজ বা ভবিষ্যতের কোনো তারিখ হতে হবে।" },
                { status: 400 }
            );
        }

        const plannedDays = Math.min(deadlineDays, MAX_DAYS);
        const truncated = deadlineDays > MAX_DAYS;
        const minutesPerDay = Math.round(hoursPerDay * 60);

        const userPrompt = `
Create a study plan with these details:

- Goal (what to learn): ${topic}
- Current level: ${level}
- Number of days: ${plannedDays}
- Daily study time: ${hoursPerDay} hours (${minutesPerDay} minutes)
${notes ? `- Learner's extra notes: ${notes}` : ""}
${truncated ? `- Note: the full deadline is ${deadlineDays} days, but plan only the FIRST ${plannedDays} days as a strong foundation.` : ""}

The "days" array must have exactly ${plannedDays} items.
`;

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.5,
            max_completion_tokens: 8000,
            reasoning_effort: "low",
        });

        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("PLAN_PARSE");
        }

        const plan = normalizePlan(extractJson(content));

        return NextResponse.json({
            plan,
            plannedDays: plan.days.length,
            truncated,
        });
    } catch (error) {
        return errorResponse(error);
    }
}