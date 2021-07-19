import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawComponent } from '../withdraw/withdraw.component';
import { ClaimRewardComponent } from '../claim-reward/claim-reward.component';

import { tap } from 'rxjs/operators';
import { PercentButtonsComponent } from '../percent-buttons/percent-buttons.component';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent {
  inputFocused: boolean;
  tokenAmount: number;
  balance$ = this.store.select(stakeSelectors.getBalance).pipe(tap(balance => this.tokenAmount = +balance));
  amountToStake = new FormControl('', [Validators.min(0), Validators.required]);
  earnedReward$ = this.store.select(stakeSelectors.getReward);
  stakeAmount$ = this.store.select(stakeSelectors.getStakeAmount);
  isStakingDisabled$ = this.store.select(stakeSelectors.isStakingDisabled);
  isWithdrawDisabled$ = this.store.select(stakeSelectors.isWithdrawDisabled);
  compound = new FormControl(false);
  @ViewChild('percentButtons') percentButtons: PercentButtonsComponent;

  constructor(private dialog: MatDialog, private store: Store<StakeState>) {
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.inputFocused = false;
    this.percentButtons.selectedPercentButton = null;
    this.amountToStake.setValue('');
  }

  isAmountInvalid() {
    return this.amountToStake.invalid;
  }

  inputChangeHandler() {
    this.percentButtons.selectedPercentButton = null;
  }

  calcStakeAmount(percent: number) {
    this.amountToStake.setValue(Math.floor(this.tokenAmount * percent / 100));
  }

  stake() {
    this.store.dispatch(AuthActions.loginBeforeStakeIfNotLoggedIn({amount: this.amountToStake.value.toString()}));
    this.amountToStake.reset();
  }

  withdraw() {
    this.dialog.open(WithdrawComponent, {
      width: '400px',
      maxWidth: '100%',
      disableClose: true,
      backdropClass: 'backdrop-shadow'
    });
  }

  claimReward() {
    this.dialog.open(ClaimRewardComponent, {
      width: '400px',
      maxWidth: '100%',
      disableClose: true,
      backdropClass: 'backdrop-shadow'
    });
  }

}
