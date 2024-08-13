import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { nowPlayingActions } from '../../store/actions';
import { nowPlayingSelectors } from '../../store/selectors';

@Component({
  selector: 'app-now-playing-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './now-playing-page.component.html',
  styleUrl: './now-playing-page.component.scss',
})
export class NowPlayingPageComponent extends ClearObservable implements OnInit {
  movies$: Observable<Movie[]>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    super();
    this.movies$ = this.store.select(nowPlayingSelectors.selectMovies);
    this.error$ = this.store.select(nowPlayingSelectors.selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(nowPlayingActions.load());
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
