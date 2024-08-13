import { MovieDetails } from '../models/movie-details.interface';
import { Movie } from '../models/movie.interface';

export interface MoviesState {
  nowPlaying: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
  favorite: Movie[];
  watchLater: Movie[];

  favoriteIds: number[];
  watchLaterIds: number[];

  movieDetails: MovieDetails | null;

  isLoading: {
    nowPlaying: boolean;
    popular: boolean;
    topRated: boolean;
    upcoming: boolean;
    favorite: boolean;
    watchLater: boolean;
    movieDetails: boolean;
  };

  error: {
    nowPlaying: string | null;
    popular: string | null;
    topRated: string | null;
    upcoming: string | null;
    favorite: string | null;
    watchLater: string | null;
    movieDetails: string | null;
  };
}

export const initialState: MoviesState = {
  nowPlaying: [],
  popular: [],
  topRated: [],
  upcoming: [],
  favorite: [],
  watchLater: [],

  favoriteIds: [],
  watchLaterIds: [],

  movieDetails: null,

  isLoading: {
    nowPlaying: false,
    popular: false,
    topRated: false,
    upcoming: false,
    favorite: false,
    watchLater: false,
    movieDetails: false,
  },

  error: {
    nowPlaying: null,
    popular: null,
    topRated: null,
    upcoming: null,
    favorite: null,
    watchLater: null,
    movieDetails: null,
  },
};
