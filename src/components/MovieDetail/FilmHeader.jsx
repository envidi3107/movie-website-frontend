import React from 'react';
import { FaPlay, FaThumbsUp, FaThumbsDown, FaComments } from 'react-icons/fa';

export default function FilmHeader({
    movie,
    userFilmReaction,
    isReacting,
    onFilmReact,
    onPlay,
}) {
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="col-span-1">
                <div className="w-full max-w-[260px] rounded-xl overflow-hidden shadow-lg border border-white/5">
                    <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-full h-auto object-cover"
                    />
                    <div className="p-3 bg-[#0b0b0b] flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-300">
                                {movie.type === 'SERIES' ? 'Series' : 'Movie'}
                            </span>
                            <span className="text-xs text-gray-400">
                                {movie.adult ? 'Adult' : 'All ages'}
                            </span>
                        </div>
                        <div className="flex gap-3 text-xs text-gray-300">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400 font-semibold">
                                    {(movie.rating || 0).toFixed(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{movie.numberOfViews ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-span-2">
                <h1 className="text-3xl lg:text-5xl font-bold mb-3">
                    {movie.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                    <div className="px-3 py-1 border border-white/20 rounded-full text-xs">
                        {movie.type}
                    </div>
                    {movie.genres && (
                        <div className="text-sm text-gray-300">
                            {Array.isArray(movie.genres)
                                ? movie.genres.join(' • ')
                                : movie.genres}
                        </div>
                    )}
                </div>

                <p className="text-gray-300 mb-6 max-w-3xl">{movie.overview}</p>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onPlay}
                        className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        <FaPlay /> Play
                    </button>

                    <button className="px-4 py-2 border border-white/10 rounded-md text-sm">
                        Add to list
                    </button>

                    <div className="ml-auto flex items-center gap-4 text-sm text-gray-300">
                        <button
                            disabled={isReacting}
                            onClick={() => onFilmReact('LIKE')}
                            className={`flex items-center gap-2 px-3 py-2 rounded ${userFilmReaction === 'LIKE' ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                        >
                            <FaThumbsUp />
                            <span>{movie.numberOfLikes ?? 0}</span>
                        </button>

                        <button
                            disabled={isReacting}
                            onClick={() => onFilmReact('DISLIKE')}
                            className={`flex items-center gap-2 px-3 py-2 rounded ${userFilmReaction === 'DISLIKE' ? 'bg-red-600 text-white' : 'hover:bg-white/5'}`}
                        >
                            <FaThumbsDown />
                            <span>{movie.numberOfDislikes ?? 0}</span>
                        </button>

                        <div className="flex items-center gap-2">
                            <FaComments />
                            <span>{movie.numberOfComments ?? 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
