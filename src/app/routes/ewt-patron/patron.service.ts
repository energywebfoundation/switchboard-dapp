import { Injectable } from '@angular/core';
import { IAM, MessagingMethod, SafeIam, setChainConfig, setMessagingOptions, WalletProvider } from 'iam-client-lib';
import { safeAppSdk } from '../../shared/services/gnosis.safe.service';
import { IamService, VOLTA_CHAIN_ID } from '../../shared/services/iam.service';
import { environment } from '../../../environments/environment';
import { getUserProfile } from '../../state/user-claim/user.selectors';
import { finalize, map, switchMap, take, tap } from 'rxjs/operators';

import { utils } from 'ethers';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';

const {formatEther} = utils;

@Injectable({
  providedIn: 'root'
})
export class PatronService {
  private balance = new BehaviorSubject<number>(500);

  constructor(private iamService: IamService) {
  }

  init() {
    const walletProvider = WalletProvider.MetaMask;
    this.iamService.waitForSignature(walletProvider, true, false);
    from(this.iamService.login({
      walletProvider,
      reinitializeMetamask: true,
      initCacheServer: false,
      initDid: false
    })).pipe()
      .subscribe(() => {
        this.iamService.clearWaitSignatureTimer();
        this.setBalance();
      });
  }

  get balance$(): Observable<number> {
    return this.balance.asObservable();
  }

  setBalance(): void {
    from(this.iamService.iam.getSigner().getAddress())
      .pipe(
        switchMap((address) => from(this.iamService.iam.getSigner().provider.getBalance(address)))
      )
      .subscribe((bigNumber => {
        this.balance.next(+formatEther(bigNumber));
      }));
  }
}
