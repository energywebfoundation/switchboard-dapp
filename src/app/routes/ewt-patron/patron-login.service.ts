import { Injectable } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { IamService } from '../../shared/services/iam.service';
import { from } from 'rxjs';
import { StakeState } from '../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../state/stake/stake.actions';

@Injectable({
  providedIn: 'root'
})
export class PatronLoginService {

  constructor(private iamService: IamService, private store: Store<StakeState>) {
  }

  login(): void {
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true, false);
    from(this.iamService.login({
      walletProvider,
      reinitializeMetamask: true,
      initCacheServer: false,
      initDID: false
    })).subscribe(() => {
        this.iamService.clearWaitSignatureTimer();
        this.store.dispatch(StakeActions.initStakingPool());
      });
  }

}
