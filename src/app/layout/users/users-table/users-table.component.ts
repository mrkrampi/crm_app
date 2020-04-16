import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { debounceTime, distinctUntilChanged, finalize, first } from 'rxjs/operators';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog, PageEvent, Sort } from '@angular/material';
import { FirebaseResponse } from '../../../core/models/response.model';
import { UserToken } from '../../../core/models/user-token.model';
import { Subscription } from 'rxjs';
import { UpdateService } from '../../../core/services/update.service';
import { StatusService } from '../../../core/services/status.service';
import { PaginationData } from '../../../core/models/get-data.model';
import { PaginationResponse } from '../../../core/models/pagination-response.model';
import { SpinnerService } from '../../../core/services/spinner.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['firstName', 'email', 'role', 'status', 'actions'];
  users: User[];
  showMenu: boolean;
  subscription$: Subscription = new Subscription();
  collectionSize: number;
  options = new PaginationData();
  searchField = new FormControl();

  constructor(private userService: UsersService,
              private auth: AuthService,
              private snackbar: SnackBarService,
              private dialog: MatDialog,
              private updateService: UpdateService,
              private statusService: StatusService,
              private spinnerService: SpinnerService,
              private searchService: SearchService,
              private title: Title) {
    this.subscription$.add(
      this.updateService.shouldUpdate$
        .subscribe(({tableToUpdate}) => {
          if (tableToUpdate === '/users') {
            this.loadUsers();
          }
        })
    );
    title.setTitle('Users');
  }

  ngOnInit() {
    this.loadUsers();
    this.auth.currentUser$
      .subscribe((user: UserToken) => {
        this.showMenu = user && user.isAdmin;
      });

    this.subscription$.add(
      this.searchField.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((val: string) => {
          if (val.trim() === '') {
            this.loadUsers();
          } else {
            this.search(val);
          }
        })
    );
  }

  loadUsers(): void {
    this.spinnerService.next(true);
    this.userService.getUsers({
      ...this.options
    })
      .pipe(
        first(),
        finalize(() => this.spinnerService.next(false))
      )
      .subscribe((response: PaginationResponse<User>) => {
        this.users = response.data;
        this.collectionSize = response.collectionSize;
      });
  }

  deleteUser(uid: string): void {
    this.spinnerService.next(true);
    this.userService.deleteUser(uid)
      .pipe(first())
      .subscribe((response: FirebaseResponse) => {
          this.snackbar.showSnackbar(response.msg);
          this.loadUsers();
        },
        err => {
          this.snackbar.showSnackbar(err.message);
          this.spinnerService.next(false);
        });
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '530px',
      height: '380px',
      panelClass: 'app-full-bleed-dialog',
      data: {user}
    });
    dialogRef.afterClosed().subscribe(async (editedUser: User) => {
      if (editedUser) {
        this.spinnerService.next(true);
        const result = await this.userService.editUser(editedUser);
        this.loadUsers();
        this.snackbar.showSnackbar(result.msg);
      }
    });
  }

  sortData(sortOptions: Sort): void {
    this.options.sortField = sortOptions.active;
    this.options.sortDirection = sortOptions.direction;
    this.loadUsers();
  }

  changePage(pageOptions: PageEvent) {
    this.options.page = pageOptions.pageIndex;
    this.options.countOfElements = pageOptions.pageSize;
    this.loadUsers();
  }

  changeStatus(status: string, uid: string) {
    this.spinnerService.next(true);
    this.userService.changeStatus(status, uid)
      .pipe(
        first(),
        finalize(() => this.spinnerService.next(false))
      )
      .subscribe((response: FirebaseResponse) => {
        this.snackbar.showSnackbar(response.msg);
      });
  }

  search(value: string): void {
    this.searchService.userSearch(value)
      .subscribe((users: User[]) => this.users = users);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
