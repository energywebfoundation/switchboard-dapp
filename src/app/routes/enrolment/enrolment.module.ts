import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { FormsModule } from '@angular/forms';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
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
  ],
})
export class EnrolmentModule {}
