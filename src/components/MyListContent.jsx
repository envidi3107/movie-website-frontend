import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useRequest from '@/hooks/useRequest';
import usePlaylist from '@/hooks/usePlaylist';
import { useNotification } from '@/contexts/NotificationContext';

export default function MyListContent() {
    const [activeTab, setActiveTab] = useState('history');
    const [history, setHistory] = useState([]);

    // Use custom hook
    const {
        playlists,
        isLoading: playlistLoading,
        getUserPlaylists,
        createPlaylist,
        deletePlaylist,
    } = usePlaylist();

    // Local loading state for history (playlist loading handled by hook)
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const { get } = useRequest();

    const { showNotification } = useNotification();

    // Playlist creation state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        } else {
            getUserPlaylists();
        }
    }, [activeTab]);

    const fetchHistory = async () => {
        setIsHistoryLoading(true);
        // Error handling is managed by useRequest
        const res = await get('/watching/history');
        if (res?.results) {
            setHistory(res.results);
        }
        setIsHistoryLoading(false);
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        const success = await createPlaylist(newPlaylistName);
        if (success) {
            setNewPlaylistName('');
            setShowCreateForm(false);
        }
    };

    const handleDeletePlaylist = async (playlistId) => {
        if (!confirm('Are you sure you want to delete this playlist?')) return;
        await deletePlaylist(playlistId);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="dark:text-white text-gray-900 text-3xl font-black">
                    My List
                </h2>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-[#1f1629] p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'history'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Watch History
                    </button>
                    <button
                        onClick={() => setActiveTab('playlist')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                            activeTab === 'playlist'
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        Playlists
                    </button>
                </div>
            </div>

            {isHistoryLoading || playlistLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {activeTab === 'history' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {history.length > 0 ? (
                                history.map((item, index) => (
                                    <Link
                                        to={`/film/${item.film?.filmId}`}
                                        key={index}
                                        className="group relative"
                                    >
                                        <div className="aspect-2/3 rounded-xl overflow-hidden mb-3">
                                            <img
                                                src={item.film?.posterPath}
                                                alt={item.film?.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="material-symbols-outlined text-white text-4xl">
                                                    play_circle
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="dark:text-white text-gray-900 font-bold text-sm truncate">
                                            {item.film?.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {Math.round(
                                                    item.watchedDuration /
                                                        (1000 * 60)
                                                )}{' '}
                                                mins watched
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
                                    No watch history found.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'playlist' && (
                        <div>
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() =>
                                        setShowCreateForm(!showCreateForm)
                                    }
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-[#1f1629] hover:bg-gray-200 dark:hover:bg-[#2a1e38] text-gray-900 dark:text-white font-bold rounded-xl transition-colors"
                                >
                                    <span className="material-symbols-outlined">
                                        add
                                    </span>
                                    Create Playlist
                                </button>
                            </div>

                            {showCreateForm && (
                                <form
                                    onSubmit={handleCreatePlaylist}
                                    className="mb-8 bg-gray-50 dark:bg-[#1f1629] p-6 rounded-2xl border border-gray-100 dark:border-white/5 animate-fade-in"
                                >
                                    <h4 className="text-lg font-bold dark:text-white text-gray-900 mb-4">
                                        New Playlist
                                    </h4>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Playlist Name"
                                            value={newPlaylistName}
                                            onChange={(e) =>
                                                setNewPlaylistName(
                                                    e.target.value
                                                )
                                            }
                                            required
                                            className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-xl transition-colors"
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCreateForm(false)
                                            }
                                            className="px-6 rounded-xl font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {playlists.map((playlist) => (
                                    <div
                                        key={playlist.playlistId}
                                        className="bg-white dark:bg-[#1f1629] rounded-2xl p-5 border border-gray-100 dark:border-white/5 group hover:border-primary/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-primary/10 p-3 rounded-xl text-primary">
                                                <span className="material-symbols-outlined">
                                                    playlist_play
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleDeletePlaylist(
                                                        playlist.playlistId
                                                    )
                                                }
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete Playlist"
                                            >
                                                <span className="material-symbols-outlined">
                                                    delete
                                                </span>
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-bold dark:text-white text-gray-900 mb-1">
                                            {playlist.playlistName}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            Created{' '}
                                            {new Date(
                                                playlist.createdAt
                                            ).toLocaleDateString()}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            <span>
                                                {playlist.films?.length || 0}{' '}
                                                items
                                            </span>
                                        </div>

                                        {/* Preview of items could go here */}
                                        <div className="mt-4 flex -space-x-3 overflow-hidden">
                                            {playlist.films
                                                ?.slice(0, 4)
                                                .map((film, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={film.posterPath}
                                                        alt={film.title}
                                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1f1629] object-cover"
                                                    />
                                                ))}
                                            {playlist.films?.length > 4 && (
                                                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1f1629] bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold dark:text-white">
                                                    +{playlist.films.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {playlists.length === 0 && !playlistLoading && (
                                    <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl">
                                        You haven't created any playlists yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
