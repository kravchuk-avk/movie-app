import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-popular-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule],
  templateUrl: './popular-page.component.html',
  styleUrls: ['./popular-page.component.scss'],
})
export class PopularPageComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
      },
      error: (err) => {
        console.error('Error fetching popular movies', err);
      },
    });
  }

  trackByMovieId(index: number, item: Movie): number {
    return item.id;
  }
}
