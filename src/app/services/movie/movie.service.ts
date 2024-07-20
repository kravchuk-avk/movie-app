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
      this.favoriteMovies = this.favoriteMovies.filter(
        (m) => m.id !== movie.id,
      );
    }
  }

  addToWatchLater(movie: Movie) {
    if (!this.watchLaterMovies.some((m) => m.id === movie.id)) {
      this.watchLaterMovies.push(movie);
    } else {
      this.watchLaterMovies = this.watchLaterMovies.filter(
        (m) => m.id !== movie.id,
      );
    }
  }

  getFavoriteMovieIds(): string[] {
    return this.favoriteMovies.map((movie) => movie.id.toString());
  }

  getWatchLaterMovieIds(): string[] {
    return this.watchLaterMovies.map((movie) => movie.id.toString());
  }
}
