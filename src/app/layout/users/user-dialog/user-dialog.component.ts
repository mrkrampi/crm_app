import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../core/models/role';
import { validateForWhiteSpace } from '../../../core/validators/white-space-validator';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  roles = Object.keys(Role);
  roleName = Role;

  constructor(private dialogRef: MatDialogRef<UserDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: any,
              private fb: FormBuilder) {
    this.data = this.data || {};
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: [this.user && this.user.firstName || '', [Validators.required, Validators.maxLength(12), validateForWhiteSpace]],
      lastName: [this.user && this.user.lastName || '', [Validators.required, Validators.maxLength(12), validateForWhiteSpace]],
      email: [this.user && this.user.email || '', Validators.compose([Validators.required, Validators.email])],
      role: [this.user && this.user.role || Role.admin, Validators.required]
    });
  }

  get user() {
    return this.data.user;
  }

  cancelDialog() {
    this.dialogRef.close(null);
  }

  saveUser() {
    if (this.userForm.valid) {
      const uid = this.user && this.user.uid || '';
      const status = this.user && this.user.status || '';
      this.dialogRef.close({uid, status, ...this.userForm.value});
    }
  }
}
