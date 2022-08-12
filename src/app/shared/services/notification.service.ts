import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import {
  OwnedEnrolmentsActions,
  OwnedEnrolmentsSelectors,
  RequestedEnrolmentsActions,
  RequestedEnrolmentsSelectors,
} from '@state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _assetsOfferedToMe = new BehaviorSubject<number>(0);

  constructor(
    private claimsFacade: ClaimsFacadeService,
    private assetsFacade: AssetsFacadeService,
    private store: Store
  ) {}

  get pendingApproval() {
    return this.store.select(
      RequestedEnrolmentsSelectors.getPendingEnrolmentsAmount
    );
  }

  get pendingDidDocSync() {
    return this.store.select(OwnedEnrolmentsSelectors.getNotSyncedAmount);
  }

  get assetsOfferedToMe() {
    return this._assetsOfferedToMe.asObservable();
  }

  async init() {
    this._assetsOfferedToMe.next(await this.getOfferedAssetsAmount());
  }

  updatePendingApprovalList() {
    this.store.dispatch(RequestedEnrolmentsActions.getEnrolmentRequests());
  }

  updatePendingPublishList() {
    this.store.dispatch(OwnedEnrolmentsActions.getOwnedEnrolments());
  }

  increaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() + 1);
  }

  decreaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() - 1);
  }

  private async getOfferedAssetsAmount(): Promise<number> {
    return (await this.assetsFacade.getOfferedAssets()).length;
  }
}
