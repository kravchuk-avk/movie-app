import { Injectable } from '@angular/core';
import { Movie, MovieListResponse } from '../../models/movie.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MovieDetails } from '../../models/movie-details.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiBaseUrl;

  private favoriteMovies: Movie[] = [];
  private watchLaterMovies: Movie[] = [];

  constructor(private http: HttpClient) {}

  private handleError(error: unknown): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }

  private getMovies(endpoint: string): Observable<Movie[]> {
    const url = `${this.apiUrl}${endpoint}?api_key=${this.apiKey}`;
    return this.http.get<MovieListResponse>(url).pipe(
      map((response) => {
        console.log('Response from server:', response);
        if (!response || !response.results) {
          throw new Error('Invalid response from server');
        }
        return response.results;
      }),
      catchError(this.handleError),
    );
  }

  getNowPlayingMovies(): Observable<Movie[]> {
    return this.getMovies('/movie/now_playing');
  }

  getPopularMovies(): Observable<Movie[]> {
    return this.getMovies('/movie/popular');
  }

  getTopRatedMovies(): Observable<Movie[]> {
    return this.getMovies('/movie/top_rated');
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.getMovies('/movie/upcoming');
  }

  getMovieById(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(
      `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`,
    );
  }

  getFavoriteMovies(): Movie[] {
    return this.favoriteMovies;
  }

  getWatchLaterMovies(): Movie[] {
    return this.watchLaterMovies;
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
