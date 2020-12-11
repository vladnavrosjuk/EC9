import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public user$: BehaviorSubject<firebase.User> = new BehaviorSubject<firebase.User>(null);

  private userData: firebase.User;

  public get user(): firebase.User {
    return this.userData;
  }

  public set user(user: firebase.User) {
    if (this.userData !== user) {
      this.userData = user;
      this.user$.next(user);
    }
  }
}
