import { Injectable } from '@angular/core';
import { headerLinks } from '../../constants/header-links';
import { sidebarLinks } from '../../constants/sidebar-links';
import { CustomRoute } from '../../models/custom-route.interface';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  getSidebarLinks(): CustomRoute[] {
    return sidebarLinks;
  }

  getHeaderLinks(): CustomRoute[] {
    return headerLinks;
  }
}
