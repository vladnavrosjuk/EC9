import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { from, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { CrudService } from '../crud/crud.service';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<firebase.User>;

  constructor(
    private angAuthService: AngularFireAuth,
    private crudServiceService: CrudService,
    private firestoreService: AngularFirestore,
  ) {
    this.user$ = this.angAuthService.authState.pipe(
      switchMap((user: firebase.User) => {
        if (user) {
          return this.firestoreService.doc<firebase.User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      }),
    );
  }

  public googleSign(): Observable<auth.UserCredential> {
    const provider = new auth.GoogleAuthProvider();
    return from(this.angAuthService.signInWithPopup(provider)).pipe(
      tap((userCred: auth.UserCredential) => {
        this.updateUserData(userCred.user);
      }),
      take(1),
    );
  }

  public signOut(): Observable<void> {
    return from(this.angAuthService.signOut()).pipe(take(1));
  }

  private updateUserData(user): void {
    /* this.crudServiceService.updateObject('users', user.uid); */
  }
}
