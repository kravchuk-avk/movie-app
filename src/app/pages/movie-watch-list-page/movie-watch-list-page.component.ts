import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component, OnInit } from '@angular/core';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-movie-watch-list-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-watch-list-page.component.html',
  styleUrl: './movie-watch-list-page.component.scss',
})
export class MovieWatchListPageComponent implements OnInit {
  watchLaterMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {}

  ngOnInit() {
    this.watchLaterMovies = this.movieService.getWatchLaterMovies();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
