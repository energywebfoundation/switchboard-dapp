import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import * as StakeActions from '../../../state/stake/stake.actions';
import * as AuthActions from '../../../state/auth/auth.actions';
import { getDid } from '../../../state/user-claim/user.selectors';
import { take } from 'rxjs/operators';
import * as userClaimsActions from '../../../state/user-claim/user.actions';
import { LoadingService } from '../loading.service';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import { ToastrService } from 'ngx-toastr';
import { WalletProvider } from 'iam-client-lib';
import SWAL from 'sweetalert';
import { isUserLoggedIn } from '../../../state/auth/auth.selectors';

export interface LoginOptions {
  walletProvider?: WalletProvider;
  reinitializeMetamask?: boolean;
  initCacheServer?: boolean;
  initDID?: boolean;
}

export enum Wallet_Provider_Events {
  AccountChanged = 'EVENT_ACCOUNT_CHANGED',
  NetworkChanged = 'EVENT_NETWORK_CHANGED',
  Disconnected = 'EVENT_DISCONNECTED'
}
const LOGIN_ERRORS = new Map()
  .set('Cannot destructure property', 'Please check if you are connected to correct network.')

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public accountAddress = undefined;

  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private store: Store<UserClaimState>,
              private toastr: ToastrService) {
  }

  isSessionActive() {
    return this.iamService.iam.isSessionActive();
  }

  async hasSessionRetrieved(): Promise<boolean> {
    if (!this.isSessionActive()) {
      return false;
    }

    this.loadingService.show();
    await this.login();
    this.clearWaitSignatureTimer();

    return true;
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(loginOptions?: LoginOptions, redirectOnAccountChange: boolean = true): Promise<boolean> {
    let retVal = false;

    // Check if account address exists
    if (!(await this.isUserPresent())) {
      try {
        const {did, connected, userClosedModal} = await this.iamService.iam.initializeConnection(loginOptions);
        if (did && connected && !userClosedModal) {
          // Setup Account Address
          const signer = this.iamService.iam.getSigner();
          this.accountAddress = await signer.getAddress();

          // Listen to Account Change
          this.iamService.iam.on('accountChanged', () => {
            this._displayAccountAndNetworkChanges(Wallet_Provider_Events.AccountChanged, redirectOnAccountChange);
          });

          // Listen to Network Change
          this.iamService.iam.on('networkChanged', () => {
            this._displayAccountAndNetworkChanges(Wallet_Provider_Events.NetworkChanged, redirectOnAccountChange);
          });

          // Listen to Disconnection
          this.iamService.iam.on('disconnected', () => {
            this._displayAccountAndNetworkChanges(Wallet_Provider_Events.Disconnected, redirectOnAccountChange);
          });
          // TODO: remove it when login method will be fully handled by store and call it after login.
          this.store.dispatch(StakeActions.initStakingPool());
          this.store.dispatch(AuthActions.loginSuccess());
          retVal = true;
        }
      } catch (e) {
        this.handleLoginErrors(e);
      }
    } else {
      // The account address is set so it means the user is current loggedin
      retVal = true;
    }

    return retVal;
  }

  handleLoginErrors(e) {
    console.error(e);

    const message = LOGIN_ERRORS.has(e.message) ? LOGIN_ERRORS.get(e.message) : e.message;
    this.toastr.error(message);
  }

  private async isUserPresent(): Promise<boolean> {
    return Boolean(await this.store.select(isUserLoggedIn).pipe(take(1)).toPromise());
  }

  async setupUser() {
    if (await this.isUserSetUp()) {
      return;
    }

    const didDocument = await this.iamService.iam.getDidDocument();
    this.store.dispatch(userClaimsActions.setDidDocument({didDocument}));
    this.store.dispatch(userClaimsActions.loadUserClaims());
  }

  private async isUserSetUp(): Promise<boolean> {
    return Boolean(await this.store.select(getDid).pipe(take(1)).toPromise());
  }

  /**
   * Disconnect from IAM
   */
  logout(saveDeepLink?: boolean) {
    this.iamService.iam.closeConnection();
    this.store.dispatch(userClaimsActions.clearUserClaim());

    saveDeepLink ? this.saveDeepLink() : location.href = location.origin + '/welcome';

    // Clean up loader.
    this.loadingService.hide();
  }

  async disconnect() {
    await this.iamService.iam.closeConnection();
    this.store.dispatch(userClaimsActions.clearUserClaim());
    this.loadingService.hide();
  }

  setDeepLink(deepLink: any) {
    this._deepLink = deepLink;
  }

  private saveDeepLink(): void {
    location.href = location.origin + '/welcome?returnUrl=' + encodeURIComponent(this._deepLink);
  }

  public waitForSignature(walletProvider?: WalletProvider, isConnectAndSign?: boolean, navigateOnTimeout: boolean = true) {
    this._throwTimeoutError = false;
    const timeoutInMinutes = walletProvider === WalletProvider.EwKeyManager ? 2 : 1;
    const connectionMessage = isConnectAndSign ? 'connection to a wallet and ' : '';
    const messages = [
      {
        message: `Your ${connectionMessage}signature is being requested.`,
        relevantProviders: 'all'
      },
      {
        message: 'EW Key Manager should appear in a new browser tab or window. If you do not see it, please check your browser settings.',
        relevantProviders: WalletProvider.EwKeyManager
      },
      {
        message: `If you do not complete this within ${timeoutInMinutes} minute${timeoutInMinutes === 1 ? '' : 's'},
          your browser will refresh automatically.`,
        relevantProviders: 'all'
      },
    ];
    const waitForSignatureMessage = messages
      .filter(m => m.relevantProviders === walletProvider || m.relevantProviders === 'all')
      .map(m => m.message);
    this.loadingService.show(waitForSignatureMessage);
    this._timer = setTimeout(() => {
      this._displayTimeout(isConnectAndSign, navigateOnTimeout);
      this.clearWaitSignatureTimer();
      this._throwTimeoutError = true;
    }, timeoutInMinutes * 60000);
  }

  public clearWaitSignatureTimer(throwError?: boolean) {
    clearTimeout(this._timer);
    this._timer = undefined;
    this.loadingService.hide();

    if (this._throwTimeoutError) {
      throw new Error('Wallet Signature Timeout');
      this._throwTimeoutError = false;
    }
  }

  private async _displayTimeout(isConnectAndSign?: boolean, navigateOnTimeout?: boolean) {
    let message = 'sign';
    if (isConnectAndSign) {
      message = 'connect with your wallet and sign';
    }
    const config = {
      title: 'Wallet Signature Timeout',
      text: `The period to ${message} the requested signature has elapsed. Please login again.`,
      icon: 'error',
      button: 'Proceed',
      closeOnClickOutside: false
    };

    const result = await SWAL(config);
    if (result) {
      if (navigateOnTimeout) {
        this.logout();
      } else {
        this.disconnect();
      }
    }
  }

  private async _displayAccountAndNetworkChanges(changeType: string, redirectOnAccountChange: boolean) {
    let message: string;
    let title: string;

    switch (changeType) {
      case Wallet_Provider_Events.AccountChanged:
        title = 'Account Changed';
        message = 'Account is changed.';
        break;
      case Wallet_Provider_Events.NetworkChanged:
        title = 'Network Changed';
        message = 'Network is changed.';
        break;
      case Wallet_Provider_Events.Disconnected:
        title = 'Disconnected';
        message = 'You are disconnected from your wallet.';
        break;
    }

    const config = {
      title,
      text: `${message} Please login again.`,
      icon: 'warning',
      button: 'Proceed',
      closeOnClickOutside: false
    };

    const result = await SWAL(config);
    if (result) {
      if (redirectOnAccountChange) {
        this.logout();
      } else {
        this.disconnect();
      }
    }
  }
}
