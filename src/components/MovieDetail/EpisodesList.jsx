import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function EpisodesList({
    episodes,
    episodeIndex,
    onPlay,
    onEpisodeReact,
    episodeReactions,
    isReacting,
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Episodes</h2>
                <div className="text-sm text-gray-400">
                    {episodes.length} episodes
                </div>
            </div>

            <div className="grid gap-3">
                {episodes.map((ep, idx) => (
                    <div
                        key={ep.id || idx}
                        className={`p-4 rounded-lg border ${episodeIndex === idx ? 'border-primary bg-primary/10' : 'border-white/5'} flex items-start gap-4`}
                    >
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-medium">
                            {ep.episodeNumber ?? idx + 1}
                        </div>
                        <div className="grow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold">
                                        {ep.title}
                                    </h3>
                                    <div className="text-xs text-gray-400">
                                        {ep.viewCount ?? 0} views •{' '}
                                        {ep.likeCount ?? 0} likes •{' '}
                                        {ep.dislikeCount ?? 0} dislikes
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onPlay(idx)}
                                        className="px-3 py-2 bg-primary rounded text-white text-sm"
                                    >
                                        Play
                                    </button>

                                    <button
                                        disabled={isReacting}
                                        onClick={() =>
                                            onEpisodeReact(ep.id, 'LIKE')
                                        }
                                        className={`px-2 py-1 rounded ${episodeReactions[ep.id] === 'LIKE' ? 'bg-primary text-black' : 'border border-white/10'}`}
                                    >
                                        <FaThumbsUp />
                                    </button>

                                    <button
                                        disabled={isReacting}
                                        onClick={() =>
                                            onEpisodeReact(ep.id, 'DISLIKE')
                                        }
                                        className={`px-2 py-1 rounded ${episodeReactions[ep.id] === 'DISLIKE' ? 'bg-red-600 text-white' : 'border border-white/10'}`}
                                    >
                                        <FaThumbsDown />
                                    </button>
                                </div>
                            </div>

                            {ep.description && (
                                <p className="mt-2 text-sm text-gray-300">
                                    {ep.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
