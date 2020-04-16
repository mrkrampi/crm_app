import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../models/status.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FirebaseResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(private functions: AngularFireFunctions) {}

  getStatus(): Observable<Status[]> {
    const status = this.functions.httpsCallable('getStatuses');
    return status({});
  }

  deleteStatus(uid): Observable<FirebaseResponse>{
    const deleteFunction = this.functions.httpsCallable('deleteStatus');
    return deleteFunction({uid});
  }

  async addStatus(status: Status): Promise<FirebaseResponse> {
    const addFunction = this.functions.httpsCallable('addStatus');
    return addFunction({status}).toPromise();
  }
}
