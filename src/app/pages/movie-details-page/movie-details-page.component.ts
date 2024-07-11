import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies } from '../../mocks/mock-movies+';
import { DurationPipe } from "../../pipes/duration/duration.pipe";
import { MovieCardComponent } from "../../components/movie-card/movie-card.component";
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../components/header/header.component';
import { MovieListComponent } from '../../components/movie-list/movie-list.component';

@Component({
    selector: 'app-movie-details-page',
    standalone: true,
    templateUrl: './movie-details-page.component.html',
    styleUrl: './movie-details-page.component.scss',
    imports: [HeaderComponent, MovieCardComponent, CommonModule, MovieListComponent, DurationPipe]
})
export class MovieDetailsPageComponent implements OnInit {

  movies = [...nowPlayingMovies, ...popularMovies, ...topRatedMovies, ...upcomingMovies];


    movie: any;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam;
      this.movie = this.movies.find(movie => movie.id === id);
    }
  }
}