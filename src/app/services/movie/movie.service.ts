import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Movie, MovieListResponse } from '../../models/movie.interface';
import { MovieDetails } from '../../models/movie-details.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiKey = environment.apiKey;
  private apiUrl = environment.apiBaseUrl;

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
        if (!response || !response.results) {
          throw new Error('Invalid response from server');
        }
        return response.results;
      }),
      catchError(this.handleError),
    );
  }

  // Методы для получения фильмов по категориям
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

  getFavoriteMovies(): Observable<Movie[]> {
    // Предположим, что "Избранное" и "Смотреть позже" хранятся на стороне сервера,
    // но могут также храниться локально, в этом случае можно вернуть mock-данные или использовать localStorage
    return this.getMovies('/movie/favorites'); // Пример эндпоинта
  }

  getWatchLaterMovies(): Observable<Movie[]> {
    return this.getMovies('/movie/watch_later'); // Пример эндпоинта
  }

  // Метод для получения деталей о фильме
  getMovieDetails(id: number): Observable<MovieDetails> {
    const url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get<MovieDetails>(url).pipe(catchError(this.handleError));
  }
}
