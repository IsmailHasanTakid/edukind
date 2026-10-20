
import MentorChat from "@/components/mentor/MentorChat";

const careerSuggestions = [
    {
        title: "What Should I Learn Next?",
        description:
            "তোমার বর্তমান skill অনুযায়ী পরবর্তী শেখার বিষয় নির্ধারণ করো।",
        prompt:
            "Act as my personal AI career advisor. Help me decide what I should learn next based on my current skills, experience, interests, and career goals. Ask me questions first if you need more information. Then create a prioritized learning plan with reasons.",
        icon: "target",
        color: "cyan",
    },
    {
        title: "Build My Career Roadmap",
        description:
            "Beginner থেকে job-ready হওয়ার ধাপে ধাপে পরিকল্পনা।",
        prompt:
            "Help me build a personalized career roadmap. First ask about my current skills, preferred career, available study time, and target timeline. Then organize the roadmap into clear phases with skills, projects, milestones, and practical next steps.",
        icon: "graduation",
        color: "violet",
    },
    {
        title: "Analyze My Skill Gaps",
        description:
            "আমার লক্ষ্য অনুযায়ী কোন দক্ষতাগুলো এখনো শেখা বাকি?",
        prompt:
            "Act as a career readiness coach. Help me evaluate my skills against my target role. Ask me about my knowledge, projects, practical experience, and target job. Identify likely skill gaps, explain why they matter, and suggest a prioritized improvement plan. Do not assume skills I have not demonstrated.",
        icon: "brain",
        color: "amber",
    },
    {
        title: "Explore Job-Market Skills",
        description:
            "কোন দক্ষতা, tools ও projects আমার লক্ষ্য পূরণে কাজে লাগবে?",
        prompt:
            "Help me understand the skills, tools, projects, and practical experience relevant to my target career. Ask which role and location I am targeting. Distinguish general industry knowledge from current job-market evidence, and do not invent current hiring trends or statistics. Recommend what I should investigate and learn next.",
        icon: "lightbulb",
        color: "pink",
    },
];

export default function CareerMentorPage() {
    return (
        <MentorChat
            mode="career"
            showSidebar={false}
            title="Your Career, Reimagined."
            description="তোমার পরবর্তী পদক্ষেপ কী? সঠিক skill বেছে নাও, নিজের roadmap তৈরি করো এবং আত্মবিশ্বাসের সঙ্গে career-এর দিকে এগিয়ে যাও।"
            heroIcon="target"
            accent="cyan"
            badge="EDUKIND CAREER INTELLIGENCE"
            placeholder="Ask about your career, skills, roadmap..."
            suggestions={careerSuggestions}
        />
    );
}
