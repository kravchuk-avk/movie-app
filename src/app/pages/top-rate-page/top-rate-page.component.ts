import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from "../../components/movie-list/movie-list.component";
import { Router } from '@angular/router';
import { topRatedMovies } from '../../mocks/mock-movies+';

@Component({
  selector: 'app-top-rate-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, MovieListComponent],
  templateUrl: './top-rate-page.component.html',
  styleUrl: './top-rate-page.component.scss'
})
export class TopRatePageComponent {

  movies = topRatedMovies;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private router: Router) { }

   redirectToDetailsPage(id: string) {
      this.router.navigate([`movie/:${id}`])
   }

isInList(list: string[], movie: any): boolean {
    return list.includes(movie.id);
  }

handleAddToFavorite(movie: any) {
    const index = this.favoriteMovieListIds.indexOf(movie.id);
    if (index === -1) {
      this.favoriteMovieListIds.push(movie.id);
    } else {
      this.favoriteMovieListIds.splice(index, 1);
    }
  }

  handleAddToWatchList(movie: any) {
    const index = this.watchLaterMovieListIds.indexOf(movie.id);
    if (index === -1) {
      this.watchLaterMovieListIds.push(movie.id);
    } else {
      this.watchLaterMovieListIds.splice(index, 1);
    }
  }

  trackByMovieId(index: number, movie: any): number {
    return movie.id;
  }
}