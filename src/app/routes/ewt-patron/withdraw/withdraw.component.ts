import { Component, Inject, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../../state/stake/stake.actions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';
import * as stakeSelectors from '../../../state/stake/stake.selectors';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {
  isWithdrawingDelayFinished$ = this.store.select(stakeSelectors.isWithdrawingDelayFinished);

  constructor(private store: Store<StakeState>) {
  }

  withdraw() {
    this.store.dispatch(StakeActions.withdrawReward());
  }

}
