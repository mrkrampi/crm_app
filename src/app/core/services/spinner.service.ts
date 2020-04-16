import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinner$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  get spinner(): Observable<boolean> {
    return this.spinner$.asObservable();
  }

  next(flag: boolean): void {
    this.spinner$.next(flag);
  }
}
