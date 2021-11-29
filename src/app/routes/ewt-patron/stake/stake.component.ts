import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import * as PoolActions from '../../../state/pool/pool.actions';
import { MAX_STAKE_AMOUNT } from '../../../state/pool/models/const';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent {
  inputFocused: boolean;
  tokenAmount: number;
  amountToStake = new FormControl('', [Validators.min(1), Validators.required, Validators.max(MAX_STAKE_AMOUNT)]);
  maxAmount$ = this.store.select(poolSelectors.getMaxPossibleAmountToStake).pipe(tap(value => {
    this.setAmountValidators(value);
    this.tokenAmount = +value;
  }));
  balance$ = this.store.select(poolSelectors.getBalance);
  earnedReward$ = this.store.select(poolSelectors.getReward);
  stakeAmount$ = this.store.select(poolSelectors.getStakeAmount);
  isWithdrawDisabled$ = this.store.select(poolSelectors.isWithdrawDisabled);
  getContributorLimit$ = this.store.select(poolSelectors.getContributorLimit);
  dates$ = this.store.select(poolSelectors.expirationDate);


  constructor(private store: Store) {
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.inputFocused = false;
    this.amountToStake.setValue('');
  }

  isAmountInvalid() {
    return this.amountToStake.invalid;
  }

  calcStakeAmount(percent: number) {
    this.amountToStake.setValue((this.tokenAmount * percent) / 100);
  }

  private putStake() {
    this.store.dispatch(PoolActions.putStake({amount: this.amountToStake.value.toString()}));
  }

  stake() {
    this.putStake();
    this.amountToStake.reset();
  }

  withdraw() {
    this.store.dispatch(PoolActions.openWithdrawDialog());
  }

  setAmountValidators(maxAmount: number) {
    this.amountToStake.setValidators([Validators.min(1), Validators.required, Validators.max(maxAmount)]);
  }

}
