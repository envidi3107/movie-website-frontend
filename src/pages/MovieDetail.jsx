import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useRequest from '@/hooks/useRequest';
import formatDate from '@/utils/formatDate';
import {
    FaPlay,
    FaStar,
    FaCalendar,
    FaThumbsUp,
    FaThumbsDown,
    FaComments,
    FaEye,
} from 'react-icons/fa';
import { useNotification } from '@/contexts/NotificationContext';

import FilmHeader from '@/components/MovieDetail/FilmHeader';
import EpisodesList from '@/components/MovieDetail/EpisodesList';
import PlayerOverlay from '@/components/MovieDetail/PlayerOverlay';
import SidebarDetails from '@/components/MovieDetail/SidebarDetails';

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { get, post } = useRequest();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeEpisode, setActiveEpisode] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [episodeIndex, setEpisodeIndex] = useState(0);

    // Reaction states
    const [userFilmReaction, setUserFilmReaction] = useState(null); // 'LIKE' | 'DISLIKE' | null
    const [episodeReactions, setEpisodeReactions] = useState({}); // { [episodeId]: 'LIKE' | 'DISLIKE' }
    const [isReacting, setIsReacting] = useState(false);

    // Fetch movie detail - made reusable so we can refresh after reaction
    const fetchMovieDetail = async () => {
        try {
            setLoading(true);
            const response = await get(`/films/${id}`);
            const data =
                response?.results ||
                response?.result ||
                response?.data ||
                response;
            if (data) setMovie(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchMovieDetail();
    }, [id]);

    // Fetch user reactions and map to local state
    const fetchUserReactions = async () => {
        try {
            const res = await get('/reaction/get-user-reaction');
            const results = res?.results || [];
            // Find film reaction
            const filmId = movie?.filmId || movie?.id || movie?._id;
            const filmReaction = results.find((r) => r.film_id === filmId);
            setUserFilmReaction(
                filmReaction ? filmReaction.reaction_type : null
            );
            // If API returns episode reactions, we could map them here (not specified in example)
        } catch (err) {
            console.error('fetchUserReactions error', err);
        }
    };

    const { showNotification } = useNotification();

    useEffect(() => {
        if (movie) fetchUserReactions();
    }, [movie]);

    // Choose playable video url based on movie / episode selection
    const getPlayableUrl = () => {
        if (activeEpisode)
            return activeEpisode.videoPath || activeEpisode.videoUrl || null;
        if (movie?.videoPath || movie?.videoUrl)
            return movie.videoPath || movie.videoUrl;
        if (movie?.episodes && movie.episodes.length > 0)
            return movie.episodes[0].videoPath || movie.episodes[0].videoUrl;
        return null;
    };

    const playableUrl = getPlayableUrl();

    const getBackdrop = () =>
        movie?.backdropPath ||
        movie?.backdropUrl ||
        movie?.posterPath ||
        movie?.posterUrl;

    if (loading) {
        return (
            <div className="min-h-screen w-screen bg-[#0f0f0f] flex items-center justify-center">
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

    const handlePlayEpisode = (index) => {
        setEpisodeIndex(index);
        setActiveEpisode(movie.episodes[index]);
        setIsPlaying(true);
    };

    const handleNextEpisode = () => {
        if (!movie?.episodes) return;
        const next = Math.min(episodeIndex + 1, movie.episodes.length - 1);
        handlePlayEpisode(next);
    };

    const handlePrevEpisode = () => {
        if (!movie?.episodes) return;
        const prev = Math.max(episodeIndex - 1, 0);
        handlePlayEpisode(prev);
    };

    // Film reaction (LIKE/DISLIKE) — optimistic UI update (no full refresh to update UI)
    const handleFilmReaction = async (type) => {
        if (!movie) return;
        const prev = userFilmReaction;
        // Toggle: if clicking same type -> remove reaction locally
        const next = prev === type ? null : type;

        // Optimistically update UI counts
        setUserFilmReaction(next);
        setMovie((m) => {
            if (!m) return m;
            let likes = m.numberOfLikes ?? 0;
            let dislikes = m.numberOfDislikes ?? 0;

            if (type === 'LIKE') {
                if (prev === 'LIKE') likes = Math.max(0, likes - 1);
                else {
                    likes = likes + 1;
                    if (prev === 'DISLIKE')
                        dislikes = Math.max(0, dislikes - 1);
                }
            }

            if (type === 'DISLIKE') {
                if (prev === 'DISLIKE') dislikes = Math.max(0, dislikes - 1);
                else {
                    dislikes = dislikes + 1;
                    if (prev === 'LIKE') likes = Math.max(0, likes - 1);
                }
            }

            return { ...m, numberOfLikes: likes, numberOfDislikes: dislikes };
        });

        setIsReacting(true);
        try {
            // Call backend but don't rely on it to update UI; revert on error
            await post('/reaction/save-reaction', {
                filmId: movie.filmId || movie.id || movie._id,
                reactionType: next || type,
                reactionTime: new Date().toISOString(),
            });
        } catch (err) {
            // revert on error
            setUserFilmReaction(prev);
            await fetchMovieDetail();
            if (showNotification)
                showNotification('Failed to save reaction', 'error');
            console.error('handleFilmReaction error', err);
        } finally {
            setIsReacting(false);
        }
    };

    // Episode reaction — optimistic per-episode update then refresh counts
    const handleEpisodeReaction = async (episodeId, type) => {
        if (!movie) return;
        const ep = movie.episodes?.find((e) => e.id === episodeId);
        if (!ep) return;

        const prev = episodeReactions[episodeId] || null;
        const next = prev === type ? null : type;

        // Optimistic update on UI: update episode counts and local mapping
        setEpisodeReactions((prevMap) => ({ ...prevMap, [episodeId]: next }));
        setMovie((m) => {
            if (!m) return m;
            const eps = m.episodes.map((e) => {
                if (e.id !== episodeId) return e;
                let likeCount = e.likeCount ?? 0;
                let dislikeCount = e.dislikeCount ?? 0;
                if (type === 'LIKE') {
                    if (prev === 'LIKE') likeCount = Math.max(0, likeCount - 1);
                    else {
                        likeCount = likeCount + 1;
                        if (prev === 'DISLIKE')
                            dislikeCount = Math.max(0, dislikeCount - 1);
                    }
                }
                if (type === 'DISLIKE') {
                    if (prev === 'DISLIKE')
                        dislikeCount = Math.max(0, dislikeCount - 1);
                    else {
                        dislikeCount = dislikeCount + 1;
                        if (prev === 'LIKE')
                            likeCount = Math.max(0, likeCount - 1);
                    }
                }
                return { ...e, likeCount, dislikeCount };
            });
            return { ...m, episodes: eps };
        });

        setIsReacting(true);
        try {
            await post('/reaction/save-episode-reaction', {
                episodeId,
                reactionType: next || type,
            });
            // refresh to ensure counts are consistent
            await fetchMovieDetail();
        } catch (err) {
            // revert mapping
            setEpisodeReactions((prevMap) => ({
                ...prevMap,
                [episodeId]: prev,
            }));
            await fetchMovieDetail();
            if (showNotification)
                showNotification('Failed to save episode reaction', 'error');
            console.error('handleEpisodeReaction error', err);
        } finally {
            setIsReacting(false);
        }
    };

    return (
        <div className="min-h-screen w-screen bg-[#0f0f0f] text-white">
            {/* Hero */}
            <div className="relative w-full h-[60vh] lg:h-[70vh] z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${getBackdrop()})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0a0a0a]/60 to-transparent" />
            </div>

            <div className="relative mt-[-250px] w-full p-6 lg:p-12 z-100">
                <div className="max-w-6xl mx-auto">
                    <FilmHeader
                        movie={movie}
                        userFilmReaction={userFilmReaction}
                        isReacting={isReacting}
                        onFilmReact={handleFilmReaction}
                        onPlay={() => {
                            if (
                                movie.type === 'SERIES' &&
                                movie.episodes?.length
                            ) {
                                handlePlayEpisode(0);
                            } else {
                                setActiveEpisode(null);
                                setIsPlaying(true);
                            }
                        }}
                    />
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Episodes */}
                        {movie.type === 'SERIES' &&
                            movie.episodes?.length > 0 && (
                                <EpisodesList
                                    episodes={movie.episodes}
                                    episodeIndex={episodeIndex}
                                    onPlay={handlePlayEpisode}
                                    onEpisodeReact={handleEpisodeReaction}
                                    episodeReactions={episodeReactions}
                                    isReacting={isReacting}
                                />
                            )}

                        {/* Overview / Details */}
                        <section>
                            <h2 className="text-xl font-bold mb-3">Overview</h2>
                            <p className="text-gray-300 leading-relaxed">
                                {movie.overview}
                            </p>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <SidebarDetails movie={movie} />
                </div>
            </div>

            {/* Player overlay */}
            <PlayerOverlay
                isPlaying={isPlaying}
                playableUrl={playableUrl}
                activeEpisode={activeEpisode}
                onClose={() => setIsPlaying(false)}
                onPrev={handlePrevEpisode}
                onNext={handleNextEpisode}
            />
        </div>
    );
}
