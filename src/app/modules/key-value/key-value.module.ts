import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeyValueComponent } from './key-value/key-value.component';
import { KeyValueFormComponent } from './key-value-form/key-value-form.component';
import { KeyValueListComponent } from './key-value-list/key-value-list.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    KeyValueComponent,
    KeyValueFormComponent,
    KeyValueListComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    KeyValueComponent,
    KeyValueListComponent
  ]
})
export class KeyValueModule {
}
