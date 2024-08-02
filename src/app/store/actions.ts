import { createAction, props } from '@ngrx/store';
import { Movie } from '../models/movie.interface';

export const loadMovies = createAction('[Movies] Load Movies');
export const loadMoviesSuccess = createAction(
  '[Movies] Load Movies Success',
  props<{ movies: Movie[] }>(),
);
export const loadMoviesFailure = createAction(
  '[Movies] Load Movies Failure',
  props<{ error: string }>(),
);

export const addToFavorites = createAction(
  '[Movies] Add To Favorites',
  props<{ movie: Movie }>(),
);
export const removeFromFavorites = createAction(
  '[Movies] Remove From Favorites',
  props<{ movie: Movie }>(),
);
export const addToWatchList = createAction(
  '[Movies] Add To WatchList',
  props<{ movie: Movie }>(),
);
export const removeFromWatchList = createAction(
  '[Movies] Remove From WatchList',
  props<{ movie: Movie }>(),
);
