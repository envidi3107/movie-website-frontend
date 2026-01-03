import { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useNotification } from "../context/NotificationContext";
import SpinAnimation from "./LoadingAnimation/SpinAnimation/SpinAnimation";
import { TiTickOutline } from "react-icons/ti";
import { Link } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";

import axiosClient from "../libs/axiosClient";

export default function NotificationIcon() {
  const [notifications, setNotifications] = useState([]);
  const [isShowNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isNewNotification, showNotification } = useNotification();

  const deleteUserNotification = async (notificationId) => {
    setLoading(notificationId);
    try {
      await axiosClient.delete(
        `/user-notification/delete?notificationId=${notificationId}`,
      );
      const newNotifications = notifications.filter(
        (n) => n.id !== notificationId,
      );
      setNotifications(newNotifications);
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAllNotification = async () => {
    setLoading(true);
    try {
      const data = await axiosClient.delete("/user-notification/clear-all");
      setNotifications([]);
      showNotification("success", data.message);
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAllUserNotification = async () => {
      setLoading(true);
      try {
        const data = await axiosClient.get("/user-notification/get-all");
        setNotifications(data.results);
      } catch (err) {
        showNotification("error", err.message);
      } finally {
        setLoading(false);
      }
    };
    getAllUserNotification();
  }, [isNewNotification, showNotification]);

  return (
    <div className="relative z-[100] select-none">
      <div
        className={`relative text-[28px] text-white cursor-pointer ${isNewNotification || notifications.length !== 0 ? "animate-ring" : ""}`}
        onClick={() => {
          setShowNotification(!isShowNotification);
        }}
      >
        <IoIosNotifications />
        {notifications.length !== 0 && (
          <div className="w-[8px] h-[8px] bg-red-500 rounded-[50%] absolute top-[5px] right-[5px]"></div>
        )}
      </div>

      <AnimatePresence>
        {isShowNotification && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="globalScrollStyle absolute top-[100%] right-[-20%] mt-2 p-[10px] min-w-56 w-[300px] max-h-[300px] bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 flex flex-col justify-start items-center gap-y-[8px] text-gray-300 overflow-y-auto"
          >
            {loading ? (
              <SpinAnimation />
            ) : notifications.length > 0 ? (
              <>
                <div
                  className="w-full text-purple-500 underline text-right cursor-pointer"
                  onClick={clearAllNotification}
                >
                  Clear all
                </div>

                {notifications.map((notification) => (
                  <div className="w-full p-[5px] border-[2px] border-solid border-gray-700 rounded-[8px] flex justify-center items-start gap-[7px]">
                    <div>
                      <p className="border-b border-slate-500 text-red-400">
                        {notification.title}
                      </p>
                      <p>
                        {notification.description}{" "}
                        <Link
                          to={`/watch-detail/hot-movies${notification.actionUrl}`}
                          className="inline-flex items-center align-middle"
                        >
                          <FaArrowCircleRight className="text-yellow-400 text-[25px]" />
                        </Link>
                      </p>
                    </div>
                    {loading === notification.id ? (
                      <SpinAnimation />
                    ) : (
                      <div
                        className="flex gap-x-[10px] text-[18px] cursor-pointer text-[lightgreen] shadow-[0_0_3px_3px_lightgreen]"
                        onClick={() => deleteUserNotification(notification.id)}
                      >
                        <TiTickOutline />
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full px-4 py-3  border-gray-700 text-center select-none">
                No notification now!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
