import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EnrolmentFormComponent } from './enrolment-form.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
  ],
  declarations: [
    EnrolmentFormComponent
  ],
  exports: [EnrolmentFormComponent]
})

export class EnrolmentFormModule {
}
