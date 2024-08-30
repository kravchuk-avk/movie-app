import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.interface';
import { ButtonModule } from 'primeng/button';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { favoriteActions, watchLaterActions } from '../../store/actions';
import { selectFavoriteIds, selectWatchLaterIds } from '../../store/selectors';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  imports: [CommonModule, DurationPipe, CardModule, ButtonModule, RouterLink],
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  favoriteMoviesIds$: Observable<number[]>;
  watchLaterMoviesIds$: Observable<number[]>;

  constructor(private store: Store) {
    this.favoriteMoviesIds$ = this.store.select(selectFavoriteIds);
    this.watchLaterMoviesIds$ = this.store.select(selectWatchLaterIds);
  }

  get isFavorite$(): Observable<boolean> {
    return this.favoriteMoviesIds$.pipe(
      map((ids) => ids.includes(this.movie.id)),
    );
  }

  get isInWatchList$(): Observable<boolean> {
    return this.watchLaterMoviesIds$.pipe(
      map((ids) => ids.includes(this.movie.id)),
    );
  }

  toggleFavorite() {
    this.store.dispatch(favoriteActions.update({ movieId: this.movie.id }));
  }

  toggleWatchList() {
    this.store.dispatch(watchLaterActions.update({ movieId: this.movie.id }));
  }
}
