import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _pendingApproval    : BehaviorSubject<number>;
  private _pendingDidDocSync  : BehaviorSubject<number>;
  
  constructor() {
    this._pendingApproval     = new BehaviorSubject<number>(0);
    this._pendingDidDocSync   = new BehaviorSubject<number>(0); 
  }

  get pendingApproval() {
    return this._pendingApproval.asObservable();
  }

  get pendingDidDocSync() {
    return this._pendingDidDocSync.asObservable();
  }

  initNotifCounts(pendingApproval: number, pendingDidDocSync: number) {
    this._pendingApproval.next(pendingApproval);
    this._pendingDidDocSync.next(pendingDidDocSync);
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
}
