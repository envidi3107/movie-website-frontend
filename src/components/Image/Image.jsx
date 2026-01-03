import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const tmdb_image_base_url = import.meta.env.VITE_TMDB_BASE_IMAGE_URL;
const api_key = import.meta.env.VITE_API_KEY;

function Image({ id = null, title = null, src = null, belongTo = null }) {
  const [isError, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tmdbFilmDetail, setTmdbFilmDetail] = useState(null);
  useEffect(() => {
    const fetchTmdbFilmById = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`,
      );

      setTmdbFilmDetail(response.data);
    };
    if (belongTo === "TMDB_FILM") {
      fetchTmdbFilmById();
    }
  }, [belongTo, id]);

  if (isError) return null;

  return (
    <div
      key={id || null}
      className={
        "relative w-full h-full rounded-xl overflow-hidden shadow-lg group transition-transform duration-300" +
        `${loading ? " animate-skeleton" : ""}`
      }
    >
      {(src || tmdbFilmDetail) && (
        <img
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          onLoad={() => setLoading(false)}
          className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          src={
            src
              ? src
              : tmdbFilmDetail
                ? `${tmdb_image_base_url}/original/${tmdbFilmDetail.poster_path || tmdbFilmDetail.backdrop_path}`
                : ""
          }
          alt=""
        />
      )}

      {/* Overlay for text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 group">
        {title ? (
          <div className="flex flex-col gap-2 transform translate-y-[50%] group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-semibold text-lg truncate bg-black/60 p-[5px]">
              {title}
            </p>
            <Link
              to={`/watch-detail/hot-movies/${id}/`}
              className="m-auto min-w-[45%] inline-block bg-yellow-400 text-black text-center text-sm font-medium py-1 px-3 rounded opacity-0 hover:bg-yellow-300 group-hover:opacity-100 transition-all duration-200"
            >
              Watch detail
            </Link>
          </div>
        ) : tmdbFilmDetail ? (
          <div className="flex flex-col gap-2 transform translate-y-[50%] group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-semibold text-lg truncate">
              {tmdbFilmDetail.title}
            </p>
            <Link
              to={`/watch-detail/theatrical-movie/${tmdbFilmDetail.id}/`}
              className="m-auto min-w-[45%] inline-block bg-yellow-400 text-black text-center text-sm font-medium py-1 px-3 rounded opacity-0 hover:bg-yellow-300 group-hover:opacity-100 transition-all duration-200"
            >
              Watch detail
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Image;
