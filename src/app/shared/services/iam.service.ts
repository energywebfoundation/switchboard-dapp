import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import {
  ENSNamespaceTypes,
  IAM,
  MessagingMethod,
  SafeIam,
  setCacheClientOptions,
  setChainConfig,
  setMessagingOptions
} from 'iam-client-lib';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';
import { safeAppSdk } from './gnosis.safe.service';
import { ConfigService } from './config.service';
import { from, Observable } from 'rxjs';
import { LoginOptions } from './login/login.service';
import { finalize, switchMap } from 'rxjs/operators';
import { ClaimData } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';

const {walletConnectOptions, cacheServerUrl, natsServerUrl, kmsServerUrl} = environment;

const ethAddrPattern = '0x[A-Fa-f0-9]{40}';
const DIDPattern = `^did:[a-z0-9]+:(${ethAddrPattern})$`;

export const VOLTA_CHAIN_ID = 73799;

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

  get address() {
    return this.iam.address;
  }

  registerAsset() {
    return from(this.iam.registerAsset());
  }

  getUserClaims(did?: string) {
    return from(this.iam.getUserClaims({did}));
  }

  createSelfSignedClaim({data, subject}: {
    data: ClaimData;
    subject?: string;
  }) {
    return from(this.iam.createSelfSignedClaim({data, subject}));
  }

  deleteOrganization(namespace: string, returnSteps: boolean) {
    return this.iam.deleteOrganization({
      namespace: namespace,
      returnSteps
    });
  }

  getOrgHistory(namespace: string) {
    return this.wrapWithLoadingService(this.iam.getOrgHierarchy({
      namespace
    }));
  }

  getAssetById(id) {
    return this.wrapWithLoadingService(this.iam.getAssetById({id}), {message: 'Getting selected asset data...'});
  }

  closeConnection() {
    this.iam.closeConnection();
  }

  initializeConnection(loginOptions: LoginOptions) {
    return from(this.iam.initializeConnection(loginOptions));
  }

  isSessionActive() {
    return this.iam.isSessionActive();
  }

  getDefinition(organization: string) {
    return from(this.iam.getDefinition({
      type: ENSNamespaceTypes.Organization,
      namespace: organization
    }));
  }

  getDidDocument() {
    return from(this.iam.getDidDocument());
  }

  async getAddress() {
    return await this.iam.getSigner().getAddress();
  }

  async getBalance() {
    return await this.iam.getSigner().provider.getBalance(await this.getAddress());
  }

  isOwner(namespace: string) {
    return from(this.iam.isOwner({domain: namespace}));
  }

  getOrganizationsByOwner() {
    return from(this.iam.getSigner().getAddress())
      .pipe(
        switchMap((owner) =>
          from(this.iam.getENSTypesByOwner({
              type: ENSNamespaceTypes.Organization,
              owner,
              excludeSubOrgs: false
            })
          )
        )
      );
  }

  async getENSTypesByOwner(ensType: ENSNamespaceTypes) {
    return await this.iam.getENSTypesByOwner({
      type: ensType,
      owner: await this.iam.getSigner().getAddress(),
      excludeSubOrgs: false
    });
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

  isValidDid(didCtrl: AbstractControl): { [key: string]: boolean } | null {
    let retVal = null;
    const did = didCtrl.value;

    if (did && !RegExp(DIDPattern).test(did.trim())) {
      retVal = {invalidDid: true};
    }

    return retVal;
  }

  public wrapWithLoadingService<T>(source: Promise<T> | Observable<T>,
                                   loaderConfig?: { message: string | string[]; cancelable?: boolean }) {
    this.loadingService.show(loaderConfig?.message || '', !!loaderConfig?.cancelable);
    return from(source).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}
