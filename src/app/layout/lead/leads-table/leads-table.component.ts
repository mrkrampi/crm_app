import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { MatDialog, PageEvent, Sort } from '@angular/material';
import { UpdateService } from '../../../core/services/update.service';
import { Lead } from '../../../core/models/lead.model';
import { UserToken } from '../../../core/models/user-token.model';
import { LeadsService } from '../../../core/services/leads.service';
import { debounceTime, distinctUntilChanged, finalize, first } from 'rxjs/operators';
import { FirebaseResponse } from '../../../core/models/response.model';
import { PaginationData } from '../../../core/models/get-data.model';
import { LeadDialogComponent } from '../lead-dialog/lead-dialog.component';
import { PaginationResponse } from '../../../core/models/pagination-response.model';
import { SpinnerService } from '../../../core/services/spinner.service';
import { FormControl } from '@angular/forms';
import { SearchService } from '../../../core/services/search.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-leads-table',
  templateUrl: './leads-table.component.html',
  styleUrls: ['./leads-table.component.scss']
})
export class LeadsTableComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['firstName', 'company', 'position', 'source', 'status', 'email', 'comment', 'followUpDate', 'actions'];
  leads: Lead[];
  showMenu: boolean;
  subscription$: Subscription = new Subscription();
  collectionSize: number;
  options = new PaginationData();
  searchField = new FormControl();

  constructor(private leadsService: LeadsService,
              private auth: AuthService,
              private snackbar: SnackBarService,
              private dialog: MatDialog,
              private updateService: UpdateService,
              private spinnerService: SpinnerService,
              private searchService: SearchService,
              private title: Title) {
    this.subscription$.add(
      this.updateService.shouldUpdate$
      .subscribe(({tableToUpdate}) => {
        if (tableToUpdate === '/') {
          this.loadLeads();
        }
      })
    );
    title.setTitle('Leads');
  }

  ngOnInit() {
    this.loadLeads();
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
            this.loadLeads();
          } else {
            this.search(val);
          }
        })
    );
  }

  loadLeads(): void {
    this.spinnerService.next(true);
    this.leadsService.getLeads({
      ...this.options
    })
      .pipe(
        first(),
        finalize(() => this.spinnerService.next(false))
      )
      .subscribe((response: PaginationResponse<Lead>) => {
        this.leads = response.data;
        this.collectionSize = response.collectionSize;
      });
  }

  editLead(lead: Lead): void {
    const dialogRef = this.dialog.open(LeadDialogComponent, {
      width: '530px',
      height: '550px',
      panelClass: 'app-full-bleed-dialog',
      data: {lead}
    });
    dialogRef.afterClosed().subscribe(async (editedLead: Lead) => {
      if (editedLead) {
        this.spinnerService.next(true);
        editedLead.id = lead.id;
        const result: FirebaseResponse = await this.leadsService.editLead(editedLead);
        this.loadLeads();
        this.snackbar.showSnackbar(result.msg);
      }
    });
  }

  deleteLead(id: string): void {
    this.spinnerService.next(true);
    this.leadsService.deleteLead(id)
      .pipe(first())
      .subscribe((response: FirebaseResponse) => {
        this.loadLeads();
        this.snackbar.showSnackbar(response.msg);
      });
  }

  sortData(sortOptions: Sort): void {
    this.options.sortField = sortOptions.active;
    this.options.sortDirection = sortOptions.direction;
    this.loadLeads();
  }

  changePage(pageOptions: PageEvent) {
    this.options.page = pageOptions.pageIndex;
    this.options.countOfElements = pageOptions.pageSize;
    this.loadLeads();
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  search(value): void {
    this.searchService.leadsSearch(value)
      .subscribe((leads: Lead[]) => this.leads = leads);
  }
}
