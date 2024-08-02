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
  favoriteMovies$: Observable<Movie[]>;

  constructor(private store: Store) {
    super();
    this.favoriteMovies$ = this.store.select(selectAllMovies);
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
