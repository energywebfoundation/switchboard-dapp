import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { ClaimData, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { IamService } from './iam.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService implements OnDestroy {
  private _pendingApproval = new BehaviorSubject<number>(0);
  private _pendingDidDocSync = new BehaviorSubject<number>(0);
  private _assetsOfferedToMe = new BehaviorSubject<number>(0);
  private _pendingAssetDidDocSync = new BehaviorSubject<number>(0);
  private _pendingSyncCount$ = new BehaviorSubject<number | undefined>(
    undefined
  );

  public initialized = false;
  private destroy$ = new Subject<void>();

  constructor(
    private claimsFacade: ClaimsFacadeService,
    private assetsFacade: AssetsFacadeService,
    private iamService: IamService
  ) {
    this._pendingApproval;
    this._pendingDidDocSync = new BehaviorSubject<number>(0);
    this._assetsOfferedToMe = new BehaviorSubject<number>(0);
    this._pendingAssetDidDocSync = new BehaviorSubject<number>(0);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get pendingApproval() {
    return this._pendingApproval.asObservable();
  }

  get pendingDidDocSync() {
    return this._pendingDidDocSync.asObservable();
  }

  get assetsOfferedToMe() {
    return this._assetsOfferedToMe.asObservable();
  }

  get pendingAssetDidDocSync() {
    return this._pendingAssetDidDocSync.asObservable();
  }

  initNotifCounts(
    pendingApproval: number,
    assetsOfferedToMe: number,
    pendingSyncToDID: number
  ) {
    this._pendingApproval.next(pendingApproval);
    this._assetsOfferedToMe.next(assetsOfferedToMe);
    this._pendingDidDocSync.next(pendingSyncToDID);
  }

  increasePendingApprovalCount() {
    this._pendingApproval.next(this._pendingApproval.getValue() + 1);
  }

  decreasePendingApprovalCount() {
    this._pendingApproval.next(this._pendingApproval.getValue() - 1);
  }

  increasePendingDidDocSyncCount() {
    this._pendingDidDocSync.next(this._pendingDidDocSync.getValue() + 1);
  }

  decreasePendingDidDocSyncCount() {
    this._pendingDidDocSync.next(this._pendingDidDocSync.getValue() - 1);
  }

  increaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() + 1);
  }

  decreaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() - 1);
  }

  increasePendingAssetDidDocSyncCount() {
    this._pendingAssetDidDocSync.next(
      this._pendingAssetDidDocSync.getValue() + 1
    );
  }

  decreasePendingAssetDidDocSyncCount() {
    this._pendingAssetDidDocSync.next(
      this._pendingAssetDidDocSync.getValue() - 1
    );
  }

  setZeroToPendingDidDocSyncCount() {
    this._pendingSyncCount$.next(0);
  }

  async _initPendingClaimsCount(): Promise<number> {
    return (await this.claimsFacade.getClaimsByIssuer()).filter(
      (item) => !item.isRejected
    ).length;
  }

  async getOfferedAssetsCount(): Promise<number> {
    return (await this.assetsFacade.getOfferedAssets()).length;
  }

  async getPendingDidDocSync(): Promise<number> {
    let list: any[] = await Promise.all(
      (await this.iamService.claimsService.getClaimsByRequester({
          did: this.iamService.signerService.did,
          isAccepted: true,
        }))
      .map((item) => this.checkForNotSyncedOnChain(item)));

    if (list && list.length) {
      for (const item of list) {
        const arr = item.claimType.split(`.${NamespaceType.Role}.`);
        item.roleName = arr[0];
        item.requestDate = new Date(item.createdAt);
      }

        await this.appendDidDocSyncStatus(list);
    }

    return list.filter(item => this.isPendingSync(item)).length;
  }

  private async appendDidDocSyncStatus(list: any[]) {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const claims: ClaimData[] = (
      await this.iamService.claimsService.getUserClaims()
    ).filter((item: ClaimData) => {
      if (item && item.claimType) {
        const arr = item.claimType.split('.');
        if (arr.length > 1 && arr[1] === NamespaceType.Role) {
          return true;
        }
        return false;
      }
      return false;
    });

    if (claims && claims.length) {
      claims.forEach((item: ClaimData) => {
        for (let i = 0; i < list.length; i++) {
          if (item.claimType === list[i].claimType) {
            list[i].isSynced = true;
          }
        }
      });
    }
  }

  async checkForNotSyncedOnChain(item) {
    if (item.registrationTypes.includes(RegistrationTypes.OnChain)) {
      return {
        ...item,
        notSyncedOnChain: !(await this.iamService.claimsService.hasOnChainRole(
          this.iamService.signerService.did,
          item.claimType,
          parseInt(item.claimTypeVersion.toString(), 10)
        )),
      };
    }
    return item;
  }

  isPendingSync(element) {
    return (
      !element?.isSynced &&
      element.registrationTypes.includes(RegistrationTypes.OffChain) &&
      !(
        element.registrationTypes.length === 1 &&
        element.registrationTypes.includes(RegistrationTypes.OnChain)
      )
    );
  }
}
