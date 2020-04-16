import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services/users.service';
import { finalize, first } from 'rxjs/operators';
import { MatDialog, MatSidenavContainer, MatSidenavContent } from '@angular/material';
import { EditProfileDialogComponent } from '../edit-profile-dialog/edit-profile-dialog.component';
import { EditPasswordDialogComponent } from '../edit-password-dialog/edit-password-dialog.component';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { SpinnerService } from '../../../core/services/spinner.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserToken } from '../../../core/models/user-token.model';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  user: User;
  currentUser: UserToken;
  subscription: Subscription;
  @ViewChild('file', {static: true}) filee: ElementRef;

  constructor(private userService: UsersService,
              private dialog: MatDialog,
              private spinnerService: SpinnerService,
              private snackbar: SnackBarService,
              private auth: AuthService,
              private title: Title) {
    title.setTitle('Profile');
  }

  ngOnInit() {
    this.spinnerService.next(true);
    this.subscription = this.auth.currentUser$
      .subscribe((currentUser: UserToken) => this.currentUser = currentUser);

    this.userService.getCurrentUser()
      .pipe(
        first(),
        finalize(() => this.spinnerService.next(false))
      )
      .subscribe((currentUser: User) => this.user = currentUser);

    this.filee.nativeElement.onclick = this.suka;
  }

  editUser(): void {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '530px',
      height: '380px',
      panelClass: 'app-full-bleed-dialog',
      data: {user: this.user}
    });
    dialogRef.afterClosed().subscribe(async (editedUser: User) => {
      if (editedUser) {
        this.spinnerService.next(true);
        await this.userService.editCurrentUser(editedUser);
        this.user = editedUser;
        this.snackbar.showSnackbar('User successfully edited');
        this.spinnerService.next(false);
      }
    });
  }

  changePassword(): void {
   this.dialog.open(EditPasswordDialogComponent, {
      width: '430px',
      height: '350px',
      panelClass: 'app-full-bleed-dialog'
    });
  }

  suka() {
  }

  roar()
  {
    if(this.filee.nativeElement.value.length) alert('ROAR! FILES!')
    else alert('*empty wheeze*')
    document.body.onfocus = null
    console.log('depleted')
  }

  async loadImage(image: File): Promise<void> {
    console.log('hut');
    if (this.checkExtension(image.name)) {
      if (!image) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageURL = reader.result;
          const dialogRef = this.dialog.open(ImageCropperComponent, {
            width: '700px',
            height: '580px',
            panelClass: 'app-full-bleed-dialog',
            data: {imageURL}
          });

          dialogRef.afterClosed().subscribe(async (blob: Blob) => {
            if (blob) {
              this.spinnerService.next(true);
              await this.auth.changeProfileImage(blob);
              this.spinnerService.next(false);
            }
          });
        };

        reader.readAsDataURL(image);
      }
    } else {
      this.snackbar.showSnackbar('Bad image');
    }
  }

  checkExtension(fileName: string): boolean {
    const extensions = ['jpg', 'gif', 'png', 'jpeg', 'bmp'];

    const parts = fileName.split('.');
    const extension = parts[parts.length - 1];
    return extensions.indexOf(extension) !== -1;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
