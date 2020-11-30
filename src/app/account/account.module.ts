import {NgModule} from '@angular/core';
import {AccountComponent} from './account.component';
import {CommonModule} from '@angular/common';
import {AccountRoutingModule} from './account-routing.module';


@NgModule({
  declarations: [AccountComponent],
  exports: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule
  ]
})
export class AccountModule {
}
