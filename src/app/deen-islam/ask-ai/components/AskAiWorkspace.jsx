"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    MessageSquarePlus,
    RotateCcw,
    ScrollText,
    ShieldCheck,
    Sparkles,
    TriangleAlert,
} from "lucide-react";
import { bnSerif } from "@/lib/deen-fonts";
import ChatComposer from "./ChatComposer";
import ChatMessage from "./ChatMessage";
import WelcomePanel from "./WelcomePanel";
import { CornerOrnaments } from "./Ornaments";

const ASK_ENDPOINT = "/deen-islam/ask-ai/api/ask";

function makeId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildHistory(messageList) {
    return messageList
        .flatMap((message) => {
            if (message.role === "user") {
                return [
                    {
                        role: "user",
                        content: message.text.slice(0, 2500),
                    },
                ];
            }

            if (message.status === "done" && message.result) {
                const content = [message.result.answer, message.result.explanation]
                    .filter(Boolean)
                    .join("\n\n")
                    .slice(0, 2500);

                return content
                    ? [
                          {
                              role: "assistant",
                              content,
                          },
                      ]
                    : [];
            }

            return [];
        })
        .slice(-8);
}

export default function AskAiWorkspace() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [inputError, setInputError] = useState("");
    const [aiConfigured, setAiConfigured] = useState(null);
    const [confirmReset, setConfirmReset] = useState(false);

    const inputRef = useRef(null);
    const conversationRef = useRef(null);
    const abortRef = useRef(null);
    const sendingRef = useRef(false);

    const focusComposer = useCallback(() => {
        window.setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    useEffect(() => {
        let active = true;

        fetch(ASK_ENDPOINT)
            .then((response) => response.json())
            .then((data) => {
                if (active && typeof data.configured === "boolean") {
                    setAiConfigured(data.configured);
                }
            })
            .catch(() => {
                // The first question still returns a precise server error if
                // configuration or the provider is unavailable.
            });

        return () => {
            active = false;
            abortRef.current?.abort();
        };
    }, []);

    useEffect(() => {
        const node = conversationRef.current;

        if (node) {
            node.scrollTop = node.scrollHeight;
        }
    }, [messages, sending]);

    useEffect(() => {
        if (!confirmReset) return undefined;

        function handleEscape(event) {
            if (event.key === "Escape") setConfirmReset(false);
        }

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [confirmReset]);

    async function runRequest({ question, baseMessages, userMessage }) {
        if (sendingRef.current) return;

        const assistantId = makeId();
        const placeholder = {
            id: assistantId,
            role: "assistant",
            status: "loading",
            question,
        };

        setMessages([...baseMessages, userMessage, placeholder]);
        setInput("");
        setInputError("");
        setSending(true);
        sendingRef.current = true;

        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const response = await fetch(ASK_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify({
                    question,
                    history: buildHistory(baseMessages),
                }),
            });

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "সার্ভার থেকে সঠিক উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।"
                );
            }

            if (!response.ok || !data?.ok) {
                throw new Error(
                    data?.error ||
                        "উত্তরটি তৈরি করা যায়নি। আবার চেষ্টা করুন।"
                );
            }

            if (
                typeof data.answer !== "string" ||
                !Array.isArray(data.quranReferences) ||
                !Array.isArray(data.hadithReferences)
            ) {
                throw new Error(
                    "উত্তরের বিন্যাস সঠিক নয়। আবার চেষ্টা করুন।"
                );
            }

            setMessages((previous) =>
                previous.map((message) =>
                    message.id === assistantId
                        ? {
                              ...message,
                              status: "done",
                              result: data,
                          }
                        : message
                )
            );
        } catch (error) {
            if (error?.name === "AbortError") return;

            setMessages((previous) =>
                previous.map((message) =>
                    message.id === assistantId
                        ? {
                              ...message,
                              status: "error",
                              error:
                                  error?.message ||
                                  "একটি অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করুন।",
                          }
                        : message
                )
            );
        } finally {
            if (abortRef.current === controller) {
                abortRef.current = null;
                sendingRef.current = false;
                setSending(false);
            }
        }
    }

    function startQuestion(question) {
        const trimmed = question.trim();

        if (!trimmed) {
            setInputError("অনুগ্রহ করে একটি প্রশ্ন লিখুন।");
            focusComposer();
            return;
        }

        if (trimmed.length < 2) {
            setInputError("অন্তত দুটি অক্ষরের একটি প্রশ্ন লিখুন।");
            focusComposer();
            return;
        }

        if (trimmed.length > 1200) {
            setInputError("প্রশ্ন ১২০০ অক্ষরের মধ্যে রাখুন।");
            focusComposer();
            return;
        }

        if (sendingRef.current) return;

        if (aiConfigured === false) {
            setInput(trimmed);
            setInputError(
                "AI সেবাটি কনফিগার করা হয়নি। সার্ভারে GROQ_API_KEY যোগ করার পর আবার চেষ্টা করুন।"
            );
            focusComposer();
            return;
        }

        const userMessage = {
            id: makeId(),
            role: "user",
            text: trimmed,
        };

        runRequest({
            question: trimmed,
            baseMessages: messages,
            userMessage,
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        startQuestion(input);
    }

    function handleSuggestion(question) {
        if (sendingRef.current) {
            setInput(question);
            return;
        }

        startQuestion(question);
    }

    function handleRetry(failedMessage) {
        if (sendingRef.current) return;

        const failedIndex = messages.findIndex(
            (message) => message.id === failedMessage.id
        );

        if (failedIndex < 0) return;

        const previousMessage = messages[failedIndex - 1];
        const cutIndex =
            previousMessage?.role === "user"
                ? failedIndex - 1
                : failedIndex;
        const baseMessages = messages.slice(0, Math.max(0, cutIndex));
        const question = failedMessage.question;

        if (!question) {
            setInputError("আগের প্রশ্নটি খুঁজে পাওয়া যায়নি। আবার লিখুন।");
            focusComposer();
            return;
        }

        const userMessage = {
            id: makeId(),
            role: "user",
            text: question,
        };

        runRequest({
            question,
            baseMessages,
            userMessage,
        });
    }

    function requestNewChat() {
        if (!messages.length) {
            focusComposer();
            return;
        }

        setConfirmReset(true);
    }

    function resetConversation() {
        abortRef.current?.abort();
        abortRef.current = null;
        sendingRef.current = false;
        setSending(false);
        setMessages([]);
        setInput("");
        setInputError("");
        setConfirmReset(false);
        focusComposer();
    }

    const hasMessages = messages.length > 0;

    return (
        <div className="relative flex h-[calc(100dvh-5.625rem)] flex-col overflow-hidden">
            <div className="relative mx-auto flex h-full w-full max-w-[1180px] min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-0 -z-10 h-64 w-[min(900px,92vw)] -translate-x-1/2 rounded-full bg-[#C69B52]/[0.07] blur-3xl"
                />

                <header className="mx-auto w-full max-w-5xl shrink-0">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div className="min-w-0 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#C69B52]/30 bg-[#FBF1E8]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A6424]">
                                <Sparkles size={12} aria-hidden="true" />
                                ইসলামিক জ্ঞান · যাচাইকৃত সূত্র
                            </div>

                            <h1
                                className={`${bnSerif.className} mt-3 text-[30px] leading-[1.25] text-[#153B37] sm:text-[38px]`}
                            >
                                ইসলাম সম্পর্কে জানুন
                            </h1>

                            <p className="mt-2.5 max-w-2xl text-[13px] leading-7 text-[#5E7368] sm:text-sm">
                                কুরআন ও নির্ভরযোগ্য হাদিসের সূত্রসহ ইসলামিক
                                প্রশ্নের উত্তর খুঁজুন। উত্তর, ব্যাখ্যা এবং
                                যাচাই করা সূত্র আলাদাভাবে দেখানো হবে।
                            </p>
                        </div>

                        <div className="hidden shrink-0 grid-cols-3 gap-2 text-center lg:grid">
                            {[
                                {
                                    icon: BookOpen,
                                    title: "কুরআন",
                                    text: "আয়াত ও অনুবাদ",
                                },
                                {
                                    icon: ScrollText,
                                    title: "হাদিস",
                                    text: "রেকর্ড ও গ্রেড",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "যাচাই",
                                    text: "মডেল নয়, সার্ভার",
                                },
                            ].map(({ icon: Icon, title, text }) => (
                                <div
                                    key={title}
                                    className="w-[92px] rounded-2xl border border-[#E1EAE3] bg-white/70 px-2.5 py-3"
                                >
                                    <Icon
                                        size={16}
                                        className="mx-auto text-[#1E4F4A]"
                                        aria-hidden="true"
                                    />
                                    <p className="mt-1.5 text-[11px] font-semibold text-[#153B37]">
                                        {title}
                                    </p>
                                    <p className="mt-0.5 text-[9px] leading-4 text-[#8A9A91]">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </header>

                {aiConfigured === false ? (
                    <div
                        role="status"
                        className="mx-auto mt-4 flex w-full max-w-5xl shrink-0 items-start gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-[11px] leading-6 text-amber-800"
                    >
                        <TriangleAlert
                            size={17}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                        />
                        <span>
                            AI সেবাটি এখনো কনফিগার করা হয়নি। সার্ভারে{" "}
                            <code className="rounded bg-amber-100 px-1 py-0.5">
                                GROQ_API_KEY
                            </code>{" "}
                            যোগ করলে প্রশ্নের উত্তর পাওয়া যাবে।
                        </span>
                    </div>
                ) : null}

                <section
                    className="relative mx-auto mt-5 flex min-h-0 w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-[#D8E4DC] bg-[#FFFDF8]/90 shadow-[0_28px_70px_-52px_rgba(21,59,55,.62)] sm:mt-5 sm:rounded-[2rem]"
                    aria-label="ইসলামিক প্রশ্নোত্তর কর্মক্ষেত্র"
                >
                    <CornerOrnaments />

                    <div className="relative flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#E5EEE8] bg-[#FBFCFA]/80 px-4 py-2.5">
                        <div className="flex items-center gap-2 text-[10px] text-[#7A8B82]">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    aiConfigured === false
                                        ? "bg-amber-500"
                                        : "bg-emerald-500"
                                }`}
                                aria-hidden="true"
                            />
                            {aiConfigured === false
                                ? "AI কনফিগারেশন প্রয়োজন"
                                : "সূত্র-ভিত্তিক ইসলামিক সহায়ক"}
                        </div>

                        <button
                            type="button"
                            onClick={requestNewChat}
                            disabled={!hasMessages}
                            className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#1E4F4A]/15 bg-white px-3 py-1.5 text-[10px] font-semibold text-[#527066] transition hover:border-[#1E4F4A]/35 hover:text-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <RotateCcw size={12} aria-hidden="true" />
                            নতুন চ্যাট
                        </button>
                    </div>

                    {hasMessages ? (
                        <div
                            ref={conversationRef}
                            role="log"
                            aria-live="polite"
                            aria-relevant="additions text"
                            className="page-scrollbar-hidden relative min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5 sm:px-5 sm:py-6"
                        >
                            <div className="mx-auto w-full max-w-4xl space-y-5">
                                {messages.map((message) => (
                                    <ChatMessage
                                        key={message.id}
                                        message={message}
                                        onRetry={handleRetry}
                                        sending={sending}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <WelcomePanel
                            onSuggestion={handleSuggestion}
                            disabled={sending || aiConfigured === false}
                        />
                    )}

                    <ChatComposer
                        value={input}
                        onChange={(value) => {
                            setInput(value);
                            if (inputError) setInputError("");
                        }}
                        onSubmit={handleSubmit}
                        sending={sending}
                        disabled={sending || aiConfigured === false}
                        inputRef={inputRef}
                        aiConfigured={aiConfigured}
                        error={inputError}
                    />
                </section>

                <footer className="mx-auto mt-3 flex w-full max-w-5xl shrink-0 flex-wrap items-center justify-between gap-2 px-1 text-[10px] leading-5 text-[#8A9A91]">
                    <p className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} aria-hidden="true" />
                        শুধু সফলভাবে অনুসন্ধান করা সূত্র যাচাইকৃত হিসেবে দেখানো
                        হয়।
                    </p>
                    <p className="flex items-center gap-1.5">
                        <MessageSquarePlus size={12} aria-hidden="true" />
                        এই কথোপকথন পেজটি রিফ্রেশ করলে মুছে যাবে।
                    </p>
                </footer>
            </div>

            {confirmReset ? (
                <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
                    <button
                        type="button"
                        aria-label="নতুন চ্যাট বাতিল"
                        onClick={() => setConfirmReset(false)}
                        className="absolute inset-0 bg-[#071A16]/45 backdrop-blur-sm"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reset-chat-title"
                        className="relative w-full max-w-sm rounded-2xl border border-[#D8E4DC] bg-[#FFFBF5] p-5 shadow-2xl"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FBF1E8] text-[#8A6424]">
                            <RotateCcw size={19} aria-hidden="true" />
                        </div>
                        <h2
                            id="reset-chat-title"
                            className="mt-4 text-base font-semibold text-[#153B37]"
                        >
                            নতুন চ্যাট শুরু করবেন?
                        </h2>
                        <p className="mt-1.5 text-[12px] leading-6 text-[#5E7368]">
                            বর্তমান কথোপকথন ও তার উত্তরগুলো মুছে যাবে। এটি
                            ফিরিয়ে আনা যাবে না।
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                autoFocus
                                onClick={() => setConfirmReset(false)}
                                className="min-h-10 rounded-xl border border-[#D8E4DC] bg-white px-4 text-[12px] font-medium text-[#527066] transition hover:border-[#1E4F4A]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4F4A] focus-visible:ring-offset-2"
                            >
                                বাতিল
                            </button>
                            <button
                                type="button"
                                onClick={resetConversation}
                                className="min-h-10 rounded-xl bg-[#1E4F4A] px-4 text-[12px] font-semibold text-[#FFFBF5] transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                            >
                                নতুন চ্যাট
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
