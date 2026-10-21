"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Bot,
    BrainCircuit,
    CheckCircle2,
    ChevronLeft,
    Clock3,
    Code2,
    FileText,
    Headphones,
    Lightbulb,
    LoaderCircle,
    Lock,
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
import {
    MAX_ANSWER_LENGTH,
    normalizeInterviewConfig,
} from "@/lib/interview";
import {
    getSpeechRecognition,
    getSpeechSynthesis,
    recognitionLanguage,
    speakText,
    stopSpeaking,
} from "@/lib/speech";

const CONFIG_KEY = "edukindInterviewConfig";
const ACTIVE_SESSION_KEY = "edukindInterviewSessionId";
const RESULT_PREFIX = "edukindInterviewResult:";
const RESULT_POLL_INTERVAL_MS = 2000;
const RESULT_POLL_ATTEMPTS = 150;

async function readJson(response) {
    return response.json().catch(() => ({}));
}

async function createInterviewSession(config) {
    const response = await fetch("/api/interviewer/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
    });
    const data = await readJson(response);

    if (!response.ok || !data.session?.id) {
        throw new Error(
            data.error || "Interview session তৈরি করা যায়নি। আবার চেষ্টা করো।"
        );
    }

    return data.session;
}

// React development mode mounts effects twice. Sharing the in-flight
// creation request prevents an orphaned duplicate interview session.
const pendingSessionCreations = new Map();

function createInterviewSessionOnce(config) {
    const key = JSON.stringify(config);
    const pending = pendingSessionCreations.get(key);

    if (pending) return pending;

    const promise = createInterviewSession(config).finally(() => {
        if (pendingSessionCreations.get(key) === promise) {
            pendingSessionCreations.delete(key);
        }
    });

    pendingSessionCreations.set(key, promise);
    return promise;
}

async function fetchInterviewSession(id, signal) {
    const response = await fetch(`/api/interviewer/session/${id}`, {
        signal,
        cache: "no-store",
    });
    const data = await readJson(response);

    if (response.status === 404) {
        const error = new Error(
            data.error || "Interview session পাওয়া যায়নি।"
        );
        error.code = "NOT_FOUND";
        throw error;
    }

    if (!response.ok) {
        throw new Error(
            data.error || "Interview session লোড করা যায়নি।"
        );
    }

    return data;
}

function toRoomItem(question, fallbackDifficulty) {
    return {
        index: question.index,
        category: question.category || "General",
        difficulty: question.difficulty || fallbackDifficulty || "Intermediate",
        question: question.question,
        hint: question.hint || "",
    };
}

function toRoomHistory(session) {
    return (session?.questions || [])
        .filter((question) => question.answered)
        .map((question) => ({
            ...toRoomItem(question, session.config?.difficulty),
            answer: question.answer,
        }));
}

function pendingRoomQuestion(session) {
    const pending = (session?.questions || []).find(
        (question) => !question.answered && question.question
    );

    return pending ? toRoomItem(pending, session.config?.difficulty) : null;
}

async function requestSessionQuestion(id, signal) {
    const response = await fetch(
        `/api/interviewer/session/${id}/question`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal,
        }
    );
    const data = await readJson(response);

    if (!response.ok) {
        const error = new Error(
            data.error || "AI প্রশ্ন তৈরি করতে পারেনি। আবার চেষ্টা করো।"
        );
        error.code = data.code;
        throw error;
    }

    if (data.finished) return null;

    if (!data.question || typeof data.question.question !== "string") {
        throw new Error(
            "AI থেকে বৈধ কোনো প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করো।"
        );
    }

    return {
        ...toRoomItem(data.question, data.question.difficulty),
        questionNumber: data.question.questionNumber,
    };
}

async function saveSessionAnswer(id, questionIndex, rawAnswer) {
    const response = await fetch(
        `/api/interviewer/session/${id}/answer`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                questionIndex,
                answer: rawAnswer,
            }),
        }
    );
    const data = await readJson(response);

    if (!response.ok) {
        const error = new Error(
            data.error || "উত্তর সংরক্ষণ করা যায়নি। আবার চেষ্টা করো।"
        );
        error.code = data.code;
        throw error;
    }

    return data;
}

async function requestReportGeneration(id) {
    const response = await fetch(
        `/api/interviewer/session/${id}/complete`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        }
    );
    const data = await readJson(response);

    if (response.status === 202 || data.status === "evaluating") {
        return {
            status: "evaluating",
            retryAfter: Number(data.retryAfter) || 2,
        };
    }

    if (!response.ok || !data.result) {
        const error = new Error(
            data.error || "Final report তৈরি করা যায়নি। আবার চেষ্টা করো।"
        );
        error.code = data.code;
        throw error;
    }

    return { status: "completed", result: data.result };
}

async function pollReport(id, retryAfter = 2) {
    const interval = Math.max(
        RESULT_POLL_INTERVAL_MS,
        (Number(retryAfter) || 2) * 1000
    );

    for (let attempt = 0; attempt < RESULT_POLL_ATTEMPTS; attempt += 1) {
        const data = await fetchInterviewSession(id);

        if (data.status === "completed" && data.result) {
            return data.result;
        }

        if (data.status === "failed") {
            throw new Error(
                data.error ||
                "Report তৈরি করা যায়নি। তোমার উত্তরগুলো সংরক্ষিত আছে।"
            );
        }

        if (data.status === "in_progress") {
            throw new Error(
                "Interview এখনো শেষ হয়নি। আবার report তৈরি করার চেষ্টা করো।"
            );
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
    }

    throw new Error(
        "Report তৈরি হতে বেশি সময় লাগছে। তোমার উত্তরগুলো সংরক্ষিত আছে; আবার চেষ্টা করো।"
    );
}

function readSavedConfig() {
    const saved = sessionStorage.getItem(CONFIG_KEY);

    if (!saved) {
        throw new Error(
            "Interview configuration পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।"
        );
    }

    let parsed;

    try {
        parsed = JSON.parse(saved);
    } catch {
        throw new Error(
            "Saved interview configuration ঠিক নেই। Setup page থেকে আবার শুরু করো।"
        );
    }

    return normalizeInterviewConfig(parsed);
}

export default function InterviewRoomPage() {
    const router = useRouter();

    const [sessionId, setSessionId] = useState(null);
    const [config, setConfig] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [history, setHistory] = useState([]);
    const [answer, setAnswer] = useState("");
    const [reviewIndex, setReviewIndex] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSavingAnswer, setIsSavingAnswer] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [error, setError] = useState("");
    const [nextError, setNextError] = useState("");
    const [endError, setEndError] = useState("");
    const [evaluationError, setEvaluationError] = useState("");

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voiceError, setVoiceError] = useState("");
    const [voices, setVoices] = useState([]);

    const [showHint, setShowHint] = useState(false);
    const [showEndDialog, setShowEndDialog] = useState(false);

    const recognitionRef = useRef(null);

    const reviewItem = reviewIndex !== null ? history[reviewIndex] : null;
    const isReviewing = Boolean(reviewItem);
    const totalQuestions = config?.questionCount || 0;
    const answeredCount = history.length;
    const progress = totalQuestions
        ? Math.min((answeredCount / totalQuestions) * 100, 100)
        : 0;
    const bengaliVoiceAvailable = voices.some((voice) =>
        String(voice.lang || "").toLowerCase().startsWith("bn")
    );
    const displayQuestion = reviewItem || activeQuestion;

    function stopVoiceAnswer() {
        const recognition = recognitionRef.current;
        recognitionRef.current = null;

        if (recognition) {
            recognition.onend = null;
            try {
                recognition.stop();
            } catch {
                // Ignore stop errors.
            }
        }

        setIsListening(false);
    }

    async function finishInterview(
        knownSessionId = sessionId,
        knownAnsweredCount = history.length
    ) {
        if (!knownSessionId) {
            setShowEndDialog(false);
            setEvaluationError(
                "Interview session পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।"
            );
            return;
        }

        if (knownAnsweredCount === 0) {
            setShowEndDialog(false);
            setEndError(
                "Report তৈরির জন্য কমপক্ষে একটি উত্তর দিতে হবে।"
            );
            return;
        }

        stopVoiceAnswer();
        stopSpeaking();
        setIsSpeaking(false);
        setShowEndDialog(false);
        setShowHint(false);
        setEndError("");
        setEvaluationError("");
        setIsEvaluating(true);

        try {
            let outcome = await requestReportGeneration(knownSessionId);
            let result;

            if (outcome.status === "evaluating") {
                result = await pollReport(
                    knownSessionId,
                    outcome.retryAfter
                );
            } else {
                result = outcome.result;
            }

            if (!result?.id) {
                throw new Error(
                    "Final report তৈরি করা যায়নি। আবার চেষ্টা করো।"
                );
            }

            try {
                localStorage.setItem(
                    `${RESULT_PREFIX}${result.id}`,
                    JSON.stringify(result)
                );
                sessionStorage.removeItem(ACTIVE_SESSION_KEY);
                sessionStorage.setItem(
                    "edukindInterviewResultId",
                    result.id
                );
            } catch {
                // The result is still available from the server.
            }

            router.push(`/mentor/interviewer/result/${result.id}`);
        } catch (err) {
            setIsEvaluating(false);
            setEvaluationError(
                err?.message || "Final report তৈরি করা যায়নি। আবার চেষ্টা করো।"
            );
        }
    }

    async function resumeActiveSession(activeId, signal) {
        let data;

        try {
            data = await fetchInterviewSession(activeId, signal);
        } catch (resumeError) {
            if (resumeError?.code === "NOT_FOUND") {
                try {
                    sessionStorage.removeItem(ACTIVE_SESSION_KEY);
                } catch {
                    // Ignore browser storage errors.
                }
                return false;
            }

            throw resumeError;
        }

        if (signal?.aborted) return true;

        if (data.status === "completed" && data.result?.id) {
            try {
                sessionStorage.removeItem(ACTIVE_SESSION_KEY);
            } catch {
                // Ignore browser storage errors.
            }
            router.replace(`/mentor/interviewer/result/${data.result.id}`);
            return true;
        }

        if (data.status === "evaluating" || data.status === "failed") {
            router.replace(`/mentor/interviewer/result/${activeId}`);
            return true;
        }

        if (data.status !== "in_progress" || !data.session) {
            return false;
        }

        setSessionId(activeId);
        setConfig(data.session.config);

        const restoredHistory = toRoomHistory(data.session);
        setHistory(restoredHistory);

        const pending = pendingRoomQuestion(data.session);

        if (pending) {
            setActiveQuestion(pending);
            return true;
        }

        const nextQuestion = await requestSessionQuestion(activeId, signal);

        if (signal?.aborted) return true;

        if (!nextQuestion) {
            await finishInterview(activeId, restoredHistory.length);
            return true;
        }

        setActiveQuestion(nextQuestion);
        return true;
    }

    async function startInterview(signal) {
        let activeId = null;

        try {
            activeId = sessionStorage.getItem(ACTIVE_SESSION_KEY);
        } catch {
            // Browser storage may be unavailable.
        }

        if (activeId) {
            const resumed = await resumeActiveSession(activeId, signal);

            if (resumed) return;
        }

        const savedConfig = readSavedConfig();

        if (signal?.aborted) return;

        setConfig(savedConfig);

        const session = await createInterviewSessionOnce(savedConfig);

        try {
            sessionStorage.setItem(ACTIVE_SESSION_KEY, session.id);
        } catch {
            // The session still exists on the server.
        }

        if (signal?.aborted) return;

        setSessionId(session.id);

        const firstQuestion = await requestSessionQuestion(
            session.id,
            signal
        );

        if (signal?.aborted) return;

        if (!firstQuestion) {
            throw new Error("AI থেকে কোনো প্রশ্ন পাওয়া যায়নি। আবার চেষ্টা করো।");
        }

        setActiveQuestion(firstQuestion);
    }

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                await startInterview(controller.signal);
            } catch (err) {
                if (err?.name === "AbortError" || controller.signal.aborted) {
                    return;
                }

                setError(
                    err?.message || "Interview শুরু করা যায়নি। আবার চেষ্টা করো।"
                );
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
        // The interview must start once on mount; startInterview also reacts
        // to the abort signal and must not be re-run on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const synthesis = getSpeechSynthesis();

        if (!synthesis) return undefined;

        const updateVoices = () => setVoices(synthesis.getVoices());

        updateVoices();
        synthesis.addEventListener?.("voiceschanged", updateVoices);

        return () => {
            synthesis.removeEventListener?.("voiceschanged", updateVoices);
            synthesis.cancel();
        };
    }, []);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                try {
                    recognitionRef.current.stop();
                } catch {
                    // Ignore teardown errors.
                }
                recognitionRef.current = null;
            }

            stopSpeaking();
        };
    }, []);

    async function retryGenerateInterview() {
        setIsLoading(true);
        setError("");
        setNextError("");
        setEndError("");
        setEvaluationError("");
        setHistory([]);
        setActiveQuestion(null);
        setReviewIndex(null);
        setAnswer("");
        setShowHint(false);

        try {
            await startInterview();
        } catch (err) {
            setError(err?.message || "Interview শুরু করা যায়নি। আবার চেষ্টা করো।");
        } finally {
            setIsLoading(false);
        }
    }

    function startVoiceAnswer() {
        if (!config || isPaused || isReviewing) return;

        const SpeechRecognition = getSpeechRecognition();

        if (!SpeechRecognition) {
            setVoiceError(
                "এই browser-এ speech recognition support নেই। Chrome বা Edge-এ চেষ্টা করো। তুমি এখনো লিখে উত্তর দিতে পারবে।"
            );
            return;
        }

        if (recognitionRef.current) return;

        try {
            const recognition = new SpeechRecognition();
            const baseText = answer.trim();
            let finalTranscript = "";

            recognition.lang = recognitionLanguage(config.language);
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let interimTranscript = "";

                for (
                    let index = event.resultIndex;
                    index < event.results.length;
                    index += 1
                ) {
                    const transcript =
                        event.results[index][0]?.transcript || "";

                    if (event.results[index].isFinal) {
                        finalTranscript += ` ${transcript}`;
                    } else {
                        interimTranscript += ` ${transcript}`;
                    }
                }

                setAnswer(
                    `${baseText} ${finalTranscript} ${interimTranscript}`
                        .replace(/\s+/g, " ")
                        .trim()
                );
            };

            recognition.onerror = (event) => {
                recognitionRef.current = null;
                setIsListening(false);

                if (
                    event.error === "not-allowed" ||
                    event.error === "service-not-allowed"
                ) {
                    setVoiceError(
                        "Microphone permission দিতে হবে। Permission না দিলেও তুমি লিখে উত্তর দিতে পারবে।"
                    );
                } else if (event.error === "language-not-supported") {
                    setVoiceError(
                        `এই browser-এ ${recognitionLanguage(config.language)} speech recognition support নেই। লিখে উত্তর দাও।`
                    );
                } else if (event.error === "no-speech") {
                    setVoiceError(
                        "কোনো কথা শনাক্ত হয়নি। Microphone-এর কাছে গিয়ে আবার চেষ্টা করো।"
                    );
                } else if (event.error !== "aborted") {
                    setVoiceError(
                        "কথা শনাক্ত করা যায়নি। আবার চেষ্টা করো অথবা লিখে উত্তর দাও।"
                    );
                }
            };

            recognition.onend = () => {
                recognitionRef.current = null;
                setIsListening(false);
            };

            recognition.start();
            recognitionRef.current = recognition;
            setIsListening(true);
            setVoiceError("");
        } catch {
            recognitionRef.current = null;
            setIsListening(false);
            setVoiceError(
                "Microphone চালু করা যায়নি। আবার চেষ্টা করো অথবা লিখে উত্তর দাও।"
            );
        }
    }

    function speakQuestion() {
        const item = reviewItem || activeQuestion;

        if (!item) return;

        const result = speakText({
            text: item.question,
            language: config?.language,
            voices,
            onStart: () => {
                setIsSpeaking(true);
                setVoiceError("");
            },
            onEnd: () => setIsSpeaking(false),
            onError: (message) => {
                setIsSpeaking(false);
                setVoiceError(message);
            },
        });

        if (result?.error) {
            setIsSpeaking(false);
            setVoiceError(result.error);
        }
    }

    function togglePause() {
        if (!isPaused) {
            stopVoiceAnswer();
            stopSpeaking();
            setIsSpeaking(false);
        }

        setIsPaused((previous) => !previous);
    }

    function openReview(index) {
        if (index < 0 || index >= history.length) return;

        stopVoiceAnswer();
        stopSpeaking();
        setIsSpeaking(false);
        setReviewIndex(index);
        setShowHint(false);
    }

    function closeReview() {
        setReviewIndex(null);
        setShowHint(false);
    }

    async function submitAnswer() {
        if (
            !activeQuestion ||
            !config ||
            !sessionId ||
            !answer.trim() ||
            isPaused ||
            isGenerating ||
            isSavingAnswer ||
            isEvaluating ||
            isReviewing
        ) {
            return;
        }

        stopVoiceAnswer();
        stopSpeaking();
        setIsSpeaking(false);
        setIsSavingAnswer(true);
        setNextError("");

        // Keep the exact text the candidate submitted. The server stores this
        // string unchanged; no trim() is applied to the stored answer.
        const rawAnswer = answer;
        const answeredQuestion = {
            ...activeQuestion,
            answer: rawAnswer,
        };
        const nextHistory = [...history, answeredQuestion];

        try {
            await saveSessionAnswer(
                sessionId,
                activeQuestion.index,
                rawAnswer
            );
        } catch (saveError) {
            if (saveError?.code !== "ALREADY_ANSWERED") {
                setIsSavingAnswer(false);
                setNextError(
                    saveError?.message ||
                    "উত্তর সংরক্ষণ করা যায়নি। আবার চেষ্টা করো।"
                );
                return;
            }
        }

        setIsSavingAnswer(false);
        setHistory(nextHistory);
        setAnswer("");
        setActiveQuestion(null);
        setReviewIndex(null);
        setShowHint(false);

        if (nextHistory.length >= config.questionCount) {
            await finishInterview(sessionId, nextHistory.length);
            return;
        }

        setIsGenerating(true);

        try {
            const nextQuestion = await requestSessionQuestion(sessionId);

            if (!nextQuestion) {
                await finishInterview(sessionId, nextHistory.length);
                return;
            }

            setActiveQuestion(nextQuestion);
        } catch (err) {
            setNextError(
                err?.message || "পরের প্রশ্ন তৈরি করা যায়নি। আবার চেষ্টা করো।"
            );
        } finally {
            setIsGenerating(false);
        }
    }

    async function retryNextQuestion() {
        if (!sessionId || isGenerating) return;

        setNextError("");
        setIsGenerating(true);

        try {
            const nextQuestion = await requestSessionQuestion(sessionId);

            if (!nextQuestion) {
                await finishInterview(sessionId, history.length);
                return;
            }

            setActiveQuestion(nextQuestion);
        } catch (err) {
            setNextError(
                err?.message || "পরের প্রশ্ন তৈরি করা যায়নি। আবার চেষ্টা করো।"
            );
        } finally {
            setIsGenerating(false);
        }
    }

    async function finishFromDialog() {
        setEndError("");

        if (!sessionId) {
            setEndError(
                "Interview session পাওয়া যায়নি। Setup page থেকে আবার শুরু করো।"
            );
            return;
        }

        let answeredCount = history.length;
        let savedCurrent = false;

        if (activeQuestion && answer.trim() && !isReviewing) {
            try {
                await saveSessionAnswer(
                    sessionId,
                    activeQuestion.index,
                    answer
                );
                savedCurrent = true;

                setHistory((current) => [
                    ...current,
                    { ...activeQuestion, answer },
                ]);
                setAnswer("");
                setActiveQuestion(null);
                setReviewIndex(null);
                setShowHint(false);
            } catch (saveError) {
                if (saveError?.code === "ALREADY_ANSWERED") {
                    savedCurrent = true;
                } else {
                    setEndError(
                        saveError?.message ||
                        "উত্তর সংরক্ষণ করা যায়নি। আবার চেষ্টা করো।"
                    );
                    return;
                }
            }
        }

        if (answeredCount === 0 && !savedCurrent) {
            setEndError(
                "Report তৈরির জন্য কমপক্ষে একটি উত্তর দিতে হবে।"
            );
            return;
        }

        await finishInterview(
            sessionId,
            answeredCount + (savedCurrent ? 1 : 0)
        );
    }

    function retryEvaluation() {
        finishInterview(sessionId, Math.max(history.length, 1));
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
    if (error || !config) {
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
                            type="button"
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
                            type="button"
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
                        <p className="truncate font-semibold">
                            {config.subject}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            {config.interviewType} Interview
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <Sparkles size={15} className="text-violet-300" />
                            DIFFICULTY
                        </div>
                        <p className="font-semibold">{config.difficulty}</p>
                        <p className="mt-1 text-xs text-slate-500">
                            {config.language} · {config.mode} mode
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                            <Clock3 size={15} className="text-amber-300" />
                            QUESTION PROGRESS
                        </div>
                        <p className="font-semibold">
                            {isReviewing
                                ? `Reviewing ${reviewIndex + 1} of ${totalQuestions}`
                                : `${Math.min(answeredCount + 1, totalQuestions)} of ${totalQuestions}`}
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
                                    Let&apos;s begin your {config.subject}{" "}
                                    interview.
                                </h2>

                                <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                                    {config.language === "বাংলা" ||
                                        config.language === "Bangla + English"
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
                                                    opacity: isPaused
                                                        ? 0.3
                                                        : isSpeaking ||
                                                            isListening
                                                            ? 0.95
                                                            : 0.55,
                                                }}
                                            />
                                        )
                                    )}
                                </div>

                                <p className="mt-3 text-xs text-slate-500">
                                    {isPaused
                                        ? "Session paused"
                                        : isEvaluating
                                            ? "Preparing your final report"
                                            : isGenerating
                                                ? "Preparing the next question"
                                                : isListening
                                                    ? "Listening to your answer"
                                                    : isSpeaking
                                                        ? "Reading the question aloud"
                                                        : "AI interview in progress"}
                                </p>
                            </div>
                        </div>

                        {/* Current question / review */}
                        <div className="rounded-3xl border border-white/[0.09] bg-[#10121c]/90 p-5 md:p-8">
                            {isReviewing ? (
                                <>
                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                        <span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                                            Question {reviewIndex + 1} · Review
                                        </span>
                                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
                                            {reviewItem.difficulty}
                                        </span>
                                    </div>

                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                        {reviewItem.category}
                                    </p>

                                    <h2 className="text-xl font-semibold leading-relaxed md:text-2xl">
                                        {reviewItem.question}
                                    </h2>

                                    <div className="mt-6">
                                        <p className="mb-2 text-sm font-medium text-slate-300">
                                            Your submitted answer
                                        </p>
                                        <div className="whitespace-pre-line rounded-2xl border border-white/10 bg-[#090b13] p-4 text-sm leading-7 text-slate-200">
                                            {reviewItem.answer}
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                        <p className="flex items-center gap-2 text-xs text-slate-500">
                                            <Lock size={14} />
                                            Submitted answer cannot be changed.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={closeReview}
                                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                                        >
                                            <ChevronLeft size={16} />
                                            Back to current question
                                        </button>
                                    </div>
                                </>
                            ) : isGenerating ? (
                                <div className="flex min-h-[320px] flex-col items-center justify-center py-10 text-center">
                                    <LoaderCircle
                                        size={40}
                                        className="animate-spin text-cyan-300"
                                    />
                                    <h2 className="mt-5 text-xl font-semibold">
                                        পরবর্তী প্রশ্ন তৈরি হচ্ছে
                                    </h2>
                                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                                        তোমার উত্তর সংরক্ষণ করা হয়েছে। AI উত্তরটি
                                        বিশ্লেষণ করে পরের প্রশ্ন তৈরি করছে।
                                    </p>
                                </div>
                            ) : nextError ? (
                                <div className="flex min-h-[320px] flex-col items-center justify-center py-10 text-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
                                        <AlertCircle size={28} />
                                    </div>
                                    <h2 className="mt-4 text-xl font-semibold">
                                        পরের প্রশ্ন পাওয়া যায়নি
                                    </h2>
                                    <p className="mt-2 max-w-md break-words text-sm leading-6 text-slate-400">
                                        {nextError}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        তোমার আগের উত্তরগুলো সংরক্ষিত আছে।
                                    </p>
                                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={retryNextQuestion}
                                            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold"
                                        >
                                            Try again
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                finishInterview(
                                                    sessionId,
                                                    history.length
                                                )
                                            }
                                            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/[0.05]"
                                        >
                                            Finish with {answeredCount} answers
                                        </button>
                                    </div>
                                </div>
                            ) : activeQuestion ? (
                                <>
                                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                                        <span className="rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                                            Question{" "}
                                            {Math.min(
                                                answeredCount + 1,
                                                totalQuestions
                                            )}
                                        </span>

                                        <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-400">
                                            {activeQuestion.difficulty}
                                        </span>
                                    </div>

                                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                        {activeQuestion.category}
                                    </p>

                                    <h2 className="text-xl font-semibold leading-relaxed md:text-2xl">
                                        {activeQuestion.question}
                                    </h2>

                                    {activeQuestion.hint && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowHint(
                                                        (previous) => !previous
                                                    )
                                                }
                                                className="mt-5 inline-flex items-center gap-2 text-sm text-amber-300 transition hover:text-amber-200"
                                            >
                                                <Lightbulb size={16} />
                                                {showHint
                                                    ? "Hide hint"
                                                    : "Need a hint?"}
                                            </button>

                                            {showHint && (
                                                <div className="mt-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100/80">
                                                    {activeQuestion.hint}
                                                </div>
                                            )}
                                        </>
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
                                            onChange={(event) =>
                                                setAnswer(event.target.value)
                                            }
                                            disabled={
                                                isPaused ||
                                                isListening ||
                                                isSavingAnswer
                                            }
                                            maxLength={MAX_ANSWER_LENGTH}
                                            placeholder={
                                                config.mode === "Voice"
                                                    ? "Speak using the microphone or type your answer here..."
                                                    : "Explain your answer here..."
                                            }
                                            rows={6}
                                            className="w-full resize-y rounded-2xl border border-white/10 bg-[#090b13] p-4 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10 disabled:opacity-50"
                                        />

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={togglePause}
                                                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05]"
                                            >
                                                {isPaused ? (
                                                    <Play size={16} />
                                                ) : (
                                                    <Pause size={16} />
                                                )}
                                                {isPaused ? "Resume" : "Pause"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={submitAnswer}
                                                disabled={
                                                    !answer.trim() ||
                                                    isPaused ||
                                                    isGenerating ||
                                                    isSavingAnswer
                                                }
                                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold shadow-lg shadow-violet-950/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {isSavingAnswer
                                                    ? "Saving..."
                                                    : answeredCount + 1 >=
                                                        totalQuestions
                                                        ? "Finish Practice"
                                                        : "Submit & Continue"}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                                    <LoaderCircle
                                        size={34}
                                        className="animate-spin text-cyan-300"
                                    />
                                    <p className="mt-4 text-sm text-slate-400">
                                        প্রশ্ন লোড হচ্ছে...
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Voice controls */}
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
                            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                                <div>
                                    <div className="flex items-center gap-2 font-semibold">
                                        <Headphones
                                            size={18}
                                            className="text-cyan-300"
                                        />
                                        Voice controls
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        {config.mode === "Voice"
                                            ? "Voice mode selected. তুমি চাইলে microphone দিয়েও উত্তর দিতে পারো, অথবা লিখে দিতে পারো।"
                                            : "Text interview selected. চাইলে microphone ব্যবহার করতে পারো, নাহলে লিখে উত্তর দাও।"}
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {bengaliVoiceAvailable
                                            ? "বাংলা text-to-speech voice পাওয়া গেছে।"
                                            : "এই browser-এ বাংলা text-to-speech voice শনাক্ত হয়নি।"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isListening) {
                                                stopVoiceAnswer();
                                            } else {
                                                startVoiceAnswer();
                                            }
                                        }}
                                        disabled={
                                            isPaused ||
                                            isReviewing ||
                                            !activeQuestion ||
                                            isGenerating
                                        }
                                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition disabled:opacity-40 ${isListening
                                            ? "border border-rose-400/30 bg-rose-400/10 text-rose-300"
                                            : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15"
                                            }`}
                                    >
                                        {isListening ? (
                                            <MicOff size={17} />
                                        ) : (
                                            <Mic size={17} />
                                        )}
                                        {isListening
                                            ? "Stop recording"
                                            : "Start speaking"}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={speakQuestion}
                                        disabled={isPaused || !displayQuestion}
                                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.05] disabled:opacity-40"
                                    >
                                        {isSpeaking ? (
                                            <LoaderCircle
                                                size={17}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Volume2 size={17} />
                                        )}
                                        {isSpeaking
                                            ? "Reading..."
                                            : "Play question"}
                                    </button>
                                </div>
                            </div>

                            {voiceError && (
                                <div
                                    role="alert"
                                    className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-rose-400/15 bg-rose-400/[0.06] p-3 text-xs leading-5 text-rose-200"
                                >
                                    <span>{voiceError}</span>
                                    <button
                                        type="button"
                                        onClick={() => setVoiceError("")}
                                        aria-label="Dismiss voice message"
                                        className="shrink-0 text-rose-300/70 hover:text-rose-200"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}

                            {isListening && (
                                <p className="mt-4 rounded-xl border border-cyan-400/15 bg-cyan-400/[0.06] p-3 text-xs text-cyan-200">
                                    তোমার কথা live text-এ যোগ হচ্ছে। শেষ হলে
                                    &quot;Stop recording&quot; চাপো। ভুল হলে
                                    লেখা সম্পাদনা করতে পারবে।
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <aside className="space-y-5 lg:sticky lg:top-6">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#10121c]/90 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Question navigator
                                </h3>
                                <span className="text-xs text-slate-500">
                                    {answeredCount} answered
                                </span>
                            </div>

                            <div className="space-y-2">
                                {Array.from({
                                    length: totalQuestions,
                                }).map((_, index) => {
                                    const answeredItem = history[index];
                                    const isCurrent =
                                        !answeredItem &&
                                        index === answeredCount &&
                                        Boolean(activeQuestion);
                                    const isOpenReview =
                                        reviewIndex === index && answeredItem;

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                answeredItem &&
                                                openReview(index)
                                            }
                                            disabled={!answeredItem}
                                            className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${isOpenReview ||
                                                (isCurrent &&
                                                    reviewIndex === null)
                                                ? "border-violet-400/30 bg-violet-400/[0.09]"
                                                : "border-white/[0.06] bg-white/[0.02]"
                                                } ${answeredItem
                                                    ? "hover:bg-white/[0.05]"
                                                    : "cursor-default"
                                                }`}
                                        >
                                            <span
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${answeredItem
                                                    ? "bg-emerald-400/10 text-emerald-300"
                                                    : isCurrent
                                                        ? "bg-violet-400/15 text-violet-200"
                                                        : "bg-white/[0.05] text-slate-500"
                                                    }`}
                                            >
                                                {answeredItem ? (
                                                    <CheckCircle2 size={16} />
                                                ) : isCurrent ? (
                                                    index + 1
                                                ) : (
                                                    <Lock size={13} />
                                                )}
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block text-sm font-medium">
                                                    Question {index + 1}
                                                </span>
                                                <span className="mt-1 block truncate text-xs text-slate-500">
                                                    {answeredItem
                                                        ? answeredItem.category
                                                        : isCurrent
                                                            ? "Current question"
                                                            : "Locked until reached"}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="mt-3 text-[11px] leading-5 text-slate-600">
                                আগের প্রশ্নে ক্লিক করে তোমার submitted উত্তর
                                দেখতে পারবে। উত্তর পরিবর্তন করা যাবে না।
                            </p>
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
                                    <p className="text-sm font-semibold">
                                        Your responses
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {answeredCount} of {totalQuestions}{" "}
                                        saved
                                    </p>
                                </div>
                            </div>
                            <p className="mt-3 text-xs leading-5 text-slate-500">
                                প্রতিটি submitted উত্তর হুবহু সংরক্ষিত হচ্ছে এবং
                                interview শেষে server-side AI evaluation-এ
                                পাঠানো হবে।
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
                                type="button"
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
                            তুমি {answeredCount} / {totalQuestions}টি প্রশ্নের
                            উত্তর দিয়েছ।{" "}
                            {activeQuestion &&
                                answer.trim() &&
                                !isReviewing
                                ? "বর্তমান লেখাটিও হিসাবের মধ্যে নেওয়া হবে। "
                                : ""}
                            এখন report তৈরি করলে বাকি প্রশ্নগুলো বাদ যাবে।
                        </p>

                        {endError && (
                            <div className="mt-4 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-xs leading-5 text-rose-200">
                                {endError}
                            </div>
                        )}

                        <div className="mt-6 flex flex-col gap-3">
                            {answeredCount > 0 ||
                                (activeQuestion && answer.trim()) ? (
                                <button
                                    type="button"
                                    onClick={finishFromDialog}
                                    disabled={isSavingAnswer}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold disabled:opacity-50"
                                >
                                    <FileText size={16} />
                                    {isSavingAnswer
                                        ? "Saving answer..."
                                        : "Finish & get report"}
                                </button>
                            ) : (
                                <p className="rounded-xl border border-amber-400/15 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-200">
                                    Report তৈরির জন্য কমপক্ষে একটি উত্তর দিতে
                                    হবে।
                                </p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEndDialog(false)}
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
                                >
                                    Continue
                                </button>
                                <Link
                                    href="/mentor/interviewer"
                                    className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium text-slate-300 hover:bg-white/[0.05]"
                                >
                                    Exit without report
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Evaluation overlay */}
            {isEvaluating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11131f] p-7 text-center shadow-2xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                            <LoaderCircle size={32} className="animate-spin" />
                        </div>
                        <h2 className="mt-5 text-xl font-bold">
                            Final report তৈরি হচ্ছে
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            তোমার প্রতিটি উত্তর AI দিয়ে মূল্যায়ন করা হচ্ছে।
                            প্রশ্ন সংখ্যা বেশি হলে একটু সময় লাগতে পারে।
                        </p>
                        <p className="mt-4 text-xs text-slate-500">
                            এই window বন্ধ করো না।
                        </p>
                    </div>
                </div>
            )}

            {!isEvaluating && evaluationError && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#11131f] p-7 text-center shadow-2xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-400/10 text-rose-300">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="mt-5 text-xl font-bold">
                            Report তৈরি করা যায়নি
                        </h2>
                        <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                            {evaluationError}
                        </p>
                        <p className="mt-3 text-xs leading-5 text-slate-500">
                            তোমার উত্তরগুলো এখনো সংরক্ষিত আছে। আবার চেষ্টা করো।
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={retryEvaluation}
                                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-4 py-3 text-sm font-semibold"
                            >
                                Try again
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEvaluationError("");
                                    router.push("/mentor/interviewer");
                                }}
                                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.05]"
                            >
                                Exit without report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
