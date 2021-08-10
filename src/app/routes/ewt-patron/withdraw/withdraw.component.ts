import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as PoolActions from '../../../state/pool/pool.actions';
import * as poolSelectors from '../../../state/pool/pool.selectors';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {
  isWithdrawingDelayFinished$ = this.store.select(poolSelectors.isWithdrawingDelayFinished);

  constructor(private store: Store<StakeState>) {
  }

  withdraw() {
    this.store.dispatch(PoolActions.withdrawReward());
  }

}
