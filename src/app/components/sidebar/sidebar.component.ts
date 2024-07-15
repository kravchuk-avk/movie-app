import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  sidebarVisible: boolean = true;

  sidebarLinks: { routePath: string; routeName: string }[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.sidebarLinks = this.router.config
      .filter((route) => route.data && route.data['label'])
      .map((route) => ({
        routePath: route.path || '',
        routeName: route.data!['label'],
      }));
  }

  showSidebar() {
    this.sidebarVisible = true;
  }
}
