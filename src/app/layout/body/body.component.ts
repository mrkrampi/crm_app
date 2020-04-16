import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {

  constructor(private auth: AuthService) { }

  async logOut(): Promise<void> {
    await this.auth.signOut();
  }
}
