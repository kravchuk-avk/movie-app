import { createAction, props } from '@ngrx/store';
import { MovieDetails } from '../models/movie-details.interface';
import { Movie } from '../models/movie.interface';

export const createLoadActions = (category: string) => ({
  load: createAction(`[Movies] Load ${category} Movies`),
  loadSuccess: createAction(
    `[Movies] Load ${category} Movies Success`,
    props<{ movies: Movie[] }>(),
  ),
  loadFailure: createAction(
    `[Movies] Load ${category} Movies Failure`,
    props<{ error: string }>(),
  ),
});

export const createUpdateActions = (category: string) => ({
  update: createAction(
    `[Movies] Update ${category}`,
    props<{ movieId: number }>(),
  ),
  updateSuccess: createAction(
    `[Movies] Update ${category} Success`,
    props<{ movieId: number }>(),
  ),
  updateFailure: createAction(
    `[Movies] Update ${category} Failure`,
    props<{ error: string }>(),
  ),
});

export const nowPlayingActions = createLoadActions('Now Playing');
export const popularActions = createLoadActions('Popular');
export const topRatedActions = createLoadActions('Top Rated');
export const upcomingActions = createLoadActions('Upcoming');

export const favoriteActions = {
  ...createLoadActions('Favorite'),
  ...createUpdateActions('Favorite'),
  setFavoriteMovieIds: createAction(
    '[Favorite Movies] Set Favorite Movie IDs',
    props<{ movieIds: number[] }>(),
  ),
};

export const watchLaterActions = {
  ...createLoadActions('Watch Later'),
  ...createUpdateActions('Watch Later'),
  setWatchLaterMovieIds: createAction(
    '[Watch Later Movies] Set Watch Later Movie IDs',
    props<{ movieIds: number[] }>(),
  ),
};

export const movieDetailsActions = {
  load: createAction(
    '[Movies] Load Movie Details',
    props<{ movieId: number }>(),
  ),
  loadSuccess: createAction(
    '[Movies] Load Movie Details Success',
    props<{ movie: MovieDetails }>(),
  ),
  loadFailure: createAction(
    '[Movies] Load Movie Details Failure',
    props<{ error: string }>(),
  ),
};
