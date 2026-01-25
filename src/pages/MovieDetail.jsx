import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequest from '@/hooks/useRequest';
import { FaPlay, FaStar, FaCalendar, FaClock, FaList } from 'react-icons/fa';

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get } = useRequest();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeEpisode, setActiveEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const response = await get(`/films/${id}`);
                // Helper to unwrap response, assuming API might wrap single item in results or result
                const data =
                    response?.results ||
                    response?.result ||
                    response?.data ||
                    response;
                if (data) {
                    setMovie(data);
                }
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetail();
        }
    }, [id]);

    const handlePlayParams = () => {
        if (!movie) return null;

        // Try to find video at root
        let video = movie.videoPath || movie.videoUrl;

        // If not found, checks episodes (common for both Series and sometimes normalized Movies)
        if (!video && movie.episodes && movie.episodes.length > 0) {
            video = movie.episodes[0].videoPath || movie.episodes[0].videoUrl;
        }

        // For SERIES specific logic (if we strictly want to ignore root video for series, though fallback is fine)
        if (movie.type === 'SERIES' && activeEpisode) {
            return activeEpisode.videoPath || activeEpisode.videoUrl || video;
        }

        return video;
    };

    const currentVideoUrl = handlePlayParams();

    // Helper for images
    const getBackdrop = () =>
        movie?.backdropPath ||
        movie?.backdropUrl ||
        movie?.posterPath ||
        movie?.posterUrl;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">
                Movie not found
            </div>
        );
    }

    return (
        <div className="min-h-screen w-screen bg-[#0f0f0f] text-white">
            {/* Hero/Player Section */}
            <div className="relative w-full h-[60vh] lg:h-[80vh]">
                {isPlaying && currentVideoUrl ? (
                    <div className="absolute inset-0 bg-black z-50">
                        {/* Simple Video Player Placeholder - In real app, consider using a library like react-player or custom controls */}
                        <video
                            src={currentVideoUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-contain"
                        />
                        <button
                            onClick={() => setIsPlaying(false)}
                            className="absolute top-4 left-4 z-50 bg-black/50 px-4 py-2 rounded text-white hover:bg-black/70"
                        >
                            Back to Details
                        </button>
                    </div>
                ) : (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${getBackdrop()})` }}
                        >
                            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-8 lg:p-16 z-10">
                            <div className="max-w-4xl">
                                <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                                    {movie.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-sm lg:text-base text-gray-300 mb-6">
                                    {movie.voteAverage && (
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <FaStar />
                                            <span>
                                                {movie.voteAverage.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                    {movie.releaseDate && (
                                        <div className="flex items-center gap-2">
                                            <FaCalendar />
                                            <span>
                                                {new Date(
                                                    movie.releaseDate
                                                ).getFullYear()}
                                            </span>
                                        </div>
                                    )}
                                    {movie.duration && (
                                        <div className="flex items-center gap-2">
                                            <FaClock />
                                            <span>{movie.duration}</span>
                                        </div>
                                    )}
                                    <div className="px-3 py-1 border border-white/20 rounded-full text-xs">
                                        {movie.type === 'MOVIE'
                                            ? 'Movie'
                                            : 'Series'}
                                    </div>
                                </div>

                                <p className="text-gray-300 text-lg mb-8 line-clamp-3 max-w-2xl">
                                    {movie.overview}
                                </p>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsPlaying(true)}
                                        className="flex items-center gap-3 bg-primary hover:bg-primary/80 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105"
                                    >
                                        <FaPlay />
                                        Play Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Genres */}
                        {movie.genres && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-gray-200">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {(Array.isArray(movie.genres)
                                        ? movie.genres
                                        : movie.genres.split(',')
                                    ).map((genre, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-surface-dark px-4 py-2 rounded-lg text-gray-300 text-sm border border-white/5"
                                        >
                                            {typeof genre === 'string'
                                                ? genre.trim()
                                                : genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Episodes List for Series */}
                        {movie.type === 'SERIES' &&
                            movie.episodes &&
                            movie.episodes.length > 0 && (
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-gray-200">
                                        <FaList className="text-primary" />
                                        Episodes
                                    </h3>
                                    <div className="grid gap-3">
                                        {movie.episodes.map((episode, idx) => (
                                            <button
                                                key={episode.id || idx}
                                                onClick={() => {
                                                    setActiveEpisode(episode);
                                                    setIsPlaying(true);
                                                }}
                                                className={`flex items-center p-4 rounded-xl transition-all ${
                                                    activeEpisode?.id ===
                                                    episode.id
                                                        ? 'bg-primary/20 border-primary/50'
                                                        : 'bg-surface-dark hover:bg-[#252525] border-transparent'
                                                } border border-white/5 group`}
                                            >
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    {idx + 1}
                                                </div>
                                                <div className="grow text-left">
                                                    <h4 className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                                        {episode.title}
                                                    </h4>
                                                    {episode.duration && (
                                                        <span className="text-xs text-gray-500">
                                                            {episode.duration}
                                                        </span>
                                                    )}
                                                </div>
                                                <FaPlay className="text-white/20 group-hover:text-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Sidebar / details */}
                    <div className="space-y-8">
                        {/* Add more sidebar content like cast, related movies, etc. later */}
                    </div>
                </div>
            </div>
        </div>
    );
}
