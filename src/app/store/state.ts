import { Movie } from '../models/movie.interface';

export interface MovieState {
  movies: Movie[];
  favorites: Movie[];
  watchList: Movie[];
  error: string | null;
}

export const initialState: MovieState = {
  movies: [],
  favorites: [],
  watchList: [],
  error: null,
};
