import { useState, useEffect } from 'react';
import usePlaylist from '@/hooks/usePlaylist';

export default function PlaylistPopup({ filmId, onClose }) {
    const { playlists, getUserPlaylists, addFilmToPlaylist, createPlaylist } =
        usePlaylist();
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        getUserPlaylists();
    }, [getUserPlaylists]);

    const handleAddToPlaylist = async (playlistId) => {
        const success = await addFilmToPlaylist(playlistId, filmId);
        if (success) {
            onClose();
        }
    };

    const handleCreateWrapper = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        await createPlaylist(newPlaylistName);
        setNewPlaylistName('');
        setIsCreating(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#1f1629] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-white font-bold text-lg">
                        Save to Playlist
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {playlists.length > 0 ? (
                        <div className="space-y-2">
                            {playlists.map((playlist) => (
                                <button
                                    key={playlist.playlistId}
                                    onClick={() =>
                                        handleAddToPlaylist(playlist.playlistId)
                                    }
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-left transition-colors group"
                                >
                                    <div className="bg-primary/20 p-2 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="material-symbols-outlined text-xl">
                                            playlist_add
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">
                                            {playlist.playlistName}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {playlist.films?.length || 0} items
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No playlists found.</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white/5 border-t border-white/10">
                    {isCreating ? (
                        <form
                            onSubmit={handleCreateWrapper}
                            className="flex gap-2"
                        >
                            <input
                                type="text"
                                autoFocus
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                                placeholder="Playlist name"
                                className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
                            />
                            <button
                                type="submit"
                                className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
                                disabled={!newPlaylistName.trim()}
                            >
                                <span className="material-symbols-outlined text-lg">
                                    check
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    close
                                </span>
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full py-2 flex items-center justify-center gap-2 text-primary font-bold hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <span className="material-symbols-outlined">
                                add
                            </span>
                            Create New Playlist
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
