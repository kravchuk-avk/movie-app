import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsPageComponent } from './pages/movie-details-page/movie-details-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NowPlayingPageComponent } from './pages/now-playing-page/now-playing-page.component';
import { PopularPageComponent } from './pages/popular-page/popular-page.component';
import { TopRatePageComponent } from './pages/top-rate-page/top-rate-page.component';
import { UpcomingPageComponent } from './pages/upcoming-page/upcoming-page.component';
import { MovieWatchListPageComponent } from './pages/movie-watch-list-page/movie-watch-list-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MovieGuard } from './guards/movie.guard';
import { MovieFavoritesPageComponent } from './pages/movie-favorites-page/movie-favorites-page.component';
import { NgModule } from '@angular/core';

// import { MovieResolver } from "./resolver/movie-resolver";

export const routes: Routes = [
  { path: 'movie/:id', component: MovieDetailsPageComponent},

  { path: 'home', canActivate: [MovieGuard], component: HomePageComponent},
  { path: 'now-playing', component: NowPlayingPageComponent, data: { label: 'Now Playing' } },
  { path: 'popular', component: PopularPageComponent, data: { label: 'Popular' }  },
  { path: 'top-rate', component: TopRatePageComponent, data: { label: 'Top Rate' } },
  { path: 'upcoming', component: UpcomingPageComponent , data: { label: 'Upcoming' } },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  { path: 'favorite', component: MovieFavoritesPageComponent, data: { label: 'Favorites' }, outlet: 'header' },
  { path: 'watch-list', component: MovieWatchListPageComponent, data: { label: 'WatchList' }, outlet: 'header' },
];

// resolve: {data: MovieResolver},

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}