import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;

  constructor(private builder: FormBuilder,
              private authService: AuthService,
              private title: Title) {
    this.resetForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    title.setTitle('Forgot password');
  }

  get email(): AbstractControl {
    return this.resetForm.get('email');
  }

  async sendResetLink(): Promise<void> {
    await this.authService.sendResetLink(this.email.value);
  }
}
