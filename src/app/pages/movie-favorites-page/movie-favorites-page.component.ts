import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { HeaderComponent } from '../../components/header/header.component';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../services/movie/movie.service';

@Component({
  selector: 'app-movie-favorites-page',
  standalone: true,
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
  templateUrl: './movie-favorites-page.component.html',
  styleUrls: ['./movie-favorites-page.component.scss'],
})
export class MovieFavoritesPageComponent implements OnInit {
  favoriteMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
  ) {}

  ngOnInit() {
    this.favoriteMovies = this.movieService.getFavoriteMovies();
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}
