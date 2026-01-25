import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "./LoadingAnimation/Skeleton";
import { useNotification } from "../context/NotificationContext";
import { useUserContext } from "../context/AuthUserContext";
import TypeWriter from "./TypeWriter";

const tmdb_image_base_url = import.meta.env.VITE_TMDB_BASE_IMAGE_URL;
const animationDelay = 6000;

export default function FeaturedMovie({ trendingList, isLoading }) {
  const [featuredMovie, setFeaturedMovie] = useState({
    data: null,
    index: 0,
  });
  const { showNotification } = useNotification();
  const { authUser } = useUserContext();

  useEffect(() => {
    if (trendingList.length === 0) return;

    setFeaturedMovie({
      data: trendingList[0],
      index: 0,
    });

    let featuredMovieInterval = setInterval(() => {
      setFeaturedMovie((prev) => {
        if (prev.index === trendingList.length - 1) {
          return {
            data: trendingList[0],
            index: 0,
          };
        } else {
          return {
            data: trendingList[prev.index + 1],
            index: prev.index + 1,
          };
        }
      });
    }, animationDelay);

    return () => clearInterval(featuredMovieInterval);
  }, [trendingList]);

  return (
    <div className="relative w-screen h-screen mt-[50px]">
      <div className="absolute inset-0 z-0">
        <div className="slider-viewport w-full h-full overflow-hidden">
          <div
            className={`w-auto h-full flex transform translate-x-[-${featuredMovie.index * 100}%] transition-all duration-500 ease-out`}
          >
            {trendingList.map((movie) => (
              <img
                key={movie.id}
                src={`${tmdb_image_base_url}original/${movie.backdrop_path}`}
                alt=""
                className="min-w-[100vw] object-cover"
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>

      {/* Featured Movie Info */}
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center pb-20 animate-moveToTop">
        {isLoading ? (
          <div className="max-w-2xl">
            <Skeleton className="h-12 w-3/4 mb-4 rounded" />

            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-6 w-20 mb-4 rounded-full" />
              <Skeleton className="h-4 w-12 mb-4 rounded" />
            </div>

            <div className="space-y-2 mb-8">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className={`h-4 rounded ${i === 2 ? "w-5/6" : i === 3 ? "w-4/6" : "w-full"}`}
                />
              ))}
            </div>

            <div className="flex space-x-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          featuredMovie.data && (
            <div className="max-w-2xl transform translate-y-[20px]">
              <TypeWriter
                content={featuredMovie.data.title || featuredMovie.data.name}
                typeSpeed={100}
              />
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-blue-600 rounded-full text-sm font-semibold">
                  {featuredMovie.data?.media_type === "movie"
                    ? "Movie"
                    : "TV Series"}
                </span>
                {featuredMovie.data?.release_date && (
                  <span className="text-gray-300">
                    {new Date(featuredMovie.data?.release_date).getFullYear()}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-8 line-clamp-3">
                {featuredMovie.data?.overview}
              </p>
              <div className="flex space-x-4">
                {authUser ? (
                  <Link
                    to={`/watch-detail/theatrical-movie/${featuredMovie.data?.id}`}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Play Now
                  </Link>
                ) : (
                  <button
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                    onClick={() =>
                      showNotification(
                        "error",
                        "Please log in or sign up to continue!",
                      )
                    }
                  >
                    Play Now
                  </button>
                )}

                <a
                  href="#trending"
                  className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  + Watch list
                </a>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
