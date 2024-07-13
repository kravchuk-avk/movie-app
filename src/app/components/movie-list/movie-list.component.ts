import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
} from '../../mocks/mock-movies+';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, DurationPipe],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss',
})
export class MovieListComponent {
  movies: Movie[] = [
    ...nowPlayingMovies,
    ...popularMovies,
    ...topRatedMovies,
    ...upcomingMovies,
  ];

  favorites: Movie[] = [];
  watchList: Movie[] = [];

  public isInList(list: Movie[], movie: Movie): boolean {
    return list.some((item) => item.id === movie.id);
  }

  public toggleMovieInList(list: Movie[], movie: Movie): void {
    const index = list.findIndex((item) => item.id === movie.id);
    if (index === -1) {
      list.push(movie);
    } else {
      list.splice(index, 1);
    }
  }

  handleAddFavorites(movie: Movie) {
    this.toggleMovieInList(this.favorites, movie);
  }

  handleAddWatchList(movie: Movie) {
    this.toggleMovieInList(this.watchList, movie);
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
