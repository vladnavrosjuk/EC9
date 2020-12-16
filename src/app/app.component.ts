import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, filter, finalize, map, startWith, switchMap, takeUntil, takeWhile, tap } from 'rxjs/operators';
import firebase from 'firebase';
import { CrudService } from './services/crud/crud.service';
import { AuthService } from './services/auth/auth.service';
import { NoteModel } from './interfaces/note.model';
import { StoreService } from './store.service';
import { from, Observable, combineLatest, forkJoin } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { updatePlaceholderMap } from '@angular/compiler/src/render3/view/i18n/util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit {
  public notes: NoteModel[];

  public user: firebase.User;

  public imageLink: string;

  public progress: string;

  public showTemplate = true;

  @ViewChild('divElementTest')
  public testElement: ElementRef;

  @ViewChild('templateRef')
  public testTemplate: TemplateRef<any>;

  constructor(
    private crudService: CrudService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private router: Router,
    private storage: AngularFireStorage,
    private storeService: StoreService
  ) {
  }

  @HostListener('window:resize')
  public onWindowResize() {
    console.log('windowResize');
  }

  public mouseenter() {
    console.log('mouseenter');
  }

  public navigate(): void {
    this.router.navigate(['home']);
  }

  public getUser(): void {
    console.log(this.storeService.user);
  }

  public login(): void {
    this.authService.googleSign().subscribe();
  }

  public logout(): void {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  public getNotes(): void {
    console.log('asd');
    this.crudService

      .handleData<NoteModel>('notes')
      .pipe(
        tap((notes: NoteModel[]) => {
          this.notes = notes;
          this.cdr.detectChanges();
          console.log('asd');
        }),
        filter((notes: NoteModel[]) => {
          console.log('asd');
          return notes?.length === 0;
        })
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.crudService.getByReference();
    this.storeService.user$.subscribe((value) => {
      this.user = value;
    });
    this.getNotes();
  }

  public createNote(): void {
    console.log(this.testElement);

    /* const note: NoteModel = { name: '', content: '', date: new Date().getTime() };
     return this.crudService.createEntity('notes', note); */
  }


  public onFileSelected(event) {

    const file = event.target.files[0];
    /*const { downloadUrl$, uploadProgress$ } = this.uploadFileAndGetMetadata(
      'test',
      file
    );*/
    combineLatest(this.uploadFileAndGetMetadata(
      'test',
      file
    )).pipe(takeWhile(([percent, link]) => {
      return !link;
    },true)).subscribe(([percent, link]) => {
      console.log(percent);

      console.log(link);
    });
    /*    updatePlaceholderMap();*/

    /*uploadProgress$.subscribe((value) => this.progress = value);
    downloadUrl$.subscribe((value) => this.imageLink = value);*/
  }

  public uploadFileAndGetMetadata(
    mediaFolderPath: string,
    fileToUpload: File
  ): Observable<string>[] {
    const { name } = fileToUpload;
    const filePath = `${mediaFolderPath}/${new Date().getTime()}_${name}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(
      filePath,
      fileToUpload
    );
    return [
      uploadTask.percentageChanges().pipe(map(value => value.toString()), takeWhile(value => value !== '100', true)),
      this.getDownloadUrl$(uploadTask, filePath).pipe(startWith(null))
    ];
  }

  private getDownloadUrl$(
    uploadTask: AngularFireUploadTask,
    path: string
  ): Observable<string> {
    return from(uploadTask).pipe(
      switchMap((_) => this.storage.ref(path).getDownloadURL())
    );
  }

  public trackByFn(index: number, note: NoteModel): string {
    return note?.id;
  }
}
