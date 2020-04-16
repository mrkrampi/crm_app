import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AngularFireFunctions } from '@angular/fire/functions';
import { FirebaseResponse } from '../models/response.model';
import { AuthService } from './auth.service';
import { PaginationResponse } from '../models/pagination-response.model';
import { map, tap } from 'rxjs/operators';
import { SnackBarService } from './snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private functions: AngularFireFunctions,
              private auth: AuthService,
              private snackbar: SnackBarService) {
  }

  getUsers({page = 0, countOfElements = 10, sortField = 'firstName', sortDirection = 'asc'})
    : Observable<PaginationResponse<User>> {
    const getLeadsFunction = this.functions.httpsCallable('getUsers');
    return getLeadsFunction({
      page,
      countOfElements,
      sortField,
      sortDirection
    })
  }

  deleteUser(uid: string): Observable<FirebaseResponse> {
    const deleteFunction = this.functions.httpsCallable('deleteUser');
    return deleteFunction({uid});
  }

  async editUser(editedUser: User): Promise<FirebaseResponse> {
    const editFunction = this.functions.httpsCallable('editUser');
    return editFunction({editedUser})
      .pipe(
        map(response => {
          this.auth.next(response.claims);
          return response.responseInfo;
        })
      )
      .toPromise();
  }

  async addUser(user: User): Promise<FirebaseResponse> {
    const addFunction = this.functions.httpsCallable('addUser');
    return addFunction({user}).toPromise();
  }

  getCurrentUser(): Observable<User> {
    const getCurrentUserFunction = this.functions.httpsCallable('getCurrentUser');
    return getCurrentUserFunction({});
  }

  async editCurrentUser(user: User): Promise<void> {
    await this.auth.changeEmail(user.email);
    const editCurrentUserFunction = this.functions.httpsCallable('editCurrentUser');
    return editCurrentUserFunction({user})
      .pipe(
        tap(result => this.auth.next(result))
      )
      .toPromise();
  }

  changeStatus(status: string, uid: string): Observable<FirebaseResponse> {
    const changeStatusFunction = this.functions.httpsCallable('changeStatus');
    return changeStatusFunction({status, uid});
  }
}
