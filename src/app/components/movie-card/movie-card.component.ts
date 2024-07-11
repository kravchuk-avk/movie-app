import { CommonModule } from '@angular/common';
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
    imports: [CommonModule, DurationPipe, CardModule, ButtonModule, RouterLink]
})
export class MovieCardComponent {

  // redirectToDetailsPage(arg0: string) {
  //   throw new Error('Method not implemented.');
  // }

  @Input() movie: any;
  @Input() isFavorite: boolean = false;
  @Input() isInWatchList: boolean = false;
  @Output() addFavorites = new EventEmitter<any>();
  @Output() addWatchList = new EventEmitter<any>();


// ngOnInit() {
//       this.movie = this.movie
//    }

  addToFavorites() {
    this.addFavorites.emit(this.movie.id);
  }

  addToWatchList() {
    this.addWatchList.emit(this.movie.id);
  }
}