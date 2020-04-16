import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Lead } from '../models/lead.model';
import { first, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private firestore: AngularFirestore) {
  }

  leadsSearch(value: string): Observable<Lead[]> {
    return this.firestore.collection<Lead>('leads').get()
      .pipe(
        first(),
        map(item => item.docs.map(item => {
          return {
            id: item.id,
            ...item.data()
          };
        })),
        map((leads: Lead[]) => leads.filter(item => this.checkLead(item, value)))
      );
  }

  userSearch(value: string): Observable<User[]> {
    return this.firestore.collection<User>('users').get()
      .pipe(
        first(),
        map(item => item.docs.map(item => {
          return {
            uid: item.id,
            ...item.data()
          };
        })),
        map((users: User[]) => users.filter(item => this.checkUser(item, value)))
      );
  }

  statusSearch(value: string): Observable<Status[]> {
    return this.firestore.collection<Status>('status').get()
      .pipe(
        first(),
        map(item => item.docs.map(item => {
          return {
            uid: item.id,
            ...item.data()
          };
        })),
        map((statuses: Status[]) => statuses.filter(item => this.checkStatus(item, value)))
      );
  }

  private checkLead(lead: Lead, value: string): boolean {
    const row = `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.position} ${lead.source} ${lead.status} ${lead.email}` +
      `${lead.comment}`;

    return row.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  private checkUser(user: User, value: string): boolean {
    const row = `${user.firstName} ${user.lastName} ${user.email} ${user.status}`;
    return row.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }

  private checkStatus(status: Status, value: string): boolean {
    const row = `${status.name} ${status.description}`;
    return row.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  }
}
