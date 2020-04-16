import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role } from '../../../core/models/role';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  userForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditProfileDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: any,
              private fb: FormBuilder) {
    this.data = this.data || {};
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      firstName: [this.user && this.user.firstName || '', [Validators.required, Validators.maxLength(12)]],
      lastName: [this.user && this.user.lastName || '', [Validators.required, Validators.maxLength(12)]],
      email: [this.user && this.user.email || '', Validators.compose([Validators.required, Validators.email])]
    });
  }

  get user(): User {
    return this.data.user;
  }

  cancelDialog() {
    this.dialogRef.close(null);
  }

  saveUser() {
    if (this.userForm.valid) {
      const {uid, status, role} = this.user;
      const firstName = this.userForm.get('firstName').value.trim();
      const lastName = this.userForm.get('lastName').value.trim();
      const email = this.userForm.get('email').value.trim();
      this.dialogRef.close({uid, role, status, firstName, lastName, email});
    }
  }
}
