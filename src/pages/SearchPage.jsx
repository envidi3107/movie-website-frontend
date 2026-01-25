import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useFilmService from '@/hooks/useFilmService';
import PosterCard from '@/components/PosterCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { searchFilms } = useFilmService();

    const query = searchParams.get('q') || '';
    const genreParam = searchParams.get('genres') || '';
    const adultParam = searchParams.get('adult') === 'true';
    const pageParam = parseInt(searchParams.get('page')) || 1;

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [selectedGenre, setSelectedGenre] = useState(genreParam);
    const [isAdult, setIsAdult] = useState(adultParam);

    useEffect(() => {
        fetchData();
        // Sync local state with URL params on mount/change
        setSelectedGenre(genreParam);
        setIsAdult(adultParam);
    }, [searchParams]);

    const fetchData = async () => {
        setLoading(true);
        // useRequest handles error notifications
        const params = {
            q: query,
            genres: genreParam || undefined,
            adult: adultParam,
            page: pageParam,
            size: 24,
        };
        const res = await searchFilms(params);
        if (res) {
            setResults(res.results || []);
            setTotalPages(res.totalPages || 0);
            setTotalElements(res.totalElements || 0);
        }
        setLoading(false);
    };

    const handleFilterChange = () => {
        // Update URL params to trigger fetch
        const params = new URLSearchParams(searchParams);
        if (selectedGenre) params.set('genres', selectedGenre);
        else params.delete('genres');

        params.set('adult', isAdult);
        params.set('page', 1); // Reset to page 1 on filter change
        setSearchParams(params);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage);
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    const clearFilters = () => {
        setSelectedGenre('');
        setIsAdult(false);
        const params = new URLSearchParams(searchParams);
        params.delete('genres');
        params.set('adult', false);
        params.set('page', 1);
        setSearchParams(params);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display w-screen">
            <Navbar />
            <div className="pt-24 px-6 lg:px-12 pb-12 min-h-screen">
                {/* Search Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-gray-100 dark:bg-[#1f1629] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                    <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                        <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                            search
                        </span>
                        <input
                            type="text"
                            value={query}
                            readOnly // Or editable if we want to allow searching from here too, but mainly from navbar
                            className="bg-transparent border-none outline-none w-full text-gray-900 dark:text-white font-medium"
                            placeholder="Search result..."
                        />
                        {query && (
                            <button
                                onClick={() => navigate('/search')}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <button className="px-5 py-2 rounded-full bg-primary text-white text-sm font-bold flex items-center gap-2">
                        Filters{' '}
                        <span className="material-symbols-outlined text-sm">
                            filter_list
                        </span>
                    </button>

                    {/* Genre Dropdown (Mocked for now as we don't have genre list API in context) */}
                    <select
                        value={selectedGenre}
                        onChange={(e) => {
                            setSelectedGenre(e.target.value);
                            handleFilterChange();
                        }} // Immediate update or require "Apply"? Image suggests interactive. Let's do immediate or add Apply button if needed.
                        // Actually, let's trigger handleFilterChange separately or in useEffect if we want specific "Apply" button?
                        // Image shows "Clear called" button, so maybe auto-apply or specific. Let's add an Apply button logic or just auto-apply.
                        // For now, I'll update state and let user click 'Search' or auto-update?
                        // Let's stick to state change triggering effect via handleFilterChange which updates URL.
                        // But wait, changing select triggers onChange.
                        // Let's modify: onChange -> setSelectedGenre. Then useEffect on selectedGenre? No, that causes rapid refetch.
                        // Better: onChange -> update state AND update URL immediately? Yes.
                        className="px-4 py-2 rounded-full bg-gray-100 dark:bg-[#1f1629] text-gray-700 dark:text-gray-300 text-sm font-bold outline-none border border-transparent focus:border-primary/50"
                    >
                        <option value="">All Genres</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Drama">Drama</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Horror">Horror</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-[#1f1629] px-4 py-2 rounded-full text-sm font-bold text-gray-700 dark:text-gray-300 select-none border border-transparent hover:border-primary/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={isAdult}
                            onChange={(e) => {
                                const params = new URLSearchParams(
                                    searchParams
                                );
                                params.set('adult', e.target.checked);
                                params.set('page', 1);
                                setSearchParams(params);
                            }}
                            className="accent-primary"
                        />
                        Adult Content
                    </label>

                    <button
                        onClick={clearFilters}
                        className="ml-auto text-primary text-sm font-bold hover:underline"
                    >
                        Clear All
                    </button>
                </div>

                {/* Results Title */}
                <div className="mb-6 flex items-baseline justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-2xl font-bold dark:text-white text-gray-900">
                            Results for "{query}"
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Found {totalElements} matches in Movies & TV Shows
                        </p>
                    </div>
                    <div className="text-xs font-bold text-gray-400">
                        Sort by: <span className="text-white">Relevance</span>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
                                {results.map((film) => (
                                    <div key={film.filmId} className="group">
                                        <div className="relative aspect-2/3 rounded-xl overflow-hidden mb-3 cursor-pointer">
                                            <img
                                                src={film.posterPath}
                                                alt={film.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        'https://via.placeholder.com/300x450?text=No+Image')
                                                }
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Rating Badge */}
                                            <div className="absolute top-2 right-2 bg-surface-dark/80 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[10px] text-yellow-500 filled">
                                                    star
                                                </span>
                                                {film.rating?.toFixed(1) ||
                                                    'N/A'}
                                            </div>

                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                <span className="material-symbols-outlined text-white text-5xl drop-shadow-lg">
                                                    play_circle
                                                </span>
                                            </div>

                                            <a
                                                href={`/film/${film.filmId}`}
                                                className="absolute inset-0"
                                            ></a>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                                            <a href={`/film/${film.filmId}`}>
                                                {film.title}
                                            </a>
                                        </h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
                                            <span>
                                                {new Date(
                                                    film.releaseDate
                                                ).getFullYear() || 'N/A'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                            <span>{film.type}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center items-center">
                                <span className="material-symbols-outlined text-6xl text-gray-800 dark:text-gray-700 mb-4">
                                    search_off
                                </span>
                                <p className="text-xl font-bold dark:text-white text-gray-900">
                                    No results found for "{query}"
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                                    We couldn't find anything matching your
                                    search. Try different keywords or filters.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(pageParam - 1)
                                    }
                                    disabled={pageParam === 1}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1f1629] text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-[#302839] transition-colors font-bold"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                                        Page {pageParam} of {totalPages}
                                    </span>
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(pageParam + 1)
                                    }
                                    disabled={pageParam === totalPages}
                                    className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-[#1f1629] text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-[#302839] transition-colors font-bold"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

// Helper to fix the checkbox logic inline above:
// onChange={(e) => {
//     const newVal = e.target.checked;
//     setIsAdult(newVal);
//     const params = new URLSearchParams(searchParams);
//     params.set('adult', newVal);
//     params.set('page', 1);
//     setSearchParams(params);
// }}
