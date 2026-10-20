import MentorChat from "@/components/mentor/MentorChat";

const suggestions = [
    {
        title: "Understand a concept",
        description: "Make difficult topics simple.",
        prompt: "Explain a difficult concept to me in simple terms.",
        icon: "book",
        color: "violet",
    },
    {
        title: "Debug my code",
        description: "Find bugs and understand why.",
        prompt: "Help me debug my code and explain the solution.",
        icon: "code",
        color: "cyan",
    },
    {
        title: "Solve a problem",
        description: "Break problems into small steps.",
        prompt: "Help me solve a problem step by step.",
        icon: "brain",
        color: "amber",
    },
    {
        title: "Plan my learning",
        description: "Build a learning path for me.",
        prompt: "Help me create a personalized learning roadmap.",
        icon: "graduation",
        color: "pink",
    },
];

const initialChats = [
    "Understanding JavaScript closures",
    "My React learning roadmap",
    "How does the internet work?",
    "Data structures made simple",
];

export default function AskAIMentorPage() {
    return (
        <MentorChat
            mode="chat"
            title="Ask AI Mentor"
            description="যেকোনো প্রশ্ন করো, সহজ ভাষায় বুঝিয়ে দেব।"
            heroIcon="chat"
            accent="violet"
            badge="YOUR PERSONAL AI MENTOR"
            placeholder="Ask your mentor anything..."
            suggestions={suggestions}
            initialChats={initialChats}
        />
    );
}