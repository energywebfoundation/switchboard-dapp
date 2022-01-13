import { Injectable } from '@angular/core';
import { IamService, PROVIDER_TYPE } from '../iam.service';
import { LoadingService } from '../loading.service';
import { ToastrService } from 'ngx-toastr';
import { AccountInfo, ProviderType, PUBLIC_KEY } from 'iam-client-lib';
import SWAL from 'sweetalert';
import { from, Observable, of } from 'rxjs';
import { IamListenerService } from '../iam-listener/iam-listener.service';
import { catchError, delayWhen, filter, map, take } from 'rxjs/operators';
import { swalLoginError } from './helpers/swal-login-error-handler';

export interface LoginOptions {
  providerType?: ProviderType;
  reinitializeMetamask?: boolean;
  initCacheServer?: boolean;
  createDocument?: boolean;
}

interface LoginError {
  key: string;
  message: string;
}

export const LOGIN_TOASTR_UNDERSTANDABLE_ERRORS: LoginError[] = [
  {
    key: 'Request of type \'wallet_requestPermissions\'',
    message: 'Please check if you do not have pending notifications in your wallet',
  }
];

export const WALLET_CONNECT_KEY = 'walletconnect';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(private loadingService: LoadingService,
              private iamService: IamService,
              private toastr: ToastrService,
              private iamListenerService: IamListenerService) {
  }

  isSessionActive() {
    return (Boolean(localStorage.getItem(PROVIDER_TYPE)) && Boolean(localStorage.getItem(PUBLIC_KEY)));
  }

  storeSession() {
    localStorage.setItem(PROVIDER_TYPE, this.iamService.providerType);
    return from(this.iamService.getPublicKey()).pipe(
      map((key) => localStorage.setItem(PUBLIC_KEY, key)),
    );
  }

  clearSession() {
    localStorage.removeItem(PROVIDER_TYPE);
    localStorage.removeItem(PUBLIC_KEY);
    localStorage.removeItem(WALLET_CONNECT_KEY);
  }

  getSession() {
    return {
      providerType: localStorage.getItem(PROVIDER_TYPE) as ProviderType,
      publicKey: localStorage.getItem(PUBLIC_KEY),
    };
  }

  getProviderType() {
    return this.iamService.providerType;
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  login(loginOptions?: LoginOptions, redirectOnChange: boolean = true): Observable<{ success: boolean; accountInfo?: AccountInfo | undefined }> {
    return from(this.iamService.initializeConnection(loginOptions))
      .pipe(
        map(({did, connected, userClosedModal, accountInfo}) => {
          const loginSuccessful = did && connected && !userClosedModal;
          if (loginSuccessful) {
            this.iamListenerService.setListeners((config) => this.openSwal(config, redirectOnChange));
          }
          if (!loginSuccessful) {
            this.loadingService.hide();
            this.openSwal({
              title: 'Ops!', text: 'Something went wrong :('
            }, redirectOnChange);
          }
          return {success: Boolean(loginSuccessful), accountInfo};
        }),

        delayWhen(({success}) => {
          if (success) return this.storeSession();
        }),
        catchError(err => this.handleLoginErrors(err, redirectOnChange))
      );
  }

  /**
   * Disconnect from IAM
   */
  logout(saveDeepLink?: boolean) {
    this.clearSession();
    this.iamService.closeConnection().subscribe(() => {
      saveDeepLink ? this.saveDeepLink() : location.href = location.origin + '/welcome';
    });
  }

  disconnect() {
    this.iamService.closeConnection().subscribe(() => {
      location.reload();
    });
  }

  setDeepLink(deepLink: any) {
    this._deepLink = deepLink;
  }

  public waitForSignature(walletProvider?: ProviderType, isConnectAndSign?: boolean, navigateOnTimeout: boolean = true) {
    this._throwTimeoutError = false;
    const timeoutInMinutes = walletProvider === ProviderType.EwKeyManager ? 2 : 1;
    const connectionMessage = isConnectAndSign ? 'connection to a wallet and ' : '';
    const messages = [
      {
        message: `Your ${connectionMessage}signature is being requested.`,
        relevantProviders: 'all'
      },
      {
        message: 'EW Key Manager should appear in a new browser tab or window. If you do not see it, please check your browser settings.',
        relevantProviders: ProviderType.EwKeyManager
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
      this._throwTimeoutError = false;
      throw new Error('Wallet Signature Timeout');
    }
  }

  private openSwal(config, navigateOnTimeout: boolean) {
    from(SWAL({
      icon: 'error',
      button: 'Proceed',
      closeOnClickOutside: false,
      ...config
    }))
      .pipe(
        take(1),
        filter(Boolean)
      )
      .subscribe(() =>
        navigateOnTimeout ? this.logout() : this.disconnect()
      );
  }

  /**
   *  Handles non descriptive errors from iam-client-lib and cache server.
   */
  private handleLoginErrors(e, navigateOnTimeout) {
    console.error(e);
    const swalConfig = swalLoginError(e.message);
    if (e.message && this.isSessionActive()) {
      this.loadingService.hide();
      this.openSwal({
        title: 'Ops!', text: 'Something went wrong :('
      }, true);
    }
    if (swalConfig) {
      // in some cases is displayed loader.
      this.loadingService.hide();
      this.openSwal(swalConfig, navigateOnTimeout);
    } else {
      const loginError = LOGIN_TOASTR_UNDERSTANDABLE_ERRORS.filter(error => e.message.includes(error.key))[0];
      this.toastr.error(loginError ? loginError.message : e.message);
    }
    return of({success: false});
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

    this.openSwal(config, navigateOnTimeout);
  }
}


