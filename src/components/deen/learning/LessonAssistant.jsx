"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    AlertCircle,
    BookOpenCheck,
    LoaderCircle,
    Send,
    Sparkles,
    WandSparkles,
} from "lucide-react";

const SUGGESTIONS = [
    "Explain this lesson in simple Bangla.",
    "Give me one example and one practice question.",
    "Summarise the key points of this lesson.",
    "Quiz me on this lesson, one question at a time.",
];

function Message({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm sm:text-base leading-6 sm:max-w-[86%] ${
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

export default function LessonAssistant({ course, lesson }) {
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

    useEffect(() => {
        return () => abortRef.current?.abort();
    }, []);

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
                    mode: "quran-academy",
                    courseId: course.id,
                    lessonId: lesson.id,
                    messages: history.slice(-16),
                }),
            });

            if (!response.ok) {
                let message = "The lesson assistant could not respond.";

                try {
                    const payload = await response.json();
                    if (payload?.error) message = payload.error;
                } catch {
                    // Keep the default message when the response is not JSON.
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
                    "The lesson assistant could not respond. Please try again."
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
        <section
            aria-labelledby="lesson-assistant-heading"
            className="overflow-hidden rounded-2xl border border-[#DCE8DF] bg-[#F8FBF9]"
        >
            <div className="flex items-start gap-3 border-b border-[#DCE8DF] bg-[#0C2E24] px-4 py-3.5 text-white sm:px-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E7CE93]/20 bg-[#E7CE93]/10 text-[#E7CE93]">
                    <Sparkles size={17} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                    <h2
                        id="lesson-assistant-heading"
                        className="text-sm sm:text-base font-semibold"
                    >
                        Lesson Assistant
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm leading-5 text-emerald-50/55">
                        Explains this lesson only. It cannot hear or certify
                        recitation.
                    </p>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="max-h-[430px] min-h-[190px] space-y-3 overflow-y-auto px-3.5 py-4 sm:px-5"
                aria-live="polite"
            >
                {messages.length === 0 ? (
                    <div className="rounded-xl border border-[#E0E9E3] bg-white px-4 py-4">
                        <p className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#294B3A]">
                            <BookOpenCheck
                                size={14}
                                aria-hidden="true"
                                className="text-[#1B7A53]"
                            />
                            Study this lesson with guidance
                        </p>
                        <p className="mt-2 text-xs sm:text-sm leading-6 text-[#7A887F]">
                            Ask for a simpler explanation, an example, a
                            summary, or practice questions. The assistant uses
                            the current course, module, lesson, and knowledge
                            check as its context.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => sendMessage(suggestion)}
                                    disabled={loading}
                                    className="rounded-full border border-[#D8E5DC] bg-[#F8FBF9] px-3 py-1.5 text-left text-xs sm:text-sm font-medium text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#EEF7F1] disabled:opacity-50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <Message key={index} message={message} />
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
                    <WandSparkles
                        size={15}
                        aria-hidden="true"
                        className="mb-2 shrink-0 text-[#8A978F]"
                    />
                    <textarea
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        maxLength={2000}
                        placeholder="Ask about this lesson..."
                        aria-label="Ask the lesson assistant"
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
                    Educational support only. Verify Quranic text and
                    recitation with the verified reader and a qualified
                    teacher.
                </p>
            </form>
        </section>
    );
}
