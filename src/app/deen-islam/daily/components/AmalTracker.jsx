"use client";

import { useEffect, useRef, useState } from "react";
import {
    Check,
    ListChecks,
    Plus,
    RotateCcw,
    Sparkles,
    Trash2,
    Undo2,
} from "lucide-react";
import { bnSerif } from "@/lib/deen-fonts";
import { DEFAULT_HABITS, MAX_CUSTOM_HABITS } from "../data/amal";
import { toBn } from "../utils/dates";
import { DeenIcon } from "./icons";
import SectionHeading from "./SectionHeading";

function HabitRow({ habit, done, onToggle, onRemove }) {
    return (
        <li
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition ${
                done
                    ? "border-[#B9D6C9] bg-[#F2F8F4]"
                    : "border-transparent hover:bg-[#FBF5EC]"
            }`}
        >
            <button
                type="button"
                role="checkbox"
                aria-checked={done}
                onClick={() => onToggle(habit.id)}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
            >
                <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                        done
                            ? "border-[#1E4F4A] bg-[#1E4F4A] text-white"
                            : "border-[#CBB9A2] bg-white text-transparent"
                    }`}
                >
                    <Check size={14} strokeWidth={2.4} aria-hidden="true" />
                </span>

                <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        done
                            ? "border-[#B9D6C9] bg-white text-[#1E4F4A]"
                            : "border-[#E4D2B8] bg-[#FFFBF5] text-[#8A6A2F]"
                    }`}
                >
                    <DeenIcon
                        name={habit.icon}
                        size={16}
                        strokeWidth={1.7}
                        aria-hidden="true"
                    />
                </span>

                <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                        <span
                            className={`text-sm sm:text-base font-semibold ${
                                done
                                    ? "text-[#718078] line-through decoration-[#9FC4B5]"
                                    : "text-[#153B37]"
                            }`}
                        >
                            {habit.label}
                        </span>
                        {habit.custom ? (
                            <span className="rounded-full border border-[#E4D2B8] bg-[#FBF1E8] px-1.5 py-0.5 text-[11px] sm:text-xs font-semibold text-[#8A6A2F]">
                                নিজের
                            </span>
                        ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs sm:text-sm leading-5 text-[#839088]">
                        {habit.description}
                    </span>
                </span>
            </button>

            {habit.custom ? (
                <button
                    type="button"
                    onClick={() => onRemove(habit.id)}
                    aria-label={`${habit.label} আমলটি মুছুন`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#A08F7A] transition hover:bg-[#F7E8E4] hover:text-[#A54A3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52]"
                >
                    <Trash2 size={14} aria-hidden="true" />
                </button>
            ) : null}
        </li>
    );
}

export default function AmalTracker({
    completed,
    ready,
    customHabits,
    onToggle,
    onAddCustomHabit,
    onRemoveCustomHabit,
    onReset,
    onRestore,
    dateLabel,
}) {
    const [input, setInput] = useState("");
    const [formMessage, setFormMessage] = useState(null);
    const [undo, setUndo] = useState(null);
    const undoTimer = useRef(null);

    useEffect(() => {
        return () => {
            if (undoTimer.current) clearTimeout(undoTimer.current);
        };
    }, []);

    const habits = [...DEFAULT_HABITS, ...customHabits];
    const habitIds = new Set(habits.map((habit) => habit.id));
    const validCompleted = completed.filter((id) => habitIds.has(id));
    const total = habits.length;
    const doneCount = validCompleted.length;
    const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    const isComplete = total > 0 && doneCount === total;
    const customCount = customHabits.length;
    const canAdd = customCount < MAX_CUSTOM_HABITS;

    const handleSubmit = (event) => {
        event.preventDefault();
        const result = onAddCustomHabit(input);

        if (!result?.ok) {
            setFormMessage({
                type: "error",
                text: result?.message ?? "আমলটি যোগ করা যায়নি।",
            });
            return;
        }

        setInput("");
        setFormMessage({
            type: "success",
            text: "নতুন আমল যোগ হয়েছে। আজকের তালিকায় এটি চিহ্নিত করতে পারেন।",
        });
    };

    const handleReset = () => {
        if (doneCount === 0) return;

        setUndo({ snapshot: validCompleted });
        onReset();

        if (undoTimer.current) clearTimeout(undoTimer.current);
        undoTimer.current = setTimeout(() => setUndo(null), 8000);
    };

    const handleRestore = () => {
        if (!undo) return;
        onRestore(undo.snapshot);
        setUndo(null);
        if (undoTimer.current) clearTimeout(undoTimer.current);
    };

    return (
        <section
            id="amal"
            aria-labelledby="amal-heading"
            className="scroll-mt-24 pt-8 sm:pt-10"
        >
            <SectionHeading
                eyebrow="AMAL · DAILY PRACTICE"
                title="আজকের আমল"
                description="দিনের ইবাদত ও ভালো কাজের একটি ব্যক্তিগত চেকলিস্ট। এটি নিজের হিসাব রাখার সহায়ক, ইবাদতের গ্রহণযোগ্যতার মাপকাঠি নয়।"
                icon={ListChecks}
                headingId="amal-heading"
                action={
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={doneCount === 0}
                        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D8C4A8] bg-white px-4 text-xs sm:text-sm font-semibold text-[#1E4F4A] transition hover:border-[#C69B52] hover:bg-[#FFF8EF] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <RotateCcw size={13} aria-hidden="true" />
                        আজকের অগ্রগতি রিসেট
                    </button>
                }
            />

            <div className="mt-5 grid gap-3.5 lg:grid-cols-[0.82fr_1.8fr]">
                <aside className="relative overflow-hidden rounded-2xl border border-[#2D6A60] bg-[#1E4F4A] p-5 text-white shadow-[0_18px_40px_rgba(21,59,55,0.18)]">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full border border-[#E8CE96]/15"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-5 -top-6 h-24 w-24 rotate-45 border border-[#E8CE96]/10"
                    />

                    <div className="relative">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-[#E8CE96]/80">
                            আজকের অগ্রগতি
                        </p>

                        <div className="mt-4 flex items-center gap-4">
                            <div
                                className="relative flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background: `conic-gradient(#E8CE96 ${
                                        percent * 3.6
                                    }deg, rgba(255,255,255,0.14) 0deg)`,
                                }}
                                role="img"
                                aria-label={`আজকের আমল ${toBn(percent)} শতাংশ সম্পন্ন`}
                            >
                                <div className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-[#1E4F4A]">
                                    <span className="text-xl font-bold leading-none text-[#FFF8E7]">
                                        {ready ? toBn(percent) : "—"}
                                        <span className="text-xs sm:text-sm font-medium text-[#DCE8E2]/70">
                                            %
                                        </span>
                                    </span>
                                    <span className="mt-1 text-[11px] sm:text-xs text-[#DCE8E2]/70">
                                        সম্পন্ন
                                    </span>
                                </div>
                            </div>

                            <div className="min-w-0">
                                <p className="flex items-baseline gap-1 text-[#FFF8E7]">
                                    <span className="text-2xl font-bold">
                                        {ready ? toBn(doneCount) : "—"}
                                    </span>
                                    <span className="text-sm text-[#DCE8E2]/70">
                                        / {toBn(total)} টি
                                    </span>
                                </p>
                                <p className="mt-1 text-xs sm:text-sm leading-5 text-[#DCE8E2]/65">
                                    {isComplete
                                        ? "আজকের সব আমল চিহ্নিত হয়েছে।"
                                        : doneCount === 0
                                          ? "আজ এখনও কোনো আমল চিহ্নিত করা হয়নি।"
                                          : "চেকলিস্টে চাপ দিয়ে অগ্রগতি বাড়ান।"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/15">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#E8CE96] to-[#C69B52] transition-[width] duration-500"
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-[#DCE8E2]/55">
                            {dateLabel
                                ? `${dateLabel} · স্থানীয় তারিখ অনুযায়ী`
                                : "স্থানীয় তারিখ অনুযায়ী সংরক্ষিত"}
                        </p>
                    </div>
                </aside>

                <div className="rounded-2xl border border-[#EADCCB] bg-[#FFF8EF] p-3.5 sm:p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EADCCB] pb-3">
                        <h3 className="text-sm sm:text-base font-bold text-[#153B37]">
                            আমলের তালিকা
                        </h3>
                        <span className="text-xs sm:text-sm text-[#718078]">
                            {toBn(total)}টি আমল · {toBn(customCount)}টি নিজের
                        </span>
                    </div>

                    {!ready ? (
                        <div className="mt-3 space-y-2" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-14 animate-pulse rounded-xl bg-[#F1E7DA]"
                                />
                            ))}
                        </div>
                    ) : (
                        <ul className="mt-2">
                            {habits.map((habit) => (
                                <HabitRow
                                    key={habit.id}
                                    habit={habit}
                                    done={validCompleted.includes(habit.id)}
                                    onToggle={onToggle}
                                    onRemove={onRemoveCustomHabit}
                                />
                            ))}
                        </ul>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-3 rounded-xl border border-dashed border-[#D8C4A8] bg-[#FFFBF5] p-3"
                    >
                        <label
                            htmlFor="custom-amal"
                            className="block text-xs sm:text-sm font-semibold text-[#405A52]"
                        >
                            নিজের আমল যোগ করুন
                        </label>
                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                            <input
                                id="custom-amal"
                                type="text"
                                value={input}
                                onChange={(event) => {
                                    setInput(event.target.value);
                                    if (formMessage?.type === "error") {
                                        setFormMessage(null);
                                    }
                                }}
                                maxLength={60}
                                disabled={!canAdd}
                                placeholder="যেমন: পরিবারকে সময় দেওয়া"
                                className="min-h-10 min-w-0 flex-1 rounded-lg border border-[#DDCDB7] bg-white px-3 text-sm text-[#153B37] outline-none transition placeholder:text-[#97A29B] focus:border-[#1E4F4A] focus:ring-4 focus:ring-[#1E4F4A]/10 disabled:cursor-not-allowed disabled:bg-[#F5EFE6]"
                            />
                            <button
                                type="submit"
                                disabled={!canAdd || !input.trim()}
                                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#1E4F4A] px-3.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#153B37] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                            >
                                <Plus size={13} aria-hidden="true" />
                                যোগ করুন
                            </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-[#839088]">
                            <span>
                                সর্বোচ্চ {toBn(MAX_CUSTOM_HABITS)}টি নিজের আমল
                                রাখা যাবে।
                            </span>
                            <span>
                                {toBn(customCount)}/{toBn(MAX_CUSTOM_HABITS)}
                            </span>
                        </div>

                        {formMessage ? (
                            <p
                                role="status"
                                className={`mt-2 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm leading-5 ${
                                    formMessage.type === "success"
                                        ? "bg-[#EAF3EF] text-[#1E4F4A]"
                                        : "bg-[#FBEDE9] text-[#A54A3A]"
                                }`}
                            >
                                {formMessage.text}
                            </p>
                        ) : null}

                        {!canAdd ? (
                            <p className="mt-2 text-xs sm:text-sm leading-5 text-[#8A6A2F]">
                                নিজের আমলের সীমা পূর্ণ। নতুন যোগ করতে একটি পুরনো
                                আমল মুছে ফেলুন।
                            </p>
                        ) : null}
                    </form>
                </div>
            </div>

            {undo ? (
                <div
                    role="status"
                    className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#D8C4A8] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#405A52] shadow-[0_8px_20px_rgba(21,59,55,0.06)]"
                >
                    <span>আজকের অগ্রগতি রিসেট হয়েছে।</span>
                    <button
                        type="button"
                        onClick={handleRestore}
                        className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-[#1E4F4A] px-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#153B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B52] focus-visible:ring-offset-2"
                    >
                        <Undo2 size={12} aria-hidden="true" />
                        ফিরিয়ে আনুন
                    </button>
                </div>
            ) : null}

            {isComplete ? (
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#9FC4B5] bg-[#F2F8F4] px-3.5 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1E4F4A] text-white">
                        <Sparkles size={15} aria-hidden="true" />
                    </span>
                    <div>
                        <p
                            className={`${bnSerif.className} text-sm font-bold text-[#153B37]`}
                        >
                            আজকের সব আমল চিহ্নিত হয়েছে
                        </p>
                        <p className="mt-1 text-xs sm:text-sm leading-5 text-[#5B6F67]">
                            অগ্রগতি সংরক্ষিত আছে। ইবাদতের গ্রহণযোগ্যতা ও
                            প্রতিদানের বিষয়টি আল্লাহর কাছে।
                        </p>
                    </div>
                </div>
            ) : null}

            <p className="mt-3 text-xs sm:text-sm leading-6 text-[#839088]">
                এই চেকলিস্ট কোনো ফরজ বা ওয়াজিবের তালিকা নয় এবং ইবাদতের
                বৈধতা নির্ধারণ করে না। ব্যক্তিগত দায়িত্বশীলতার জন্য এটি একটি
                সহায়ক মাধ্যম। দ্বীনি মাসআলায় নির্ভরযোগ্য আলেমের পরামর্শ নিন।
            </p>
        </section>
    );
}
