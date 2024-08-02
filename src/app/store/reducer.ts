import { createReducer, on } from '@ngrx/store';
import { Movie } from '../models/movie.interface';
import {
  loadMoviesSuccess,
  loadMoviesFailure,
  addToFavorites,
  removeFromFavorites,
  addToWatchList,
  removeFromWatchList,
} from './actions';

export interface MovieState {
  movies: Movie[];
  favoriteMovies: Movie[];
  watchLaterMovies: Movie[];
  error: string | null;
}

export const initialState: MovieState = {
  movies: [],
  favoriteMovies: [],
  watchLaterMovies: [],
  error: null,
};

export const movieReducer = createReducer(
  initialState,
  on(loadMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    error: null,
  })),
  on(loadMoviesFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(addToFavorites, (state, { movie }) => ({
    ...state,
    favoriteMovies: [...state.favoriteMovies, movie],
  })),
  on(removeFromFavorites, (state, { movie }) => ({
    ...state,
    favoriteMovies: state.favoriteMovies.filter((m) => m.id !== movie.id),
  })),
  on(addToWatchList, (state, { movie }) => ({
    ...state,
    watchLaterMovies: [...state.watchLaterMovies, movie],
  })),
  on(removeFromWatchList, (state, { movie }) => ({
    ...state,
    watchLaterMovies: state.watchLaterMovies.filter((m) => m.id !== movie.id),
  })),
);
