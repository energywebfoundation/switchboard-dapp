import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';
import { GovernanceDetailsModule } from '../applications/governance-view/governance-details/governance-details.module';
import { NewAssetTypeComponent } from './new-asset-type/new-asset-type.component';
import { NewPassiveAssetComponent } from './new-passive-asset/new-passive-asset.component';
import { AssetListComponent } from './asset-list/asset-list.component';
import { AssetOwnershipHistoryComponent } from './asset-ownership-history/asset-ownership-history.component';
import { AssetDetailsComponent } from './asset-details/asset-details.component';
import { EditAssetDialogComponent } from './edit-asset-dialog/edit-asset-dialog.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatExpansionModule } from '@angular/material/expansion';
import { VerificationMethodComponent } from './verification-method/verification-method.component';
import { HistoryElementComponent } from './asset-ownership-history/history-element/history-element.component';
import { HistoryPeriodComponent } from './asset-ownership-history/history-period/history-period.component';
import { TypeAlgorithmPipe } from './pipes/type-algorithm.pipe';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { QrCodeScannerModule } from '../../shared/components/qr-code-scanner/qr-code-scanner.module';
import { RouterConst } from '../router-const';
import { AssetEnrolmentListComponent } from './asset-enrolment-list/asset-enrolment-list.component';
import { EnrolmentListModule } from '../enrolment/enrolment-list/enrolment-list.module';
import { PublishRoleDirective } from '../../shared/services/publish-role/publish-role.directive';

const routes: Routes = [
  { path: '', component: AssetsComponent },
  {
    path: RouterConst.EnrolmentDetails,
    component: AssetDetailsComponent,
  },
];

@NgModule({
  declarations: [
    AssetsComponent,
    NewAssetTypeComponent,
    NewPassiveAssetComponent,
    AssetListComponent,
    AssetOwnershipHistoryComponent,
    AssetEnrolmentListComponent,
    EditAssetDialogComponent,
    VerificationMethodComponent,
    HistoryElementComponent,
    HistoryPeriodComponent,
    TypeAlgorithmPipe,
    AssetDetailsComponent,
  ],
  imports: [
    CommonModule,
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
    GovernanceDetailsModule,
    MatExpansionModule,
    ClipboardModule,
    QrCodeScannerModule,
    EnrolmentListModule,
    PublishRoleDirective,
  ],
})
export class AssetsModule {}
