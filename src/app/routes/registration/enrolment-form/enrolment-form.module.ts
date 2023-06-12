import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EnrolmentFormComponent } from './enrolment-form.component';
import { JsonEditorModule } from '@modules';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    JsonEditorModule,
  ],
  declarations: [EnrolmentFormComponent],
  exports: [EnrolmentFormComponent],
})
export class EnrolmentFormModule {}
