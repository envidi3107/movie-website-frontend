import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNotification } from "../context/NotificationContext";
import SpinAnimation from "./LoadingAnimation/SpinAnimation/SpinAnimation";
import { RiDeleteBin6Line } from "react-icons/ri";

import axiosClient from "../libs/axiosClient";

export default function Bookmark({ filmId, belongTo }) {
  const [userPlaylist, setUserPlaylist] = useState(null);
  const [isShowAllPlaylist, setShowAllPlaylist] = useState(false);
  const [addPlaylist, setAddPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchAllUserPlaylist = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get("/playlist/get-user-playlist");
        setUserPlaylist(data.results);
      } catch (err) {
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isShowAllPlaylist) fetchAllUserPlaylist();
  }, [isShowAllPlaylist, showNotification]);

  const handleCreationPlaylist = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const playlistName = formData.get("playlistName");
    axiosClient
      .post(`/playlist/create-playlist?playlistName=${playlistName}`)
      .then((data) => {
        setUserPlaylist((prev) => [...prev, data.results]);
        setAddPlaylist(false);
        showNotification("success", data.message);
      })
      .catch((err) => showNotification("error", err.message));
  };

  const handleAddFilmToPlaylist = async (playlistId) => {
    setLoading(playlistId);
    axiosClient
      .post("/users/add-film-to-user-playlist", {
        playlistId: playlistId,
        filmId: filmId,
        ownerFilm: belongTo,
      })
      .then((data) => showNotification("success", data.message))
      .catch((err) => showNotification("error", err.message))
      .finally(() => setLoading(false));
  };

  const handleAddTmdbFilm = async () => {
    try {
      const data = await axiosClient.post(`/tmdb-films/add?tmdbId=${filmId}`);
      console.log("success", data.message);
    } catch (err) {
      console.log("error", err.message);
    }
  };

  const handleDeleteUserPlaylist = async (playlistId) => {
    setLoading(playlistId);
    axiosClient
      .delete(`/playlist/delete-user-playlist?playlistId=${playlistId}`)
      .then((data) => {
        setUserPlaylist((prev) =>
          prev.filter((playlist) => playlist.playlistId !== playlistId),
        );
        showNotification("success", data.message);
      })
      .catch((err) => showNotification("error", err.message))
      .finally(() => setLoading(false));
  };

  let playlistModal = null;
  let addPlaylistModal = null;
  if (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    document.body
  ) {
    playlistModal =
      isShowAllPlaylist &&
      createPortal(
        <div className="w-screen h-auto border border-white rounded-[8px] flex justify-center items-center z-[3000] fixed top-[50px] right-0 bottom-0 left-0 text-white p-[10px]">
          <div
            className="overlay bg-black/80 absolute top-0 right-0 left-0 bottom-0 rounded-[8px] cursor-pointer"
            onClick={() => setShowAllPlaylist(false)}
          />
          <div className="globalScrollStyle flex flex-col gap-y-[10px] z-[1000] h-full overflow-y-auto overflow-x-hidden p-4">
            <h1 className="specialColor text-[120%] font-bold p-[10px] text-center">
              Available playlists.
            </h1>

            {loading === true ? (
              <div className="w-full flex justify-center items-center">
                <SpinAnimation />
              </div>
            ) : null}

            {userPlaylist &&
              userPlaylist.map((playlist) => (
                <div
                  className="flex justify-between items-center gap-x-[5px]"
                  key={playlist.playlistId}
                >
                  <div
                    className="commonColor h-full flex justify-between items-center min-w-[250px] rounded-[5px] p-[10px] hover:scale-[1.03] hover:text-[yellow] cursor-pointer"
                    onClick={() => handleAddFilmToPlaylist(playlist.playlistId)}
                  >
                    <p>{playlist.playlistName}</p>
                    {loading === playlist.playlistId && <SpinAnimation />}
                  </div>
                  <div
                    className="hover:scale-[1.05] transition duration-200 ease-in-out cursor-pointer hover:text-red-600"
                    onClick={() =>
                      handleDeleteUserPlaylist(playlist.playlistId)
                    }
                  >
                    <RiDeleteBin6Line
                      style={{
                        fontSize: "20px",
                      }}
                    />
                  </div>
                </div>
              ))}

            <div
              className="hover:scale-[1.04] transition duration-200 ease-in-out flex justify-center items-center gap-x-[3px] cursor-pointer"
              onClick={() => setAddPlaylist(true)}
            >
              <IoIosAddCircleOutline style={{ fontSize: "30px" }} />
              <span className="text-[80%]">Add Playlist</span>
            </div>
          </div>
        </div>,
        document.body,
      );
    addPlaylistModal =
      addPlaylist &&
      createPortal(
        <div className="w-full h-screen border border-white rounded-[8px] flex justify-center items-center z-[3000] fixed top-[50px] right-0 bottom-0 left-0 text-white">
          <div
            className="overlay bg-black/70 absolute top-0 right-0 left-0 bottom-0 rounded-[8px] cursor-pointer"
            onClick={() => setAddPlaylist(false)}
          />
          <form className="z-[2]" onSubmit={handleCreationPlaylist}>
            <input
              type="text"
              name="playlistName"
              placeholder="Enter playlist name"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              type="submit"
              disable={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition"
            >
              {loading ? <SpinAnimation /> : "Add"}
            </button>
          </form>
        </div>,
        document.body,
      );
  }

  return (
    <>
      <div className="flex gap-x-[3px] mt-[3px] z-[2000] relative">
        {loading ? (
          <div className="w-[50px] h-[25px] animate-skeleton rounded-[8px]"></div>
        ) : (
          <div
            className="cursor-pointer z-[1000]"
            onClick={() => {
              if (belongTo === "TMDB_FILM") {
                handleAddTmdbFilm();
              }
              setShowAllPlaylist(!isShowAllPlaylist);
            }}
          >
            <IoBookmarkOutline style={{ width: "25px", height: "25px" }} />
          </div>
        )}
      </div>
      {playlistModal}
      {addPlaylistModal}
    </>
  );
}
