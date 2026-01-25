import React from "react";
import SlideShowTopMovie from "../components/SlideShowTopMovie";
import Movie from "./Movie";
import PageTransition from "./PageTransition";
import { cinemaMap } from "../constants/menu";
export default function MovieList({ movies, menuState, onSetMenuState }) {
  if (
    movies &&
    menuState.activeMenu !== "HotMoviesAndFree" &&
    movies.belong_to === "SYSTEM_FILM"
  )
    return null;
  if (movies && movies.results.length === 0) {
    return (
      <div className="w-full h-auto flex flex-col justify-evenly items-center text-white">
        <div className="w-full h-auto flex justify-center items-center text-white text-[20px] font-bold">
          No movies found
        </div>
        <PageTransition />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-[10px] flex  flex-wrap gap-x-[8px] gap-y-[12px]">
      <div className="menuOnMobile absolute top-0 left-0 text-white w-[20px] h-[20px] text-center block sm:hidden">
        X
      </div>
      <div className="w-full h-[60vh] bg-slate-800 rounded-[10px]">
        {movies && <SlideShowTopMovie />}
      </div>

      {cinemaMap[menuState.activeMenu] ? (
        <div className="w-full h-auto flex justify-end p-0">
          <select
            id="movieTypeSelection"
            value={menuState.cinemaType}
            onChange={(e) =>
              onSetMenuState((prev) => ({
                activeMenu: prev.activeMenu,
                cinemaType: e.target.value,
              }))
            }
            className="w-[100px] text-white bg-black cursor-pointer border-[1px] border-solid border-[white] rounded-[4px]"
          >
            {cinemaMap[menuState.activeMenu].map((type, index) => (
              <option
                key={type}
                value={type}
                className="rounded-[10px] cursor-pointer"
              >
                {type}
              </option>
            ))}
          </select>
        </div>
      ) : (
        ""
      )}

      {movies &&
        movies.results.map((data, index) => (
          <Movie
            key={index}
            id={index}
            movieData={data}
            belongTo={movies.belong_to}
          />
        ))}

      <PageTransition />
    </div>
  );
}
