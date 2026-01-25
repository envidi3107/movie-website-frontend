const websiteBaseUrl = import.meta.env.VITE_WEBSITE_BASE_URL;

const menuSystemApiMap = {
  HotMoviesAndFree: `${websiteBaseUrl}/api/system-films/summary-list`,
  Playlist: {
    system: `${websiteBaseUrl}/api/users/{userId}/get-user-playlist/system-film`,
    tmdb: `${websiteBaseUrl}/api/users/{userId}/get-user-playlist/tmdb-film`,
  },
  History: {
    system: `${websiteBaseUrl}/api/watching/get-watching-history/system-film`,
    tmdb: `${websiteBaseUrl}/api/watching/get-watching-history/tmdb-film`,
  },
};

export { menuSystemApiMap };
