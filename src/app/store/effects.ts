import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Movie } from '../models/movie.interface';
import { Router } from '@angular/router';
import { createLoadActions, movieDetailsActions } from './actions';
import { MoviesService } from '../services/movie/movie.service';

@Injectable()
export class MoviesEffects {
  constructor(
    private actions$: Actions,
    private moviesService: MoviesService,
    private router: Router,
  ) {}

  private loadMovies(category: string, loadFn: () => Observable<Movie[]>) {
    return this.actions$.pipe(
      ofType(createLoadActions(category).load),
      switchMap(() =>
        loadFn().pipe(
          tap((movies) => console.log(`Loaded ${category} movies`, movies)),
          map((movies) => createLoadActions(category).loadSuccess({ movies })),
          catchError((error) => {
            console.error(`Error loading ${category} movies`, error);
            return of(createLoadActions(category).loadFailure({ error }));
          }),
        ),
      ),
    );
  }

  loadNowPlaying$ = createEffect(() =>
    this.loadMovies('nowPlaying', () =>
      this.moviesService.getNowPlayingMovies(),
    ),
  );

  loadPopular$ = createEffect(() =>
    this.loadMovies('popular', () => this.moviesService.getPopularMovies()),
  );

  loadTopRated$ = createEffect(() =>
    this.loadMovies('topRated', () => this.moviesService.getTopRatedMovies()),
  );

  loadUpcoming$ = createEffect(() =>
    this.loadMovies('upcoming', () => this.moviesService.getUpcomingMovies()),
  );

  loadFavoriteMovies$ = createEffect(() =>
    this.loadMovies('favorite', () => this.moviesService.getFavoriteMovies()),
  );

  loadWatchLaterMovies$ = createEffect(() =>
    this.loadMovies('watchLater', () =>
      this.moviesService.getWatchLaterMovies(),
    ),
  );

  loadMovieDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movieDetailsActions.load),
      switchMap((action) =>
        this.moviesService.getMovieDetails(action.movieId).pipe(
          tap((movie) => console.log('Loaded movie details:', movie)),
          map((movie) => movieDetailsActions.loadSuccess({ movie })),
          catchError((error) => {
            console.error('Error loading movie details', error);
            return of(movieDetailsActions.loadFailure({ error }));
          }),
        ),
      ),
    ),
  );

  navigateToMovieDetails$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieDetailsActions.loadSuccess),
        tap(({ movie }) => {
          this.router.navigate(['/movies', movie.id]);
        }),
      ),
    { dispatch: false },
  );
}
