import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFormComponent } from '../field-form/field-form.component';
import { FieldsSummaryComponent } from '../fields-summary/fields-summary.component';
import { RoleFieldComponent } from '../role-field/role-field.component';
import { SharedModule } from '../../../../../shared/shared.module';


@NgModule({
  declarations: [FieldFormComponent, FieldsSummaryComponent, RoleFieldComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FieldFormComponent, FieldsSummaryComponent, RoleFieldComponent
  ]
})
export class CreateFieldsModule {
}
