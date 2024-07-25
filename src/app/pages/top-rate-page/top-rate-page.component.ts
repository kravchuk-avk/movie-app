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

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getTopRatedMovies().subscribe((movies) => {
      this.movies = movies;
    });
  }

  trackByMovieId(index: number, item: Movie): number {
    return item.id;
  }
}
