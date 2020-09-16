import { Injectable } from '@angular/core';
import { IAM } from 'iam-client-lib';
import { environment } from 'src/environments/environment';

const LS_WALLETCONNECT = 'walletconnect';
const LS_KEY_CONNECTED = 'connected';
const { walletConnectOptions } = environment;

type User = {
  accountAddress: string
};

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private _iam: IAM;
  private _user: User;

  constructor() {
    // Initialize Data
    console.log(walletConnectOptions);
    this._iam = new IAM(walletConnectOptions);
  }

  /**
   * Login via IAM and retrieve basic user info
   */
  async login(): Promise<boolean> {
    let retVal = false;

    // Check if account address exists
    if (!this._user) {
      const { did, connected, userClosedModal } = await this._iam.initializeConnection();
      const signer = this._iam.getSigner();
      const account = await signer.provider.listAccounts();
  
      // Retrieve account address
      if (account && account.length > 0) {
        this._user = {
          accountAddress: account[0]
        };
      }

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
  isLoggedIn() {
    let isLocallyLoggedIn = false;

    // Check if there is an existing walletconnect session locally
    if (window.localStorage && window.localStorage.getItem(LS_WALLETCONNECT)) {
      let walletconnectData = JSON.parse(window.localStorage.getItem(LS_WALLETCONNECT));
      isLocallyLoggedIn = walletconnectData[LS_KEY_CONNECTED];
    }

    // TRUE if user is locally loggedin or is loggedin from IAM
    return this._iam.isConnected() || isLocallyLoggedIn;
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
    return JSON.parse(JSON.stringify(this._user));
  }
}
