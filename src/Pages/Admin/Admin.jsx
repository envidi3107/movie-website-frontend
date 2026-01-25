import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Image from "../../components/Image/Image";
import Marvel1 from "../../assets/marvel1.jpg";
import AdminSideBar from "../../components/AdminSideBar";
import UserStat from "../../components/UserStat";
import MovieStat from "../../components/MovieStat";
import Dashboard from "../../components/Dashboard";
import Setting from "../../components/Setting";
import { useNotification } from "../../context/NotificationContext";
import { usePageTransition } from "../../context/PageTransitionContext";
import PulseAnimation from "../../components/LoadingAnimation/PulseAnimation/PulseAnimation";

import axiosClient from "../../libs/axiosClient";
import axios from "axios";

function Admin() {
  const [topFilm, setTopFilm] = useState({
    topFilmData: null,
    type: "Top view",
    limit: 1,
  });
  const [newUserData, setNewUserData] = useState([]);
  const [popularHours, setPopularHours] = useState(null);
  const [watchingDate, setWatchingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const { pageNumber } = usePageTransition();

  const [isOpenSidebar, setIsOpenSidebar] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const [allUserData, setAllUserData] = useState([]);
  const { showNotification } = useNotification();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdateType = () => {
    setTopFilm((prev) => ({
      ...prev,
      type: prev.type === "Top view" ? "Top like" : "Top view",
    }));
  };

  const handleUpdateLimition = (limitValue) => {
    setTopFilm((prev) => ({
      ...prev,
      limit: limitValue,
    }));
  };

  //Dashboard
  useEffect(() => {
    const fetchTopFilm = async () => {
      try {
        let response = null;
        if (topFilm.type === "Top view") {
          response = await axiosClient.get(
            `/films/top-view-film?size=${topFilm.limit}`,
          );
        } else {
          response = await axiosClient.get(
            `/films/top-like-film?size=${topFilm.limit}`,
          );
        }
        setTopFilm((prev) => ({
          ...prev,
          topFilmData: response.results,
        }));
      } catch (error) {
        showNotification("error", error.message);
      }
    };
    fetchTopFilm();
  }, [topFilm.type, topFilm.limit, showNotification]);

  useEffect(() => {
    const fetchPopularHours = async () => {
      try {
        const data = await axiosClient.get("/admin/popular-hours");
        console.log("popular hours:", data.results);
        setPopularHours(data.results);
      } catch (error) {
        showNotification("error", error.message);
      }
    };
    fetchPopularHours();
  }, [showNotification, watchingDate]);

  useEffect(() => {
    const fetchNewUserData = async () => {
      try {
        const data = await axiosClient.get(
          "/admin/users/registrations/monthly",
        );
        setNewUserData(data.results);
      } catch (error) {
        showNotification("error", error.message);
      }
    };
    fetchNewUserData();
  }, [showNotification]);

  // users
  useEffect(() => {
    const fetchAllUser = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get(
          `/admin/get-users?page=${pageNumber}`,
        );
        setAllUserData(data.results);
      } catch (error) {
        showNotification("error", error.message);
      } finally {
        setLoading(false);
      }
    };
    if (activeMenu === "Users") {
      fetchAllUser();
    }
  }, [activeMenu, pageNumber, showNotification]);

  // movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get(`/films/all?page=${pageNumber}`);
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    if (
      activeMenu === "Movies" ||
      (activeMenu === "Movies" && pageNumber > 0)
    ) {
      fetchMovies();
    }
  }, [activeMenu, pageNumber]);

  return (
    <div className="w-auto h-auto flex flex-col justify-center items-center overflow-x-hidden text-white">
      <Header
        additionalHeaderStyles={{
          borderBottom: "2px solid #2b2b2b",
        }}
      />

      <AdminSideBar
        isOpen={isOpenSidebar}
        onClose={() => setIsOpenSidebar(!isOpenSidebar)}
        onUpdateActiveMenu={setActiveMenu}
      />

      <div
        className={
          "w-full min-h-screen flex flex-col justify-start items-center px-[5px] bg-black rounded-[10px] mt-[50px] relative " +
          `${isOpenSidebar ? "sm:w-[calc(100%-230px)] sm:ml-[230px]" : "sm:w-full"}`
        }
      >
        {activeMenu === "Dashboard" ? (
          <Dashboard
            newUserData={newUserData}
            onUpdateType={handleUpdateType}
            onUpdateLimition={handleUpdateLimition}
            topFilm={topFilm}
            popularHours={popularHours}
          />
        ) : activeMenu === "Users" ? (
          <UserStat
            allUserData={allUserData}
            onUpdateUser={setAllUserData}
            onSetLoading={setLoading}
          />
        ) : activeMenu === "Movies" ? (
          <MovieStat
            movies={movies}
            onUpdateMovies={setMovies}
            loading={loading}
            onSetLoading={setLoading}
          />
        ) : activeMenu === "Setting" ? (
          <Setting />
        ) : (
          ""
        )}

        {loading && <PulseAnimation onLoading={loading} />}
      </div>
    </div>
  );
}

export default Admin;
