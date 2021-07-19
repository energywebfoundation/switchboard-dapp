import { Injectable } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { IamService } from '../../shared/services/iam.service';
import { from } from 'rxjs';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../state/stake/stake.actions';
import * as AuthActions from '../../state/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class PatronLoginService {

  constructor(private iamService: IamService, private store: Store) {
  }

  login(): void {
    //todo: delete subscribe, use while login with metamask in effect (?).
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true, false);
    from(this.iamService.login({
      walletProvider,
      reinitializeMetamask: true,
      initCacheServer: false,
      initDID: false
    })).subscribe((loggedIn) => {
      if (loggedIn) {
        this.store.dispatch(AuthActions.loginSuccess());
        this.store.dispatch(StakeActions.initStakingPool());
      } else {
        this.store.dispatch(AuthActions.loginFailure())
      }
      this.iamService.clearWaitSignatureTimer();
    });
  }

}
