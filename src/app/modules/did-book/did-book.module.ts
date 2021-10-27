import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DidBookFormComponent } from './components/did-book-form/did-book-form.component';
import { DidBookListComponent } from './components/did-book-list/did-book-list.component';
import { DidBookComponent } from './components/did-book/did-book.component';
import { SharedModule } from '../../shared/shared.module';
import { DidBookService } from './services/did-book.service';
import { DidBookHttpService } from './services/did-book-http.service';


@NgModule({
  declarations: [
    DidBookFormComponent,
    DidBookListComponent,
    DidBookComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    DidBookService,
    DidBookHttpService
  ]
})
export class DidBookModule {
  static forRoot(): ModuleWithProviders<DidBookModule> {
    return {
      ngModule: DidBookModule,
      providers: [
        DidBookService
      ]
    };
  }
}
