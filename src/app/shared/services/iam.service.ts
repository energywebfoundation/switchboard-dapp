import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  IAM,
  MessagingMethod,
  SafeIam,
  setCacheClientOptions,
  setChainConfig,
  setMessagingOptions,
  WalletProvider
} from 'iam-client-lib';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { safeAppSdk } from './gnosis.safe.service';
import { ConfigService } from './config.service';
import { Store } from '@ngrx/store';
import * as userClaimsActions from '../../state/user-claim/user.actions';
import { UserClaimState } from '../../state/user-claim/user.reducer';
import { ToastrService } from 'ngx-toastr';
import { getDid, getUserProfile } from '../../state/user-claim/user.selectors';
import { take } from 'rxjs/operators';
import * as StakeActions from '../../state/stake/stake.actions';

const LS_WALLETCONNECT = 'walletconnect';
const LS_KEY_CONNECTED = 'connected';
const {walletConnectOptions, cacheServerUrl, natsServerUrl, kmsServerUrl} = environment;

const SWAL = require('sweetalert');

const EVENT_ACCOUNT_CHANGED = 'EVENT_ACCOUNT_CHANGED';
const EVENT_NETWORK_CHANGED = 'EVENT_NETWORK_CHANGED';
const EVENT_DISCONNECTED = 'EVENT_DISCONNECTED';

const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
const DIDPattern = `^did:[a-z0-9]+:(${ethAddrPattern})$`;

export const VOLTA_CHAIN_ID = 73799;

export interface LoginOptions {
  walletProvider?: WalletProvider;
  reinitializeMetamask?: boolean;
  initCacheServer?: boolean;
  initDID?: boolean;
}

export enum LoginType {
  LOCAL = 'local',
  REMOTE = 'remote'
}

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private _iam: IAM;
  public accountAddress = undefined;

  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(private loadingService: LoadingService,
              configService: ConfigService,
              private store: Store<UserClaimState>,
              private toastr: ToastrService) {
    // Set Cache Server
    setCacheClientOptions(VOLTA_CHAIN_ID, {
      url: cacheServerUrl
    });

    // Set RPC
    setChainConfig(VOLTA_CHAIN_ID, {
      rpcUrl: walletConnectOptions.rpcUrl
    });

    // Set Messaging Options
    setMessagingOptions(VOLTA_CHAIN_ID, {
      messagingMethod: MessagingMethod.Nats,
      natsServerUrl,
    });

    let connectionOptions;
    if (kmsServerUrl) {
      connectionOptions = {
        ewKeyManagerUrl: kmsServerUrl
      };
    }

    // Initialize Data
    if (configService.safeInfo) {
      this._iam = new SafeIam(safeAppSdk, connectionOptions);
    } else {
      this._iam = new IAM(connectionOptions);
    }
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(loginOptions?: LoginOptions, redirectOnAccountChange: boolean = true): Promise<boolean> {
    let retVal = false;

    // Check if account address exists
    if (!(await this.isUserPresent())) {
      try {
        const {did, connected, userClosedModal} = await this._iam.initializeConnection(loginOptions);
        if (did && connected && !userClosedModal) {
          // Setup Account Address
          const signer = this._iam.getSigner();
          this.accountAddress = await signer.getAddress();

          // Listen to Account Change
          this._iam.on('accountChanged', () => {
            this._displayAccountAndNetworkChanges(EVENT_ACCOUNT_CHANGED, redirectOnAccountChange);
          });

          // Listen to Network Change
          this._iam.on('networkChanged', () => {
            this._displayAccountAndNetworkChanges(EVENT_NETWORK_CHANGED, redirectOnAccountChange);
          });

          // Listen to Disconnection
          this._iam.on('disconnected', () => {
            this._displayAccountAndNetworkChanges(EVENT_DISCONNECTED, redirectOnAccountChange);
          });
          this.store.dispatch(StakeActions.initOnlyStakingPoolService());
          retVal = true;
        }
      } catch (e) {
        console.error(e);
        this.toastr.error('Could not login, please try again later');
      }
    } else {
      // The account address is set so it means the user is current loggedin
      retVal = true;
    }

    return retVal;
  }

  private async isUserPresent(): Promise<boolean> {
    return Boolean(await this.store.select(getUserProfile).pipe(take(1)).toPromise());
  }

  async setupUser() {
    if (await this.isUserSetUp()) {
      return;
    }

    const didDocument = await this._iam.getDidDocument();
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
    this._iam.closeConnection();
    this.store.dispatch(userClaimsActions.clearUserClaim());

    saveDeepLink ? this.saveDeepLink() : location.href = location.origin + '/#/welcome';

    // Clean up loader.
    this.loadingService.hide();
  }

  disconnect() {
    this._iam.closeConnection();
    this.store.dispatch(userClaimsActions.clearUserClaim());
    this.loadingService.hide();
  }

  setDeepLink(deepLink: any) {
    this._deepLink = deepLink;
  }

  logoutAndRefresh(saveDeepLink?: boolean) {
    this.logout(saveDeepLink);
    const $navigate = setTimeout(() => {
      clearTimeout($navigate);
      location.reload();
    }, 100);
  }

  private saveDeepLink(): void {
    location.href = location.origin + '/#/welcome?returnUrl=' + encodeURIComponent(this._deepLink);
  }

  /**
   * Retrieve IAM Object Reference
   */
  get iam(): IAM {
    return this._iam;
  }

  public waitForSignature(walletProvider?: WalletProvider, isConnectAndSign?: boolean, refreshOnTimeout: boolean = true) {
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
      this._displayTimeout(isConnectAndSign, refreshOnTimeout);
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
        this.logoutAndRefresh();
      } else {
        this.disconnect();
        location.reload();
      }
    }
  }

  private async _displayAccountAndNetworkChanges(changeType: string, redirectOnAccountChange: boolean) {
    let message: string;
    let title: string;

    switch (changeType) {
      case EVENT_ACCOUNT_CHANGED:
        title = 'Account Changed';
        message = 'Account is changed.';
        break;
      case EVENT_NETWORK_CHANGED:
        title = 'Network Changed';
        message = 'Network is changed.';
        break;
      case EVENT_DISCONNECTED:
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
        this.logoutAndRefresh();
      } else {
        this.disconnect();
        location.reload();
      }
    }
  }

  /**
   * @deprecated
   * Use isAlphaNumericOnly function from utils/functions instead.
   * @param event
   * @param includeDot
   */
  isAlphaNumericOnly(event: any, includeDot?: boolean) {
    const charCode = (event.which) ? event.which : event.keyCode;

    // Check if key is alphanumeric key
    return (
      (charCode > 96 && charCode < 123) || // a-z
      (charCode > 64 && charCode < 91) || // A-Z
      (charCode > 47 && charCode < 58) || // 0-9
      (includeDot && charCode === 46) // .
    );
  }

  isValidEthAddress(ethAddressCtrl: AbstractControl): { [key: string]: boolean } | null {
    let retVal = null;
    let ethAddress = ethAddressCtrl.value;

    if (ethAddress && !RegExp(ethAddrPattern).test(ethAddress.trim())) {
      retVal = {invalidEthAddress: true};
    }

    return retVal;
  }

  isValidDid(didCtrl: AbstractControl): { [key: string]: boolean } | null {
    let retVal = null;
    let did = didCtrl.value;

    if (did && !RegExp(DIDPattern).test(did.trim())) {
      retVal = {invalidDid: true};
    }

    return retVal;
  }

  /**
   * @deprecated
   * Use isValidJsonFormat function from utils/validators/json-format instead.
   * @param jsonFormatCtrl
   */
  isValidJsonFormat(jsonFormatCtrl: AbstractControl): { [key: string]: boolean } | null {
    let retVal = null;
    let jsonStr = jsonFormatCtrl.value;

    if (jsonStr && jsonStr.trim()) {
      try {
        JSON.parse(jsonStr);
      } catch (e) {
        retVal = {invalidJsonFormat: true};
      }
    }

    return retVal;
  }
}
