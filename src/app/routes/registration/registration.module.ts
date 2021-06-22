import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RequestClaimComponent } from './request-claim/request-claim.component';
import { ConnectToWalletDialogComponent } from './connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SelectAssetDialogComponent } from './select-asset-dialog/select-asset-dialog.component';
import { EnrolmentFormComponent } from './enrolment-form/enrolment-form.component';


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
        LayoutModule
    ],
    declarations: [
        RequestClaimComponent,
        ConnectToWalletDialogComponent,
        SelectAssetDialogComponent,
        EnrolmentFormComponent
    ],
    entryComponents: [ConnectToWalletDialogComponent, SelectAssetDialogComponent],
    exports: []
})

export class RegistrationModule { }
