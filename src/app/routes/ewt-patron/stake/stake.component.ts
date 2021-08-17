import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { tap } from 'rxjs/operators';
import { PercentButtonsComponent } from '../percent-buttons/percent-buttons.component';
import { Store } from '@ngrx/store';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import * as PoolActions from '../../../state/pool/pool.actions';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent {
  inputFocused: boolean;
  tokenAmount: number;
  amountToStake = new FormControl('', [Validators.min(1), Validators.required]);
  balance$ = this.store.select(poolSelectors.getBalance).pipe(tap(balance => this.tokenAmount = +balance));
  earnedReward$ = this.store.select(poolSelectors.getReward);
  stakeAmount$ = this.store.select(poolSelectors.getStakeAmount);
  isWithdrawDisabled$ = this.store.select(poolSelectors.isWithdrawDisabled);
  isStakingDisabled$ = this.store.select(poolSelectors.isStakingDisabled);

  @ViewChild('percentButtons') percentButtons: PercentButtonsComponent;

  constructor(private dialog: MatDialog, private store: Store) {
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

  private putStake() {
    this.store.dispatch(PoolActions.putStake({amount: this.amountToStake.value.toString()}));
  }

  stake() {
    this.putStake();
    this.amountToStake.reset();
  }

  withdraw() {
    this.store.dispatch(PoolActions.withdrawRequest());
  }

}
