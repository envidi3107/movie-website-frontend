import { useRef, useEffect, useState } from "react";
import React from "react";
import Header from "../../components/Header/Header.jsx";
import SideBar from "../../components/SideBar.jsx";
import PulseAnimation from "../../components/LoadingAnimation/PulseAnimation/PulseAnimation.jsx";

import { useNotification } from "../../context/NotificationContext.jsx";
import MovieList from "../../components/MovieList.jsx";
import Playlist from "../../components/Playlist.jsx";
import FilmHistory from "../../components/FilmHistory.jsx";
import { cinemaMap } from "../../constants/menu.jsx";
import { urlTemplates } from "../../constants/TmdbUrls.jsx";
import { usePageTransition } from "../../context/PageTransitionContext.jsx";

const api_key = import.meta.env.VITE_API_KEY;
const access_token = import.meta.env.VITE_API_READ_ACCESS_TOKEN;

import axiosClient from "../../libs/axiosClient.js";
import axios from "axios";

function Home() {
  const [movies, setMovies] = useState();
  const [loading, setLoading] = useState(false);
  const { pageNumber } = usePageTransition();
  const [menuState, setMenuState] = useState({
    activeMenu: "HotMoviesAndFree",
    cinemaType: null,
  });

  const [playlist, setPlaylist] = useState({
    systemFilm: null,
    tmdbFilm: null,
  });

  const movieListBox = useRef(null);
  const { showNotification } = useNotification();
  let initialMovie = useRef(null);

  const updateActiveMenu = (newActiveMenu) => {
    setMenuState({
      activeMenu: newActiveMenu,
      cinemaType: cinemaMap[newActiveMenu] ? cinemaMap[newActiveMenu][0] : null,
    });
  };

  useEffect(() => {
    const fetchSystemMovie = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get("/films/all?page=" + pageNumber);
        data.belong_to = "SYSTEM_FILM";
        initialMovie.current = data;
        setMovies(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showNotification("error", err.message);
      }
    };

    if (menuState.activeMenu === "HotMoviesAndFree") {
      fetchSystemMovie();
    }
  }, [menuState, pageNumber, showNotification]);

  useEffect(() => {
    const fetchTmdbMovie = async () => {
      console.log("fetchTmdbMovie");
      setLoading(true);
      try {
        const params = {
          api_key: api_key,
          page: pageNumber,
        };
        const url = urlTemplates[menuState.activeMenu][menuState.cinemaType];

        // Use raw axios for TMDB to avoid credentials issues
        const response = await axios.get(url, { params });
        const data = response.data;
        data.type = menuState.activeMenu;
        data.belong_to = "TMDB_FILM";
        initialMovie.current = data;
        setMovies(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        showNotification("error", err.message);
      }
    };

    if (menuState.cinemaType) {
      fetchTmdbMovie();
    }
  }, [menuState, pageNumber, showNotification]);

  useEffect(() => {
    const fetchFilmPlaylist = async () => {
      setLoading(true);
      try {
        const options = {
          method: "GET",
          credentials: "include",
        };

        const [systemFilmData, tmdbFilmData] = await Promise.all([
          axiosClient
            .get("/users/get-user-playlist/system-film")
            .then((res) => res),
          axiosClient
            .get("/users/get-user-playlist/tmdb-film")
            .then((res) => res),
        ]);

        setPlaylist({
          systemFilm: systemFilmData.results,
          tmdbFilm: tmdbFilmData.results,
        });
      } catch (err) {
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (menuState.activeMenu === "Playlist") {
      fetchFilmPlaylist();
    }
  }, [menuState.activeMenu, showNotification]);

  const handleSearching = (queryParam) => {
    console.log("queryParam: ", queryParam);

    const searchSystemFilm = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(queryParam);
        const data = await axiosClient.get(`/system-films/search?${params}`);
        data.belong_to = "SYSTEM_FILM";
        setMovies(data);
      } catch (err) {
        console.log(err);
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    const searchTmdbFilm = async () => {
      setLoading(true);
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      };

      axios
        .get(
          `https://api.themoviedb.org/3/search/movie?query=${queryParam.title}&include_adult=false&language=en-US&page=1`,
          options,
        )
        .then((res) => res.data)
        .then((data) => {
          data.type = menuState.activeMenu;
          data.belong_to = "TMDB_FILM";
          setMovies(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };

    if (menuState.activeMenu === "HotMoviesAndFree") {
      searchSystemFilm();
    } else if (
      menuState.activeMenu === "Trending" ||
      menuState.activeMenu === "Movie" ||
      menuState.activeMenu === "TV Show"
    ) {
      searchTmdbFilm();
    }
  };

  const resetMovies = () => {
    setMovies(initialMovie.current);
  };

  return (
    <>
      <Header
        onSearching={handleSearching}
        onReset={resetMovies}
        activeMenu={menuState.activeMenu}
      />
      <div className="body flex relative mt-[50px] min-h-screen z-10">
        <SideBar onUpdateActiveMenu={updateActiveMenu} menuState={menuState} />

        <div
          className="movie-list-box flex w-full sm:w-[80%] sm:ml-[20%] min-h-screen rounded-[10px] box-border bg-gradient-to-b px-[3px] from-[#0f0f0f] to-[#1a1a1a] text-white transition-all duration-400 ease-linear relative"
          ref={movieListBox}
        >
          {menuState.activeMenu === "Playlist" ? (
            <Playlist
              systemFilm={playlist.systemFilm}
              tmdbFilm={playlist.tmdbFilm}
            />
          ) : menuState.activeMenu === "History" ? (
            <FilmHistory />
          ) : (
            <MovieList
              movies={movies}
              menuState={menuState}
              onSetMenuState={setMenuState}
            />
          )}

          {loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 z-[1000] h-screen">
              <PulseAnimation onLoading={loading} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
