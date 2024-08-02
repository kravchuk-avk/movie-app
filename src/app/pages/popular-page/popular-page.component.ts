import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadMovies } from '../../store/actions';
import { selectAllMovies, selectMovieError } from '../../store/selectors';

@Component({
  selector: 'app-popular-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './popular-page.component.html',
  styleUrls: ['./popular-page.component.scss'],
})
export class PopularPageComponent extends ClearObservable implements OnInit {
  movies$: Observable<Movie[]>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    super();
    this.movies$ = this.store.select(selectAllMovies);
    this.error$ = this.store.select(selectMovieError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadMovies());
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
