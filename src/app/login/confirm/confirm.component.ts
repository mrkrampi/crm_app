import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  passwordForm: FormGroup;
  hidePassword = true;
  passwordFieldType = 'password';

  constructor(private builder: FormBuilder,
              private auth: AuthService,
              private title: Title) {
    this.passwordForm = builder.group({
      password: ['', [Validators.required]],
      repeatPassword: ['', Validators.required]
    }, {validators: this.checkPasswords});
    title.setTitle('Confirm invite')
  }

  ngOnInit() {
  }

  get password(): AbstractControl {
    return this.passwordForm.get('password');
  }

  get repeatPassword(): AbstractControl {
    return this.passwordForm.get('repeatPassword');
  }

  confirmUser(): void {
    this.auth.confirmUser(this.password.value);
  }

  showOrHidePassword() {
    this.passwordFieldType = this.passwordFieldType === 'text' ? 'password' : 'text';
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password');
    const repeatPassword = group.get('repeatPassword');

    if (password.value !== repeatPassword.value) {
      repeatPassword.setErrors({notSame: true});
    } else {
      repeatPassword.setErrors(null);
    }
  }
}
