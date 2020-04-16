import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ImageCropperResult, NgxCropperjsComponent } from 'ngx-cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageCropperComponent {
  imageSource: string | ArrayBuffer;
  @ViewChild('angularCropper', {static: false}) public angularCropper: NgxCropperjsComponent;

  options = {
    zoomable: true,
    aspectRatio: 1
  };

  constructor(readonly dialogRef: MatDialogRef<ImageCropperComponent>,
              @Inject(MAT_DIALOG_DATA) private readonly data: any) {
    this.imageSource = this.data && this.data.imageURL || null;
  }

  saveCanvas() {
    this.angularCropper.exportCanvas();
  }

  saveCropped(cropped: ImageCropperResult) {
    this.dialogRef.close(cropped.blob);
  }
}
