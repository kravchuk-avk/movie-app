import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { topRatedActions } from '../../store/actions';
import { topRatedSelectors } from '../../store/selectors';

@Component({
  selector: 'app-top-rate-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './top-rate-page.component.html',
  styleUrl: './top-rate-page.component.scss',
})
export class TopRatePageComponent extends ClearObservable implements OnInit {
  movies$: Observable<Movie[]>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    super();
    this.movies$ = this.store.select(topRatedSelectors.selectMovies);
    this.error$ = this.store.select(topRatedSelectors.selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(topRatedActions.load());
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
