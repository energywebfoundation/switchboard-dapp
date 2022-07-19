import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DidBookFormComponent } from './components/did-book-form/did-book-form.component';
import { DidBookListComponent } from './components/did-book-list/did-book-list.component';
import { DidBookComponent } from './components/did-book/did-book.component';
import { SharedModule } from '../../shared/shared.module';
import { DidBookService } from './services/did-book.service';
import { DidBookHttpService } from './services/did-book-http.service';
import { SelectDidComponent } from './components/select-did/select-did.component';
import { AddSingleRecordComponent } from './components/add-single-record/add-single-record.component';
import { QrCodeModule } from '../../shared/components/qr-code/qr-code.module';

@NgModule({
  declarations: [
    DidBookFormComponent,
    DidBookListComponent,
    DidBookComponent,
    SelectDidComponent,
    AddSingleRecordComponent,
  ],
  imports: [CommonModule, SharedModule, QrCodeModule],
  providers: [DidBookHttpService],
  exports: [DidBookComponent, SelectDidComponent],
})
export class DidBookModule {}
