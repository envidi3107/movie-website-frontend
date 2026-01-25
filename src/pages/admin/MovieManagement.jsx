import { useState, useEffect } from 'react';
import useRequest from '@/hooks/useRequest';
import { useNotification } from '@/contexts/NotificationContext';

export default function MovieManagement() {
    const { get, remove } = useRequest();
    const { showNotification } = useNotification();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await get('/films/all');
            if (response?.results) {
                setMovies(response.results);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (filmId) => {
        try {
            const response = await remove(`/admin/delete/film/${filmId}`);
            if (response) {
                showNotification(
                    response.message || 'Movie deleted successfully',
                    'success'
                );
                setMovies(movies.filter((m) => m.filmId !== filmId));
                setDeleteConfirm(null);
            }
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-white text-3xl font-black">
                        Movie Management
                    </h1>
                    <p className="text-white/60 mt-2">
                        Manage all movies on the platform
                    </p>
                </div>
                <div className="text-white/60">
                    Total: {movies.length} movies
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-white/60">Loading movies...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {movies.map((movie) => (
                        <div
                            key={movie.filmId}
                            className="bg-[#1a0b2e] border border-white/10 rounded-2xl overflow-hidden group hover:border-primary transition-all"
                        >
                            <div className="relative aspect-2/3 overflow-hidden bg-white/5">
                                <img
                                    src={movie.posterPath}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src =
                                            'https://via.placeholder.com/300x450?text=No+Image';
                                    }}
                                />
                                {movie.adult && (
                                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                        18+
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold">
                                        {movie.type}
                                    </span>
                                    <span className="text-white/60 text-xs">
                                        {new Date(
                                            movie.releaseDate
                                        ).getFullYear()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-yellow-500 text-sm">
                                            star
                                        </span>
                                        <span>
                                            {movie.rating?.toFixed(1) || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">
                                            visibility
                                        </span>
                                        <span>
                                            {movie.numberOfViews?.toLocaleString() ||
                                                0}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        setDeleteConfirm(movie.filmId)
                                    }
                                    className="w-full px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors font-medium text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a0b2e] border border-white/10 rounded-2xl p-8 max-w-md w-full">
                        <h3 className="text-white text-xl font-bold mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-white/60 mb-6">
                            Are you sure you want to delete this movie? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-4 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
