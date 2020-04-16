import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Lead } from '../models/lead.model';
import { Observable } from 'rxjs';
import { FirebaseResponse } from '../models/response.model';
import { PaginationResponse } from '../models/pagination-response.model';

@Injectable({
  providedIn: 'root'
})
export class LeadsService {

  constructor(private functions: AngularFireFunctions) { }

  getLeads({page = 0, countOfElements = 10, sortField = 'followUpDate', sortDirection = 'desc'})
    : Observable<PaginationResponse<Lead>> {
    const getLeadsFunction = this.functions.httpsCallable('getLeads');
    return getLeadsFunction({
      page,
      countOfElements,
      sortField,
      sortDirection
    });
  }

  deleteLead(id: string): Observable<FirebaseResponse> {
    const deleteLeadFunction = this.functions.httpsCallable('deleteLead');
    return deleteLeadFunction({id});
  }

  editLead(lead: Lead): Promise<FirebaseResponse> {
    const editLeadFunction = this.functions.httpsCallable('editLead');
    return editLeadFunction({lead}).toPromise();
  }

  addLead(lead): Promise<FirebaseResponse> {
    const addLeadFunction = this.functions.httpsCallable('addLead');
    return addLeadFunction({lead}).toPromise();
  }
}
