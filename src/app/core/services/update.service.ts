import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UpdateTable } from '../models/update-table.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private shouldUpdateSubject: Subject<UpdateTable>;
  shouldUpdate$: Observable<UpdateTable>;

  constructor() {
    this.shouldUpdateSubject = new Subject<UpdateTable>();
    this.shouldUpdate$ = this.shouldUpdateSubject.asObservable();
  }

  next(tableToUpdate: string): void {
    this.shouldUpdateSubject.next({tableToUpdate});
  }
}
