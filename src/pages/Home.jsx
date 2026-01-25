import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import MovieSection from '@/components/MovieSection';
import TrendingCard from '@/components/TrendingCard';
import PosterCard from '@/components/PosterCard';
import WideCard from '@/components/WideCard';
import useRequest from '@/hooks/useRequest';

export default function Home() {
    const { get } = useRequest();
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [heroMovie, setHeroMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Trending (Top Viewed)
                const trendingRes = await get('/films/top-viewed?q=10');

                // Fetch New Releases
                const newReleaseRes = await get('/films/new-releases?q=10');

                if (trendingRes?.results) {
                    setTrendingMovies(trendingRes.results);
                    // Pick random hero from top viewed
                    if (trendingRes.results.length > 0) {
                        const randomIdx = Math.floor(
                            Math.random() * trendingRes.results.length
                        );
                        setHeroMovie(trendingRes.results[randomIdx]);
                    }
                }

                if (newReleaseRes?.results) {
                    setNewReleases(newReleaseRes.results);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper for recommended (still mocking or reuse trending/new for now if no dedicated API)
    // We can just use trendingMovies or maybe fetch a different set.
    // Reusing trending for recommended for now as per previous logic (random slice).
    const recommended = trendingMovies.slice(0, 3);

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen overflow-x-hidden font-display w-screen">
            <Navbar />
            <main className="relative overflow-x-hidden">
                <Hero movie={heroMovie} />
                <div className="relative -mt-10 pb-20 z-10 space-y-12 w-full">
                    {/* Trending Row */}
                    <MovieSection title="Trending Now" icon="trending_up">
                        {loading ? (
                            <div className="text-white">Loading...</div>
                        ) : (
                            trendingMovies.map((movie) => (
                                <TrendingCard
                                    key={movie.filmId}
                                    id={movie.filmId}
                                    title={movie.title}
                                    year={new Date(
                                        movie.releaseDate
                                    ).getFullYear()}
                                    genre={movie.type}
                                    rating={
                                        movie.voteAverage?.toFixed(1) || 'N/A'
                                    }
                                    image={
                                        movie.posterPath ||
                                        'https://via.placeholder.com/200x300'
                                    }
                                />
                            ))
                        )}
                    </MovieSection>

                    {/* New Releases Row */}
                    <MovieSection title="New Releases">
                        {loading ? (
                            <div className="text-white">Loading...</div>
                        ) : (
                            newReleases.map((movie) => (
                                <PosterCard
                                    key={movie.filmId}
                                    id={movie.filmId}
                                    image={
                                        movie.posterPath ||
                                        'https://via.placeholder.com/200x300'
                                    }
                                    badge={movie.adult ? '18+' : null}
                                />
                            ))
                        )}
                    </MovieSection>

                    {/* Recommended Row */}
                    <MovieSection title="Recommended for You">
                        {loading ? (
                            <div className="text-white">Loading...</div>
                        ) : (
                            recommended.map((movie) => (
                                <WideCard
                                    key={movie.filmId}
                                    id={movie.filmId}
                                    title={movie.title}
                                    match={`${Math.floor(Math.random() * 20) + 80}%`}
                                    image={
                                        movie.backdropPath ||
                                        movie.posterPath ||
                                        'https://via.placeholder.com/460x260'
                                    }
                                />
                            ))
                        )}
                    </MovieSection>
                </div>
            </main>
            <Footer />
        </div>
    );
}
