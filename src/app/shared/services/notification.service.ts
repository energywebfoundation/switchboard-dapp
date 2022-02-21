import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';

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
    private assetsFacade: AssetsFacadeService
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

  private asd() {
    // this.pendingApproval
    //   .pipe(takeUntil(this._subscription$))
    //   .subscribe(async () => {
    //     await this._initPendingClaimsCount();
    //     this._calcTotalCount();
    //   });
    // this.assetsOfferedToMe
    //   .pipe(takeUntil(this._subscription$))
    //   .subscribe(async () => {
    //     await this._initAssetsOfferedToMeSyncCount();
    //     this._calcTotalCount();
    //   });
    // this.pendingAssetDidDocSync
    //   .pipe(takeUntil(this._subscription$))
    //   .subscribe(async () => {
    //     await this._initApprovedClaimsForAssetSyncCount();
    //     this._calcTotalCount();
    //   });
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
    pendingAssetDidDocSync: number
  ) {
    this._pendingApproval.next(pendingApproval);
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
}
