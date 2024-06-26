import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { DurationPipe } from '../../pipe/duration/duration.pipe'
import { MOCK_MOVIES } from '../../mock-data/mock-movies';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, DurationPipe],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent {

  movies = MOCK_MOVIES;


  favorites: any[] = [];
  watchList: any[] = [];

  public isInList(list: any[], movie: any): boolean {
    return list.some(item => item.id === movie.id);
  }

  public toggleMovieInList(list: any[], movie: any): void {
    const index = list.findIndex(item => item.id === movie.id);
    if (index === -1) {
      list.push(movie);
    } else {
      list.splice(index, 1);
    }
  }

  handleAddFavorites(movie: any) {
    this.toggleMovieInList(this.favorites, movie);
  }

  handleAddWatchList(movie: any) {
    this.toggleMovieInList(this.watchList, movie);
  }

  trackByMovieId(index: number, movie: any): number {
    return movie.id;
  }
}