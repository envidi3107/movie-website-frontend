export default function MovieSection({ title, icon, children }) {
    return (
        <section className="pl-6 lg:pl-16">
            <div className="flex items-center justify-between pr-6 lg:pr-24 mb-4">
                <h2 className="text-white text-xl lg:text-2xl font-black tracking-tight flex items-center gap-2">
                    {title}
                    {icon && (
                        <span className="material-symbols-outlined text-primary">
                            {icon}
                        </span>
                    )}
                </h2>
                <a
                    className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                    href="#"
                >
                    See All
                </a>
            </div>
            <div className="flex gap-5 custom-scrollbar pb-4 pr-10">
                {children}
            </div>
        </section>
    );
}
