import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';
import { SnackBarService } from './snack-bar.service';
import { BehaviorSubject } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserToken } from '../models/user-token.model';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<UserToken>(null);

  constructor(private snackBar: SnackBarService,
              private router: Router,
              private route: ActivatedRoute,
              private afAuth: AngularFireAuth,
              private functions: AngularFireFunctions,
              private snackbar: SnackBarService,
              private storage: AngularFireStorage) {
    this.loadClaims();
  }

  loadClaims() {
    const getClaimsFunction = this.functions.httpsCallable('getUserClaims');
    getClaimsFunction({})
      .pipe(first())
      .subscribe((claims: UserToken) => this.next(claims));
  }

  next(userClaims: UserToken) {
    this.currentUser$.next(userClaims);
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.loadClaims();
      await this.router.navigate(['']);
      this.snackBar.showSnackbar('Login is succeed');
    } catch {
      this.snackBar.showSnackbar('Bad email or password');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.afAuth.authState
      .pipe(first())
      .toPromise();
    return !!user;
  }

  async signOut(): Promise<void> {
    await this.afAuth.auth.signOut();
    await this.router.navigate(['/login']);
  }

  async sendResetLink(email: string): Promise<void> {
    try {
      await this.afAuth.auth.sendPasswordResetEmail(email);
    } finally {
      this.snackbar.showSnackbar('Check you inbox');
      await this.router.navigate(['/login']);
    }
  }

  confirmUser(password: string): void {
    const confirmUserFunction = this.functions.httpsCallable('confirmUser');
    this.route.queryParams
      .subscribe(async params => {
        const {id: inviteId} = params;
        try {
          await confirmUserFunction({inviteId, password}).toPromise();
          await this.router.navigate(['/login']);
        } catch (e) {
          this.snackBar.showSnackbar(e.message);
        }
      });
  }

  async changePassword(password: string): Promise<void> {
    const user = this.afAuth.auth.currentUser;
    try {
      await user.updatePassword(password);
      this.snackBar.showSnackbar('Password successfully changed');
    } catch {
      this.snackBar.showSnackbar('Please sign out and then sign in again');
    }
  }

  async changeEmail(email: string): Promise<void> {
    const user = this.afAuth.auth.currentUser;
    try {
      await user.updateEmail(email);
    } catch {
      this.snackBar.showSnackbar('Something went wrong, try again');
    }
  }

  async changeProfileImage(image: Blob): Promise<void> {
    const {uid} = this.afAuth.auth.currentUser;
    await this.storage.upload(`avatar/${uid}`, image);
    this.storage.ref(`avatar/${uid}`).getDownloadURL()
      .subscribe(async (imageURL: string) => {
        await this.afAuth.auth.currentUser.updateProfile({photoURL: imageURL});
        const setProfileImageFunction = this.functions.httpsCallable('setProfileImage');
        setProfileImageFunction({imageURL}).pipe(first()).subscribe();
        this.loadClaims();
      });
  }
}
