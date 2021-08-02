import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as authSelectors from '../../../state/auth/auth.selectors';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-staking-header',
  templateUrl: './staking-header.component.html',
  styleUrls: ['./staking-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StakingHeaderComponent {
  loggedIn$ = this.store.select(authSelectors.isUserLoggedIn);

  constructor(private store: Store) { }

  logOut() {
    this.store.dispatch(AuthActions.logout());
  }
}
