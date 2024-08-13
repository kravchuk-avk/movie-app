import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MovieDetails } from '../../models/movie-details.interface';
import { movieDetailsActions } from '../../store/actions';
import { selectMovieDetails } from '../../store/selectors';

@Component({
  selector: 'app-movie-details-page',
  standalone: true,
  templateUrl: './movie-details-page.component.html',
  styleUrls: ['./movie-details-page.component.scss'],
  imports: [HeaderComponent, MovieCardComponent, CommonModule, DurationPipe],
})
export class MovieDetailsPageComponent implements OnInit {
  movie$: Observable<MovieDetails | null>;
  public favoriteMovieListIds: string[] = [];
  public watchLaterMovieListIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    this.movie$ = this.store.select(selectMovieDetails);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const id = +idParam;
      this.store.dispatch(movieDetailsActions.load({ movieId: id }));
    }
  }
}
