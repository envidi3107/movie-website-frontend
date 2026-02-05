import React from 'react';
import { IoClose } from 'react-icons/io5';

export default function PlayerOverlay({
    isPlaying,
    playableUrl,
    activeEpisode,
    onClose,
    onPrev,
    onNext,
}) {
    if (!isPlaying || !playableUrl) return null;

    const isIframe =
        playableUrl.includes('player.phimapi.com') ||
        playableUrl.includes('m3u8');

    return (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-6">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded bg-white/10 hover:bg-white/20"
            >
                <IoClose className="text-white" />
            </button>
            <div className="w-full max-w-4xl">
                <h3 className="text-lg font-semibold text-white mb-2">
                    {activeEpisode?.title || ''}
                </h3>

                {isIframe ? (
                    <iframe
                        src={playableUrl}
                        width="100%"
                        height="420px"
                        title="player"
                        className="bg-slate-800 rounded"
                        allow="autoplay"
                    />
                ) : (
                    <video
                        key={playableUrl}
                        src={playableUrl}
                        controls
                        autoPlay
                        className="w-full rounded max-h-[70vh] bg-black"
                    />
                )}

                <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
                    <div className="flex items-center gap-4">
                        <div>
                            {activeEpisode
                                ? `${activeEpisode.viewCount ?? 0} views`
                                : ''}
                        </div>
                        <div>
                            {activeEpisode
                                ? `${activeEpisode.likeCount ?? 0} likes`
                                : ''}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onPrev}
                            className="px-3 py-1 border rounded border-white/10"
                        >
                            Prev
                        </button>
                        <button
                            onClick={onNext}
                            className="px-3 py-1 border rounded border-white/10"
                        >
                            Next
                        </button>
                    </div>
                </div>

                {activeEpisode?.description && (
                    <p className="mt-3 text-gray-300 text-sm">
                        {activeEpisode.description}
                    </p>
                )}
            </div>
        </div>
    );
}
