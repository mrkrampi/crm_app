import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    return route.routeConfig.path.indexOf('login') !== -1
      ? this.loginGuard() : this.pagesGuard();
  }

  async loginGuard(): Promise<boolean> {
    const isLoggedIn = await this.auth.isAuthenticated();
    if (isLoggedIn) {
      await this.router.navigate(['']);
      return false;
    }
    return true;
  }

  async pagesGuard(): Promise<boolean> {
    const isLoggedIn = await this.auth.isAuthenticated();
    if (!isLoggedIn) {
      await this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
