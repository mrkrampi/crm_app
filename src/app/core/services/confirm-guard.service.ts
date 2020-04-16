import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { first, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmGuardService implements CanActivate {

  constructor(private router: Router,
              private functions: AngularFireFunctions) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const {id: inviteId} = route.queryParams;
    const checkInviteFunction = this.functions.httpsCallable('inviteExisting');

    return checkInviteFunction({inviteId})
      .pipe(
        first(),
        tap(async result => {
          if (!result) {
            await this.router.navigate(['/login']);
          }
        })
      );
  }
}
