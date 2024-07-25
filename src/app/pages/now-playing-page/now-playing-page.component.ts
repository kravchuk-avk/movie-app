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

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getNowPlayingMovies().subscribe((movies) => {
      this.movies = movies;
    });
  }

  trackByMovieId(index: number, item: Movie): number {
    return item.id;
  }
}
