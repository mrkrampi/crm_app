import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadRoutingModule } from './lead-routing.module';
import { LeadsTableComponent } from './leads-table/leads-table.component';
import { AppMaterialModule } from '../../core/modules/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [LeadsTableComponent],
  imports: [
    CommonModule,
    LeadRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    MatCardModule
  ],
})
export class LeadModule { }
