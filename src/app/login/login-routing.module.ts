import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmGuardService } from '../core/services/confirm-guard.service';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        component: SignInComponent
      },
      {
        path: 'confirm',
        component: ConfirmComponent,
        canActivate: [ConfirmGuardService]
      },
      {
        path: 'forgot',
        component: ForgotPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
