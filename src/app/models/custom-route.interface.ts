import { Route } from '@angular/router';

export interface CustomRoute extends Route {
  routeName: string;
  routePath: string;
  routeIcon?: string;
}
