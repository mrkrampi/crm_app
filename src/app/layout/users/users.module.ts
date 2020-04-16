import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersTableComponent } from './users-table/users-table.component';
import { AppMaterialModule } from '../../core/modules/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersTableComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule
  ],
})
export class UsersModule { }
