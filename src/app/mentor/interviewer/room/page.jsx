
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    BrainCircuit,
    CheckCircle2,
    Clock3,
    Code2,
    Headphones,
    Lightbulb,
    MessageSquare,
    Mic,
    MicOff,
    Pause,
    Play,
    ShieldCheck,
    Sparkles,
    Volume2,
    X,
} from "lucide-react";

export default function InterviewRoomPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [interviewConfig, setInterviewConfig] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceError, setVoiceError] = useState("");
    const [isPaused, setIsPaused] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const recognitionRef = useRef(null);
    const [showEndDialog, setShowEndDialog] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function generateInterview() {
            try {
                const savedConfig = sessionStorage.getItem(
                    "edukindInterviewConfig"
                );

                if (!savedConfig) {
                    throw new Error(
                        "Interview configuration পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।"
                    );
                }

                const config = JSON.parse(savedConfig);

                if (!config.subject || !config.questionCount) {
                    throw new Error(
                        "Interview configuration অসম্পূর্ণ। আবার Setup করো।"
                    );
                }

                if (cancelled) return;
                setInterviewConfig(config);

                const topic =
                    config.topicMode === "all"
                        ? `All relevant topics within ${config.subject}. Cover a balanced range of important concepts.`
                        : Array.isArray(config.topics)
                            ? config.topics.join(", ")
                            : "";

                const response = await fetch(
                    "/api/interviewer/generate",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            interviewType: config.interviewType,
                            subject: config.subject,
                            topic,
                            difficulty: config.difficulty,
                            language: config.language,
                            questionCount: config.questionCount,
                        }),
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error ||
                        "AI প্রশ্ন তৈরি করতে পারেনি। আবার চেষ্টা করো।"
                    );
                }

                if (
                    !Array.isArray(data.questions) ||
                    data.questions.length === 0
                ) {
                    throw new Error(
                        "AI থেকে কোনো প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করো।"
                    );
                }

                if (cancelled) return;

                setQuestions(data.questions);
                setAnswers(new Array(data.questions.length).fill(""));
                setCurrentQuestion(0);
                setAnswer("");
                setError("");
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.message ||
                        "Interview শুরু করা যায়নি। আবার চেষ্টা করো।"
                    );
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        generateInterview();

        return () => {
            cancelled = true;
        };
    }, []);

    async function retryGenerateInterview() {
        setIsLoading(true);
        setError("");
        setQuestions([]);
        setAnswers([]);
        setCurrentQuestion(0);
        setAnswer("");

        // Reuse the same loading process without reloading the page.
        try {
            const savedConfig = sessionStorage.getItem(
                "edukindInterviewConfig"
            );

            if (!savedConfig) {
                throw new Error(
                    "Configuration পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।"
                );
            }

            const config = JSON.parse(savedConfig);
            setInterviewConfig(config);

            const topic =
                config.topicMode === "all"
                    ? `All relevant topics within ${config.subject}. Cover a balanced range of important concepts.`
                    : Array.isArray(config.topics)
                        ? config.topics.join(", ")
                        : "";

            const response = await fetch("/api/interviewer/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    interviewType: config.interviewType,
                    subject: config.subject,
                    topic,
                    difficulty: config.difficulty,
                    language: config.language,
                    questionCount: config.questionCount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "AI প্রশ্ন তৈরি করতে পারেনি।"
                );
            }

            if (!Array.isArray(data.questions) || !data.questions.length) {
                throw new Error("AI থেকে কোনো প্রশ্ন পাওয়া যায়নি।");
            }

            setQuestions(data.questions);
            setAnswers(new Array(data.questions.length).fill(""));
        } catch (err) {
            setError(err.message || "আবার চেষ্টা করো।");
        } finally {
            setIsLoading(false);
        }
    }

    const question = questions[currentQuestion];

    const progress = questions.length
        ? ((currentQuestion + 1) / questions.length) * 100
        : 0;

    function speakQuestion() {
        if (!question || !("speechSynthesis" in window)) {
            setVoiceError("এই browser-এ voice playback support নেই।");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(
            question.question
        );

        const language = interviewConfig?.language;

        utterance.lang =
            language === "বাংলা"
                ? "bn-BD"
                : language === "English"
                    ? "en-US"
                    : "en-US";

        utterance.onstart = () => {
            setIsSpeaking(true);
            setVoiceError("");
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setVoiceError("প্রশ্নটি শোনানো যায়নি। আবার চেষ্টা করো।");
        };

        window.speechSynthesis.speak(utterance);
    }
    function startVoiceAnswer() {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setVoiceError(
                "এই browser-এ speech recognition support নেই। Chrome-এ চেষ্টা করো।"
            );
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        function stopVoiceAnswer() {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        recognition.lang =
            interviewConfig?.language === "বাংলা"
                ? "bn-BD"
                : "en-US";

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let transcript = "";

            for (
                let i = 0;
                i < event.results.length;
                i++
            ) {
                transcript += event.results[i][0].transcript + " ";
            }

            setAnswer(transcript.trim());
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            setVoiceError(
                event.error === "not-allowed"
                    ? "Microphone permission দিতে হবে।"
                    : "কথা শনাক্ত করা যায়নি। আবার চেষ্টা করো।"
            );
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            recognition.start();
            setIsListening(true);
            setVoiceError("");
        } catch {
            setIsListening(false);
            setVoiceError("Microphone চালু করা যায়নি। আবার চেষ্টা করো।");
        }
    }
    function saveAnswer() {
        if (!answer.trim() || isPaused || !question) return;

        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestion] = answer.trim();
        setAnswers(updatedAnswers);

        setShowHint(false);
        setIsListening(false);

        if (currentQuestion < questions.length - 1) {
            const nextIndex = currentQuestion + 1;
            setCurrentQuestion(nextIndex);
            setAnswer(updatedAnswers[nextIndex] || "");
        } else {
            setShowEndDialog(true);
        }
    }

    function goToQuestion(index) {
        if (index < 0 || index >= questions.length) return;

        setCurrentQuestion(index);
        setAnswer(answers[index] || "");
        setShowHint(false);
        setIsListening(false);
    }

    // Loading screen
    if (isLoading) {
        return (
            <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070910] px-5 text-white">
                <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px]" />
                <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

                <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#10121c]/90 p-8 text-center shadow-2xl">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10">
                        <BrainCircuit className="h-10 w-10 animate-pulse text-cyan-300" />
                    </div>

                    <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.18em] text-cyan-300">
                        <Sparkles size={15} />
                        EDUKIND AI INTERVIEWER
                    </div>

                    <h1 className="text-2xl font-bold">
                        Preparing your interview
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        AI তোমার নির্বাচিত Subject, Topic এবং Difficulty
                        অনুযায়ী নতুন প্রশ্ন তৈরি করছে। একটু অপেক্ষা করো।
                    </p>

                    <div className="mx-auto mt-7 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
                    </div>
                </div>
            </main>
        );
    }

    // Error screen
    if (error || !questions.length || !question) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#070910] px-5 text-white">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10121c] p-7 text-center">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
                        <BrainCircuit size={28} />
                    </div>

                    <h1 className="text-xl font-bold">
                        Interview শুরু করা যায়নি
                    </h1>

                    <p className="mt-3 break-words text-sm leading-6 text-slate-400">
                        {error || "প্রশ্ন পাওয়া যায়নি।"}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={retryGenerateInterview}
                            className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                        >
                            Try again
                        </button>

                        <Link
                            href="/mentor/interviewer/setup"
                            className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium"
                        >
                            Back to setup
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen overflow-hidden bg-[#070910] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
                <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
            </div>

            <div className="relative mx-auto max-w-[1600px] p-4 md:p-6">
                {/* Top navigation */}
                <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/mentor/interviewer"
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:bg-white/10"
                            aria-label="Back to interviewer dashboard"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white shadow-lg shadow-violet-500/20">
                            <BrainCircuit size={22} />
                        </div>

                        <div>
                            <h1 className="text-sm font-bold tracking-wide md:text-base">
                                EDUKIND{" "}
                                <span className="text-cyan-300">
                                    AI Interviewer
                                </span>
                            </h1>
                            <p className="text-xs text-slate-500">
                                Interview workspace
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-300">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Practice Session
                        </div>

                        <button
                            onClick={() => setShowEndDialog(true)}
                            className="rounded-xl border border-rose-400/20 px-4 py-2.5 text-sm text-rose-300 transition hover:bg-rose-400/10"
                        >
                            End Interview
                        </button>
                    </div>
                </header>

                {/* Interview overview */}
                <section className="mb-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <Code2 size={15} className="text-cyan-300" />
                            SUBJECT
                        </div>
                        <p className="font-semibold">
                            {interviewConfig?.subject || "Custom Subject"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {interviewConfig?.interviewType || "Technical"} Interview
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <Sparkles size={15} className="text-violet-300" />
                            DIFFICULTY
                        </div>
                        <p className="font-semibold">
                            {interviewConfig?.difficulty || "Intermediate"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            AI-generated questions
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <Clock3 size={15} className="text-amber-300" />
                            QUESTION PROGRESS
                        </div>
                        <p className="font-semibold">
                            {currentQuestion + 1} of {questions.length}
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </section>

                {/* Main workspace */}
                <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
                    <div className="space-y-6">
                        {/* AI interviewer */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#151328] via-[#10131f] to-[#0b1720] p-6 md:p-9">
                            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-[80px]" />

                            <div className="relative flex flex-col items-center text-center">
                                <div className="relative mb-5">
                                    <div className="absolute inset-0 scale-150 rounded-full bg-violet-500/15 blur-2xl" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/15 bg-gradient-to-br from-violet-500/30 to-cyan-400/20 shadow-xl shadow-violet-900/30">
                                        <Bot size={46} className="text-cyan-100" />
                                    </div>
                                    <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#111321] bg-emerald-400">
                                        <span className="h-2 w-2 rounded-full bg-white" />
                                    </span>
                                </div>

                                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-cyan-300">
                                    <Sparkles size={14} />
                                    YOUR AI INTERVIEWER
                                </div>

                                <h2 className="text-xl font-bold md:text-2xl">
                                    Let&apos;s begin your{" "}
                                    {interviewConfig?.subject || "interview"} interview.
                                </h2>

                                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                                    {interviewConfig?.language === "বাংলা"
                                        ? "সময় নিয়ে উত্তর দাও। সম্ভব হলে নিজের যুক্তি ও উদাহরণ দিয়ে ব্যাখ্যা করো।"
                                        : "Take your time, explain your reasoning, and use examples whenever possible."}
                                </p>

                                <div className="mt-6 flex items-center gap-1.5">
                                    {[16, 27, 19, 36, 24, 42, 18, 30, 15, 34, 22, 40, 17, 28, 14].map(
                                        (height, index) => (
                                            <span
                                                key={index}
                                                className="w-1 rounded-full bg-gradient-to-t from-violet-500 to-cyan-300"
                                                style={{
                                                    height: `${height}px`,
                                                    opacity: isPaused ? 0.3 : 0.9,
                                                }}
                                            />
                                        )
                                    )}
                                </div>

                                <p className="mt-3 text-xs text-slate-500">
                                    {isPaused ? "Session paused" : "AI interview simulation"}
                                </p>
                            </div>
                        </div>

                        {/* Current question */}
                        <div className="rounded-3xl border border-white/[0.09] bg-[#10121c]/90 p-5 md:p-8">
                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                <span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                                    Question {currentQuestion + 1}
                                </span>

                                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
                                    {question.difficulty}
                                </span>
                            </div>

                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                {question.category}
                            </p>

                            <h2 className="text-xl font-semibold leading-relaxed md:text-2xl">
                                {question.question}
                            </h2>

                            <button
                                onClick={() => setShowHint((previous) => !previous)}
                                className="mt-5 inline-flex items-center gap-2 text-sm text-amber-300 transition hover:text-amber-200"
                            >
                                <Lightbulb size={16} />
                                {showHint ? "Hide hint" : "Need a hint?"}
                            </button>

                            {showHint && (
                                <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/80">
                                    {question.hint}
                                </div>
                            )}

                            <div className="mt-7">
                                <label
                                    htmlFor="answer"
                                    className="mb-3 block text-sm font-medium text-slate-300"
                                >
                                    Your answer
                                </label>

                                <textarea
                                    id="answer"
                                    value={answer}
                                    onChange={(event) => setAnswer(event.target.value)}
                                    disabled={isPaused}
                                    placeholder="Explain your answer here..."
                                    rows={6}
                                    className="w-full resize-y rounded-2xl border border-white/10 bg-[#090b13] p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10 disabled:opacity-50"
                                />

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <button
                                        onClick={() => {
                                            setIsListening(false);
                                            setIsPaused((previous) => !previous);
                                        }}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                                    >
                                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                                        {isPaused ? "Resume" : "Pause"}
                                    </button>

                                    <button
                                        onClick={saveAnswer}
                                        disabled={!answer.trim() || isPaused}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {currentQuestion === questions.length - 1
                                            ? "Finish Practice"
                                            : "Submit & Continue"}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Voice controls */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                                <div>
                                    <div className="flex items-center gap-2 font-semibold">
                                        <Headphones size={18} className="text-cyan-300" />
                                        Voice controls
                                        {voiceError && (
                                            <p className="mt-3 text-sm text-rose-300">
                                                {voiceError}
                                            </p>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {interviewConfig?.mode === "Voice"
                                            ? "Voice mode selected. Microphone transcription is not connected yet."
                                            : "Text interview selected. Voice input is not connected yet."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => {
                                            if (isListening) {
                                                stopVoiceAnswer();
                                            } else {
                                                startVoiceAnswer();
                                            }
                                        }}
                                        disabled={isPaused}
                                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition disabled:opacity-40 ${isListening
                                            ? "border border-rose-400/30 bg-rose-400/10 text-rose-300"
                                            : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15"
                                            }`}
                                    >
                                        {isListening ? <MicOff size={17} /> : <Mic size={17} />}
                                        {isListening ? "Stop recording" : "Start speaking"}
                                    </button>

                                    <button
                                        onClick={speakQuestion}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                                    >
                                        <Volume2 size={17} />
                                        Play question
                                    </button>
                                </div>
                            </div>

                            {isListening && (
                                <p className="mt-4 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-3 text-xs text-rose-200">
                                    এটি এখনো UI preview। তোমার কথা এখনো রেকর্ড বা
                                    transcribe হচ্ছে না।
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#10121c]/90 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold">Question navigator</h3>
                                <span className="text-xs text-slate-500">
                                    {answers.filter(Boolean).length} answered
                                </span>
                            </div>

                            <div className="space-y-2">
                                {questions.map((item, index) => (
                                    <button
                                        key={`${item.category}-${index}`}
                                        onClick={() => goToQuestion(index)}
                                        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${currentQuestion === index
                                            ? "border-violet-400/30 bg-violet-400/[0.09]"
                                            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${answers[index]
                                                ? "bg-emerald-400/10 text-emerald-300"
                                                : currentQuestion === index
                                                    ? "bg-violet-400/15 text-violet-200"
                                                    : "bg-white/[0.05] text-slate-400"
                                                }`}
                                        >
                                            {answers[index] ? (
                                                <CheckCircle2 size={16} />
                                            ) : (
                                                index + 1
                                            )}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-medium">
                                                Question {index + 1}
                                            </span>
                                            <span className="mt-1 block truncate text-xs text-slate-500">
                                                {item.category}
                                            </span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.07] to-violet-500/[0.07] p-5">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                                <ShieldCheck size={21} />
                            </div>
                            <h3 className="font-semibold">Interview tips</h3>
                            <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-400">
                                <li>• উত্তর দেওয়ার আগে প্রশ্নটি ভালোভাবে বোঝো।</li>
                                <li>• সম্ভব হলে উদাহরণসহ ব্যাখ্যা করো।</li>
                                <li>• উত্তর না জানলে নিজের যুক্তি ব্যাখ্যা করো।</li>
                                <li>• সংক্ষিপ্ত ও পরিষ্কারভাবে উত্তর দেওয়ার চেষ্টা করো।</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                                    <MessageSquare size={19} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Your responses</p>
                                    <p className="text-xs text-slate-500">
                                        {answers.filter(Boolean).length} saved in this session
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                উত্তরগুলো আপাতত এই পেজের state-এ রাখা হচ্ছে; database-এ
                                সংরক্ষণ করা হচ্ছে না।
                            </p>
                        </div>
                    </aside>
                </section>
            </div>

            {/* End interview dialog */}
            {showEndDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11131f] p-6 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300">
                                <BrainCircuit size={24} />
                            </div>
                            <button
                                onClick={() => setShowEndDialog(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                                aria-label="Close dialog"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold">
                            End practice session?
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            তুমি {answers.filter(Boolean).length} /{" "}
                            {questions.length}টি প্রশ্নের উত্তর দিয়েছ।
                            AI evaluation report এখনো যুক্ত করা হয়নি।
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => setShowEndDialog(false)}
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
                            >
                                Continue
                            </button>
                            <Link
                                href="/mentor/interviewer"
                                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-center text-sm font-semibold"
                            >
                                Exit interview
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
