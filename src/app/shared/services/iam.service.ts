import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { IAM, DIDAttribute, CacheServerClient, MessagingMethod } from 'iam-client-lib';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';

const LS_WALLETCONNECT = 'walletconnect';
const LS_KEY_CONNECTED = 'connected';
const { walletConnectOptions, cacheServerUrl, natsServerUrl } = environment;

const SWAL = require('sweetalert');

const cacheClient = new CacheServerClient({
  url: cacheServerUrl
});

const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
const DIDPattern = `^did:[a-z0-9]+:(${ethAddrPattern})$`;

export enum LoginType {
  LOCAL = 'local',
  REMOTE = 'remote'
};

declare type User = {
  name: string,
  birthdate: Date,
  address: string
};

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private _iam: IAM;
  private _user: BehaviorSubject<User | undefined>;
  private _didDocument: any;
  public accountAddress = undefined;

  private _throwTimeoutError = false;
  private _timer = undefined;
  private _deepLink = '';

  constructor(private loadingService: LoadingService) {
    let options = {
      ...walletConnectOptions,
      cacheClient,
      messagingMethod: MessagingMethod.CacheServer,
      natsServerUrl
    };

    // console.info('IAM Service Options', options);

    // Initialize Data
    this._user = new BehaviorSubject<User>(undefined);
    this._iam = new IAM(options);
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(useMetamaskExtension?: boolean, reinitializeMetamask?: boolean): Promise<boolean> {
    let retVal = false;

    // Check if account address exists
    if (!this._user.getValue()) {
      // console.log('Initializing connections...');
      let metamaskOpts = undefined;
      if (useMetamaskExtension) {
        metamaskOpts = {
          useMetamaskExtension: useMetamaskExtension,
          reinitializeMetamask: !!reinitializeMetamask
        };
      }

      try {
        const { did, connected, userClosedModal } = await this._iam.initializeConnection(metamaskOpts);
        // console.log(did, connected, userClosedModal);
        if (did && connected && !userClosedModal) {
          // Setup Account Address
          const signer = this._iam.getSigner();
          this.accountAddress = await signer.getAddress();

          // console.log('signer', signer);

          // Listen to Account Change
          if (useMetamaskExtension) {
            this._listenToMetamaskAccountChange();
          }

          retVal = true;
        }
      }
      catch (e) {
        console.error(e);
        this.logout();
        location.reload();
      }
    }
    else {
      // The account address is set so it means the user is current loggedin
      retVal = true;
    }

    return retVal;
  }

  async setupUser() {
    // No need to setup user again
    if (this._didDocument) {
      return;
    }

    // Setup DID Document
    this._didDocument = await this._iam.getDidDocument();

    // Get User Claims
    let data: any[] = await this.iam.getUserClaims();
    // console.log('getUserClaims()', JSON.parse(JSON.stringify(data)));

    // Get Profile Related Claims
    data = data.filter((item: any) => item.profile ? true : false );
    // console.log('Profile Claims', JSON.parse(JSON.stringify(data)));

    // Get the most recent claim
    if (data.length) {
        let tmp: any = data[0].profile;
        this._user.next({
          name: tmp.name,
          birthdate: new Date(tmp.birthdate),
          address: tmp.address
      });
    }
    else {
      this._user.next(undefined);
    }
  }

  /**
   * Disconnect from IAM
   */
  logout(saveDeepLink?: boolean) {
    this._iam.closeConnection();
    this._user = undefined;

    // Logout for Metamask Extension
    if (localStorage['METAMASK_EXT_CONNECTED']) {
      localStorage.removeItem('METAMASK_EXT_CONNECTED');
    }

    // Save Deep Link
    localStorage.removeItem('DEEP_LINK');
    if (saveDeepLink) {
      localStorage['DEEP_LINK'] = this._deepLink;
    }
  }

  setDeepLink(deepLink: any) {
    this._deepLink = deepLink;
  }

  logoutAndRefresh(saveDeepLink?: boolean) {
    this.logout(saveDeepLink);
    let $navigate = setTimeout(() => {
      clearTimeout($navigate);
      location.reload();
  }, 100);
  }

  /**
   * Checks if the there is a user currently logged-in into the dApp
   */
  getLoginStatus(): LoginType {
    if (this._iam.isConnected()) {
      // User is loggedin via remote connection
      return LoginType.REMOTE;
    }
    else {
      let isLocallyLoggedIn = false;

      // Check if there is an existing walletconnect or metamask session locally
      if (window.localStorage) {
        if (window.localStorage.getItem(LS_WALLETCONNECT)) {
          let walletconnectData = JSON.parse(window.localStorage.getItem(LS_WALLETCONNECT));
          isLocallyLoggedIn = walletconnectData[LS_KEY_CONNECTED];
        }
        else if (window.localStorage.getItem('METAMASK_EXT_CONNECTED')) {
          isLocallyLoggedIn = true;
        }
        
      }
      
      if (isLocallyLoggedIn) {
        // User has existing local session, need to call IAM.login()
        return LoginType.LOCAL;
      }
      else {
        // User is not logged-in
        return;
      }
    }
  }

  /**
   * Retrieve IAM Object Reference
   */
  get iam(): IAM {
    return this._iam;
  }

  get userProfile() {
    return this._user.asObservable();
  }

  setUserProfile(data: any) {
    this._user.next(data);
  }

  private _listenToMetamaskAccountChange() {
    // Listen to account changes in metamask
    if (window['ethereum']) {
      window['ethereum'].on('accountsChanged', () => {
        location.reload();
      });
    }
  }

  public waitForSignature(isConnectAndSign?: boolean) {
    this._throwTimeoutError = false;
    let timeout = 60000;
    let messageType = 'sign';
    if (isConnectAndSign) {
      messageType = 'connect to your wallet and sign';
    }

    this.loadingService.show(['Your signature is being requested.', `Please ${messageType} within ${timeout / 1000} seconds or you will be automatically logged-out.`]);
    this._timer = setTimeout(() => {
      this._displayTimeout(timeout / 1000, isConnectAndSign);
      this.clearWaitSignatureTimer();
      this._throwTimeoutError = true;
    }, timeout);
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

  private async _displayTimeout(timeout: number, isConnectAndSign?: boolean) {
    let message = 'sign';
    if (isConnectAndSign) {
      message = 'connect with your wallet and sign'
    }
    let config = {
        title: 'Wallet Signature Timeout',
        text: `The period to ${message} the requested signature has elapsed. Please login again.`,
        icon: 'error',
        button: 'Proceed',
        closeOnClickOutside: false
      };

    let result = await SWAL(config);
    if (result) {
        this.logoutAndRefresh();
    }
  }

  isAlphaNumericOnly(event: any, includeDot?: boolean) {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // Check if key is alphanumeric key
    if ((charCode > 96 && charCode < 123) || (charCode > 47 && charCode < 58) || (includeDot && charCode === 46)) {
      return true;
    }

    return false;
  }

  isValidEthAddress(ethAddressCtrl: AbstractControl) : { [key: string]: boolean } | null {
    let retVal = null;
    let ethAddress = ethAddressCtrl.value;

    if (ethAddress && !RegExp(ethAddrPattern).test(ethAddress.trim())) {
      retVal = { invalidEthAddress: true };
    }

    return retVal;
  }

  isValidDid(didCtrl: AbstractControl) : { [key: string]: boolean } | null {
    let retVal = null;
    let did = didCtrl.value;

    if (did && !RegExp(DIDPattern).test(did.trim())) {
      retVal = { invalidDid: true };
    }

    return retVal;
  }

  isValidJsonFormat(jsonFormatCtrl: AbstractControl) : { [key: string]: boolean } | null {
    let retVal = null;
    let jsonStr = jsonFormatCtrl.value;

    if (jsonStr && jsonStr.trim()) {
      try {
        JSON.parse(jsonStr);
      }
      catch(e) {
        retVal = { invalidJsonFormat: true };
      }
    }

    return retVal;
  }
}
