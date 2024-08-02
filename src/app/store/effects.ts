import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MovieService } from '../services/movie/movie.service';
import { loadMovies, loadMoviesSuccess, loadMoviesFailure } from './actions';

@Injectable()
export class MovieEffects {
  loadMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMovies),
      mergeMap(() =>
        this.movieService.getPopularMovies().pipe(
          map((movies) => loadMoviesSuccess({ movies })),
          catchError((error) =>
            of(loadMoviesFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private movieService: MovieService,
  ) {}
}
