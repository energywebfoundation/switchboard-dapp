import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { ClaimsFacadeService } from './claims-facade/claims-facade.service';
import { AssetsFacadeService } from './assets-facade/assets-facade.service';
import { EnrolmentsFacadeService } from '@state';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _assetsOfferedToMe = new BehaviorSubject<number>(0);

  constructor(
    private claimsFacade: ClaimsFacadeService,
    private assetsFacade: AssetsFacadeService,
    private enrolmentFacade: EnrolmentsFacadeService
  ) {}

  get pendingApproval() {
    return this.enrolmentFacade.pendingApprovalAmount$;
  }

  get pendingDidDocSync() {
    return this.enrolmentFacade.notSyncedAmount$;
  }

  get assetsOfferedToMe() {
    return this._assetsOfferedToMe.asObservable();
  }

  init() {
    this.getOfferedAssetsAmount().subscribe({
      next: (v) => {
        this._assetsOfferedToMe.next(v);
      },
    });
  }

  increaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() + 1);
  }

  decreaseAssetsOfferedToMeCount() {
    this._assetsOfferedToMe.next(this._assetsOfferedToMe.getValue() - 1);
  }

  private getOfferedAssetsAmount(): Observable<number> {
    return this.assetsFacade
      .getOfferedAssets()
      .pipe(map((assets) => assets.length));
  }
}
