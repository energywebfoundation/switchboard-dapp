import { Injectable } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { IamService } from '../../shared/services/iam.service';
import { from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../state/stake/stake.actions';
import * as AuthActions from '../../state/auth/auth.actions';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatronLoginService {

  constructor(private iamService: IamService, private store: Store) {
  }

  login(): Observable<boolean> {
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true, false);
    return from(this.iamService.login({
      walletProvider,
      reinitializeMetamask: true,
      initCacheServer: false,
      initDID: false
    }, false)).pipe(finalize(() => this.iamService.clearWaitSignatureTimer()));
  }

}
