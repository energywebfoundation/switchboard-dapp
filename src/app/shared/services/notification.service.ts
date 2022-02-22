import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import {
  Claim,
  ClaimData,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { IamService } from './iam.service';
import { EnrolmentListService } from './enrolment-list/enrolment-list.service';

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
    private iamService: IamService,
    private enrolmentListService: EnrolmentListService
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
    const list: Claim[] = await this.claimsFacade.getClaimsByRequester(true);

    return (
      await this.enrolmentListService.appendDidDocSyncStatus(list)
    ).filter((item) => this.enrolmentListService.isPendingSync(item)).length;
  }
}
