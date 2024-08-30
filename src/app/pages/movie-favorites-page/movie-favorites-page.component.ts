import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { Movie } from '../../models/movie.interface';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { favoriteActions } from '../../store/actions';
import { favoriteSelectors } from '../../store/selectors';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';

@Component({
  selector: 'app-movie-favorites-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-favorites-page.component.html',
  styleUrls: ['./movie-favorites-page.component.scss'],
})
export class MovieFavoritesPageComponent
  extends ClearObservable
  implements OnInit
{
  favoriteMovies$: Observable<Movie[]> | null = null;
  isLoading$: Observable<boolean> | null = null;
  error$: Observable<string | null> | null = null;

  constructor(private store: Store) {
    super();
  }

  ngOnInit() {
    this.store.dispatch(favoriteActions.load());

    this.favoriteMovies$ = this.store.select(favoriteSelectors.selectMovies);
    this.isLoading$ = this.store.select(favoriteSelectors.selectIsLoading);
    this.error$ = this.store.select(favoriteSelectors.selectError);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
