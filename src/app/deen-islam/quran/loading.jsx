// src/app/deen-islam/quran/loading.jsx
export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F7FAF8]">
            <div className="h-56 animate-pulse bg-[#14503C]/90" />
            <div className="mx-auto grid max-w-[1280px] gap-3.5 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-[76px] animate-pulse rounded-2xl bg-white" />
                ))}
            </div>
        </main>
    );
}