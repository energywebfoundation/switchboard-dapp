import { Injectable } from '@angular/core';
import { IamService, PROVIDER_TYPE } from '../iam.service';
import { LoadingService } from '../loading.service';
import { ToastrService } from 'ngx-toastr';
import {
  AccountInfo,
  IS_ETH_SIGNER,
  ProviderType,
  PUBLIC_KEY,
} from 'iam-client-lib';
import SWAL from 'sweetalert';
import { from, Observable, of } from 'rxjs';
import { IamListenerService } from '../iam-listener/iam-listener.service';
import {
  catchError,
  delayWhen,
  filter, finalize,
  map,
  share,
  take
} from 'rxjs/operators';
import { swalLoginError } from './helpers/swal-login-error-handler';
import { LoginSwalButtons } from './helpers/login-swal.buttons';
import { MetamaskProviderService } from '../metamask-provider/metamask-provider.service';

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
    key: "Request of type 'wallet_requestPermissions'",
    message:
      'Please check if you do not have pending notifications in your wallet',
  },
];

export const WALLET_CONNECT_KEY = 'walletconnect';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private toastr: ToastrService,
    private iamListenerService: IamListenerService,
    private metamaskService: MetamaskProviderService
  ) {}

  isSessionActive() {
    return (
      Boolean(localStorage.getItem(PROVIDER_TYPE)) &&
      Boolean(localStorage.getItem(PUBLIC_KEY)) &&
      Boolean(localStorage.getItem(IS_ETH_SIGNER))
    );
  }

  storeSession() {
    localStorage.setItem(PROVIDER_TYPE, this.iamService.providerType);
    localStorage.setItem(IS_ETH_SIGNER, this.iamService.isEthSigner.toString());
    return from(this.iamService.getPublicKey()).pipe(
      map((key) => localStorage.setItem(PUBLIC_KEY, key))
    );
  }

  clearSession() {
    localStorage.removeItem(PROVIDER_TYPE);
    localStorage.removeItem(PUBLIC_KEY);
    localStorage.removeItem(WALLET_CONNECT_KEY);
    localStorage.removeItem(IS_ETH_SIGNER);
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

  isMetamaskProvider(): boolean {
    return localStorage.getItem(PROVIDER_TYPE) === ProviderType.MetaMask;
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  login(
    loginOptions?: LoginOptions,
    redirectOnChange = true
  ): Observable<{ success: boolean; accountInfo?: AccountInfo | undefined }> {
    this.waitForSignature(loginOptions.providerType, redirectOnChange);
    return from(this.iamService.initializeConnection(loginOptions)).pipe(
      map(({ did, connected, userClosedModal, accountInfo }) => {
        const loginSuccessful = did && connected && !userClosedModal;
        if (loginSuccessful) {
          this.iamListenerService.setListeners((config) =>
            this.openSwal(config, redirectOnChange)
          );
        }
        if (!loginSuccessful) {
          this.loadingService.hide();
          this.openSwal(
            {
              title: 'Ops!',
              text: 'Something went wrong :(',
            },
            redirectOnChange
          );
        }
        return { success: Boolean(loginSuccessful), accountInfo };
      }),

      delayWhen(({ success }) => {
        if (success) return this.storeSession();
      }),
      catchError((err) => this.handleLoginErrors(err, redirectOnChange)),
      finalize(() => this.clearWaitSignatureTimer())
    );
  }

  /**
   * Disconnect from IAM
   */
  logout(saveDeepLink?: boolean) {
    this.clearSession();
    this.iamService.closeConnection().subscribe(() => {
      saveDeepLink
        ? this.saveDeepLink()
        : (location.href = location.origin + '/welcome');
    });
  }

  disconnect(): void {
    this.clearSession();
    this.iamService.closeConnection().subscribe(() => {
      location.reload();
    });
  }

  setDeepLink(deepLink: string) {
    this._deepLink = deepLink;
  }

  public waitForSignature(
    walletProvider?: ProviderType,
    isConnectAndSign?: boolean,
    navigateOnTimeout = true
  ) {
    this._throwTimeoutError = false;
    const timeoutInMinutes = 1;
    const connectionMessage = 'connection to a wallet and ';
    const messages = [
      {
        message: `Your ${connectionMessage}signature is being requested.`,
      },
      {
        message: `If you do not complete this within ${timeoutInMinutes} minute your browser will refresh automatically.`,
      },
    ];
    const waitForSignatureMessage = messages
      .map((m) => m.message);
    this.loadingService.show(waitForSignatureMessage);
    this._timer = setTimeout(() => {
      this._displayTimeout(navigateOnTimeout);
      this.clearWaitSignatureTimer();
      this.clearSession();
      this._throwTimeoutError = true;
    }, timeoutInMinutes * 60000);
  }

  private clearWaitSignatureTimer() {
    console.log('clearing');
    clearTimeout(this._timer);
    this._timer = undefined;
    this.loadingService.hide();

    if (this._throwTimeoutError) {
      this._throwTimeoutError = false;
      throw new Error('Wallet Signature Timeout');
    }
  }

  public wrongNetwork() {
    if (this.isSessionActive()) {
      const swalSubscription = from(
        SWAL({
          icon: 'error',
          closeOnClickOutside: false,
          closeOnEsc: false,
          title: 'Oops!',
          text: "You're using the wrong network",
          buttons: {
            [LoginSwalButtons.Proceed]: {
              text: 'Proceed',
              closeModal: false,
            },
            [LoginSwalButtons.Import]: {
              text: 'Import configuration',
              closeModal: false,
            },
          },
        })
      ).pipe(take(1), share());

      this.proceedLogout(swalSubscription);
      this.importMMConfig(swalSubscription);
    }
  }

  private openSwal(config, navigateOnTimeout: boolean) {
    from(
      SWAL({
        icon: 'error',
        buttons: {
          [LoginSwalButtons.Proceed]: {
            text: 'Proceed',
            closeModal: false,
          },
        },
        closeOnClickOutside: false,
        closeOnEsc: false,
        ...config,
      })
    )
      .pipe(take(1), filter(Boolean))
      .subscribe(() => (navigateOnTimeout ? this.logout() : this.disconnect()));
  }

  /**
   *  Handles non descriptive errors from iam-client-lib and cache server.
   */
  private handleLoginErrors(e, navigateOnTimeout) {
    console.error(e);
    const swalConfig = swalLoginError(e.message);
    if (e.message && this.isSessionActive()) {
      this.loadingService.hide();
      this.openSwal(
        {
          title: 'Oops!',
          text: 'Something went wrong :(',
        },
        true
      );
    }
    if (swalConfig) {
      // in some cases is displayed loader.
      this.loadingService.hide();
      this.openSwal(swalConfig, navigateOnTimeout);
    } else {
      const loginError = LOGIN_TOASTR_UNDERSTANDABLE_ERRORS.filter((error) =>
        e.message.includes(error.key)
      )[0];
      this.toastr.error(loginError ? loginError.message : e.message);
    }
    return of({ success: false });
  }

  private saveDeepLink(): void {
    location.href =
      location.origin +
      '/welcome?returnUrl=' +
      encodeURIComponent(this._deepLink);
  }

  private _displayTimeout(
    navigateOnTimeout?: boolean
  ) {
    let message = 'connect with your wallet and sign';

    const config = {
      title: 'Wallet Signature Timeout',
      text: `The period to ${message} the requested signature has elapsed. Please login again.`,
      icon: 'error',
      closeOnClickOutside: false,
    };

    this.openSwal(config, navigateOnTimeout);
  }

  private proceedLogout(buttonSubscription: Observable<LoginSwalButtons>) {
    buttonSubscription
      .pipe(
        filter(
          (buttonName: LoginSwalButtons) =>
            buttonName === LoginSwalButtons.Proceed
        )
      )
      .subscribe(() => this.disconnect());
  }

  private importMMConfig(buttonSubscription: Observable<LoginSwalButtons>) {
    buttonSubscription
      .pipe(
        filter(
          (buttonName: LoginSwalButtons) =>
            buttonName === LoginSwalButtons.Import
        )
      )
      .subscribe(async () => {
        this.loadingService.show(
          'Switching network... Please check Your Metamask '
        );
        await this.metamaskService.importMetamaskConf();
        this.loadingService.hide();
      });
  }
}
