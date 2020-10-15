import { Injectable } from '@angular/core';
import { IAM, DIDAttribute, CacheServerClient, MessagingMethod } from 'iam-client-lib';
import { environment } from 'src/environments/environment';

const LS_WALLETCONNECT = 'walletconnect';
const LS_KEY_CONNECTED = 'connected';
const { walletConnectOptions, cacheServerUrl, natsServerUrl } = environment;

const cacheClient = new CacheServerClient({
  url: cacheServerUrl
})

export enum LoginType {
  LOCAL = 'local',
  REMOTE = 'remote'
};

declare type User = {
  accountAddress: string
};

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private _iam: IAM;
  private _user: User;
  private _didDocument: any;

  constructor() {
    let options = {
      ...walletConnectOptions,
      cacheClient,
      messagingMethod: MessagingMethod.CacheServer,
      natsServerUrl
    };

    console.info('IAM Service Options', options);

    // Initialize Data
    this._iam = new IAM(options);
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(): Promise<boolean> {
    let retVal = false;

    // Check if account address exists
    if (!this._user) {
      const { did, connected, userClosedModal } = await this._iam.initializeConnection();
      console.log(did, connected, userClosedModal);
      if (did && connected && !userClosedModal) {
        retVal = true;
      }
    }
    else {
      // The account address is set so it means the user is current loggedin
      retVal = true;
    }

    return retVal;
  }

  async setupUser() {
    const signer = this._iam.getSigner();
    const account = await signer.getAddress();
    this._didDocument = await this._iam.getDidDocument();

    // Retrieve account address
    if (account) {
      this._user = {
        accountAddress: account
      };
    }
  }

  /**
   * Disconnect from IAM
   */
  logout() {
    this._iam.closeConnection();
    this._user = undefined;
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

      // Check if there is an existing walletconnect session locally
      if (window.localStorage && window.localStorage.getItem(LS_WALLETCONNECT)) {
        let walletconnectData = JSON.parse(window.localStorage.getItem(LS_WALLETCONNECT));
        isLocallyLoggedIn = walletconnectData[LS_KEY_CONNECTED];
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

  /**
   * Retreive User Details
   */
  get user() {
    return this._user ? JSON.parse(JSON.stringify(this._user)) : this._user;
  }
}
