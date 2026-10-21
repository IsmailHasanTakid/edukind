
import DeenSidebar from "@/components/deen/DeenSidebar";

export default function DeenIslamLayout({ children }) {
    return (
        <div className="relative min-h-screen">
            <DeenSidebar />

            <div className="min-w-0 lg:pl-[260px]">
                {children}
            </div>
        </div>
    );
}
