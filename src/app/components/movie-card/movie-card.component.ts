import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DurationPipe } from '../../pipe/duration/duration.pipe';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    templateUrl: './movie-card.component.html',
    styleUrl: './movie-card.component.scss',
    imports: [CommonModule, DurationPipe, CardModule, ButtonModule]
})
export class MovieCardComponent {
  @Input() movie: any;
  @Input() isFavorite: boolean = false;
  @Input() isInWatchList: boolean = false;
  @Output() addFavorites = new EventEmitter<void>();
  @Output() addWatchList = new EventEmitter<void>();

  addToFavorites() {
    this.addFavorites.emit(this.movie.title);
  }

  addToWatchList() {
    this.addWatchList.emit(this.movie.title);
  }
}