import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiredFieldsComponent } from './components/required-fields/required-fields.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [RequiredFieldsComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [RequiredFieldsComponent]
})
export class RequiredFieldsModule {
}
