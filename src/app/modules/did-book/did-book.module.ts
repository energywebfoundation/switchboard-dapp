import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DidBookFormComponent } from './components/did-book-form/did-book-form.component';
import { DidBookListComponent } from './components/did-book-list/did-book-list.component';
import { DidBookComponent } from './components/did-book/did-book.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    DidBookFormComponent,
    DidBookListComponent,
    DidBookComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DidBookModule {
}
