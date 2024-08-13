import { createReducer, on } from '@ngrx/store';
import {
  favoriteActions,
  watchLaterActions,
  movieDetailsActions,
  createLoadActions,
  createUpdateActions,
} from './actions';
import { initialState, MoviesState } from './state';

export const moviesReducer = createReducer(
  initialState,

  ...['nowPlaying', 'popular', 'topRated', 'upcoming', 'favorite', 'watchLater']
    .map((category) => [
      on(
        createLoadActions(category).load,
        (state: MoviesState): MoviesState => ({
          ...state,
          isLoading: {
            ...state.isLoading,
            [category]: true,
          },
        }),
      ),
      on(
        createLoadActions(category).loadSuccess,
        (state: MoviesState, { movies }): MoviesState => ({
          ...state,
          isLoading: {
            ...state.isLoading,
            [category]: false,
          },
          [category]: movies,
        }),
      ),
      on(
        createLoadActions(category).loadFailure,
        (state: MoviesState, { error }): MoviesState => ({
          ...state,
          isLoading: {
            ...state.isLoading,
            [category]: false,
          },
          error: {
            ...state.error,
            [category]: error,
          },
        }),
      ),
    ])
    .flat(),

  ...['favorite', 'watchLater']
    .map((category) => [
      on(
        createUpdateActions(category).update,
        (state: MoviesState): MoviesState => ({
          ...state,
          isLoading: {
            ...state.isLoading,
            [category]: true,
          },
        }),
      ),
      on(
        createUpdateActions(category).updateSuccess,
        (state: MoviesState, { movieId }): MoviesState => {
          const key = `${category}Ids` as 'favoriteIds' | 'watchLaterIds';
          const isInList = state[key].includes(movieId);
          const updatedList = isInList
            ? state[key].filter((id: number) => id !== movieId)
            : [...state[key], movieId];
          return {
            ...state,
            isLoading: {
              ...state.isLoading,
              [category]: false,
            },
            [key]: updatedList,
          };
        },
      ),
      on(
        createUpdateActions(category).updateFailure,
        (state: MoviesState, { error }): MoviesState => ({
          ...state,
          isLoading: {
            ...state.isLoading,
            [category]: false,
          },
          error: {
            ...state.error,
            [category]: error,
          },
        }),
      ),
      on(
        category === 'favorite'
          ? favoriteActions.setFavoriteMovieIds
          : watchLaterActions.setWatchLaterMovieIds,
        (state: MoviesState, { movieIds }): MoviesState => ({
          ...state,
          [category === 'favorite' ? 'favoriteIds' : 'watchLaterIds']: movieIds,
        }),
      ),
    ])
    .flat(),

  on(
    movieDetailsActions.load,
    (state: MoviesState): MoviesState => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        movieDetails: true,
      },
    }),
  ),
  on(
    movieDetailsActions.loadSuccess,
    (state: MoviesState, { movie }): MoviesState => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        movieDetails: false,
      },
      movieDetails: movie,
    }),
  ),
  on(
    movieDetailsActions.loadFailure,
    (state: MoviesState, { error }): MoviesState => ({
      ...state,
      isLoading: {
        ...state.isLoading,
        movieDetails: false,
      },
      error: {
        ...state.error,
        movieDetails: error,
      },
    }),
  ),
);
