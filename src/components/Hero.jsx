import { useState } from 'react';
import { Link } from 'react-router-dom';
import PlaylistPopup from '@/components/PlaylistPopup';
import SkeletonHero from '@/components/SkeletonHero';

export default function Hero({ movie, loading = false }) {
    const [showPlaylist, setShowPlaylist] = useState(false);

    if (loading) return <SkeletonHero />;
    if (!movie) return null;

    return (
        <section className="relative w-full h-[85vh] @container">
            <div
                className="absolute inset-0 bg-cover bg-center"
                data-alt={movie.title}
                style={{
                    backgroundImage: `url('${movie.backdropPath || movie.posterPath}')`,
                }}
            ></div>
            <div className="absolute inset-0 hero-gradient"></div>
            <div className="absolute inset-0 glow-overlay"></div>
            <div className="relative h-full flex flex-col justify-end px-6 lg:px-16 pb-20 max-w-[1440px] mx-auto">
                <div className="flex flex-col gap-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                        <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                            New Release
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                            <span className="material-symbols-outlined fill-1 text-sm">
                                star
                            </span>
                            <span className="text-sm font-bold text-white">
                                {movie.rating?.toFixed(1) || 'N/A'}
                            </span>
                            <span className="text-xs text-white/50 ml-1">
                                ({movie.voteCount} reviews)
                            </span>
                        </div>
                    </div>
                    <h1 className="text-white text-5xl lg:text-8xl font-black leading-none tracking-tighter uppercase italic line-clamp-2">
                        {movie.title}
                    </h1>
                    <div className="flex gap-2.5">
                        {movie?.genres.map((genre, idx) => (
                            <div className="flex justify-center items-center gap-2.5">
                                <p className="text-white/80 text-base lg:text-lg font-medium leading-relaxed line-clamp-3 hover:text-red-500">
                                    {genre}
                                </p>
                                {idx < movie?.genres.length - 1 && (
                                    <div className="w-0.75 h-6.25 bg-gray-400"></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4">
                        <Link
                            to={`/film/${movie.filmId}`}
                            className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-lg font-black text-sm uppercase tracking-wider transition-transform active:scale-95 group"
                        >
                            <span className="material-symbols-outlined fill-1">
                                play_arrow
                            </span>
                            Watch Now
                        </Link>
                        <button
                            onClick={() => setShowPlaylist(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg font-black text-sm uppercase tracking-wider transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>
                            Watchlist
                        </button>
                    </div>
                </div>
            </div>
            {showPlaylist && (
                <PlaylistPopup
                    filmId={movie.filmId}
                    onClose={() => setShowPlaylist(false)}
                />
            )}
        </section>
    );
}
