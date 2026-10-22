"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, LoaderCircle } from "lucide-react";

const MAX_LENGTH = 1200;

export default function ChatComposer({
    value,
    onChange,
    onSubmit,
    sending,
    disabled,
    inputRef,
    placeholder = "ইসলাম সম্পর্কে আপনার প্রশ্ন লিখুন…",
    aiConfigured,
    error,
}) {
    const formRef = useRef(null);
    const composingRef = useRef(false);
    const localInputRef = useRef(null);
    const effectiveInputRef = inputRef || localInputRef;

    useEffect(() => {
        const node = effectiveInputRef.current;

        if (!node) return;

        node.style.height = "auto";
        node.style.height = `${Math.min(node.scrollHeight, 176)}px`;
    }, [value, effectiveInputRef]);

    function handleKeyDown(event) {
        if (event.key !== "Enter" || event.shiftKey) return;

        if (
            event.nativeEvent?.isComposing ||
            composingRef.current ||
            event.keyCode === 229
        ) {
            return;
        }

        event.preventDefault();
        formRef.current?.requestSubmit();
    }

    return (
        <div className="shrink-0 border-t border-[#E3ECE6] bg-[#FFFDF8]/95 px-3 py-3 backdrop-blur sm:px-5 sm:py-4">
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className="mx-auto w-full max-w-4xl"
            >
                {error ? (
                    <p
                        role="alert"
                        className="mb-2 rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800"
                    >
                        {error}
                    </p>
                ) : null}
                <div
                    className={`group flex items-end gap-2 rounded-2xl border bg-white p-2 shadow-[0_14px_34px_-30px_rgba(21,59,55,0.65)] transition focus-within:border-[#1E4F4A]/45 focus-within:ring-4 focus-within:ring-[#1E4F4A]/[0.06] ${
                        disabled
                            ? "border-[#E5ECE7] opacity-75"
                            : "border-[#D7E3DA]"
                    }`}
                >
                    <label htmlFor="ask-ai-question" className="sr-only">
                        ইসলাম সম্পর্কে আপনার প্রশ্ন
                    </label>
                    <textarea
                        ref={effectiveInputRef}
                        id="ask-ai-question"
                        rows={1}
                        value={value}
                        maxLength={MAX_LENGTH}
                        onChange={(event) => onChange(event.target.value)}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={() => {
                            composingRef.current = true;
                        }}
                        onCompositionEnd={() => {
                            composingRef.current = false;
                        }}
                        disabled={disabled}
                        placeholder={
                            aiConfigured === false
                                ? "AI সেবা কনফিগার না হওয়া পর্যন্ত প্রশ্ন পাঠানো যাবে না।"
                                : placeholder
                        }
                        aria-describedby="ask-ai-composer-hint"
                        className="min-h-11 max-h-44 flex-1 resize-none bg-transparent px-3 py-2.5 text-[14px] leading-6 text-[#153B37] outline-none placeholder:text-[#95A49B] disabled:cursor-not-allowed sm:text-[15px]"
                    />

                    <button
                        type="submit"
                        disabled={
                            disabled || sending || !value.trim()
                        }
                        aria-label={sending ? "উত্তর তৈরি হচ্ছে" : "প্রশ্ন পাঠান"}
                        className="mb-0.5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1E4F4A] px-3.5 text-sm font-semibold text-[#FFFBF5] shadow-sm transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#B9C8C0] sm:px-4"
                    >
                        {sending ? (
                            <LoaderCircle
                                size={17}
                                className="animate-spin motion-reduce:animate-none"
                                aria-hidden="true"
                            />
                        ) : (
                            <ArrowUp size={18} aria-hidden="true" />
                        )}
                        <span className="hidden sm:inline">
                            {sending ? "অপেক্ষা করুন" : "পাঠান"}
                        </span>
                    </button>
                </div>

                <div
                    id="ask-ai-composer-hint"
                    className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1 text-[10px] text-[#8A9A91]"
                >
                    <span>
                        Enter দিয়ে পাঠান · Shift + Enter দিয়ে নতুন লাইন
                    </span>
                    <span
                        className={
                            value.length > 1050
                                ? "font-medium text-amber-700"
                                : ""
                        }
                    >
                        {value.length}/{MAX_LENGTH}
                    </span>
                </div>
            </form>
        </div>
    );
}
