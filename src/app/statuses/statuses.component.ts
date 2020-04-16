import { Component, OnDestroy } from '@angular/core';
import { Status } from '../core/models/status.model';
import { debounceTime, distinctUntilChanged, finalize, first, take } from 'rxjs/operators';
import { StatusService } from '../core/services/status.service';
import { AuthService } from '../core/services/auth.service';
import { SnackBarService } from '../core/services/snack-bar.service';
import { UpdateService } from '../core/services/update.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../core/services/spinner.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '../core/services/search.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrls: ['./statuses.component.scss']
})
export class StatusesComponent implements OnDestroy {
  displayedColumns: string[] = ['name', 'description', 'delete'];
  dataSource: Status[];
  private subscription$: Subscription = new Subscription();
  searchField = new FormControl();

  constructor(private statusService: StatusService,
              private auth: AuthService,
              private snackbar: SnackBarService,
              private updateService: UpdateService,
              private spinnerService: SpinnerService,
              private searchService: SearchService,
              private title: Title) {
    this.subscription$.add(
      this.updateService.shouldUpdate$
        .subscribe(({tableToUpdate}) => {
          if (tableToUpdate === '/status') {
            this.loadStatus();
          }
        })
    );
    this.title.setTitle('Status');
  }

  ngOnInit() {
    this.loadStatus();

    this.subscription$.add(
      this.searchField.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((val: string) => {
          if (val.trim() === '') {
            this.loadStatus();
          } else {
            this.search(val);
          }
        })
    );
  }

  loadStatus(): void {
    this.spinnerService.next(true);
    this.statusService.getStatus()
      .pipe(
        first(),
        finalize(() => this.spinnerService.next(false))
      )
      .subscribe(status => this.dataSource = status);
  }

  deleteStatus(uid: string): void {
    this.spinnerService.next(true);
    this.statusService.deleteStatus(uid)
      .pipe(take(1))
      .subscribe(response => {
        this.snackbar.showSnackbar(response.msg);
        this.loadStatus();
      });
  }

  search(value: string): void {
    this.searchService.statusSearch(value)
      .subscribe((statuses: Status[]) => this.dataSource = statuses);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
