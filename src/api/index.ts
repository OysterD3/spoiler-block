import axios from "axios";
import type { Keyword, Paginate, SearchMovie } from "../@types";

axios.interceptors.request.use((cfg) => {
  if (cfg.url) {
    cfg.url += `&api_key=${process.env.TMDB_API_KEY}`;
  }
});
axios.defaults.baseURL = "https://api.themoviedb.org/3";

const searchMovies = (query: string): Promise<SearchMovie[]> => {
  return axios
    .get<Paginate<SearchMovie>>(`/search/movie`)
    .then(({ data }) => data.results);
};

const getKeywordsByMovieID = (id: string): Promise<Keyword[]> => {
  return axios
    .get<{ id: number; keywords: Keyword[] }>(`/movie/${id}/keywords`)
    .then(({ data }) => data.keywords);
};
