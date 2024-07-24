import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomRoute } from '../../models/custom-route.interface';
import { headerLinks } from '../../constants/header-links';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  headerLinks = headerLinks;
  // protected readonly headerLinks = headerLinks;
  // headerLinks: CustomRoute[] = [];

  // constructor(private routeService: RouteService) {}

  // ngOnInit() {
  //   this.headerLinks = this.routeService.getHeaderLinks();
  //   console.log(this.headerLinks);
  // }

  trackByRoutePath(index: number, link: CustomRoute): string {
    return link.routePath;
  }
}
