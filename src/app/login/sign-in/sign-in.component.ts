import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;

  constructor(private builder: FormBuilder,
              private auth: AuthService,
              private title: Title) {
    this.loginForm = builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    title.setTitle('Log in');
  }

  ngOnInit() {
  }

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  async signIn() {
    // Email: example@gmail.com | Password: password
    await this.auth.login(this.email.value, this.password.value);
  }
}
