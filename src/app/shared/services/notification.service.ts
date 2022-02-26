import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { EnrolmentListService } from './enrolment-list/enrolment-list.service';

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
    this._pendingApproval.next(await this.getPendingClaimsAmount());
    this._assetsOfferedToMe.next(await this.getOfferedAssetsAmount());
    this._pendingDidDocSync.next(await this.getPendingDidDocSyncAmount());
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

  private async getPendingClaimsAmount(): Promise<number> {
    return (await this.claimsFacade.getNotRejectedClaimsByIssuer()).length;
  }

  private async getOfferedAssetsAmount(): Promise<number> {
    return (await this.assetsFacade.getOfferedAssets()).length;
  }

  private async getPendingDidDocSyncAmount(): Promise<number> {
    return (await this.enrolmentListService.getNotSyncedDIDsDocsList()).length;
  }
}
