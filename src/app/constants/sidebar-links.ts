import { RoutePaths } from './route-paths.enum';
import { CustomRoute } from '../models/custom-route.interface';

export const sidebarLinks: CustomRoute[] = [
  {
    routeName: 'NowPlaying',
    routePath: RoutePaths.NOW_PLAYING,
  },
  {
    routeName: 'Popular',
    routePath: RoutePaths.POPULAR,
  },
  {
    routeName: 'TopRate',
    routePath: RoutePaths.TOP_RATE,
  },
  {
    routeName: 'Upcoming',
    routePath: RoutePaths.UPCOMING,
  },
];
