import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { EnrolToRoleComponent } from './enrol-to-role/enrol-to-role.component';
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

const routes: Routes = [{path: '', component: EnrolmentComponent}];

@NgModule({
  declarations: [
    EnrolmentComponent,
    EnrolToRoleComponent,
    ViewRequestsComponent,
    ViewRoleComponent,
    FieldsComponent
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
    EnrolmentFormModule
  ],
})
export class EnrolmentModule {
}
