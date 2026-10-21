export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F7FAF8]">
            <div className="h-56 animate-pulse bg-[#14503C]/90" />
            <div className="mx-auto max-w-3xl space-y-3.5 px-5 py-10 sm:px-8">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
                ))}
            </div>
        </main>
    );
}