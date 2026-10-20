import MentorChat from "@/components/mentor/MentorChat";

const suggestions = [
    {
        title: "Teach me a topic",
        description: "Step-by-step guided lesson.",
        prompt: "Teach me step by step: ",
        icon: "graduation",
        color: "cyan",
    },
    {
        title: "Explain it simpler",
        description: "Use everyday examples.",
        prompt: "Explain this in the simplest way with a real-life example: ",
        icon: "lightbulb",
        color: "amber",
    },
    {
        title: "Quiz me",
        description: "Test what I have learned.",
        prompt: "Quiz me on this topic, one question at a time: ",
        icon: "target",
        color: "violet",
    },
    {
        title: "Start from zero",
        description: "Complete beginner friendly.",
        prompt: "I am a complete beginner. Where should I start with: ",
        icon: "book",
        color: "pink",
    },
];

export default function LearnWithAIPage() {
    return (
        <MentorChat
            mode="learn"
            showSidebar={false}
            title="Learn with AI"
            description="যেকোনো টপিক ধাপে ধাপে শেখো, শেষে ছোট প্রশ্নে নিজেকে যাচাই করো।"
            heroIcon="graduation"
            accent="cyan"
            badge="LEARN WITH AI"
            placeholder="What do you want to learn today?"
            suggestions={suggestions}
        />
    );
}