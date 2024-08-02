import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { Store } from '@ngrx/store';
import { ClearObservable } from '../../shared/directives/clear-observable.directive';
import { Observable } from 'rxjs';
import { selectAllMovies } from '../../store/selectors';

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
  watchLaterMovies$: Observable<Movie[]>;

  constructor(private store: Store) {
    super();
    this.watchLaterMovies$ = this.store.select(selectAllMovies);
  }

  ngOnInit() {
    // this.movieService.getFavoriteMovies().subscribe((movies) => {
    //   this.favoriteMovies = movies;
    // });
    // this.movieService.getWatchLaterMovies().subscribe((movies) => {
    //   this.watchLaterMovies = movies;
    // });
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
