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
import { filter, tap } from 'rxjs/operators';
import firebase from 'firebase';
import { CrudService } from './services/crud/crud.service';
import { AuthService } from './services/auth/auth.service';
import { NoteModel } from './interfaces/note.model';
import { StoreService } from './store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  public notes: NoteModel[];

  public user: firebase.User;

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
    private storeService: StoreService,
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
        }),
      )
      .subscribe();
  }

  public ngOnInit(): void {
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

  public trackByFn(index: number, note: NoteModel): string {
    return note?.id;
  }
}
