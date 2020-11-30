import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {CrudService} from './services/crud/crud.service';
import {AuthService} from './services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'firebasetest';

  public books: any[];


  constructor(private crudService: CrudService, public authService: AuthService, private router: Router) {
  }

  public navigate(): void {
    this.router.navigate(["home"]);
  }


  public addObject(): void {
    this.crudService.createEntity('books', {name: 'asdsadasdc'});
  }

  public readObject(): void {
    this.crudService.getData<any>('books').subscribe((value: any[]) => console.log(value));
  }

  public updateObject(): void {
    this.crudService.updateObject('books', 'AfFabFtjU73PSndTyz4Q').subscribe();
  }

  public delete(): void {
    this.crudService.delete('books', 'AfFabFtjU73PSndTyz4Q').subscribe();
  }

  public login(): void {
    this.authService.googleSign().subscribe();

  }

  public logout(): void {
    this.authService.signOut().subscribe(() => { this.router.navigate([""])});
  }


  public getBooks(): void {
    this.crudService.getData('books').subscribe(value => {
        this.books = value;
      }
    );
  }

  public deleteBooks(): void {
    this.books = []
  }
}

