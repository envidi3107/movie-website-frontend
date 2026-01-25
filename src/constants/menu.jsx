import { RxDashboard } from "react-icons/rx";
import { FaRegUserCircle } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import { IoSettingsOutline } from "react-icons/io5";

const cinemaMenu = ["Movie", "TV Show", "Trending"];
const trendingMenu = ["All", "Movie", "Tv"];
const movieMenu = ["Popular", "Upcoming", "Now playing", "Top rated"];
const tvshowMenu = ["Popular", "Airing today", "On The Air", "Top rated"];
const cinemaMap = {
  [cinemaMenu[0]]: movieMenu,
  [cinemaMenu[1]]: tvshowMenu,
  [cinemaMenu[2]]: trendingMenu,
};

const adminSideBarMenu = ["Dashboard", "Users", "Movies"];
const adminSideBarMap = {
  [adminSideBarMenu[0]]: RxDashboard,
  [adminSideBarMenu[1]]: FaRegUserCircle,
  [adminSideBarMenu[2]]: BiMoviePlay,
  [adminSideBarMenu[3]]: IoSettingsOutline,
};
const userActivitiesMenu = ["Playlist", "History"];

const linkIcon = {
  [cinemaMenu[2]]:
    "https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/FFFFFF/external-trending-content-creator-tanah-basah-basic-outline-tanah-basah.png",
  [cinemaMenu[0]]: "https://img.icons8.com/ios-filled/50/FFFFFF/movie.png",
  [cinemaMenu[1]]: "https://img.icons8.com/ios-filled/50/FFFFFF/tv.png",
  [userActivitiesMenu[0]]:
    "https://img.icons8.com/ios-filled/50/FFFFFF/video-playlist.png",
  [userActivitiesMenu[1]]:
    "https://img.icons8.com/ios-filled/50/FFFFFF/repeat.png",
};

export {
  adminSideBarMenu,
  adminSideBarMap,
  cinemaMenu,
  trendingMenu,
  movieMenu,
  tvshowMenu,
  cinemaMap,
  linkIcon,
  userActivitiesMenu,
};
