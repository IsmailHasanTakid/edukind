import InterviewerSidebar from "@/components/interviewer/InterviewerSidebar";

export default function InterviewerLayout({ children }) {
    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#080A12] text-white lg:flex-row">
            <InterviewerSidebar />
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
