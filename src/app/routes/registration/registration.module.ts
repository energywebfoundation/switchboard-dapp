import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RequestClaimComponent } from './request-claim/request-claim.component';
import { LayoutModule } from '../../layout/layout.module';
import { SelectAssetDialogComponent } from './select-asset-dialog/select-asset-dialog.component';
import { ConnectToWalletModule } from '../../modules/connect-to-wallet/connect-to-wallet.module';
import { EnrolmentFormModule } from './enrolment-form/enrolment-form.module';
import { RolePreconditionListModule } from './role-precondition-list/role-precondition-list.module';

const routes: Routes = [];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    NgxSpinnerModule,
    LayoutModule,
    ConnectToWalletModule,
    EnrolmentFormModule,
    RolePreconditionListModule,
  ],
  declarations: [RequestClaimComponent, SelectAssetDialogComponent],
})
export class RegistrationModule {}
