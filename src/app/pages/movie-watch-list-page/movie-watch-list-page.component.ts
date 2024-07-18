import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component, OnInit } from '@angular/core';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
} from '../../mocks/mock-movies+';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-watch-list-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-watch-list-page.component.html',
  styleUrl: './movie-watch-list-page.component.scss',
})
export class MovieWatchListPageComponent implements OnInit {
  movies: Movie[] = [
    ...nowPlayingMovies,
    ...popularMovies,
    ...topRatedMovies,
    ...upcomingMovies,
  ];
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: { [key: string]: string }) => {
      const favoriteDataString = params['favoriteData'];
      this.favoriteMovieListIds = favoriteDataString
        ? JSON.parse(favoriteDataString)
        : [];
      const watchLaterDataString = params['data'];
      this.watchLaterMovieListIds = watchLaterDataString
        ? JSON.parse(watchLaterDataString)
        : [];
    });
  }

  getMovieById(id: string): Movie | undefined {
    const numericId = +id;
    return this.movies.find((movie) => movie.id === numericId);
  }

  handleAddToFavorite(movieId: string) {
    const index = this.favoriteMovieListIds.indexOf(movieId);
    if (index === -1) {
      this.favoriteMovieListIds.push(movieId);
    } else {
      this.favoriteMovieListIds.splice(index, 1);
    }
  }

  handleAddToWatchList(movieId: string) {
    const index = this.watchLaterMovieListIds.indexOf(movieId);
    if (index === -1) {
      this.watchLaterMovieListIds.push(movieId);
    } else {
      this.watchLaterMovieListIds.splice(index, 1);
    }
  }

  trackByMovieId(index: number, movieId: string): string {
    return movieId;
  }
}
