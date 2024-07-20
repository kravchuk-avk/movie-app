import { Routes } from '@angular/router';
import { RoutePaths } from './constants/route-paths.enum';
import { MovieGuard } from './guards/movie.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NowPlayingPageComponent } from './pages/now-playing-page/now-playing-page.component';
import { PopularPageComponent } from './pages/popular-page/popular-page.component';
import { TopRatePageComponent } from './pages/top-rate-page/top-rate-page.component';
import { UpcomingPageComponent } from './pages/upcoming-page/upcoming-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { MovieDetailsPageComponent } from './pages/movie-details-page/movie-details-page.component';
import { MovieFavoritesPageComponent } from './pages/movie-favorites-page/movie-favorites-page.component';
import { MovieWatchListPageComponent } from './pages/movie-watch-list-page/movie-watch-list-page.component';
// import { MovieResolver } from "./resolver/movie-resolver";
export const routes: Routes = [
  {
    path: RoutePaths.DEFAULT,
    component: HomePageComponent,
    canActivate: [MovieGuard],
  },
  { path: RoutePaths.NOW_PLAYING, component: NowPlayingPageComponent },
  { path: RoutePaths.POPULAR, component: PopularPageComponent },
  { path: RoutePaths.TOP_RATE, component: TopRatePageComponent },
  { path: RoutePaths.UPCOMING, component: UpcomingPageComponent },
  { path: RoutePaths.MOVIE_ID, component: MovieDetailsPageComponent },
  { path: RoutePaths.FAVORITES, component: MovieFavoritesPageComponent },
  { path: RoutePaths.WATCH_LATER, component: MovieWatchListPageComponent },
  { path: RoutePaths.NOT_FOUND, component: NotFoundPageComponent },
  // outlet: 'header',
];
// resolve: {data: MovieResolver}
