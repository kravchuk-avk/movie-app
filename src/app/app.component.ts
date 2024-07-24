import { Component, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopularPageComponent } from './pages/popular-page/popular-page.component';
import { HeaderComponent } from './components/header/header.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieFavoritesPageComponent } from './pages/movie-favorites-page/movie-favorites-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MovieService } from './services/movie/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    PopularPageComponent,
    CommonModule,
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MovieFavoritesPageComponent,
    MovieCardComponent,
    SidebarComponent,
    HeaderComponent,
  ],
})
export class AppComponent implements OnInit {
  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getMovies();
  }
  title = 'first';
}
