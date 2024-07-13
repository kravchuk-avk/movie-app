import { Component } from '@angular/core';
import { Movie } from '../../models/movie.interface';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';
import { Router } from '@angular/router';
import { upcomingMovies } from '../../mocks/mock-movies+';

@Component({
  selector: 'app-upcoming-page',
  standalone: true,
  imports: [
    HeaderComponent,
    MovieCardComponent,
    CommonModule,
    MovieListComponent,
  ],
  templateUrl: './upcoming-page.component.html',
  styleUrl: './upcoming-page.component.scss',
})
export class UpcomingPageComponent {
  movies: Movie[] = upcomingMovies;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private router: Router) {}

  redirectToDetailsPage(id: string) {
    this.router.navigate([`movie/:${id}`]);
  }

  isInList(list: string[], movie: Movie): boolean {
    return list.includes(movie.id.toString());
  }

  handleAddToFavorite(movie: Movie) {
    const index = this.favoriteMovieListIds.indexOf(movie.id.toString());
    if (index === -1) {
      this.favoriteMovieListIds.push(movie.id.toString());
    } else {
      this.favoriteMovieListIds.splice(index, 1);
    }
  }

  handleAddToWatchList(movie: Movie) {
    const index = this.watchLaterMovieListIds.indexOf(movie.id.toString());
    if (index === -1) {
      this.watchLaterMovieListIds.push(movie.id.toString());
    } else {
      this.watchLaterMovieListIds.splice(index, 1);
    }
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
