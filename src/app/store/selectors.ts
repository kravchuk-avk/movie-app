import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MoviesState } from './state';
import { Movie } from '../models/movie.interface';

export const selectMoviesState = createFeatureSelector<MoviesState>('movies');

const selectCreateCategorySelectors = (category: keyof MoviesState) => ({
  selectMovies: createSelector(
    selectMoviesState,
    (state: MoviesState) => state[category] as Movie[],
  ),
  selectIsLoading: createSelector(
    selectMoviesState,
    (state: MoviesState) =>
      state.isLoading[category as keyof MoviesState['isLoading']],
  ),
  selectError: createSelector(
    selectMoviesState,
    (state: MoviesState) => state.error[category as keyof MoviesState['error']],
  ),
});

export const nowPlayingSelectors = selectCreateCategorySelectors('nowPlaying');
export const popularSelectors = selectCreateCategorySelectors('popular');
export const topRatedSelectors = selectCreateCategorySelectors('topRated');
export const upcomingSelectors = selectCreateCategorySelectors('upcoming');
export const favoriteSelectors = selectCreateCategorySelectors('favorite');
export const watchLaterSelectors = selectCreateCategorySelectors('watchLater');

export const selectFavoriteIds = createSelector(
  selectMoviesState,
  (state: MoviesState) => state.favoriteIds,
);

export const selectWatchLaterIds = createSelector(
  selectMoviesState,
  (state: MoviesState) => state.watchLaterIds,
);

export const selectMovieDetails = createSelector(
  selectMoviesState,
  (state: MoviesState) => state.movieDetails,
);
