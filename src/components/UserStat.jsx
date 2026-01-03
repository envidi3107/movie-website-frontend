import React from "react";
import Image from "./Image/Image";
import { useState, useEffect } from "react";
import { useNotification } from "../context/NotificationContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import { usePageTransition } from "../context/PageTransitionContext";
import PageTransition from "./PageTransition";

import axiosClient from "../libs/axiosClient";

export default function UserStat({ allUserData, onUpdateUser, onSetLoading }) {
  const { pageNumber, setPageNumber, nextPage, previousPage } =
    usePageTransition();

  const { showNotification } = useNotification();

  const deleteUser = async (userId) => {
    onSetLoading(true);
    try {
      const data = await axiosClient.delete(`/admin/delete?userId=${userId}`);
      let newUserData = allUserData.filter((user) => user.id !== userId);
      onUpdateUser(newUserData);
      showNotification("success", data.message);
    } catch (error) {
      showNotification("error", error.message);
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-y-[10px]">
      <table className="table-fixed w-full mt-5 rounded-xl overflow-hidden bg-[#1F1F1F] text-gray-200">
        <caption className="font-bold text-xl mb-4 text-white">
          User Information
        </caption>
        <thead className="bg-[#2D2D2D] text-white">
          <tr className="text-center">
            <th className="py-3 px-4 truncate">Avatar</th>
            <th className="py-3 px-4 truncate">Username</th>
            <th className="py-3 px-4 truncate">Email</th>
            <th className="py-3 px-4 truncate">DOB</th>
            <th className="py-3 px-4 truncate">Account Created At</th>
            <th className="py-3 px-4 truncate">IP Address</th>
            <th className="py-3 px-4 truncate">Country</th>
            <th className="py-3 px-4 truncate">Action</th>
          </tr>
        </thead>
        <tbody>
          {allUserData.length ? (
            allUserData.map((user, index) => (
              <tr
                key={index}
                className="border-t border-gray-700 hover:bg-[#333333] transition-all duration-200"
              >
                <td className="py-3 px-4">
                  <div className="w-full h-full flex justify-center items-center">
                    <div className="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center overflow-hidden">
                      <Image id={user.id} src={user.avatarPath} />
                    </div>
                  </div>
                </td>
                <td
                  className="py-3 px-4 truncate max-w-[150px]"
                  title={user.username}
                >
                  {user.username}
                </td>
                <td
                  className="py-3 px-4 truncate max-w-[200px]"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="py-3 px-4 text-center truncate">
                  {user.dateOfBirth}
                </td>
                <td className="py-3 px-4 text-center truncate">
                  {user.createdAt}
                </td>
                <td className="py-3 px-4 text-center truncate">
                  {user.ipAddress}
                </td>
                <td className="py-3 px-4" title={user.country}>
                  <div className="flex justify-center items-center gap-2">
                    <span className="uppercase">{user.country}</span>
                    <img
                      src={`https://flagcdn.com/w40/${user.country && user.country.toLowerCase()}.png`}
                      alt="Country Flag"
                      className="w-6 h-4"
                    />
                  </div>
                </td>
                <td className="py-3 px-4 text-center" title="Delete user">
                  <div
                    className="flex justify-center items-center hover:animate-dance cursor-pointer"
                    onClick={() => deleteUser(user.id)}
                  >
                    <RiDeleteBin6Line
                      style={{
                        width: "30px",
                        height: "30px",
                        color: "rgb(179, 58, 58)",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-6 text-center text-gray-400">
                No user data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <PageTransition />
    </div>
  );
}
