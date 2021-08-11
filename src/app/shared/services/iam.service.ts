import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  ENSNamespaceTypes,
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
import { from } from 'rxjs';

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

  constructor(private loadingService: LoadingService,
              configService: ConfigService) {
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
   * Retrieve IAM Object Reference
   */
  get iam(): IAM {
    return this._iam;
  }

  getDefinition(organization: string) {
    return from(this.iam.getDefinition({
      type: ENSNamespaceTypes.Organization,
      namespace: organization
    }));
  }

  async getAddress() {
    return await this.iam.getSigner().getAddress();
  }

  async getBalance() {
    return await this.iam.getSigner().provider.getBalance(await this.getAddress());
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
    const ethAddress = ethAddressCtrl.value;

    if (ethAddress && !RegExp(ethAddrPattern).test(ethAddress.trim())) {
      retVal = {invalidEthAddress: true};
    }

    return retVal;
  }

  isValidDid(didCtrl: AbstractControl): { [key: string]: boolean } | null {
    let retVal = null;
    const did = didCtrl.value;

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
    const jsonStr = jsonFormatCtrl.value;

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
