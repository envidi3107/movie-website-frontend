import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";

const image_base_url = import.meta.env.VITE_TMDB_BASE_IMAGE_URL;
const tmdb_base_url = import.meta.env.VITE_TMDB_BASE_URL;
const api_key = import.meta.env.VITE_API_KEY;

function TopFilm({ type, filmData }) {
  const [tmdbFilmDetail, setTmdbFilmDetail] = useState(null);
  useEffect(() => {
    const fetchTmdbFilmById = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${filmData.tmdbId}?api_key=${api_key}`,
      );

      setTmdbFilmDetail(response.data);
    };

    if (filmData.belongTo === "TMDB_FILM") {
      fetchTmdbFilmById();
    }
  }, [filmData]);
  console.log("type:", type);
  return (
    <div
      className={`transition-all duration-200 relative group overflow-hidden rounded-[10px] h-auto animate-fadeIn`}
    >
      <div className={`relative overflow-hidden w-full h-auto`}>
        <div
          className={`w-full h-[250px] rounded-[10px] animate-skeleton relative`}
        >
          <div className="absolute top-[5px] left-[5px] text-white text-[12px] font-normal bg-black/50 rounded-[4px] p-[3px] z-10">
            {type === "Top view"
              ? `${filmData.numberOfViews} views`
              : `${filmData.numberOfLikes} likes`}
          </div>
          {tmdbFilmDetail ? (
            <img
              src={`${image_base_url}/original/${tmdbFilmDetail.poster_path || tmdbFilmDetail.backdrop_path}`}
              alt="Error"
              className={`w-full h-full rounded-[10px] cursor-pointer absolute object-cover`}
              loading="lazy"
            />
          ) : (
            <img
              src={`${filmData.posterPath || filmData.posterPath}`}
              alt=""
              className={`w-full h-full rounded-[10px] cursor-pointer absolute object-cover`}
              loading="lazy"
            />
          )}
        </div>

        <div
          className={`watchNowButton w-[60%] h-auto p-[5px] bg-[yellow] text-black text-center absolute  opacity-0 group-hover:opacity-100 top-[77%] left-[50%] transform translate-x-[-50%] rounded-[4px] transition-all duration-200 ease-linear flex justify-center items-center hover:shadow-boxShadow-red text-[90%] font-normal`}
        >
          <Link
            to={
              filmData.belongTo === "TMDB_FILM"
                ? `/watch-detail/theatrical-movie/${filmData.tmdbId}/`
                : `/watch-detail/hot-movies/${filmData.systemFilmId}/`
            }
            className="w-full h-full flex justify-center items-center truncate text-center"
          >
            Watch detail!
          </Link>
        </div>
      </div>

      {/* title and bookmark, heart */}
      {tmdbFilmDetail ? (
        <div
          className={`flex px-[3px] mt-[4px] justify-between items-start mb-[13px]`}
        >
          <p className={`w-[80%] mr-[6px] bg-transparent`}>
            {tmdbFilmDetail.title || tmdbFilmDetail.name}
          </p>
          <Bookmark filmId={filmData.filmId} />
        </div>
      ) : (
        <div
          className={`flex px-[3px] mt-[4px] justify-between items-start mb-[13px]`}
        >
          <p className={`w-[80%] mr-[6px] bg-transparent`}>{filmData.title}</p>
          <Bookmark filmId={filmData.filmId} />
        </div>
      )}
    </div>
  );
}

export default TopFilm;
