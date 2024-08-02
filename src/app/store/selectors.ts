import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MovieState } from './reducer';

export const selectMovieState = createFeatureSelector<MovieState>('movies');

export const selectAllMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.movies,
);

export const selectFavoriteMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.favoriteMovies,
);

export const selectWatchLaterMovies = createSelector(
  selectMovieState,
  (state: MovieState) => state.watchLaterMovies,
);

export const selectMovieError = createSelector(
  selectMovieState,
  (state: MovieState) => state.error,
);
