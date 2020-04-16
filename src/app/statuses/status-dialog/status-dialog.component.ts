import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {
  statusForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<StatusDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: any,
              private fb: FormBuilder) {
    this.data = this.data || {}
  }

  ngOnInit() {
    this.statusForm = this.fb.group({
      name: [this.status && this.status.name || '', Validators.required],
      description: [this.status && this.status.description || '', Validators.required]
    });
  }

  get status() {
    return this.data.user;
  }

  cancelDialog() {
    this.dialogRef.close(null);
  }

  saveStatus() {
    if (this.statusForm.valid) {
      const uid = this.status && this.status.uid || '';
      this.dialogRef.close({uid, ...this.statusForm.value});
    }
  }
}
