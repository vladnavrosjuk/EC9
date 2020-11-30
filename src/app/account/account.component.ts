import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud/crud.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {
  constructor(private crudService: CrudService) {}

  public testSubscribe: Subscription;

  ngOnInit(): void {
    this.testSubscribe = this.crudService
      .getData('books')
      .subscribe((value) => console.log(value));
  }
}
