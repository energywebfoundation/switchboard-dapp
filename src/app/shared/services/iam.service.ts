import { Injectable } from '@angular/core';
import { IAM, DIDAttribute, CacheServerClient, MessagingMethod } from 'iam-client-lib';
import { BehaviorSubject } from 'rxjs';
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

  constructor() {
    let options = {
      ...walletConnectOptions,
      cacheClient,
      messagingMethod: MessagingMethod.CacheServer,
      natsServerUrl
    };

    console.info('IAM Service Options', options);

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
      console.log('Initializing connections...');
      let metamaskOpts = undefined;
      if (useMetamaskExtension) {
        metamaskOpts = {
          useMetamaskExtension: useMetamaskExtension,
          reinitializeMetamask: !!reinitializeMetamask
        };
      }

      try {
        const { did, connected, userClosedModal } = await this._iam.initializeConnection(metamaskOpts);
        console.log(did, connected, userClosedModal);
        if (did && connected && !userClosedModal) {
          retVal = true;
        }
      }
      catch (e) {
        console.error(e);
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
    if (this.accountAddress) {
      return;
    }

    // Get Account Address
    const signer = this._iam.getSigner();
    this.accountAddress = await signer.getAddress();

    // Setup DID Document
    this._didDocument = await this._iam.getDidDocument();

    // Get User Claims
    let data: any[] = await this.iam.getUserClaims();
    console.log('getUserClaims()', JSON.parse(JSON.stringify(data)));

    // Get Profile Related Claims
    data = data.filter((item: any) => item.profile ? true : false );
    console.log('Profile Claims', JSON.parse(JSON.stringify(data)));

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
  logout() {
    this._iam.closeConnection();
    this._user = undefined;

    // Logout for Metamask Extension
    if (localStorage['METAMASK_EXT_CONNECTED']) {
      localStorage.removeItem('METAMASK_EXT_CONNECTED');
    }
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
}
