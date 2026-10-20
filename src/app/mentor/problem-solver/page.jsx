import MentorChat from "@/components/mentor/MentorChat";

const suggestions = [
    {
        title: "Give me a hint",
        description: "Only the first step, not the answer.",
        prompt: "Give me a hint for this problem, but not the full solution: ",
        icon: "lightbulb",
        color: "amber",
    },
    {
        title: "Solve step by step",
        description: "Break it into small steps.",
        prompt: "Help me solve this problem step by step: ",
        icon: "brain",
        color: "violet",
    },
    {
        title: "Check my attempt",
        description: "Tell me what is right or wrong.",
        prompt: "Here is my attempt. Please check it and guide me:\n\n",
        icon: "target",
        color: "cyan",
    },
    {
        title: "Math or logic puzzle",
        description: "Think it through together.",
        prompt: "Give me a math or logic problem to practice, and guide me with hints.",
        icon: "book",
        color: "pink",
    },
];

export default function ProblemSolverPage() {
    return (
        <MentorChat
            mode="problem-solver"
            showSidebar={false}
            title="Problem Solver"
            description="সরাসরি উত্তর নয়, আগে hint দেব যাতে তুমি নিজে ভাবতে শেখো।"
            heroIcon="lightbulb"
            accent="amber"
            badge="PROBLEM SOLVER"
            placeholder="Describe your problem..."
            suggestions={suggestions}
        />
    );
}