import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Bookmark from "./Bookmark";
import Skeleton from "./LoadingAnimation/Skeleton";
import { useNotification } from "../context/NotificationContext";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import formatDate from "../utils/formatDate";

import axiosClient from "../libs/axiosClient";

function SlideShowTopMovie() {
  const [isLoading, setLoading] = useState(true);
  const [topViewFilm, setTopViewFilm] = useState([]);
  const [activeFilm, setActiveFilm] = useState(0);
  const { showNotification } = useNotification();

  useEffect(() => {
    const getTopViewFilm = async () => {
      try {
        const data = await axiosClient.get("/films/top-view-film?size=10");
        setTopViewFilm(data.results);
      } catch (err) {
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    };

    getTopViewFilm();
  }, [showNotification]);

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        topViewFilm.map((film) => (
          <div
            key={film.filmId}
            className={`min-w-full h-full transform -translate-x-[${activeFilm * 100}%] transition-all duration-500 ease-in`}
          >
            <img
              src={film.backdropPath}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))
      )}

      <div className="absolute left-[5%] bottom-[10%] bg-black/50 p-[5px] max-w-[70%]">
        {topViewFilm.length !== 0 && (
          <div className="sm:text-3xl font-bold">
            {topViewFilm[activeFilm].title}
          </div>
        )}

        <div className="flex items-center">
          <div
            className="cursor-pointer hover:text-yellow-400"
            onClick={() => setActiveFilm(activeFilm - 1)}
          >
            <MdNavigateBefore className="text-3xl" />
          </div>
          <div
            className="cursor-pointer hover:text-yellow-400"
            onClick={() => setActiveFilm(activeFilm + 1)}
          >
            <MdNavigateNext className="text-3xl" />
          </div>

          {topViewFilm.length !== 0 && (
            <div className="text-[110%] mx-[10px] flex">
              <p className="font-bold">
                {topViewFilm[activeFilm].numberOfViews} views
              </p>

              <div className="w-[5px] h-[5px] my-auto rounded-[50%] bg-white mx-[5px]"></div>

              <p>
                {topViewFilm[activeFilm].releaseDate
                  ? formatDate(topViewFilm[activeFilm].releaseDate)
                  : "N/A"}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-[10px]">
          {topViewFilm.map((_, index) => (
            <div
              key={index}
              className="w-[23px] h-[23px] gap-[10px] cursor-pointer flex justify-center items-center border-[1px] border-solid border-yellow-600"
              style={
                activeFilm === index
                  ? {
                      backgroundColor: "yellow",
                      color: "black",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                    }
              }
              onClick={() => setActiveFilm(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlideShowTopMovie;
