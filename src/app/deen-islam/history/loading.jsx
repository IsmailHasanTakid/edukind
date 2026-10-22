function Shimmer({ className = "" }) {
    return (
        <span
            aria-hidden="true"
            className={`block animate-pulse rounded-lg bg-[#E8E0CF] ${className}`}
        />
    );
}

export default function Loading() {
    return (
        <main className="-mx-12 min-h-screen bg-[#F8F5EC]">
            <div className="relative isolate overflow-hidden bg-[#062A21]">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(198,161,91,0.18),transparent_46%),linear-gradient(132deg,#05231B_0%,#083326_52%,#0B3D2E_100%)]"
                />
                <div className="relative mx-auto max-w-[1180px] px-5 pb-20 pt-10 sm:px-8 sm:pt-12">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-16 animate-pulse rounded bg-white/10" />
                        <span className="h-3 w-24 animate-pulse rounded bg-white/10" />
                    </div>

                    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(330px,0.88fr)] lg:items-center">
                        <div>
                            <span className="block h-6 w-44 animate-pulse rounded-full bg-[#D8BC79]/15" />
                            <span className="mt-6 block h-10 w-[86%] max-w-[560px] animate-pulse rounded-xl bg-white/10" />
                            <span className="mt-3 block h-10 w-[64%] max-w-[420px] animate-pulse rounded-xl bg-white/10" />
                            <span className="mt-6 block h-3.5 w-full max-w-[560px] animate-pulse rounded bg-white/[0.07]" />
                            <span className="mt-2 block h-3.5 w-[82%] max-w-[460px] animate-pulse rounded bg-white/[0.07]" />
                            <span className="mt-7 block h-14 w-full max-w-[590px] animate-pulse rounded-2xl bg-white/[0.07]" />
                            <div className="mt-5 flex flex-wrap gap-2">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <span
                                        key={index}
                                        className="h-7 w-24 animate-pulse rounded-full bg-white/[0.06]"
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="hidden justify-self-end lg:block">
                            <div className="h-[430px] w-[342px] animate-pulse rounded-t-[190px] border border-[#D8BC79]/15 bg-white/[0.04]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <Shimmer className="h-3 w-24 !bg-[#E1D5BF]" />
                        <Shimmer className="mt-4 h-8 w-64 !bg-[#DED2BC]" />
                        <Shimmer className="mt-3 h-3.5 w-full max-w-[520px] !bg-[#EAE2D1]" />
                    </div>
                    <Shimmer className="h-14 w-28 !bg-[#E9E0CE]" />
                </div>

                <div className="mt-7 h-14 animate-pulse rounded-2xl border border-[#E3D8C2] bg-[#FFFDF8]" />

                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-[22px] border border-[#E2D8C2] bg-[#FFFDF8]"
                        >
                            <div className="h-[152px] animate-pulse bg-[#0A3528]/90" />
                            <div className="space-y-3 p-5">
                                <Shimmer className="h-4 w-[78%] !bg-[#E4DAC7]" />
                                <Shimmer className="h-3 w-full !bg-[#EDE6D7]" />
                                <Shimmer className="h-3 w-[88%] !bg-[#EDE6D7]" />
                                <div className="flex gap-2 pt-1">
                                    <Shimmer className="h-6 w-24 !bg-[#F0E9DA]" />
                                    <Shimmer className="h-6 w-20 !bg-[#F0E9DA]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <p className="sr-only" role="status">
                ইসলামের ইতিহাসের জীবনী সংগ্রহ লোড হচ্ছে।
            </p>
        </main>
    );
}
