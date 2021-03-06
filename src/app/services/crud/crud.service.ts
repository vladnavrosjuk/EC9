import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import firebase from 'firebase';
import firestore = firebase.firestore;
import DocumentReference = firebase.firestore.DocumentReference;
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestoreService: AngularFirestore) {}

  public createEntity(collectionName: string, data: {}): Observable<string> {
    return from(this.firestoreService.collection(collectionName).add(data)).pipe(
      map((value: DocumentReference) => value.id),
      take(1),
    );
  }

  public getByReference() {
    const b = firebase.firestore().doc('books/10oJ4VKZMp2r4pTqgeHL');
    const a = this.firestoreService.doc('testila/kkR2CBhdfZx3F1knDR38');
    this.createEntity('testila', { name: 'test', ref: b }).subscribe();
    const docRef = this.firestoreService.collection('books', (ref) =>
      ref.where('id', '==', '00sVqvkg5DBEYWS4zDp3'),
    );
    a.get().subscribe((link) => {
      from(link.ref.get()).subscribe((value: DocumentSnapshot) => console.log(value.data()));
    });
  }

  public getData<T>(collectionName: string): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.where('name', '==', 'newBook').where('test', '==', 'test');
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const { id } = a.payload.doc;
            return { id, ...data } as T;
          }),
        ),
        take(1),
      );
  }

  public handleData<T>(collectionName: string): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const { id } = a.payload.doc;
            return { id, ...data } as T;
          }),
        ),
      );
  }

  public updateObject(collectionName: string, id: string, data: {}): Observable<void> {
    return from(
      this.firestoreService.collection(collectionName).doc(id).set(data, { merge: true }),
    ).pipe(take(1));
  }

  public delete(collectionName: string, id: string): Observable<void> {
    return from(this.firestoreService.collection(collectionName).doc(id).delete()).pipe(take(1));
  }
}
