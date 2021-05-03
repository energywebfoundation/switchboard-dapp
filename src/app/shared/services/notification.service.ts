import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _pendingApproval    : BehaviorSubject<number>;
  private _pendingDidDocSync  : BehaviorSubject<number>;

  private _assetsOfferedToMe      : BehaviorSubject<number>;
  private _pendingAssetDidDocSync : BehaviorSubject<number>;

  public initialized          = false;
  
  constructor() {
    this._pendingApproval     = new BehaviorSubject<number>(0);
    this._pendingDidDocSync   = new BehaviorSubject<number>(0); 
    this._assetsOfferedToMe   = new BehaviorSubject<number>(0); 
    this._pendingAssetDidDocSync   = new BehaviorSubject<number>(0); 
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

  initNotifCounts(pendingApproval: number, pendingDidDocSync: number, assetsOfferedToMe: number, pendingAssetDidDocSync: number) {
    this._pendingApproval.next(pendingApproval);
    this._pendingDidDocSync.next(pendingDidDocSync);
    this._assetsOfferedToMe.next(assetsOfferedToMe);
    this._pendingAssetDidDocSync.next(pendingAssetDidDocSync);
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
    this._pendingAssetDidDocSync.next(this._pendingAssetDidDocSync.getValue() + 1);
  }

  decreasePendingAssetDidDocSyncCount() {
    this._pendingAssetDidDocSync.next(this._pendingAssetDidDocSync.getValue() - 1);
  }
}
