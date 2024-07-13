import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DurationPipe } from '../../pipes/duration/duration.pipe';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  imports: [CommonModule, DurationPipe, CardModule, ButtonModule, RouterLink],
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Input() isFavorite: boolean = false;
  @Input() isInWatchList: boolean = false;
  @Output() addFavorites = new EventEmitter<number>();
  @Output() addWatchList = new EventEmitter<number>();

  addToFavorites() {
    this.addFavorites.emit(this.movie.id);
  }

  addToWatchList() {
    this.addWatchList.emit(this.movie.id);
  }
}
