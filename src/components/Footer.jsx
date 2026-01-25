export default function Footer() {
    return (
        <footer className="bg-surface-dark border-t border-white/5 py-16 px-6 lg:px-16">
            <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 text-primary mb-6">
                        <span className="material-symbols-outlined text-3xl font-bold">
                            movie_filter
                        </span>
                        <h2 className="text-white text-xl font-black tracking-tighter uppercase italic">
                            CineStream
                        </h2>
                    </div>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                        Premium cinematic experiences delivered to your screen.
                        Watch the latest blockbusters and timeless classics
                        anywhere, anytime.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            className="text-white/40 hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">
                                public
                            </span>
                        </a>
                        <a
                            className="text-white/40 hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">
                                video_library
                            </span>
                        </a>
                        <a
                            className="text-white/40 hover:text-primary transition-colors"
                            href="#"
                        >
                            <span className="material-symbols-outlined">
                                podcasts
                            </span>
                        </a>
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                        Platform
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Movies
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                TV Shows
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Trending
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                New Releases
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                        Account
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                My Profile
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                My List
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Settings
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Help Center
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">
                        Legal
                    </h4>
                    <ul className="space-y-4">
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-white/40 hover:text-white text-sm transition-colors"
                                href="#"
                            >
                                Cookie Preferences
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/20 text-xs">
                    © 2024 CineStream Entertainment Inc. All rights reserved.
                </p>
                <div className="flex items-center gap-2">
                    <span className="text-white/20 text-[10px] font-bold uppercase">
                        Region:
                    </span>
                    <button className="flex items-center gap-1 text-white/40 hover:text-white text-xs font-bold transition-colors">
                        Global (EN)
                        <span className="material-symbols-outlined text-sm">
                            language
                        </span>
                    </button>
                </div>
            </div>
        </footer>
    );
}
