import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component, Input } from '@angular/core';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  imports: [CommonModule, DurationPipe, CardModule, ButtonModule, RouterLink],
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  // @Input() favoriteMovieIds: string[] = [];
  // @Input() watchLaterMovieIds: string[] = [];
  // @Output() addFavorites = new EventEmitter<string>();
  // @Output() addWatchList = new EventEmitter<string>();

  constructor(private movieService: MovieService) {}

  // get isFavorite(): boolean {
  //   return this.favoriteMovieIds.includes(this.movie.id.toString());
  // }

  // get isInWatchList(): boolean {
  //   return this.watchLaterMovieIds.includes(this.movie.id.toString());
  // }

  // addToFavorites() {
  //   this.addFavorites.emit(this.movie.id.toString());
  // }

  // addToWatchList() {
  //   this.addWatchList.emit(this.movie.id.toString());
  // }

  get isFavorite(): boolean {
    return this.movieService.isFavorite(this.movie.id);
  }

  get isInWatchList(): boolean {
    return this.movieService.isInWatchList(this.movie.id);
  }

  addToFavorites() {
    if (this.isFavorite) {
      this.movieService.removeFromFavorites(this.movie);
    } else {
      this.movieService.addToFavorites(this.movie);
    }
  }

  addToWatchList() {
    if (this.isInWatchList) {
      this.movieService.removeFromWatchLater(this.movie);
    } else {
      this.movieService.addToWatchLater(this.movie);
    }
  }
}
