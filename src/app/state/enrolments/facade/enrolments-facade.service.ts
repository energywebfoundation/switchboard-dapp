import { Injectable } from '@angular/core';
import * as RequestedEnrolmentsSelectors from '../requested/requested.selectors';
import * as OwnedEnrolmentsSelectors from '../owned/owned.selectors';
import * as RevocableEnrolmentsSelectors from '../revokable/revokable.selectors';
import * as OwnedEnrolmentsActions from '../owned/owned.actions';
import * as RequestedEnrolmentsActions from '../requested/requested.actions';
import * as RevocableEnrolmentsActions from '../revokable/revokable.actions';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EnrolmentsFacadeService {
  get pendingApprovalAmount$() {
    return this.store.select(
      RequestedEnrolmentsSelectors.getPendingEnrolmentsAmount
    );
  }
  get notSyncedAmount$() {
    return this.store.select(OwnedEnrolmentsSelectors.getNotSyncedAmount);
  }
  get ownedList$() {
    return this.store.select(OwnedEnrolmentsSelectors.getAllEnrolments);
  }
  get requestedList$() {
    return this.store.select(RequestedEnrolmentsSelectors.getAllEnrolments);
  }
  get revokableList$() {
    return this.store
      .select(RevocableEnrolmentsSelectors.getAllEnrolments)
      .pipe(
        tap((enrolments) => {
          // If there are no revocable enrolments, get the list
          if (enrolments.length === 0) {
            this.store.dispatch(
              RevocableEnrolmentsActions.getRevocableEnrolments()
            );
          }
        })
      );
  }
  private updatedId: string = null;
  constructor(private store: Store) {}

  /**
   * Checks for updates for Owned and Requested enrolments are needed, and updates them if needed in the store.
   * If method is called again within 1 second, it will not dispatch the actions again.
   * @param id
   */
  update(id: string) {
    if (this.updatedId !== id) {
      this.store.dispatch(OwnedEnrolmentsActions.updateEnrolment({ id }));
      this.store.dispatch(RequestedEnrolmentsActions.updateEnrolment({ id }));
      this.updatedId = id;
    }

    setTimeout(() => {
      this.updatedId = null;
    }, 1000);
  }

  remove(id: string): void {
    this.store.dispatch(OwnedEnrolmentsActions.removeEnrolment({ id }));
    this.store.dispatch(RequestedEnrolmentsActions.removeEnrolment({ id }));
  }

  updateOwned(id: string): void {
    this.store.dispatch(OwnedEnrolmentsActions.updateEnrolment({ id }));
  }

  updateRequested(id: string): void {
    this.store.dispatch(RequestedEnrolmentsActions.updateEnrolment({ id }));
  }

  updateRevokable(id: string): void {
    this.store.dispatch(RevocableEnrolmentsActions.updateEnrolment({ id }));
  }
}
