import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
} from "react-icons/fa";
import PulseAnimation from "../components/LoadingAnimation/PulseAnimation/PulseAnimation.jsx";
import Comment from "../components/Comment.jsx";
import { useUserContext } from "../context/AuthUserContext.jsx";
import formatDate from "../utils/formatDate.js";
import { useNavigate } from "react-router-dom";

import axiosClient from "../libs/axiosClient";

function SystemFilmDetail() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { systemFilmId } = useParams();
  const [systemFilmDetail, setSystemFilmDetail] = useState({
    systemFilmData: null,
    reactionState: null,
  });
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isUpdateData, setIsUpdateData] = useState(false);
  const { authUser } = useUserContext();
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const watchedDuration = useRef(0);
  console.log("iframeRef:", iframeRef);
  useEffect(() => {
    const fetchFilmDetail = async () => {
      try {
        const options = {
          method: "GET",
          credentials: "include",
        };
        const results = await Promise.allSettled([
          axiosClient.get(`/system-films/${systemFilmId}/detail`),
          axiosClient.get("/reaction/get-user-reaction"),
        ]);
        let userReactionState = results[1].value.results.find(
          (e) => e.film_id === systemFilmId,
        );
        watchedDuration.current = results[0].value.results.watchedDuration;
        setSystemFilmDetail({
          systemFilmData: results[0].value.results,
          reactionState: userReactionState
            ? userReactionState.reaction_type
            : null,
        });
      } catch (error) {
        showNotification("error", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmDetail();
  }, [systemFilmId, showNotification, isUpdateData]);

  const toggleVideoPlay = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleReactionFilm = async (reactionType) => {
    try {
      setSystemFilmDetail((prev) => {
        const currentReaction = prev.reactionState;
        const newReaction =
          currentReaction === reactionType ? null : reactionType;

        let likes = prev.systemFilmData.numberOfLikes;
        let dislikes = prev.systemFilmData.numberOfDislikes;

        if (currentReaction === "LIKE" && newReaction !== "LIKE") {
          likes--;
        } else if (currentReaction !== "LIKE" && newReaction === "LIKE") {
          likes++;
        }

        if (currentReaction === "DISLIKE" && newReaction !== "DISLIKE") {
          dislikes--;
        } else if (currentReaction !== "DISLIKE" && newReaction === "DISLIKE") {
          dislikes++;
        }

        return {
          ...prev,
          reactionState: newReaction,
          systemFilmData: {
            ...prev.systemFilmData,
            numberOfLikes: likes,
            numberOfDislikes: dislikes,
          },
        };
      });

      await axiosClient.post("/reaction/save-reaction", {
        filmId: systemFilmId,
        reactionType: reactionType,
        reactionTime: new Date(),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  const saveWatchingHistory = async () => {
    try {
      await axiosClient.post(
        `/watching/save-watching-history?filmId=${systemFilmId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  const saveWatchedDuration = async (duration) => {
    console.log("duration", duration);
    watchedDuration.current = duration;
    try {
      await axiosClient.get(
        `/watching/save-watched-duration/${systemFilmId}?watchedDuration=${duration}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  const increaseNumberOfViews = async (duration) => {
    if (
      duration < 0.5 * systemFilmDetail.systemFilmData &&
      systemFilmDetail.systemFilmData.totalDurations
    )
      return;
    try {
      await axiosClient.post(
        `/films/${systemFilmId}/increase-view?watchedDuration=${duration}&belongTo=SYSTEM_FILM`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      setIsUpdateData(!isUpdateData);
    } catch (err) {
      console.log(err.message);
      showNotification("error", err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <PulseAnimation onLoading={loading} />
      </div>
    );
  }

  if (!authUser) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="relative h-[350px] w-full overflow-hidden">
        <motion.img
          src={
            systemFilmDetail.systemFilmData &&
            systemFilmDetail.systemFilmData.backdropPath
          }
          alt={
            systemFilmDetail.systemFilmData &&
            systemFilmDetail.systemFilmData.title
          }
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        <motion.button
          onClick={() => {
            toggleVideoPlay();
            saveWatchingHistory();
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: "-50%" }}
          className="absolute top-1/3 left-1/2 bg-purple-600 hover:bg-purple-700 rounded-full p-3 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[40px] w-[40px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.button>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => {
              if (videoRef.current) {
                const watchedTime = Math.floor(videoRef.current.currentTime);
                saveWatchedDuration(watchedTime);
                increaseNumberOfViews(watchedTime);
              }
              toggleVideoPlay();
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-4xl justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  if (videoRef.current) {
                    const watchedTime = Math.floor(
                      videoRef.current.currentTime,
                    );
                    saveWatchedDuration(watchedTime);
                    increaseNumberOfViews(watchedTime);
                  }
                  toggleVideoPlay();
                }}
                className="absolute -top-12 right-0 text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {systemFilmDetail.systemFilmData &&
              systemFilmDetail.systemFilmData.isUseSrc ? (
                <iframe
                  ref={iframeRef}
                  src={
                    systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.videoPath
                  }
                  width="100%"
                  height="400px"
                  allow="autoplay"
                  allowfullscreen
                  title="HLS Video Player"
                  className="bg-slate-700"
                ></iframe>
              ) : (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = watchedDuration.current;
                    }
                  }}
                  className="w-full max-h-[400px] rounded-lg shadow-xl"
                  src={
                    systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.videoPath
                  }
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto px-[30px] py-8 -mt-20 relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="w-full md:w-1/3 lg:w-1/4">
            <motion.img
              src={
                systemFilmDetail.systemFilmData &&
                systemFilmDetail.systemFilmData.posterPath
              }
              alt={
                systemFilmDetail.systemFilmData &&
                systemFilmDetail.systemFilmData.title
              }
              className="rounded-lg shadow-xl w-full h-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex flex-col space-y-4">
              <motion.h1
                className="text-4xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {systemFilmDetail.systemFilmData &&
                  systemFilmDetail.systemFilmData.title}
                {systemFilmDetail.systemFilmData &&
                  systemFilmDetail.systemFilmData.adult && (
                    <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded-md">
                      18+
                    </span>
                  )}
              </motion.h1>

              <div className="flex flex-wrap gap-2">
                {systemFilmDetail.systemFilmData &&
                  systemFilmDetail.systemFilmData.genres.map((genre, index) => (
                    <motion.span
                      key={genre}
                      className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      {genre}
                    </motion.span>
                  ))}
              </div>

              <motion.div
                className="flex items-center space-x-4 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span>
                  {formatDate(
                    systemFilmDetail.systemFilmData &&
                      systemFilmDetail.systemFilmData.releaseDate,
                  )}
                </span>
                <span>•</span>
                <span className="text-[yellow]">
                  {systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.numberOfViews}{" "}
                  views
                </span>
              </motion.div>

              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${systemFilmDetail.reactionState === "LIKE" ? "bg-purple-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => handleReactionFilm("LIKE")}
                >
                  {systemFilmDetail.reactionState === "LIKE" ? (
                    <FaThumbsUp className="text-xl" />
                  ) : (
                    <FaRegThumbsUp className="text-xl" />
                  )}
                  <span>
                    {systemFilmDetail.systemFilmData &&
                      systemFilmDetail.systemFilmData.numberOfLikes}
                  </span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${systemFilmDetail.reactionState === "DISLIKE" ? "bg-red-600 text-white" : "bg-gray-700 hover:bg-gray-600"}`}
                  onClick={() => handleReactionFilm("DISLIKE")}
                >
                  {systemFilmDetail.reactionState === "DISLIKE" ? (
                    <FaThumbsDown className="text-xl" />
                  ) : (
                    <FaRegThumbsDown className="text-xl" />
                  )}
                  <span>
                    {systemFilmDetail.systemFilmData &&
                      systemFilmDetail.systemFilmData.numberOfDislikes}
                  </span>
                </motion.button>

                <button className="flex items-center space-x-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[23px] w-[23px]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    {systemFilmDetail.systemFilmData &&
                      systemFilmDetail.systemFilmData.numberOfComments}{" "}
                    comments
                  </span>
                </button>
              </motion.div>

              <motion.div
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-xl font-semibold text-white mb-2">
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.overview}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Detail */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-800 rounded-xl p-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Release Date
              </h3>
              <p className="text-gray-400">
                {formatDate(
                  systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.releaseDate,
                )}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Belonging
              </h3>
              <p className="text-gray-400">
                {systemFilmDetail.systemFilmData &&
                  systemFilmDetail.systemFilmData.belongTo.replace("_", " ")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                Added to System
              </h3>
              <p className="text-gray-400">
                {formatDate(
                  systemFilmDetail.systemFilmData &&
                    systemFilmDetail.systemFilmData.createdAt,
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Comment */}
        <Comment
          systemFilmData={
            systemFilmDetail.systemFilmData && systemFilmDetail.systemFilmData
          }
          onUpdateData={() => setIsUpdateData(!isUpdateData)}
        />
      </div>
    </div>
  );
}

export default SystemFilmDetail;
