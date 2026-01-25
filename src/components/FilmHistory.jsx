import React, { useEffect, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import Image from "./Image/Image";
import PulseAnimation from "./LoadingAnimation/PulseAnimation/PulseAnimation";
import Tooltip from "./Tooltip";

import axiosClient from "../libs/axiosClient";
import axios from "axios";

const tmdb_base_url = import.meta.env.VITE_TMDB_BASE_URL;
const api_key = import.meta.env.VITE_API_KEY;

const FilmHistory = () => {
  const [systemFilms, setSystemFilms] = useState([]);
  const [tmdbFilms, setTmdbFilms] = useState([]);

  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const fetchSystemFilmHistory = async () => {
    try {
      const data = await axiosClient.get(
        "/watching/get-watching-history/system-film",
      );
      setSystemFilms(data.results);
    } catch (err) {
      showNotification("error", "Failed to fetch system film history.");
    }
  };

  const fetchTmdbFilmHistory = async () => {
    try {
      const data = await axiosClient.get(
        "/watching/get-watching-history/tmdb-film",
      );

      const tmdbData = await Promise.all(
        (data.results || []).map(async (film) => {
          try {
            const tmdbRes = await axios.get(
              `https://api.themoviedb.org/3/movie/${film.tmdbId}?api_key=${api_key}`,
            );
            const tmdbInfo = tmdbRes.data;
            return {
              ...film,
              posterPath: `https://image.tmdb.org/t/p/original${tmdbInfo.poster_path}`,
              title: tmdbInfo.title,
              releaseDate: tmdbInfo.release_date,
            };
          } catch {
            return {
              ...film,
              posterPath: "",
              title: "Unknown",
              releaseDate: "",
            };
          }
        }),
      );

      setTmdbFilms(tmdbData);
    } catch (err) {
      showNotification("error", "Failed to fetch TMDB film history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemFilmHistory();
    fetchTmdbFilmHistory();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white p-8">
      <h2 className="text-3xl font-bold mb-6">Your Watch History</h2>

      <div>
        <h3 className="text-xl font-semibold text-purple-400 mb-4">
          Hot movies and Free
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          {systemFilms.map((film, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg shadow-lg group transition-transform duration-300 cursor-pointer"
            >
              <div className="w-full h-[250px] relative">
                <Image
                  id={film.filmId}
                  title={film.title}
                  src={film.posterPath || film.backdropPath}
                />
                <div className="absolute bottom-0 left-0 right-0 w-full h-[6px] rounded-[5px] bg-black/70 group-hover:bg-black/50 transition-all duration-300 ease-in-out">
                  <div
                    className={`w-[${(film.watchedDuration / film.totalDurations) * 100}%] h-full bg-red-600 relative`}
                  >
                    <Tooltip text={`${film.watchedDuration / 60} mins`}>
                      <div className="absolute right-[-5px] top-[-2px] w-[10px] h-[10px] rounded-[50%] bg-red-600"></div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Watched on: {film.watchingDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-green-400 mb-4">
          Theatrical movies
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {tmdbFilms.map((film) => (
            <div
              key={film.tmdbId}
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer"
            >
              {film.posterPath ? (
                <div className="w-full h-[250px]">
                  <Image
                    id={film.filmId}
                    title={film.title}
                    src={film.posterPath}
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <h4 className="text-lg font-semibold mt-2">{film.title}</h4>
              <p className="text-sm text-gray-400">
                Release: {film.releaseDate}
              </p>
              <p className="text-sm text-gray-400">
                Watch on: {film.watchingDate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[1000] h-screen">
          <PulseAnimation onLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default FilmHistory;
