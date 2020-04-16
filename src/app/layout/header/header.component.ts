import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Input() sidenav: MatSidenav;
  pageName: string;

  constructor(private router: Router) {
    this.changeName(this.router.url);
  }

  changeName(url: string): void {
    switch (url) {
      case '/profile':
        this.pageName = 'Profile';
        break;
      case '/users':
        this.pageName = 'Users';
        break;
      case '/status':
        this.pageName = 'Status';
        break;
      case '/':
        this.pageName = 'Leads';
        break;
      default:
        this.pageName = 'CRM';
    }
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.changeName(event.url);
    });
  }

  ngOnDestroy(): void {
  }
}
