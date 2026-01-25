import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import Notification from "../components/Notification.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";

const NotificationContext = createContext({
  isNewNotification: false,
  notification: null,
  showNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState([]);
  const [isNewNotification, setNewNotification] = useState(false);
  const accessToken = Cookies.get("accessToken");
  const removeNotification = useCallback(
    (id) => {
      const newNotification = notification.filter((item) => item.id !== id);
      setNotification(newNotification);
    },
    [notification],
  );

  const showNotification = useCallback((type, message, redirectUrl = null) => {
    const id = crypto.randomUUID();
    const newNotification = {
      id,
      type,
      message,
      redirectUrl,
    };
    setNotification((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotification((prev) => prev.filter((item) => item.id !== id));
    }, 5000);
  }, []);

  useEffect(() => {
    const socket = new SockJS(`${import.meta.env.VITE_WEBSITE_BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      onConnect: () => {
        console.log("Connected");
        stompClient.subscribe("/topic/new-movie", (message) => {
          const movie = JSON.parse(message.body);
          console.log("movie:", movie);
          setNewNotification(true);
          showNotification(
            "info",
            `${movie.title}: ${movie.description}`,
            movie.actionUrl,
          );
        });
      },
    });
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [showNotification, accessToken]);

  return (
    <NotificationContext.Provider
      value={{ isNewNotification, showNotification }}
    >
      {children}
      {notification.length !== 0
        ? notification.map((item, index) => (
            <Notification
              key={item.id}
              type={item.type}
              message={item.message}
              order={index}
              onClose={removeNotification}
              redirectUrl={item.redirectUrl}
            />
          ))
        : null}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
