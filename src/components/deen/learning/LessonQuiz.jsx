"use client";

import { useMemo, useState } from "react";
import {
    CheckCircle2,
    RotateCcw,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import {
    getBestQuizAttempt,
    getLatestQuizAttempt,
} from "@/lib/learning/progress";

export default function LessonQuiz({ lesson, record, onAttempt }) {
    const quiz = useMemo(() => lesson.quiz || [], [lesson.quiz]);
    const passingScore = Number(lesson.passingScore) || 70;
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const bestAttempt = getBestQuizAttempt(record, lesson.id);
    const latestAttempt = getLatestQuizAttempt(record, lesson.id);
    const answeredCount = useMemo(
        () => quiz.filter((question) => answers[question.id] !== undefined).length,
        [answers, quiz]
    );

    if (quiz.length === 0) return null;

    function submit(event) {
        event.preventDefault();
        if (answeredCount !== quiz.length) return;

        const details = quiz.map((question) => {
            const selected = answers[question.id];
            const correct = selected === question.answer;

            return {
                questionId: question.id,
                selected,
                correct,
                question: question.question,
                selectedText: question.options[selected] || "",
                correctText: question.options[question.answer] || "",
            };
        });

        const score = details.filter((item) => item.correct).length;
        const percentage = Math.round((score / quiz.length) * 100);
        const nextResult = {
            score,
            total: quiz.length,
            percentage,
            passed: percentage >= passingScore,
            answers: details,
        };

        setResult(nextResult);
        onAttempt(nextResult);
    }

    function retake() {
        setAnswers({});
        setResult(null);
    }

    const bestPercentage = bestAttempt?.percentage ?? 0;
    const passedBefore = bestPercentage >= passingScore;

    return (
        <section
            aria-labelledby="lesson-quiz-heading"
            className="rounded-2xl border border-[#E0E9E3] bg-white p-4 sm:p-5"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-[#8A978F]">
                        Knowledge check
                    </p>
                    <h2
                        id="lesson-quiz-heading"
                        className="mt-1 text-base font-semibold text-[#173B2D]"
                    >
                        Check your understanding
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm leading-5 text-[#7A887F]">
                        Answer all {quiz.length} questions. You need{" "}
                        {passingScore}% or higher to complete this lesson.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {bestAttempt ? (
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] sm:text-xs font-semibold ${
                                passedBefore
                                    ? "border-[#CFE6D8] bg-[#EAF4EE] text-[#1B7A53]"
                                    : "border-[#EADFC8] bg-[#FBF7EC] text-[#8A6418]"
                            }`}
                        >
                            <ShieldCheck size={11} aria-hidden="true" />
                            Best: {bestPercentage}%
                        </span>
                    ) : null}

                    {latestAttempt ? (
                        <span className="text-[11px] sm:text-xs text-[#9AA69D]">
                            Latest: {latestAttempt.percentage}%
                        </span>
                    ) : null}
                </div>
            </div>

            {passedBefore && !result ? (
                <p className="mt-4 rounded-xl border border-[#CFE6D8] bg-[#F2F9F5] px-3 py-2.5 text-xs sm:text-sm leading-5 text-[#1B6B4B]">
                    You have already passed this knowledge check. You can retake
                    it for practice, or mark the lesson complete.
                </p>
            ) : null}

            <form onSubmit={submit} className="mt-5 space-y-5">
                {quiz.map((question, questionIndex) => {
                    const selected = answers[question.id];
                    const submitted = result !== null;
                    const isCorrect = selected === question.answer;

                    return (
                        <fieldset
                            key={question.id}
                            className="rounded-xl border border-[#EDF2EE] bg-[#FBFDFB] p-3.5 sm:p-4"
                        >
                            <legend className="px-1 text-sm sm:text-base font-semibold leading-5 text-[#294B3A]">
                                {questionIndex + 1}. {question.question}
                            </legend>

                            <div className="mt-2.5 space-y-1.5">
                                {question.options.map((option, optionIndex) => {
                                    const optionId = `${lesson.id}-${question.id}-${optionIndex}`;
                                    const chosen = selected === optionIndex;
                                    const correctOption =
                                        submitted &&
                                        optionIndex === question.answer;
                                    const wrongChoice =
                                        submitted && chosen && !isCorrect;

                                    return (
                                        <label
                                            key={optionId}
                                            htmlFor={optionId}
                                            className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-xs sm:text-sm leading-5 transition ${
                                                correctOption
                                                    ? "border-[#A9D5BC] bg-[#EFF8F2] text-[#1B6B4B]"
                                                    : wrongChoice
                                                        ? "border-[#E8C9C9] bg-[#FCF2F2] text-[#9A3F3F]"
                                                        : chosen
                                                            ? "border-[#BFD9C9] bg-white text-[#294B3A]"
                                                            : "border-transparent bg-white text-[#5F6F66] hover:border-[#D8E5DC]"
                                            }`}
                                        >
                                            <input
                                                id={optionId}
                                                type="radio"
                                                name={`quiz-${lesson.id}-${question.id}`}
                                                value={optionIndex}
                                                checked={chosen}
                                                disabled={submitted}
                                                onChange={() =>
                                                    setAnswers((previous) => ({
                                                        ...previous,
                                                        [question.id]: optionIndex,
                                                    }))
                                                }
                                                className="mt-1 h-3.5 w-3.5 shrink-0 accent-[#1B6B4B]"
                                            />
                                            <span className="flex-1">{option}</span>
                                            {correctOption ? (
                                                <CheckCircle2
                                                    size={14}
                                                    aria-label="Correct answer"
                                                    className="mt-0.5 shrink-0"
                                                />
                                            ) : wrongChoice ? (
                                                <XCircle
                                                    size={14}
                                                    aria-label="Your answer was incorrect"
                                                    className="mt-0.5 shrink-0"
                                                />
                                            ) : null}
                                        </label>
                                    );
                                })}
                            </div>

                            {submitted ? (
                                <p className="mt-2.5 rounded-lg bg-[#F4F8F5] px-3 py-2 text-xs sm:text-sm leading-5 text-[#64756C]">
                                    <span className="font-semibold text-[#3E5B4C]">
                                        Why:
                                    </span>{" "}
                                    {question.explanation}
                                </p>
                            ) : null}
                        </fieldset>
                    );
                })}

                {result ? (
                    <div
                        role="status"
                        aria-live="polite"
                        className={`rounded-xl border px-4 py-3 ${
                            result.passed
                                ? "border-[#CFE6D8] bg-[#F2F9F5]"
                                : "border-[#EADFC8] bg-[#FCF8EF]"
                        }`}
                    >
                        <p
                            className={`text-sm sm:text-base font-semibold ${
                                result.passed
                                    ? "text-[#1B6B4B]"
                                    : "text-[#8A6418]"
                            }`}
                        >
                            {result.passed
                                ? `Passed: ${result.score}/${result.total} (${result.percentage}%)`
                                : `Not passed yet: ${result.score}/${result.total} (${result.percentage}%)`}
                        </p>
                        <p className="mt-1 text-xs sm:text-sm leading-5 text-[#64756C]">
                            {result.passed
                                ? "Your best attempt has been saved. You can now mark this lesson complete."
                                : `Review the explanations above, then retake the check. You need ${passingScore}% to pass.`}
                        </p>
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                    {!result ? (
                        <button
                            type="submit"
                            disabled={answeredCount !== quiz.length}
                            className="inline-flex items-center gap-2 rounded-full bg-[#1B6B4B] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-[#14563B] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            <ShieldCheck size={13} aria-hidden="true" />
                            Submit check ({answeredCount}/{quiz.length})
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={retake}
                            className="inline-flex items-center gap-2 rounded-full border border-[#D5E3DA] bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1B6B4B] transition hover:border-[#B8D2C1] hover:bg-[#F2F8F4]"
                        >
                            <RotateCcw size={13} aria-hidden="true" />
                            Retake check
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}
