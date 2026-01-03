import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext.jsx";
import TextOverflow from "../../components/TextOverflow.jsx";
import Header from "../../components/Header/Header.jsx";
import Image from "../../components/Image/Image.jsx";
import PulseAnimation from "../../components/LoadingAnimation/PulseAnimation/PulseAnimation.jsx";

const api_key = import.meta.env.VITE_API_KEY;
const access_token = import.meta.env.VITE_API_READ_ACCESS_TOKEN;
const image_base_url = import.meta.env.VITE_TMDB_BASE_IMAGE_URL;
const randomAvatarColor = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#A133FF",
  "#33FFF3",
  "#F3FF33",
  "#FF8C33",
  "#8C33FF",
  "#33FF8C",
  "#FF3333",
  "#33A1FF",
  "#A1FF33",
  "#FF338C",
  "#338CFF",
  "#FFC133",
  "#33FFC1",
  "#C133FF",
  "#33C1FF",
  "#FF33C1",
];
import axiosClient from "../../libs/axiosClient";
import axios from "axios";

function TmdbFilmDetail() {
  const [movieData, setMovieData] = useState({
    movieDetail: null,
    movieVideos: [],
    movieReviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [tmdbFilmDetail, setTmdbFilmDetail] = useState(null);

  const { showNotification } = useNotification();
  const { tmdbFilmId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${tmdbFilmId}?api_key=${api_key}`,
            )
            .then((res) => res.data),
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${tmdbFilmId}/videos?api_key=${api_key}`,
            )
            .then((res) => res.data),
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${tmdbFilmId}/reviews?api_key=${api_key}`,
            )
            .then((res) => res.data),
        ]);

        const movieDetail =
          results[0].status === "fulfilled" ? results[0].value : null;
        const movieVideos =
          results[1].status === "fulfilled" ? results[1].value.results : [];
        const movieReviews =
          results[2].status === "fulfilled" ? results[2].value.results : [];

        if (!movieDetail)
          showNotification("error", "Getting a movie detail is errored!");
        if (!movieVideos.length)
          showNotification("info", "No videos available for this movie");

        localStorage.setItem("movieVideos", JSON.stringify(movieVideos));

        setMovieData({
          movieDetail,
          movieVideos,
          movieReviews,
        });
      } catch (err) {
        showNotification("error", "Failed to fetch movie data");
        setMovieData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [tmdbFilmId]);

  const saveWatchHistory = async () => {
    try {
      await axiosClient.post(
        `/watching/save-watching-history?filmId=${tmdbFilmDetail.id}`,
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTmdbFilmDetail = async () => {
    try {
      const data = await axiosClient.get(
        `/tmdb-films/get?tmdbId=${tmdbFilmId}`,
      );
      setTmdbFilmDetail(data.results);
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  const handleAddTmdbFilm = async () => {
    try {
      await axiosClient.post(`/tmdb-films/add?tmdbId=${tmdbFilmId}`);
      fetchTmdbFilmDetail();
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const increaseNumberOfViews = async (duration) => {
    try {
      await axiosClient.post(
        `/films/${tmdbFilmDetail.id}/increase-view?watchedDuration=${duration}&belongTo=TMDB_FILM`,
      );
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  useEffect(() => {
    if (tmdbFilmDetail) {
      saveWatchHistory();
      increaseNumberOfViews(0.0);
    } else {
      handleAddTmdbFilm();
    }
  }, [tmdbFilmDetail]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <PulseAnimation onLoading={loading} />
      </div>
    );
  }

  if (!movieData || !movieData.movieDetail) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-300 text-xl">
          Sorry! This resource is not found!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Movie Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-[70vh] overflow-hidden"
        >
          <Image
            src={`${image_base_url}original/${movieData.movieDetail.backdrop_path}`}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container mx-auto px-4 relative z-20 -mt-32">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Movie Poster */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full md:w-1/3 lg:w-1/4"
            >
              <Image
                src={`${image_base_url}original/${movieData.movieDetail.poster_path}`}
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>

            {/* Movie Info */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="flex flex-col space-y-4">
                <motion.h1
                  className="text-4xl font-bold text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {movieData.movieDetail.title}
                  {movieData.movieDetail.adult && (
                    <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded-md">
                      18+
                    </span>
                  )}
                </motion.h1>

                <div className="flex flex-wrap gap-2">
                  {movieData.movieDetail.genres.map((genre, index) => (
                    <motion.span
                      key={genre.id}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {genre.name}
                    </motion.span>
                  ))}
                </div>

                <motion.div
                  className="flex items-center space-x-4 text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <span>{movieData.movieDetail.release_date}</span>
                  <span>•</span>
                  <span>{movieData.movieDetail.runtime} minutes</span>
                  <span>•</span>
                  <span>
                    {movieData.movieDetail.vote_average.toFixed(1)} (
                    {movieData.movieDetail.vote_count} votes)
                  </span>
                  <span>•</span>
                  <span className="text-[yellow]">
                    {tmdbFilmDetail ? tmdbFilmDetail.numberOfViews : 0} views
                  </span>
                </motion.div>

                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-2">
                    Overview
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {movieData.movieDetail.overview}
                  </p>
                </motion.div>

                {movieData.movieDetail.budget > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Budget
                    </h2>
                    <p className="text-gray-300">
                      ${movieData.movieDetail.budget.toLocaleString()}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Reviews Section */}
          <div className="w-full lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Top Reviews
              </h2>

              {movieData.movieReviews.length > 0 ? (
                <div className="space-y-6">
                  {movieData.movieReviews.map((review, index) => (
                    <motion.div
                      key={`review${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-6 shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`rounded-full w-12 h-12 flex items-center justify-center text-white font-bold`}
                          style={{
                            backgroundColor:
                              randomAvatarColor[
                                Math.floor(
                                  Math.random() * randomAvatarColor.length,
                                )
                              ],
                          }}
                        >
                          {review.author_details.avatar_path ? (
                            <img
                              src={`${image_base_url}original/${review.author_details.avatar_path}`}
                              className="w-full h-full rounded-full"
                              alt={review.author}
                            />
                          ) : (
                            review.author[0]?.toUpperCase() || "A"
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-300">
                            {review.author}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            {formatDate(review.created_at)}
                          </p>
                          <TextOverflow
                            content={review.content}
                            useBy={"MovieDetail"}
                            className="text-gray-300"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <p className="text-gray-400">
                    No reviews available for this movie
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Trailers Section */}
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="sticky top-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Related Videos
              </h2>

              {movieData.movieVideos.length > 0 ? (
                <div className="space-y-4">
                  {movieData.movieVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                      onClick={() => openVideoModal(video)}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                          className="w-full h-full object-cover"
                          alt={video.name}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium truncate">
                          {video.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {formatDate(video.published_at)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <p className="text-gray-400">
                    No videos available for this movie
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideoModal}
                className="fixed top-[10px] right-[10px] text-white hover:text-purple-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1`}
                  title={`Video: ${selectedVideo.name}`}
                  className="w-full h-full rounded-lg shadow-xl"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-white text-xl font-medium">
                  {selectedVideo.name}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TmdbFilmDetail;
