import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CustomRoute } from '../../models/custom-route.interface';
import { sidebarLinks } from '../../constants/sidebar-links';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  sidebarVisible: boolean = true;
  sidebarLinks = sidebarLinks;
  // sidebarLinks: CustomRoute[] = [];

  // constructor(private routeService: RouteService) {}

  // ngOnInit() {
  //   this.sidebarLinks = this.routeService.getSidebarLinks();
  //   console.log(this.sidebarLinks);
  // }

  showSidebar() {
    this.sidebarVisible = true;
  }

  trackByRoutePath(index: number, link: CustomRoute): string {
    return link.routePath;
  }
}
