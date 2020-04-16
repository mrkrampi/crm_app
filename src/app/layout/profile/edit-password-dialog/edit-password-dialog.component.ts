import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-edit-password-dialog',
  templateUrl: './edit-password-dialog.component.html',
  styleUrls: ['./edit-password-dialog.component.scss']
})
export class EditPasswordDialogComponent implements OnInit {
  passwordForm: FormGroup;
  hidePassword = true;
  passwordFieldType = 'password';

  constructor(private auth: AuthService,
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<EditPasswordDialogComponent>) {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required]
    }, {validators: this.checkPasswords});
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  async updatePassword() {
    if (this.passwordForm.valid) {
      await this.auth.changePassword(this.passwordForm.get('password').value);
      this.closeDialog();
    }
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
