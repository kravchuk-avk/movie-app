import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component, Input } from '@angular/core';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  selectFavoriteMovies,
  selectWatchLaterMovies,
} from '../../store/selectors';
import {
  addToFavorites,
  removeFromFavorites,
  addToWatchList,
  removeFromWatchList,
} from '../../store/actions';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  imports: [CommonModule, DurationPipe, CardModule, ButtonModule, RouterLink],
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  favoriteMovies$: Observable<Movie[]>;
  watchLaterMovies$: Observable<Movie[]>;

  constructor(private store: Store) {
    this.favoriteMovies$ = this.store.select(selectFavoriteMovies);
    this.watchLaterMovies$ = this.store.select(selectWatchLaterMovies);
  }

  get isFavorite(): boolean {
    let isFavorite = false;
    this.favoriteMovies$.subscribe((movies) => {
      isFavorite = movies.some((m) => m.id === this.movie.id);
    });
    return isFavorite;
  }

  get isInWatchList(): boolean {
    let isInWatchList = false;
    this.watchLaterMovies$.subscribe((movies) => {
      isInWatchList = movies.some((m) => m.id === this.movie.id);
    });
    return isInWatchList;
  }

  addToFavorites() {
    if (this.isFavorite) {
      this.store.dispatch(removeFromFavorites({ movie: this.movie }));
    } else {
      this.store.dispatch(addToFavorites({ movie: this.movie }));
    }
  }

  addToWatchList() {
    if (this.isInWatchList) {
      this.store.dispatch(removeFromWatchList({ movie: this.movie }));
    } else {
      this.store.dispatch(addToWatchList({ movie: this.movie }));
    }
  }
}
