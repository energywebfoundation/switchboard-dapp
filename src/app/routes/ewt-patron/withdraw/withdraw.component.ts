import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as PoolActions from '../../../state/pool/pool.actions';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import { FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { parseStringToFloat } from '../../../utils/functions/parse-string-to-float/parse-string-to-float';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent {
  maxAmount$ = this.store.select(poolSelectors.allTokens).pipe(tap(amount => this.setValidators(amount)));
  amount = new FormControl('', [Validators.required]);
  inputFocused;

  constructor(private store: Store<StakeState>) {
  }

  withdraw() {
    if (this.isAmountInvalid) {
      return;
    }
    this.store.dispatch(PoolActions.withdrawReward({value: this.amount.value}));
  }

  withdrawAll() {
    this.store.dispatch(PoolActions.withdrawAllReward());
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.inputFocused = false;
    this.amount.setValue('');
  }

  get isAmountInvalid() {
    return this.amount.invalid;
  }

  private setValidators(amount: string) {
    this.amount.setValidators([Validators.required, Validators.max(parseStringToFloat(amount))]);
  }

}
