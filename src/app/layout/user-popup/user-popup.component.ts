import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserToken } from '../../core/models/user-token.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrls: ['./user-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserPopupComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  currentUser: UserToken;

  constructor(private authService: AuthService) {
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$
      .subscribe((currentUser: UserToken) => this.currentUser = currentUser)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
