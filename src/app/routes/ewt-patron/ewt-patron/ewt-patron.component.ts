import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled);
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);
  constructor(private store: Store<StakeState>) {
  }

  connectToMetamask() {
    this.store.dispatch(AuthActions.loginHeaderStakingButton());
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
