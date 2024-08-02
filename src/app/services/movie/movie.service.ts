// import { Injectable } from '@angular/core';
// import { Movie, MovieListResponse } from '../../models/movie.interface';
// import { HttpClient } from '@angular/common/http';
// import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { MovieDetails } from '../../models/movie-details.interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class MovieService {
//   private apiKey = environment.apiKey;
//   private apiUrl = environment.apiBaseUrl;

//   private favoriteMoviesSubject = new BehaviorSubject<Movie[]>([]);
//   private watchLaterMoviesSubject = new BehaviorSubject<Movie[]>([]);

//   constructor(private http: HttpClient) {}

//   private handleError(error: unknown): Observable<never> {
//     console.error('An error occurred:', error);
//     return throwError(
//       () => new Error('Something bad happened; please try again later.'),
//     );
//   }

//   private getMovies(endpoint: string): Observable<Movie[]> {
//     const url = `${this.apiUrl}${endpoint}?api_key=${this.apiKey}`;
//     return this.http.get<MovieListResponse>(url).pipe(
//       map((response) => {
//         if (!response || !response.results) {
//           throw new Error('Invalid response from server');
//         }
//         return response.results;
//       }),
//       catchError(this.handleError),
//     );
//   }

//   getNowPlayingMovies(): Observable<Movie[]> {
//     return this.getMovies('/movie/now_playing');
//   }

//   getPopularMovies(): Observable<Movie[]> {
//     return this.getMovies('/movie/popular');
//   }

//   getTopRatedMovies(): Observable<Movie[]> {
//     return this.getMovies('/movie/top_rated');
//   }

//   getUpcomingMovies(): Observable<Movie[]> {
//     return this.getMovies('/movie/upcoming');
//   }

//   getFavoriteMovies(): Observable<Movie[]> {
//     return this.favoriteMoviesSubject.asObservable();
//   }

//   getWatchLaterMovies(): Observable<Movie[]> {
//     return this.watchLaterMoviesSubject.asObservable();
//   }

//   getMovieById(id: number): Observable<MovieDetails> {
//     const url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`;
//     return this.http.get<MovieDetails>(url).pipe(catchError(this.handleError));
//   }

//   addToFavorites(movie: Movie) {
//     const currentFavorites = this.favoriteMoviesSubject.value;
//     if (!currentFavorites.some((m) => m.id === movie.id)) {
//       this.favoriteMoviesSubject.next([...currentFavorites, movie]);
//     } else {
//       this.removeFromFavorites(movie);
//     }
//   }

//   removeFromFavorites(movie: Movie) {
//     const updatedFavorites = this.favoriteMoviesSubject.value.filter(
//       (m) => m.id !== movie.id,
//     );
//     this.favoriteMoviesSubject.next(updatedFavorites);
//   }

//   addToWatchLater(movie: Movie) {
//     const currentWatchLater = this.watchLaterMoviesSubject.value;
//     if (!currentWatchLater.some((m) => m.id === movie.id)) {
//       this.watchLaterMoviesSubject.next([...currentWatchLater, movie]);
//     } else {
//       this.removeFromWatchLater(movie);
//     }
//   }

//   removeFromWatchLater(movie: Movie) {
//     const updatedWatchLater = this.watchLaterMoviesSubject.value.filter(
//       (m) => m.id !== movie.id,
//     );
//     this.watchLaterMoviesSubject.next(updatedWatchLater);
//   }

//   isFavorite(id: number): boolean {
//     return this.favoriteMoviesSubject.value.some((movie) => movie.id === id);
//   }

//   isInWatchList(id: number): boolean {
//     return this.watchLaterMoviesSubject.value.some((movie) => movie.id === id);
//   }
// }

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
    const url = `${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`;
    return this.http.get<MovieDetails>(url).pipe(catchError(this.handleError));
  }
}
