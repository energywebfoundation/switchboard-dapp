import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../../state/stake/stake.actions';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {

  constructor(private store: Store<StakeState>) { }

  withdraw() {
    this.store.dispatch(StakeActions.withdrawReward());
  }
}
