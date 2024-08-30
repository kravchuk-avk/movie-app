import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie } from '../../models/movie.interface';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';
import { watchLaterActions } from '../../store/actions';
import { watchLaterSelectors } from '../../store/selectors';

@Component({
  selector: 'app-movie-watch-list-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-watch-list-page.component.html',
  styleUrl: './movie-watch-list-page.component.scss',
})
export class MovieWatchListPageComponent
  extends ClearObservable
  implements OnInit
{
  watchLaterMovies$: Observable<Movie[]> | null = null;
  isLoading$: Observable<boolean> | null = null;
  error$: Observable<string | null> | null = null;

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(watchLaterActions.load());

    this.watchLaterMovies$ = this.store.select(
      watchLaterSelectors.selectMovies,
    );
    this.isLoading$ = this.store.select(watchLaterSelectors.selectIsLoading);
    this.error$ = this.store.select(watchLaterSelectors.selectError);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
