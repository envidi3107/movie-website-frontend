const urlTemplates = {
  Trending: {
    All: "https://api.themoviedb.org/3/trending/all/day",
    Movie: "https://api.themoviedb.org/3/trending/movie/day",
    Tv: "https://api.themoviedb.org/3/trending/tv/day",
  },
  Movie: {
    Popular: "https://api.themoviedb.org/3/movie/popular",
    Upcoming: "https://api.themoviedb.org/3/movie/upcoming",
    "Now playing": "https://api.themoviedb.org/3/movie/now_playing",
    "Top rated": "https://api.themoviedb.org/3/movie/top_rated",
  },
  "TV Show": {
    Popular: "https://api.themoviedb.org/3/tv/popular",
    "Airing today": "https://api.themoviedb.org/3/tv/airing_today",
    "On The Air": "https://api.themoviedb.org/3/tv/on_the_air",
    "Top rated": "https://api.themoviedb.org/3/tv/top_rated",
  },
};

export { urlTemplates };
