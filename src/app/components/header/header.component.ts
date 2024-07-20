import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomRoute } from '../../models/custom-route.interface';
import { RouteService } from '../../services/route/route.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // protected readonly headerLinks = headerLinks;
  headerLinks: CustomRoute[] = [];

  constructor(private routeService: RouteService) {}

  ngOnInit() {
    this.headerLinks = this.routeService.getHeaderLinks();
    console.log(this.headerLinks);
  }

  trackByRoutePath(index: number, link: CustomRoute): string {
    return link.routePath;
  }
}
