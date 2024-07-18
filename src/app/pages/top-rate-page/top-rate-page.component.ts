import { Component } from '@angular/core';
import { Movie } from '../../models/movie.interface';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { topRatedMovies } from '../../mocks/mock-movies+';

@Component({
  selector: 'app-top-rate-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './top-rate-page.component.html',
  styleUrl: './top-rate-page.component.scss',
})
export class TopRatePageComponent {
  movies: Movie[] = topRatedMovies;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private router: Router) {}

  redirectToDetailsPage(id: string) {
    this.router.navigate([`movie/:${id}`]);
  }

  handleAddFavoriteList(movieId: string) {
    const index = this.favoriteMovieListIds.indexOf(movieId);
    if (index === -1) {
      this.favoriteMovieListIds.push(movieId);
    } else {
      this.favoriteMovieListIds.splice(index, 1);
    }
  }

  handleAddWatchList(movieId: string) {
    const index = this.watchLaterMovieListIds.indexOf(movieId);
    if (index === -1) {
      this.watchLaterMovieListIds.push(movieId);
    } else {
      this.watchLaterMovieListIds.splice(index, 1);
    }
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
