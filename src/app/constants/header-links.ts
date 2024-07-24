import { RoutePaths } from './route-paths.enum';
import { CustomRoute } from '../models/custom-route.interface';

export const headerLinks: CustomRoute[] = [
  {
    routeName: 'Favorites',
    routePath: RoutePaths.FAVORITES,
    routeIcon: 'icon-heart',
  },
  {
    routeName: 'WatchList',
    routePath: RoutePaths.WATCH_LATER,
    routeIcon: 'icon-clock',
  },
];
