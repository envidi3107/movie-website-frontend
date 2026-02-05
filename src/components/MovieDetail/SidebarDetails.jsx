import React from 'react';

export default function SidebarDetails({ movie }) {
    return (
        <aside className="space-y-6">
            <div className="p-4 rounded-lg bg-[#0b0b0b] border border-white/5">
                <h4 className="text-sm text-gray-400 mb-3">Details</h4>
                <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex justify-between">
                        <span>Type</span>
                        <span>{movie.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Release</span>
                        <span>{movie.releaseDate ?? '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Rating</span>
                        <span>{(movie.rating || 0).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Views</span>
                        <span>{movie.numberOfViews ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Comments</span>
                        <span>{movie.numberOfComments ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Duration watched</span>
                        <span>{movie.watchedDuration ?? 0}s</span>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0b0b0b] border border-white/5">
                <h4 className="text-sm text-gray-400 mb-3">Genres</h4>
                <div className="flex flex-wrap gap-2">
                    {(Array.isArray(movie.genres)
                        ? movie.genres
                        : String(movie.genres).split(',')
                    )?.map((g, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-surface-dark rounded text-xs text-gray-300"
                        >
                            {g}
                        </span>
                    ))}
                </div>
            </div>
        </aside>
    );
}
