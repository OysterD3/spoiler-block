export type Option = {
  id: string;
  term: string;
  startAt?: string;
  endAt?: string;
  createdAt: string;
};

export type Paginate<T> = {
  page: number;
  results: T[];
  total_results: number;
  total_pages: number;
};

export type SearchMovie = {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
};

export type Keyword = {
  id: number;
  name: string;
};
