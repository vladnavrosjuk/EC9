import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  filter,
  finalize,
  map,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs/operators';
import firebase from 'firebase';
import { from, Observable, combineLatest, forkJoin } from 'rxjs';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { updatePlaceholderMap } from '@angular/compiler/src/render3/view/i18n/util';
import { CrudService } from './services/crud/crud.service';
import { AuthService } from './services/auth/auth.service';
import { NoteModel } from './interfaces/note.model';
import { StoreService } from './store.service';
import { UploadService } from './services/crud/upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
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
    private storeService: StoreService,
    private uploadService: UploadService,
  ) {}

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

  public ngOnInit(): void {
    this.crudService.getByReference();
    this.storeService.user$.subscribe((value) => {
      this.user = value;
    });
  }

  public onFileSelected(event): void {
    const file = event.target.files[0];
    combineLatest(this.uploadService.uploadFileAndGetMetadata('test', file))
      .pipe(
        takeWhile(([, link]) => {
          return !link;
        }, true),
      )
      .subscribe(([percent, link]) => {
        this.progress = percent;
        this.imageLink = link;
      });
  }
}
