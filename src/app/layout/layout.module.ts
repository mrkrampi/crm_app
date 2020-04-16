import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BodyComponent } from './body/body.component';

import { LayoutRoutingModule } from './layout-routing.module';
import { UserDialogComponent } from './users/user-dialog/user-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../core/modules/app-material.module';
import { AddButtonComponent } from './add-button/add-button.component';
import { UserPopupComponent } from './user-popup/user-popup.component';
import { StatusDialogComponent } from '../statuses/status-dialog/status-dialog.component';
import { LeadDialogComponent } from './lead/lead-dialog/lead-dialog.component';
import { SpinnerComponent } from '../spinner/spinner.component';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    BodyComponent,
    UserDialogComponent,
    AddButtonComponent,
    UserPopupComponent,
    StatusDialogComponent,
    LeadDialogComponent,
    SpinnerComponent
  ],
  entryComponents: [UserDialogComponent, StatusDialogComponent, LeadDialogComponent]
})
export class LayoutModule {
}
