import { Injectable } from '@angular/core';
import { WalletProvider } from 'iam-client-lib';
import { IamService } from '../../shared/services/iam.service';
import { from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatronLoginService {

  constructor(private iamService: IamService, private store: Store) {
  }

  login(walletProvider: WalletProvider): Observable<boolean> {
    this.iamService.waitForSignature(walletProvider, true, false);
    return from(this.iamService.login({
      walletProvider,
      reinitializeMetamask: true,
      initCacheServer: false,
      initDID: false
    }, false)).pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return loggedIn;
        }
        throw new Error('Login Rejected');
      }),
      finalize(() => this.iamService.clearWaitSignatureTimer())
    );
  }

}
