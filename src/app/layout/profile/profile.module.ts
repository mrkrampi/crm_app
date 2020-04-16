import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { EditPasswordDialogComponent } from './edit-password-dialog/edit-password-dialog.component';
import { AppMaterialModule } from '../../core/modules/app-material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { NgxCropperjsModule } from 'ngx-cropperjs';

@NgModule({
  declarations: [ProfilePageComponent, EditProfileDialogComponent, EditPasswordDialogComponent, ImageCropperComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    NgxCropperjsModule
  ],
  entryComponents: [EditPasswordDialogComponent, EditProfileDialogComponent, ImageCropperComponent]
})
export class ProfileModule { }
