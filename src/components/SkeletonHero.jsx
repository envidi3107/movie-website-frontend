export default function SkeletonHero() {
    return (
        <section className="relative w-full h-[85vh] @container">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-500 animate-pulse"></div>
            <div className="absolute inset-0 hero-gradient opacity-25"></div>
            <div className="absolute inset-0 glow-overlay opacity-20"></div>
            <div className="relative h-full flex flex-col justify-end px-6 lg:px-16 pb-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col gap-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-5 bg-slate-700 rounded animate-pulse"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-4 bg-slate-700 rounded animate-pulse"></div>
                            <div className="w-16 h-4 bg-slate-700 rounded animate-pulse"></div>
                        </div>
                    </div>
                    <div className="w-3/4 h-16 lg:h-24 bg-slate-700 rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="w-full h-4 bg-slate-700 rounded animate-pulse"></div>
                        <div className="w-5/6 h-4 bg-slate-700 rounded animate-pulse"></div>
                        <div className="w-4/6 h-4 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <div className="w-32 h-10 bg-slate-700 rounded-full animate-pulse"></div>
                        <div className="w-32 h-10 bg-slate-700 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
