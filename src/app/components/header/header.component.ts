import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, ButtonModule, MovieCardComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() favoriteMovieIds: string[] = [];
  @Input() watchLaterMovieIds: string[] = [];

  constructor(private router: Router) {}

  navigateWithData(data: string[], favorite?: string) {
    const dataString = JSON.stringify(data);
    const path = favorite ? 'favorite' : 'watch-list';

    this.router.navigate([{ outlets: { header: [path] } }], {
      queryParams: { data: dataString },
    });
  }
}
