import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PopularPageComponent } from './pages/popular-page/popular-page.component';
import { HeaderComponent } from './components/header/header.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieFavoritesPageComponent } from './pages/movie-favorites-page/movie-favorites-page.component';

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
    MovieListComponent,
    SidebarComponent,
    HeaderComponent,
  ],
})
export class AppComponent {}
