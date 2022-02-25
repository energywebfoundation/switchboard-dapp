import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { Claim } from 'iam-client-lib';
import { EnrolmentListService } from './enrolment-list/enrolment-list.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _pendingApproval = new BehaviorSubject<number>(0);
  private _pendingDidDocSync = new BehaviorSubject<number>(0);
  private _assetsOfferedToMe = new BehaviorSubject<number>(0);

  constructor(
    private claimsFacade: ClaimsFacadeService,
    private assetsFacade: AssetsFacadeService,
    private enrolmentListService: EnrolmentListService
  ) {}

  get pendingApproval() {
    return this._pendingApproval.asObservable();
  }

  get pendingDidDocSync() {
    return this._pendingDidDocSync.asObservable();
  }

  get assetsOfferedToMe() {
    return this._assetsOfferedToMe.asObservable();
  }

  async init() {
    this._pendingApproval.next(await this._initPendingClaimsCount());
    this._assetsOfferedToMe.next(await this.getOfferedAssetsCount());
    this._pendingDidDocSync.next(await this.getPendingDidDocSync());
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
