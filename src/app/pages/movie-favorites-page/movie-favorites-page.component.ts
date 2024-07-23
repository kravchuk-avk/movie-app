import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-movie-favorites-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-favorites-page.component.html',
  styleUrls: ['./movie-favorites-page.component.scss'],
})
export class MovieFavoritesPageComponent implements OnInit {
  movies: Movie[] = [];
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {}

  ngOnInit() {
    this.movies = this.movieService.getMovies();
    this.favoriteMovieListIds = this.movieService.getFavoriteMovieIds();
    this.watchLaterMovieListIds = this.movieService.getWatchLaterMovieIds();
  }

  getMovieById(id: string): Movie | undefined {
    const numericId = +id;
    return this.movies.find((movie) => movie.id === numericId);
  }

  handleAddToFavorite(movieId: string) {
    const movie = this.getMovieById(movieId);
    if (movie) {
      this.movieService.addToFavorites(movie);
      this.favoriteMovieListIds = this.movieService.getFavoriteMovieIds();
    }
  }

  handleAddToWatchList(movieId: string) {
    const movie = this.getMovieById(movieId);
    if (movie) {
      this.movieService.addToWatchLater(movie);
      this.watchLaterMovieListIds = this.movieService.getWatchLaterMovieIds();
    }
  }

  trackByMovieId(index: number, movieId: string): string {
    return movieId;
  }
}
