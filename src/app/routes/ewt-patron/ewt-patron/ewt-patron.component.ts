import { Component } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as stakeSelectors from '../../../state/stake/stake.selectors';
import * as authSelectors from '../../../state/auth/auth.selectors';
import * as AuthActions from '../../../state/auth/auth.actions';
import { tap } from 'rxjs/operators';
import { PatronLoginService } from '../patron-login.service';

@Component({
  selector: 'app-ewt-patron',
  templateUrl: './ewt-patron.component.html',
  styleUrls: ['./ewt-patron.component.scss']
})
export class EwtPatronComponent {
  balance$ = this.store.select(stakeSelectors.getBalance);
  performance$ = this.store.select(stakeSelectors.getPerformance);
  annualReward$ = this.store.select(stakeSelectors.getAnnualReward);
  disableMetamaskButton$ = this.store.select(authSelectors.isMetamaskDisabled).pipe(tap(v => console.log('disabled: ',v)));
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);
  constructor(private store: Store<StakeState>, private patronLoginService: PatronLoginService) {
  }

  connectToMetamask() {
    this.patronLoginService.login();
  }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
