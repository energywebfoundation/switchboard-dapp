import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import * as userClaimsActions from '../../../state/user-claim/user.actions';
import { LoadingService } from '../loading.service';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../../state/user-claim/user.reducer';
import { ToastrService } from 'ngx-toastr';
import { WalletProvider } from 'iam-client-lib';
import SWAL from 'sweetalert';
import { from } from 'rxjs';
import { IamListenerService } from '../iam-listener/iam-listener.service';

export interface LoginOptions {
  walletProvider?: WalletProvider;
  reinitializeMetamask?: boolean;
  initCacheServer?: boolean;
  createDocument?: boolean;
}

interface LoginError {
  key: string;
  value: string;
  type: 'swal' | 'toastr';
}

const LOGIN_ERRORS: LoginError[] = [
  {key: 'Cannot destructure property', value: 'Please check if you are connected to correct network.', type: 'swal'},
  {
    key: 'Request of type \'wallet_requestPermissions\'',
    value: 'Please check if you do not have pending notifications in your wallet',
    type: 'toastr'
  }
];

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private store: Store<UserClaimState>,
              private toastr: ToastrService,
              private iamListenerService: IamListenerService) {
  }

  isSessionActive() {
    return this.iamService.isSessionActive();
  }

  callback(redirectOnAccountChange) {
    if (redirectOnAccountChange) {
      this.logout();
    } else {
      this.disconnect();
    }
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(loginOptions?: LoginOptions, redirectOnAccountChange: boolean = true): Promise<boolean> {
    let retVal = false;

    // TODO: check if any check here is needed.
    try {
      const {did, connected, userClosedModal} = await this.iamService.initializeConnection(loginOptions);
      if (did && connected && !userClosedModal) {
        const callback = redirectOnAccountChange ? this.logout : this.disconnect;
        this.iamListenerService.setListeners(callback.bind(this))
        retVal = true;
      }
    } catch (e) {
      this.handleLoginErrors(e);
    }

    return retVal;
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

  disconnect() {
    this.iamService.iam.closeConnection();
    this.store.dispatch(userClaimsActions.clearUserClaim());
    this.loadingService.hide();
    location.reload();
  }

  setDeepLink(deepLink: any) {
    this._deepLink = deepLink;
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

  public clearWaitSignatureTimer() {
    clearTimeout(this._timer);
    this._timer = undefined;
    this.loadingService.hide();

    if (this._throwTimeoutError) {
      throw new Error('Wallet Signature Timeout');
      this._throwTimeoutError = false;
    }
  }

  private handleLoginErrors(e) {
    console.error(e);
    const loginError = LOGIN_ERRORS.filter(error => e.message.includes(error.key))[0];
    if (loginError?.type === 'swal') {
      this.displayLoginErrorWithSwal(loginError.value);
    } else {
      const message = loginError ? loginError.value : e.message;
      this.toastr.error(message);
    }

  }

  private displayLoginErrorWithSwal(message: string) {
    const config = {
      title: 'Wrong Network',
      text: `${message}`,
      icon: 'error',
      button: 'Proceed',
      closeOnClickOutside: false
    };

    from(SWAL(config)).subscribe(() => this.logout());
  }

  private saveDeepLink(): void {
    location.href = location.origin + '/welcome?returnUrl=' + encodeURIComponent(this._deepLink);
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
}
