import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateFieldsModule } from '../../routes/applications/new-role/components/create-fields/create-fields.module';
import { NewIssueVcComponent } from './new-issue-vc/new-issue-vc.component';
import { EnrolmentFormModule } from '../../routes/registration/enrolment-form/enrolment-form.module';


@NgModule({
  declarations: [
    NewIssueVcComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrCodeScannerModule,
    SharedModule,
    CreateFieldsModule,
    EnrolmentFormModule
  ],
  exports: [
    NewIssueVcComponent
  ]
})
export class IssueVcModule {
}
