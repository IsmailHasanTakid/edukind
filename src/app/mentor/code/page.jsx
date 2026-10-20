import MentorChat from "@/components/mentor/MentorChat";

const suggestions = [
    {
        title: "Explain this code",
        description: "Understand what each part does.",
        prompt: "Explain this code to me step by step:\n\n",
        icon: "code",
        color: "cyan",
    },
    {
        title: "Find the bug",
        description: "Spot the cause and fix it.",
        prompt: "My code has a bug. Find the cause and explain the fix:\n\n",
        icon: "bug",
        color: "amber",
    },
    {
        title: "Improve my code",
        description: "Cleaner, faster, easier to read.",
        prompt: "Review my code and suggest improvements:\n\n",
        icon: "lightbulb",
        color: "violet",
    },
    {
        title: "Learn a concept",
        description: "Programming ideas made simple.",
        prompt: "Explain a programming concept to me with a small example.",
        icon: "book",
        color: "pink",
    },
];

export default function CodeMentorPage() {
    return (
        <MentorChat
            mode="code"
            showSidebar={false}
            title="Code Mentor"
            description="কোড পেস্ট করো। আমি ব্যাখ্যা করব, bug খুঁজব, আর উন্নত করার উপায় দেখাব।"
            heroIcon="code"
            accent="emerald"
            badge="CODE MENTOR"
            placeholder="Paste your code or ask a programming question..."
            suggestions={suggestions}
        />
    );
}