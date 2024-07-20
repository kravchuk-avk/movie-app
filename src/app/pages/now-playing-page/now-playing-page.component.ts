import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.interface';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-now-playing-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './now-playing-page.component.html',
  styleUrl: './now-playing-page.component.scss',
})
export class NowPlayingPageComponent implements OnInit {
  movies: Movie[] = [];
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movies = this.movieService.getNowPlayingMovies();
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
