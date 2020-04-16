import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusesRoutingModule } from './statuses-routing.module';
import { StatusesComponent } from './statuses.component';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [StatusesComponent],
  imports: [
    CommonModule,
    StatusesRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ]
})
export class StatusesModule { }
