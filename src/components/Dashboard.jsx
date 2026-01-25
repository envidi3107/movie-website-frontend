import React, { useState, useEffect, useRef } from "react";
import MovieViewsChart from "./MovieViewsChart/MovieViewsChart";
import PopularHoursChart from "./MovieViewsChart/PopularHoursChart";
import { useNotification } from "../context/NotificationContext";
import { FaFilter } from "react-icons/fa";
import TopFilm from "./TopFilm";
import {
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

import axiosClient from "../libs/axiosClient";

const website_base_url = import.meta.env.VITE_WEBSITE_BASE_URL;
const tmdb_base_url = import.meta.env.VITE_TMDB_BASE_URL;
const api_key = import.meta.env.VITE_API_KEY;

export default function Dashboard({
  newUserData,
  onUpdateType,
  onUpdateLimition,
  topFilm,
  popularHours,
}) {
  const [animateLineChart, setAnimateLineChart] = useState(false);
  const [limitTemplate, setLimitTemplate] = useState(topFilm.limit);
  const [limitUserLikeTemplate, setLimitUserLikeTemplate] = useState(1);
  const limitInput = useRef(null);
  const limitUserLikeInput = useRef(null);
  const [topUserLike, setTopUserLike] = useState(null);

  useEffect(() => {
    const handleSCroll = () => {
      const scrollValue = window.scrollY;
      if (scrollValue > 140) {
        setAnimateLineChart(true);
      }
    };
    window.addEventListener("scroll", handleSCroll);

    return () => {
      window.removeEventListener("scroll", handleSCroll);
    };
  }, []);

  const getTopUserLike = async () => {
    try {
      const data = await axiosClient.get(
        `/admin/top-user-like?limit=${limitUserLikeTemplate}`,
      );
      setTopUserLike(data.results);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getTopUserLike();
  }, [limitUserLikeTemplate]);

  return (
    <>
      <div className="w-full h-auto block sm:flex justify-center items-center gap-[10px] mt-[10px]">
        <MovieViewsChart
          title={
            "Total number of new users registered on the system through the months"
          }
          viewData={newUserData}
          obj={{
            valueX: "month",
            valueY: "total_users",
          }}
          animation={animateLineChart}
        />
      </div>

      <div className="w-full h-auto block sm:flex justify-center items-center gap-[10px] mt-[10px]">
        <PopularHoursChart viewData={popularHours} />
      </div>

      <div className="w-full min-h-[300px] border-[1px] border-solid border-[#fff] rounded-[10px] flex flex-col gap-y-[10px] relative p-[10px] my-[20px]">
        <div className="flex items-center gap-x-[10px] w-full">
          <select
            className="w-[100px] h-[37px] text-center bg-black/70 text-white p-[5px] rounded-[6px] cursor-pointer outline-none border-[1px] border-solid border-white"
            onChange={(e) => onUpdateType(e.target.value)}
          >
            <option value="Top view">Top view</option>
            <option value="Top like">Top like</option>
          </select>
          <input
            ref={limitInput}
            type="number"
            name="limit"
            value={limitTemplate}
            onChange={(e) => setLimitTemplate(e.target.value)}
            className="outline-none text-white w-[70px] h-[37px] rounded-[5px] border-[2px] border-solid border-slate-600 bg-black p-[7px]"
            placeholder="limit"
          />
          <div onClick={() => onUpdateLimition(limitInput.current.value)}>
            <FaFilter
              style={{
                fontSize: "130%",
                cursor: "pointer",
                color: "gray",
              }}
            />
          </div>
        </div>

        <div className="globalScrollStyle grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px] w-full h-full overflow-x-scroll">
          {topFilm.topFilmData &&
            topFilm.topFilmData.map((film, index) => (
              <TopFilm key={film.tmdbId} type={topFilm.type} filmData={film} />
            ))}
        </div>
      </div>

      <div className="w-full min-h-[300px] border-[1px] border-solid border-[#fff] rounded-[10px] flex flex-col gap-y-[10px] relative p-[10px] my-[20px]">
        <div className="flex items-center gap-x-[10px] w-full">
          <input
            ref={limitUserLikeInput}
            type="number"
            name="limitUserLike"
            value={limitUserLikeTemplate}
            onChange={(e) => setLimitUserLikeTemplate(e.target.value)}
            className="outline-none text-white w-[70px] h-[37px] rounded-[5px] border-[2px] border-solid border-slate-600 bg-black p-[7px]"
            placeholder="limit"
          />
          <div onClick={getTopUserLike}>
            <FaFilter
              style={{
                fontSize: "130%",
                cursor: "pointer",
                color: "gray",
              }}
            />
          </div>
        </div>

        {topUserLike && (
          <table className="table-auto w-full border border-gray-300 text-left">
            <caption className="font-bold text-[140%]">Top user like</caption>
            <thead className="bg-slate-800">
              <tr>
                <th className="border px-4 py-2">Avatar</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Total Likes</th>
              </tr>
            </thead>
            <tbody>
              {topUserLike.map((user) => (
                <tr key={user.userId} className="hover:bg-slate-500">
                  <td className="border px-4 py-2">
                    {user.avatarPath ? (
                      <img
                        src={`${website_base_url}${user.avatarPath}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 rounded-full" />
                    )}
                  </td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.createdAt}</td>
                  <td className="border px-4 py-2">{user.totalLikes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="globalScrollStyle grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[10px] w-full h-full overflow-x-scroll"></div>
      </div>
    </>
  );
}
