import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Map path -> English title
const titles = {
  "/": "Demo Page",
  "/home": "Home",
  "/login": "Login",
  "/signup": "Sign Up",
  "/my-info": "User Information",
  "/admin": "Admin",
  "/admin/upload-film": "Upload Film",
  "/watch/:videoKey": "Watch Film",
  "/watch-detail/:type/:typeDetail/:movieId": "Movie Details",
};

function getTitleFromPath(pathname) {
  if (pathname.startsWith("/watch-detail/")) return "Movie Details";
  if (pathname.startsWith("/watch/")) return "Watch Film";

  return titles[pathname] || "Movie Application";
}

export default function RouteTitleManager() {
  const location = useLocation();

  useEffect(() => {
    const title = getTitleFromPath(location.pathname);
    document.title = title;
  }, [location.pathname]);

  return null;
}
