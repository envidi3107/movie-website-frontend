import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "./Tooltip";
import Image from "./Image/Image";
import PageTransition from "./PageTransition";
import { IoIosAddCircleOutline } from "react-icons/io";
import { LuPencilLine } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNotification } from "../context/NotificationContext";

import axiosClient from "../libs/axiosClient";

export default function MovieStat({
  movies,
  onUpdateMovies,
  loading,
  onSetLoading,
}) {
  console.log(movies);
  const { showNotification } = useNotification();
  const handleDeleteFilm = async (systemFilmId) => {
    onSetLoading(true);
    console.log("delete");
    try {
      const data = await axiosClient.delete(
        `/admin/delete/system-film/${systemFilmId}`,
      );
      let newMovies = movies.filter(
        (movie) => movie.systemFilmId !== systemFilmId,
      );
      onUpdateMovies(newMovies);
      showNotification("success", data.message);
    } catch (error) {
      showNotification("success", error.message);
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <div
      className={
        "relative w-full min-h-screen " + (loading ? " bg-slate-600" : "")
      }
    >
      <div className="w-full font-bold text-[130%] pl-[30px] py-[20px] pr-[20px] flex justify-between items-center">
        <h1>Movies are uploaded.</h1>
        <Link
          to="/admin/upload-film"
          className="flex justify-center items-center gap-x-[5px] cursor-pointer hover:scale-[1.04] transition-all duration-200 ease-in-out"
        >
          <IoIosAddCircleOutline
            style={{
              fontSize: "30px",
            }}
          />
          <span className="text-[80%]">Add Movie</span>
        </Link>
      </div>

      <div className="flex items-center w-full h-full gap-x-[10px] flex-wrap">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.id}
              className="min-w-[calc(100%/3-7px)] h-[200px] flex justify-between items-center bg-gray-800 rounded-[10px] mb-[20px] cursor-pointer hover:scale-[1.04] transition-all duration-200 ease-in-out relative group"
            >
              <Image
                id={movie.systemFilmId}
                title={movie.title}
                src={movie.posterPath}
              />
              <div className="absolute top-[15px] right-[15px] w-auto flex gap-[4px] text-[140%] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out bg-black/70 p-[5px] rounded-[10px]">
                <div
                  onClick={() => handleDeleteFilm(movie.systemFilmId)}
                  className="hover:scale-[1.04] transition-all duration-200 ease-in-out hover:text-[red]"
                >
                  <Tooltip text="delete movie">
                    <RiDeleteBin6Line title="delete movie" />
                  </Tooltip>
                </div>

                <Link
                  to={`/admin/update-film/${movie.systemFilmId}`}
                  className="hover:scale-[1.04] transition-all duration-200 ease-in-out hover:text-[green]"
                >
                  <Tooltip text="update movie">
                    <LuPencilLine />
                  </Tooltip>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-gray-500">
            No movies uploaded yet.
          </div>
        )}
      </div>

      <PageTransition />
    </div>
  );
}
