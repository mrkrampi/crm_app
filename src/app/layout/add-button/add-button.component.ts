import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDialogComponent } from '../users/user-dialog/user-dialog.component';
import { User } from '../../core/models/user.model';
import { MatDialog } from '@angular/material';
import { UsersService } from '../../core/services/users.service';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { UpdateService } from '../../core/services/update.service';
import { AuthService } from '../../core/services/auth.service';
import { UserToken } from '../../core/models/user-token.model';
import { StatusDialogComponent } from '../../statuses/status-dialog/status-dialog.component';
import { Status } from '../../core/models/status.model';
import { StatusService } from '../../core/services/status.service';
import { LeadDialogComponent } from '../lead/lead-dialog/lead-dialog.component';
import { Lead } from '../../core/models/lead.model';
import { LeadsService } from '../../core/services/leads.service';
import { SpinnerService } from '../../core/services/spinner.service';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {
  canAdd: boolean;

  constructor(private router: Router,
              private dialog: MatDialog,
              private snackbar: SnackBarService,
              private userService: UsersService,
              private updateService: UpdateService,
              private statusService: StatusService,
              private leadService: LeadsService,
              private auth: AuthService,
              private spinnerService: SpinnerService) {
    this.auth.currentUser$
      .subscribe((user: UserToken) => {
        this.canAdd = user && user.isAdmin;
      });
  }

  callDialog(): void {
    if (this.canAdd) {
      const {url} = this.router;
      switch (url) {
        case '/users':
          this.addUser();
          break;
        case '/status':
          this.addStatus();
          break;
        default:
          this.addLead();
          break;
      }
    }
  };

  updateTable(): void {
    const {url} = this.router;
    this.updateService.next(url);
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '530px',
      height: '380px',
      panelClass: 'app-full-bleed-dialog',
    });
    dialogRef.afterClosed().subscribe(async (newUser: User) => {
      if (newUser) {
        this.spinnerService.next(true);
        const result = await this.userService.addUser(newUser);
        this.snackbar.showSnackbar(result.msg);
        this.updateTable();
      }
    });
  }

  addStatus(): void {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '530px',
      height: '300px',
      panelClass: 'app-full-bleed-dialog',
      data: {status}
    });

    dialogRef.afterClosed().subscribe(async (addedStatus: Status) => {
      if (addedStatus) {
        this.spinnerService.next(true);
        const result = await this.statusService.addStatus(addedStatus);
        this.snackbar.showSnackbar(result.msg);
        this.updateTable();
      }
    });
  }

  addLead(): void {
    const dialogRef = this.dialog.open(LeadDialogComponent, {
      width: '530px',
      height: '540px',
      panelClass: 'app-full-bleed-dialog',
    });
    dialogRef.afterClosed().subscribe(async (newLead: Lead) => {
      if (newLead) {
        this.spinnerService.next(true);
        const result = await this.leadService.addLead(newLead);
        this.snackbar.showSnackbar(result.msg);
        this.updateTable();
      }
    });
  }
}
