import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdMovie } from "react-icons/md";
import { IoMdMail } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "../../context/AuthUserContext";
import { useNotification } from "../../context/NotificationContext";
import logo from "../../assets/Logo.png";
import NotificationIcon from "../NotificationIcon";

// Animation variants
const searchVariants = {
  collapsed: { width: "40px" },
  expanded: { width: "250px" },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
];

import axiosClient from "../../libs/axiosClient";

const website_base_url = import.meta.env.VITE_WEBSITE_BASE_URL;

const Header = ({ onSearching, onReset, activeMenu }) => {
  const navigate = useNavigate();
  const searchInput = useRef(null);
  const { authUser, saveAuthUser } = useUserContext();
  const { showNotification } = useNotification();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    title: "",
    genre: "",
    releaseDate: "",
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const isLogin = localStorage.getItem("auth_user")
    ? JSON.parse(localStorage.getItem("auth_user"))
    : null;

  const handleGenreSelect = (genre) => {
    const newParams = {
      ...searchParams,
      genre: searchParams.genre === genre ? "" : genre,
    };
    setSearchParams(newParams);
    onSearching(newParams);
  };

  const handleDateChange = (e) => {
    const newParams = {
      ...searchParams,
      releaseDate: e.target.value,
    };
    setSearchParams(newParams);
    onSearching(newParams);
  };

  const clearFilters = () => {
    const newParams = { title: "", genre: "", releaseDate: "" };
    setSearchParams(newParams);
    onSearching(newParams);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInput.current.focus(), 300);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearching(searchParams);
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");

      localStorage.removeItem("auth_user");
      localStorage.removeItem("token");
      saveAuthUser(null);
      setIsDropdownOpen(false);
      navigate("/");
    } catch (err) {
      showNotification("error", err.message || err);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await axiosClient.get("/users/my-info");
        localStorage.setItem("auth_user", JSON.stringify(data.results));
        saveAuthUser(data.results);
      } catch (err) {
        if (err.status === 401) {
          localStorage.removeItem("auth_user");
          localStorage.removeItem("token");
          window.location.href = "/";
          saveAuthUser(null);
          return;
        }
        console.log(err);
        showNotification("error", err.message || err);
      }
    };
    if (isLogin && !authUser) fetchUserInfo();
  }, [authUser, isLogin, saveAuthUser, showNotification]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-60 backdrop-blur-sm shadow-lg border-b border-gray-800">
      <div className="w-full mx-auto px-[3px] sm:px-4 h-[50px] flex items-center justify-between">
        <div className="flex justify-center items-center space-x-8">
          <Link
            to={authUser ? "/home" : "/"}
            className="flex items-center space-x-2"
          >
            <img src={logo} alt="Logo" className="w-8 h-8 rounded-lg" />
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              MovieStream
            </div>
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              to={authUser ? "/home" : "/"}
              className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {authUser && (
              <Link
                to="/my-info"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Settings
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            )}
          </nav>
        </div>

        {/* Search và Filter Section */}
        <div className="items-center gap-x-4 relative hidden sm:flex">
          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="relative flex items-center"
            initial="collapsed"
            animate={isSearchExpanded ? "expanded" : "collapsed"}
            variants={searchVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.input
              ref={searchInput}
              type="search"
              name="title"
              value={searchParams.title}
              onChange={handleInputChange}
              onBlur={(e) => {
                if (e.target.value === "") {
                  setIsSearchExpanded(false);
                  onReset();
                }
              }}
              placeholder="Search movies..."
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
            />
            <button
              type="button"
              onClick={toggleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <FaSearch />
            </button>
          </motion.form>

          {/* Filter Panel */}
          {activeMenu === "HotMoviesAndFree" && (
            <div className="flex items-center gap-x-2">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`p-2 rounded-full transition-colors ${showFilterPanel ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                <FaFilter className="text-lg" />
              </button>

              {/* Active Filters Badges */}
              <div className="flex items-center gap-x-2">
                {searchParams.genre && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm"
                  >
                    {searchParams.genre}
                    <button
                      onClick={() => handleGenreSelect("")}
                      className="ml-2 text-purple-300 hover:text-white"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </motion.div>
                )}

                {searchParams.releaseDate && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm"
                  >
                    {new Date(searchParams.releaseDate).toLocaleDateString()}
                    <button
                      onClick={() =>
                        handleDateChange({ target: { value: "" } })
                      }
                      className="ml-2 text-blue-300 hover:text-white"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {showFilterPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                      <span className="text-sm font-medium text-white">
                        Filter Options
                      </span>
                      <div className="flex items-center gap-x-2">
                        <button
                          onClick={clearFilters}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          Clear All
                        </button>
                        <button
                          onClick={() => setShowFilterPanel(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Genre Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Genres
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => (
                            <button
                              key={genre}
                              onClick={() => handleGenreSelect(genre)}
                              className={`px-3 py-1 text-xs rounded-full transition-colors ${searchParams.genre === genre ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
                            >
                              {genre}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Release Date Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Release Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaCalendarAlt className="text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="releaseDate"
                            value={searchParams.releaseDate}
                            onChange={handleDateChange}
                            className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isLogin ? (
            authUser ? (
              <div className="relative flex gap-x-[10px] justify-center items-center">
                {authUser.role === "USER" && <NotificationIcon />}

                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {authUser.avatarPath ? (
                    <img
                      src={`${authUser.avatarPath}`}
                      alt="Avatar"
                      className="w-8 min-w-8 h-8 rounded-full object-cover border-2 border-purple-500 hover:border-purple-300 transition-all"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-400 hover:text-white" />
                  )}
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[100%] right-[-20%] mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">
                          {authUser.username}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center">
                          <IoMdMail className="mr-1" /> {authUser.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/my-info"
                          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaCog className="mr-3" /> Account Settings
                        </Link>
                        {authUser.role === "ADMIN" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <MdMovie className="mr-3" /> Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <FaSignOutAlt className="mr-3" /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            )
          ) : (
            <div className="flex sm:space-x-3 h-full">
              <Link
                to="/login"
                className="h-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="h-full px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition-opacity shadow-lg whitespace-nowrap"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
