// import { Component, OnInit } from '@angular/core';
// import { HeaderComponent } from '../../components/header/header.component';
// import { MovieListComponent } from "../../components/movie-list/movie-list.component";

// @Component({
//     selector: 'app-popular-page',
//     standalone: true,
//     templateUrl: './popular-page.component.html',
//     styleUrl: './popular-page.component.scss',
//     imports: [HeaderComponent, MovieListComponent]
// })
// export class PopularPageComponent implements OnInit {
// favoriteMovieListIds: string[] = [];
// watchLaterMovieListIds: string[] = [];

// ngOnInit() {
//     this.favoriteMovieListIds =['favorites'];
//     this.watchLaterMovieListIds =['watchList'];
// }
// }



import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';
import { MovieListComponent } from "../../components/movie-list/movie-list.component";
import { Router } from '@angular/router';
import { popularMovies } from '../../mocks/mock-movies+';

@Component({
    selector: 'app-popular-page',
    standalone: true,
    templateUrl: './popular-page.component.html',
    styleUrl: './popular-page.component.scss',
   imports: [HeaderComponent, MovieCardComponent, CommonModule, MovieListComponent]
})
export class PopularPageComponent {

  movies = popularMovies;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private router: Router) { }

   redirectToDetailsPage(id: string) {
      this.router.navigate([`movie/:${id}`])
   }

isInList(list: string[], movie: any): boolean {
    return list.includes(movie.id);
  }

  // handleAddToFavorite(movie: any) {
  //   if (!this.favoriteMovieListIds.includes(movie.id)) {
  //     this.favoriteMovieListIds.push(movie.id)
  //   }
  // }

  // handleAddToWatchList(movie: any) {
  //   if (!this.watchLaterMovieListIds.includes(movie.id)) {
  //     this.watchLaterMovieListIds.push(movie.id)
  //   }
  // }
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