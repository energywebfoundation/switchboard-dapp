import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EwtPatronComponent } from './ewt-patron/ewt-patron.component';
import { RouterModule } from '@angular/router';
import { StakeComponent } from './stake/stake.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PercentButtonsComponent } from './percent-buttons/percent-buttons.component';
import { DividerComponent } from './divider/divider.component';
import { StakeSuccessComponent } from './stake-success/stake-success.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SharedModule } from '../../shared/shared.module';
import { LayoutModule } from '../../layout/layout.module';
import { LastDigitsPipe } from './pipes/last-digits.pipe';
import { ConnectToWalletModule } from '../../modules/connect-to-wallet/connect-to-wallet.module';
import { StakingHeaderComponent } from './staking-header/staking-header.component';
import { StakingFooterComponent } from './staking-footer/staking-footer.component';


@NgModule({
  declarations: [
    EwtPatronComponent,
    StakeComponent,
    PercentButtonsComponent,
    DividerComponent,
    StakeSuccessComponent,
    WithdrawComponent,
    LastDigitsPipe,
    StakingHeaderComponent,
    StakingFooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '', component: EwtPatronComponent}]),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressBarModule,
    SharedModule,
    LayoutModule,
    ConnectToWalletModule
  ],

})
export class EwtPatronModule {
}
