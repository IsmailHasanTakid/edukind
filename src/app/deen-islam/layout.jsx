import { Suspense } from "react";
import DeenShell from "@/components/deen/DeenShell";

export default function DeenIslamLayout({ children }) {
    // DeenShell reads `usePathname()` to pick the active section. Wrap it so
    // dynamic routes without known params can stream in instead of blocking
    // the whole prerender.
    return (
        <Suspense
            fallback={
                <div
                    aria-hidden="true"
                    className="min-h-screen bg-[#F8F5EC]"
                />
            }
        >
            <DeenShell>{children}</DeenShell>
        </Suspense>
    );
}
