import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { validateForWhiteSpace } from '../../../core/validators/white-space-validator';
import { Status } from '../../../core/models/status.model';
import { StatusService } from '../../../core/services/status.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-lead-dialog',
  templateUrl: './lead-dialog.component.html',
  styleUrls: ['./lead-dialog.component.scss']
})
export class LeadDialogComponent implements OnInit {
  leadForm: FormGroup;
  statuses: Status[];

  constructor(private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private readonly data: any,
              private dialogRef: MatDialogRef<LeadDialogComponent>,
              private statusService: StatusService) {
    this.data = this.data || {};
    this.statusService.getStatus()
      .pipe(first())
      .subscribe((statuses: Status[]) => this.statuses = statuses);
  }

  ngOnInit() {
    this.leadForm = this.fb.group({
      firstName: [this.lead && this.lead.firstName || '', [Validators.required, Validators.maxLength(15), validateForWhiteSpace]],
      lastName: [this.lead && this.lead.lastName || '', [Validators.required, Validators.maxLength(15), validateForWhiteSpace]],
      company: [this.lead && this.lead.company || '', [Validators.required, validateForWhiteSpace]],
      position: [this.lead && this.lead.position || '', [Validators.required, validateForWhiteSpace]],
      source: [this.lead && this.lead.source || '', [Validators.required, validateForWhiteSpace]],
      status: [this.lead && this.lead.status || '', [Validators.required, validateForWhiteSpace]],
      email: [this.lead && this.lead.email || '', [Validators.required, Validators.email]],
      comment: [this.lead && this.lead.comment || '']
    });
  }

  get lead() {
    return this.data.lead;
  }

  cancelDialog(): void {
    this.dialogRef.close(null);
  }

  addLead(): void {
    if (this.leadForm.valid) {
      const firstName = this.leadForm.get('firstName').value.trim();
      const lastName = this.leadForm.get('lastName').value.trim();
      const email = this.leadForm.get('email').value.trim();
      const company = this.leadForm.get('company').value.trim();
      const position = this.leadForm.get('position').value.trim();
      const source = this.leadForm.get('source').value.trim();
      const status = this.leadForm.get('status').value;
      const comment = this.leadForm.get('comment').value.trim();
      this.dialogRef.close({
        firstName,
        lastName,
        company,
        position,
        source,
        status,
        email,
        comment
      });
    }
  }
}
