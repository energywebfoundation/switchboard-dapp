import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClaimRewardComponent } from '../claim-reward/claim-reward.component';

import { map, tap } from 'rxjs/operators';
import { PercentButtonsComponent } from '../percent-buttons/percent-buttons.component';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as StakeActions from '../../../state/stake/stake.actions';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent implements OnInit {
  inputFocused: boolean;
  tokenAmount: number;
  balance$ = this.store.select(stakeSelectors.getBalance).pipe(tap(balance => this.tokenAmount = +balance));
  amountToStake = new FormControl('', [Validators.min(0), Validators.required]);
  earnedReward$ = this.store.select(stakeSelectors.getReward);
  stakeAmount$ = this.store.select(stakeSelectors.getStakeAmount);
  isWithdrawDisabled$ = this.store.select(stakeSelectors.isWithdrawDisabled);
  isStakingDisabled$ = combineLatest([
    this.store.select(stakeSelectors.isStakingDisabled),
    this.store.select(authSelectors.isUserLoggedIn)
  ])
    .pipe(map(([stakingDisabled, loggedIn]) => stakingDisabled && loggedIn));
  isLoggedIn: boolean;
  @ViewChild('percentButtons') percentButtons: PercentButtonsComponent;

  constructor(private dialog: MatDialog, private store: Store) {
  }

  ngOnInit(): void {
    this.store.select(authSelectors.isUserLoggedIn).subscribe((loggedIn) => this.isLoggedIn = loggedIn);
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

  private loginBeforeStake() {
    this.dialog.open(LoginDialogComponent, {
      width: '434px',
      data: {
        stakeAmount: this.amountToStake.value.toString()
      },
      backdropClass: 'backdrop-shadow',
      maxWidth: '100%',
    });
  }

  private putStake() {
    this.store.dispatch(StakeActions.putStake({amount: this.amountToStake.value.toString()}));
  }

  stake() {
    this.isLoggedIn ? this.putStake() : this.loginBeforeStake();
    this.amountToStake.reset();
  }

  withdraw() {
    this.store.dispatch(StakeActions.withdrawRequest());
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
