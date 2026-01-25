import React, { useState } from "react";
import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";

const image_base_url = import.meta.env.VITE_TMDB_BASE_IMAGE_URL;

function Movie({ id, movieData, belongTo }) {
  const [isError, setError] = useState(false);

  if (isError) return null;

  return (
    <div
      className={`movie-item${id} w-[calc(25%-9px)] sm:w-[calc(20%-7px)] h-auto transition-all duration-200 relative group overflow-hidden rounded-[10px] hover:scale-[1.04]`}
    >
      <div className={`relative overflow-hidden w-full h-auto`}>
        <div className={`w-full aspect-[2/3] rounded-[10px] animate-skeleton`}>
          <img
            src={
              belongTo === "TMDB_FILM"
                ? `${image_base_url}original${movieData.poster_path || movieData.backdrop_path}`
                : `${movieData.posterPath}`
            }
            alt="Error"
            onError={() => setError(true)}
            className={`w-full h-full rounded-[10px] cursor-pointer absolute`}
            loading="lazy"
          />
        </div>

        <div
          className={`watchNowButton w-[60%] h-auto p-[5px] bg-[yellow] text-black text-center opacity-0 group-hover:opacity-100 flex justify-center items-center absolute left-[50%] transform translate-x-[-50%] bottom-[20px] rounded-[4px] transition-all duration-200 ease-linear  text-[90%] font-normal`}
        >
          <Link
            to={
              belongTo === "TMDB_FILM"
                ? `/watch-detail/theatrical-movie/${movieData.id}/`
                : `/watch-detail/hot-movies/${movieData.systemFilmId}/`
            }
            className="w-full h-full flex justify-start sm:justify-center items-center truncate"
          >
            Watch detail!
          </Link>
        </div>
      </div>

      <div
        className={`flex px-[3px] mt-[4px] justify-between items-start mb-[13px] z-[1]`}
      >
        <p className={`w-[80%] mr-[6px] bg-transparent`}>
          {" "}
          {movieData.title || movieData.name}
        </p>
        <Bookmark
          filmId={movieData.id || movieData.systemFilmId}
          belongTo={belongTo}
        />
      </div>
    </div>
  );
}

export default Movie;
