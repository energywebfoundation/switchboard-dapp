import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { FormsModule } from '@angular/forms';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { IssueVcModule } from '../../modules/issue-vc/issue-vc.module';
import { EnrolmentFormModule } from '../registration/enrolment-form/enrolment-form.module';
import { FieldsComponent } from './fields/fields.component';
import { MyEnrolmentListComponent } from './my-enrolment-list/my-enrolment-list.component';
import { RequestedEnrolmentListComponent } from './requested-enrolment-list/requested-enrolment-list.component';
import { MyRevokablesListComponent } from './revoke-enrolments/revoke-enrolment-list.component';
import { EnrolmentListModule } from './enrolment-list/enrolment-list.module';
import { RequestDetailsComponent } from './view-requests/components/request-details/request-details.component';
import { RevokeButtonsComponent } from './view-requests/components/revoke-buttons/revoke-buttons.component';
import { IssuerRequestsComponent } from './view-requests/issuer-requests/issuer-requests.component';
import { CascadingFilterModule } from '../../modules/cascading-filter/cascading-filter.module';
import { RawDataModule } from 'src/app/modules/raw-data/raw-data.module';
import { CredentialJsonComponent } from './view-requests/components/full-credential/full-credential.component';
import { PublishRoleDirective } from '../../shared/services/publish-role/publish-role.directive';

const routes: Routes = [{ path: '', component: EnrolmentComponent }];

@NgModule({
  declarations: [
    EnrolmentComponent,
    ViewRequestsComponent,
    ViewRoleComponent,
    FieldsComponent,
    MyEnrolmentListComponent,
    RequestedEnrolmentListComponent,
    MyRevokablesListComponent,
    RequestDetailsComponent,
    RevokeButtonsComponent,
    IssuerRequestsComponent,
    CredentialJsonComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatInputModule,
    QrCodeScannerModule,
    IssueVcModule,
    EnrolmentFormModule,
    EnrolmentListModule,
    CascadingFilterModule,
    RawDataModule,
    PublishRoleDirective,
  ],
})
export class EnrolmentModule {}
