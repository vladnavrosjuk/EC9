import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import firebase from 'firebase';
import firestore = firebase.firestore;
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private firestoreService: AngularFirestore) {}

  public createEntity(collectionName: string, data: {}): Observable<string> {
    return from(
      this.firestoreService.collection(collectionName).add(data)
    ).pipe(
      map((value: DocumentReference) => value.id),
      take(1)
    );
  }

  public getData<T>(
    collectionName: string,
    handleChanges = true
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.where('name', '==', 'asdsadasdc');
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data } as T;
          })
        ),
        takeWhile(() => handleChanges)
      );
  }

  public updateObject(collectionName: string, id: string): Observable<void> {
    return from(
      this.firestoreService
        .collection(collectionName)
        .doc(id)
        .set({ name: 'asdasd21d21d' }, { merge: true })
    ).pipe(take(1));
  }

  public delete(collectionName: string, id: string): Observable<void> {
    return from(
      this.firestoreService.collection(collectionName).doc(id).delete()
    ).pipe(take(1));
  }
}
