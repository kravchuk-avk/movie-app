import { Injectable } from '@angular/core';
import { Movie } from '../../models/movie.interface';
import {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
} from '../../mocks/mock-movies+';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private nowPlayingMovies: Movie[] = nowPlayingMovies;
  private popularMovies: Movie[] = popularMovies;
  private topRatedMovies: Movie[] = topRatedMovies;
  private upcomingMovies: Movie[] = upcomingMovies;
  private favoriteMovies: Movie[] = [];
  private watchLaterMovies: Movie[] = [];
  // private apiKey = '5470d20f8fde7b59d44e4efafdff8a6d';
  // private apiUrl = 'https://api.themoviedb.org/3';

  // constructor(private httpClient: HttpClient) {}
  constructor() {}

  getMovies(): Movie[] {
    return [
      ...this.nowPlayingMovies,
      ...this.popularMovies,
      ...this.topRatedMovies,
      ...this.upcomingMovies,
    ];
  }

  getPopularMovies(): Movie[] {
    return this.popularMovies;
  }

  getNowPlayingMovies(): Movie[] {
    return this.nowPlayingMovies;
  }

  getTopRatedMovies(): Movie[] {
    return this.topRatedMovies;
  }

  getUpcomingMovies(): Movie[] {
    return this.upcomingMovies;
  }

  getFavoriteMovies(): Movie[] {
    return this.favoriteMovies;
  }

  getWatchLaterMovies(): Movie[] {
    return this.watchLaterMovies;
  }

  getMovieById(id: number): Movie | undefined {
    return this.getMovies().find((movie) => movie.id === id);
  }

  addToFavorites(movie: Movie) {
    if (!this.favoriteMovies.some((m) => m.id === movie.id)) {
      this.favoriteMovies.push(movie);
    } else {
      this.removeFromFavorites(movie);
    }
  }

  removeFromFavorites(movie: Movie) {
    this.favoriteMovies = this.favoriteMovies.filter((m) => m.id !== movie.id);
  }

  addToWatchLater(movie: Movie) {
    if (!this.watchLaterMovies.some((m) => m.id === movie.id)) {
      this.watchLaterMovies.push(movie);
    } else {
      this.removeFromWatchLater(movie);
    }
  }

  removeFromWatchLater(movie: Movie) {
    this.watchLaterMovies = this.watchLaterMovies.filter(
      (m) => m.id !== movie.id,
    );
  }

  isFavorite(id: number): boolean {
    return this.favoriteMovies.some((movie) => movie.id === id);
  }

  isInWatchList(id: number): boolean {
    return this.watchLaterMovies.some((movie) => movie.id === id);
  }
}
