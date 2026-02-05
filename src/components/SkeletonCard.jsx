export default function SkeletonCard({ variant = 'poster' }) {
    const common =
        'rounded-xl overflow-hidden bg-slate-700/80 animate-pulse flex-none';
    if (variant === 'wide') {
        return (
            <div className={`${common} w-[320px] lg:w-[460px] aspect-video`} />
        );
    }
    // poster / trending
    return <div className={`${common} w-[200px] lg:w-[260px] aspect-2/3`} />;
}
