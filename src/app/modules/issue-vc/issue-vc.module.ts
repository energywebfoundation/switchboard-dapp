import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NewIssueVcComponent } from './new-issue-vc/new-issue-vc.component';
import { RequiredFieldsModule } from '../required-fields/required-fields.module';


@NgModule({
  declarations: [
    NewIssueVcComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrCodeScannerModule,
    SharedModule,
    RequiredFieldsModule
  ],
  exports: [
    NewIssueVcComponent
  ]
})
export class IssueVcModule {
}
