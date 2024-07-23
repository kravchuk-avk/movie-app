import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-top-rate-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './top-rate-page.component.html',
  styleUrl: './top-rate-page.component.scss',
})
export class TopRatePageComponent implements OnInit {
  movies: Movie[] = [];
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movies = this.movieService.getTopRatedMovies();
    this.favoriteMovieListIds = this.movieService.getFavoriteMovieIds();
    this.watchLaterMovieListIds = this.movieService.getWatchLaterMovieIds();
  }

  handleAddToFavorite(movieId: string) {
    const movie = this.movieService.getMovieById(+movieId);
    if (movie) {
      this.movieService.addToFavorites(movie);
      this.favoriteMovieListIds = this.movieService.getFavoriteMovieIds();
    }
  }

  handleAddToWatchList(movieId: string) {
    const movie = this.movieService.getMovieById(+movieId);
    if (movie) {
      this.movieService.addToWatchLater(movie);
      this.watchLaterMovieListIds = this.movieService.getWatchLaterMovieIds();
    }
  }

  trackByMovieId(index: number, item: Movie): number {
    return item.id;
  }
}
