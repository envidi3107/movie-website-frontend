import React, { useState } from "react";
import { adminSideBarMenu, adminSideBarMap } from "../constants/menu";
import { GoSidebarCollapse } from "react-icons/go";

export default function AdminSideBar({ isOpen, onClose, onUpdateActiveMenu }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  return (
    <div
      className={
        "commonColor w-[230px] h-[100%] text-white fixed top-[50px] left-[-40%] sm:left-0 transition-all duration-400 ease-linear z-50 flex flex-col " +
        `${isOpen ? "" : "transform translate-x-[-100%]"}`
      }
    >
      <div
        className="absolute right-0 top-0 transform translate-x-[100%] cursor-pointer hover:scale-[1.2] transition-all duration-200 ease-linear"
        onClick={() => onClose()}
      >
        <GoSidebarCollapse
          style={{
            fontSize: "25px",
          }}
        />
      </div>
      <div className="flex flex-col gap-[20px] p-[20px]">
        <div className="text-white text-[20px] text-center font-bold">
          Admin
        </div>
        {adminSideBarMenu.map((menu, index) => (
          <div
            key={menu}
            className="text-white text-[16px] font-bold flex items-center gap-x-[10px] cursor-pointer"
            onClick={() => {
              setActiveMenu(menu);
              onUpdateActiveMenu(menu);
            }}
            style={menu === activeMenu ? { color: "yellow" } : {}}
          >
            {React.createElement(adminSideBarMap[menu])}
            <p>{menu}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
