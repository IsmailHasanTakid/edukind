"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    LoaderCircle,
    Send,
    Sparkles,
} from "lucide-react";
import {
    LearningFooter,
    LearningPageHeader,
} from "./learning-ui";

const SUGGESTIONS = [
    "Explain the difference between madd and ghunnah in simple Bangla.",
    "Give me a 20-minute Quran reading practice routine.",
    "How should I revise after a failed knowledge check?",
    "What should I practise after Quran Reading Foundations?",
];

function ChatMessage({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-6 sm:max-w-[85%] ${
                    isUser
                        ? "rounded-br-md bg-[#1B6B4B] text-white"
                        : "rounded-bl-md border border-[#E0E9E3] bg-white text-[#3E5B4C]"
                }`}
            >
                {isUser ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                ) : message.text ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-headings:mb-2 prose-headings:mt-3 prose-headings:text-[#173B2D] prose-strong:text-[#173B2D] prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-li:text-[#3E5B4C] prose-p:text-[#3E5B4C]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.text}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <span className="inline-flex items-center gap-2 text-[#7A887F]">
                        <LoaderCircle
                            size={13}
                            className="animate-spin"
                            aria-hidden="true"
                        />
                        Thinking...
                    </span>
                )}
            </div>
        </div>
    );
}

export default function LearningAssistantView() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const scrollRef = useRef(null);
    const abortRef = useRef(null);

    useEffect(() => {
        const node = scrollRef.current;
        if (node) node.scrollTop = node.scrollHeight;
    }, [messages, loading]);

    useEffect(() => () => abortRef.current?.abort(), []);

    async function sendMessage(text) {
        const question = text.trim();
        if (!question || loading) return;

        const history = [...messages, { role: "user", text: question }];
        setMessages([...history, { role: "assistant", text: "" }]);
        setInput("");
        setLoading(true);
        setError("");

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    mode: "quran-study",
                    messages: history.slice(-16),
                }),
            });

            if (!response.ok) {
                let message = "The learning assistant could not respond.";

                try {
                    const payload = await response.json();
                    if (payload?.error) message = payload.error;
                } catch {
                    // Keep the fallback message.
                }

                throw new Error(message);
            }

            if (!response.body) {
                throw new Error("The assistant returned an empty response.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            const chunks = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(decoder.decode(value, { stream: true }));
                const assistantText = chunks.join("");

                setMessages((previous) => {
                    const next = previous.slice();
                    next[next.length - 1] = {
                        role: "assistant",
                        text: assistantText,
                    };
                    return next;
                });
            }
        } catch (requestError) {
            if (requestError.name === "AbortError") return;

            setError(
                requestError.message ||
                    "The learning assistant could not respond. Please try again."
            );
            setMessages((previous) => {
                const next = previous.slice();
                const last = next[next.length - 1];

                if (last?.role === "assistant" && !last.text) next.pop();

                return next;
            });
        } finally {
            setLoading(false);
            abortRef.current = null;
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        sendMessage(input);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage(input);
        }
    }

    return (
        <main className="relative min-h-full overflow-hidden bg-[#F5F8F6]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
                style={{
                    background:
                        "radial-gradient(ellipse at top right, rgba(31,138,91,0.08), transparent 66%)",
                }}
            />

            <div className="relative mx-auto max-w-[1100px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
                <LearningPageHeader
                    title="AI Learning Assistant"
                    description="Ask for explanations, practice questions, or study guidance. The predefined Academy courses remain the authoritative curriculum."
                >
                    <Link
                        href="/deen-islam/learning/courses"
                        className="inline-flex items-center gap-2 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                    >
                        <BookOpen size={13} aria-hidden="true" />
                        Browse courses
                    </Link>
                </LearningPageHeader>

                <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                    <section className="overflow-hidden rounded-2xl border border-[#DCE8DF] bg-[#F8FBF9]">
                        <div className="flex items-center gap-3 border-b border-[#DCE8DF] bg-[#0C2E24] px-4 py-3.5 text-white sm:px-5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7CE93]/20 bg-[#E7CE93]/10 text-[#E7CE93]">
                                <Sparkles size={17} aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-sm sm:text-base font-semibold">
                                    Study support
                                </h2>
                                <p className="mt-0.5 text-xs sm:text-sm text-emerald-50/55">
                                    Explains, practises, and recommends. Does
                                    not create a new curriculum.
                                </p>
                            </div>
                        </div>

                        <div
                            ref={scrollRef}
                            className="max-h-[520px] min-h-[360px] space-y-3 overflow-y-auto px-3.5 py-4 sm:px-5"
                            aria-live="polite"
                        >
                            {messages.length === 0 ? (
                                <div className="rounded-xl border border-[#E0E9E3] bg-white px-4 py-4">
                                    <p className="text-xs sm:text-sm font-semibold text-[#294B3A]">
                                        What would you like help with?
                                    </p>
                                    <p className="mt-1.5 text-xs sm:text-sm leading-6 text-[#7A887F]">
                                        For the best help with a specific
                                        lesson, open that lesson and use the
                                        assistant inside it. The assistant there
                                        receives the course, module, lesson, and
                                        knowledge check as context.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        {SUGGESTIONS.map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                type="button"
                                                onClick={() =>
                                                    sendMessage(suggestion)
                                                }
                                                className="rounded-full border border-[#D8E5DC] bg-[#F8FBF9] px-3 py-1.5 text-left text-xs sm:text-sm font-medium text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#EEF7F1]"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <ChatMessage
                                        key={index}
                                        message={message}
                                    />
                                ))
                            )}
                        </div>

                        {error ? (
                            <p
                                role="alert"
                                className="mx-3.5 mb-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs sm:text-sm leading-5 text-amber-800 sm:mx-5"
                            >
                                <AlertCircle
                                    size={13}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0"
                                />
                                {error}
                            </p>
                        ) : null}

                        <form
                            onSubmit={handleSubmit}
                            className="border-t border-[#E0E9E3] bg-white p-3 sm:p-4"
                        >
                            <div className="flex items-end gap-2 rounded-xl border border-[#DCE6DE] bg-[#FBFDFB] px-3 py-2 focus-within:border-[#79A98C]">
                                <textarea
                                    value={input}
                                    onChange={(event) =>
                                        setInput(event.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    rows={1}
                                    maxLength={2000}
                                    placeholder="Ask a study question..."
                                    aria-label="Ask the AI learning assistant"
                                    className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm sm:text-base leading-5 text-[#294B3A] outline-none placeholder:text-[#9AA69D]"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    aria-label="Send question"
                                    className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B6B4B] text-white transition hover:bg-[#14563B] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {loading ? (
                                        <LoaderCircle
                                            size={14}
                                            className="animate-spin"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Send size={13} aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            <p className="mt-2 text-[11px] sm:text-xs leading-4 text-[#9AA69D]">
                                Educational support only. It cannot certify
                                recitation or issue religious rulings.
                            </p>
                        </form>
                    </section>

                    <aside className="space-y-3">
                        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                            <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                Curriculum stays fixed
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm leading-5 text-[#7A887F]">
                                Course order, lessons, sources, and completion
                                criteria come from the predefined catalog. The
                                assistant cannot silently replace them.
                            </p>
                            <Link
                                href="/deen-islam/learning/courses"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] hover:text-[#14563B]"
                            >
                                Explore curriculum
                                <ArrowRight size={11} aria-hidden="true" />
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-[#EADFC8] bg-[#FBF7EC] p-4">
                            <h2 className="text-sm sm:text-base font-semibold text-[#5F4A1E]">
                                Recitation needs a teacher
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm leading-5 text-[#8A6418]">
                                Text cannot hear pronunciation. Use reliable
                                audio and a qualified teacher for articulation
                                and recitation feedback.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E0E9E3] bg-white p-4">
                            <h2 className="text-sm sm:text-base font-semibold text-[#173B2D]">
                                Prefer lesson context?
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm leading-5 text-[#7A887F]">
                                Open any course lesson and use the Lesson
                                Assistant for help tied to that exact lesson.
                            </p>
                            <Link
                                href="/deen-islam/learning/my-courses"
                                className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B7A53] hover:text-[#14563B]"
                            >
                                My Courses
                                <ArrowRight size={11} aria-hidden="true" />
                            </Link>
                        </div>
                    </aside>
                </div>

                <LearningFooter />
            </div>
        </main>
    );
}
