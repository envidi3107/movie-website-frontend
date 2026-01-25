import { useState } from "react";
import { cinemaMenu, linkIcon, userActivitiesMenu } from "../constants/menu";
import { FaAngleRight, FaAngleDown, FaPhotoFilm } from "react-icons/fa6";
import { MdMovieFilter } from "react-icons/md";
import { MdOutlineMenuOpen, MdClose } from "react-icons/md";

function SideBar({ onUpdateActiveMenu, menuState }) {
  const [isCinemaOpen, setCinemaOpen] = useState(true);
  const [isOpenSideBar, setOpenSideBar] = useState(false);
  const handleMenuClick = (tab) => {
    onUpdateActiveMenu(tab);
  };

  return (
    <div
      className={`w-[20%] h-full bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] fixed top-[50px] z-50 shadow-lg flex flex-col py-4 px-2 overflow-y-auto ${isOpenSideBar ? "left-0" : "left-[-100%]"} sm:left-0 animate-moveToRight transition-all duration-300 ease-in-out`}
    >
      <div
        className={`fixed top-[50px] left-0 ${isOpenSideBar ? "hidden" : "block"} sm:hidden text-white text-[30px] cursor-pointer hover:scale-[1.2] transition-all duration-200 ease-linear`}
        onClick={() => setOpenSideBar(!isOpenSideBar)}
      >
        <MdOutlineMenuOpen />
      </div>

      <div
        className={`fixed top-[53px] right-[3px] ${isOpenSideBar ? "block" : "hidden"} sm:hidden text-white text-[30px] cursor-pointer hover:scale-[1.2] transition-all duration-200 ease-linear`}
        onClick={() => setOpenSideBar(!isOpenSideBar)}
      >
        <MdClose />
      </div>

      <div
        className="w-full py-3 px-4 mb-4 bg-gray-800 rounded-lg cursor-pointer flex justify-center items-center hover:bg-gray-700 transition-all"
        onClick={() => handleMenuClick("HotMoviesAndFree")}
      >
        <div
          className={`flex items-center gap-3 font-semibold select-none transition-all ${menuState.activeMenu === "HotMoviesAndFree" ? "text-yellow-400" : "text-white"}`}
        >
          <MdMovieFilter
            style={{
              fontSize: "25px",
            }}
          />
          <p>Hot Movies & Free</p>
        </div>
      </div>

      {/* Theatrical Movies */}
      <div className="mb-6">
        <div
          className="flex justify-between items-center pl-[16px] pr-[8px] py-2 cursor-pointer hover:bg-gray-700 rounded-lg transition-all bg-gray-800"
          onClick={() => setCinemaOpen(!isCinemaOpen)}
        >
          <div className="flex items-center gap-3">
            <FaPhotoFilm
              style={{
                fontSize: "25px",
                color: "white",
              }}
            />
            <h1 className="text-white font-semibold select-none">
              Theatrical Movies
            </h1>
          </div>
          {isCinemaOpen ? (
            <FaAngleDown className="text-white" />
          ) : (
            <FaAngleRight className="text-white" />
          )}
        </div>

        <div
          className={`flex flex-col ml-6 pl-2 border-l border-gray-600 overflow-hidden transition-all ${isCinemaOpen ? "max-h-[500px]" : "max-h-0"} duration-300 ease-in-out`}
        >
          {cinemaMenu.map((tab) => (
            <div
              key={tab}
              className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => handleMenuClick(tab)}
            >
              <img src={linkIcon[tab]} alt={tab} className="w-5 h-5" />
              <p
                className={`text-sm select-none ${menuState.activeMenu === tab ? "text-yellow-400" : "text-gray-300"}`}
              >
                {tab}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* User Activities */}
      <div className="flex flex-col gap-2">
        {userActivitiesMenu.map((tab) => (
          <div
            key={tab}
            className="flex items-center gap-3 py-2 px-4 cursor-pointer rounded-lg hover:bg-gray-700 transition-all"
            onClick={() => handleMenuClick(tab)}
          >
            <img src={linkIcon[tab]} alt={tab} className="w-6 h-6" />
            <p
              className={`text-base select-none ${menuState.activeMenu === tab ? "text-yellow-400" : "text-gray-300"}`}
            >
              {tab}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
