import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, filter, switchMap, tap } from 'rxjs/operators';
import { CrudService } from './services/crud/crud.service';
import { AuthService } from './services/auth/auth.service';
import { NoteModel } from './interfaces/note.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public notes: NoteModel[];

  constructor(
    private crudService: CrudService,
    public authService: AuthService,
    private router: Router,
  ) {}

  public navigate(): void {
    this.router.navigate(['home']);
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
    this.crudService
      .handleData<NoteModel>('notes')
      .pipe(
        tap((notes: NoteModel[]) => {
          this.notes = notes;
          console.log('asd');
        }),
        filter((notes: NoteModel[]) => {
          console.log('asd');
          return notes?.length === 0;
        }),
        switchMap(() => this.createNote()),
      )
      .subscribe();
  }

  public ngOnInit(): void {
    this.getNotes();
  }

  public createNote(): Observable<string> {
    const note: NoteModel = { name: '', content: '' };
    return this.crudService.createEntity('notes', note);
  }

  public trackByFn(index): string {
    return index;
  }
}
