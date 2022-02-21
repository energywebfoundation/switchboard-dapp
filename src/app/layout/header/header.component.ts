/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import {
  AssetHistoryEventType,
  ClaimEventType,
  NamespaceType,
} from 'iam-client-lib';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { IamService } from '../../shared/services/iam.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import * as userSelectors from '../../state/user-claim/user.selectors';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../state/user-claim/user.reducer';
import {
  SwitchboardToastr,
  SwitchboardToastrService,
} from '../../shared/services/switchboard-toastr.service';
import { LoginService } from '../../shared/services/login/login.service';
import { logoutWithRedirectUrl } from '../../state/auth/auth.actions';
import { DidBookComponent } from '../../modules/did-book/components/did-book/did-book.component';
import { DidBookService } from '../../modules/did-book/services/did-book.service';
import { AuthSelectors, SettingsActions, SettingsSelectors } from '@state';
import { truthy } from '@operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUserDid = 'did:ewc:';
  currentUserRole = '';

  isNavMenuVisible = true;

  currentNav = '';

  // Tasks
  tasks = {
    totalCount: 0,
    assetsOfferedToMeCount: 0,
    pendingAssetSyncCount: 0,
    pendingApprovalCount: 0,
  };

  // Notifications
  notif = {
    totalCount: 0,
    pendingSyncCount: 0,
  };

  isLoadingNotif = true;
  userName$ = this.store
    .select(userSelectors.getUserName)
    .pipe(map((value) => (value ? value : 'Manage Profile')));
  userDid$ = this.store.select(userSelectors.getDid);
  notificationNewItems = 0;
  notificationList$: Observable<SwitchboardToastr[]> = this.toastr
    .getMessageList()
    .pipe(
      tap(
        (items) =>
          (this.notificationNewItems = items.filter(
            (item) => item.isNew
          ).length)
      )
    );
  isExperimentalEnabled$ = this.store.select(
    SettingsSelectors.isExperimentalEnabled
  );

  private _pendingApprovalCountListener: any;
  private _pendingSyncCountListener: any;
  private _assetsOfferedToMeCountListener: any;
  private _pendingAssetSyncCountListener: any;
  private _subscription$ = new Subject();
  private _iamSubscriptionId: number;
  private isInitNotificationCount = false;

  constructor(
    private iamService: IamService,
    private router: Router,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService,
    public dialog: MatDialog,
    private store: Store,
    private loginService: LoginService,
    private didBookService: DidBookService
  ) {
    this.store
      .select(AuthSelectors.isUserLoggedIn)
      .pipe(truthy(), takeUntil(this._subscription$))
      .subscribe(() => this.didBookService.getList());

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this._subscription$)
      )
      .subscribe((event: any) => {
        this.loginService.setDeepLink(event.url);

        this.isNavMenuVisible = event.url !== '/dashboard';

        const pathArr = event.url.split('/');

        // TODO: use routerLinkActive instead
        this.currentNav = pathArr[1];
      });
  }

  async ngOnDestroy(): Promise<void> {
    if (this._pendingSyncCountListener) {
      this._pendingSyncCountListener.unsubscribe();
    }
    if (this._pendingApprovalCountListener) {
      this._pendingApprovalCountListener.unsubscribe();
    }
    if (this._assetsOfferedToMeCountListener) {
      this._assetsOfferedToMeCountListener.unsubscribe();
    }
    if (this._pendingAssetSyncCountListener) {
      this._pendingAssetSyncCountListener.unsubscribe();
    }

    this._subscription$.next();
    this._subscription$.complete();

    // Unsubscribe to IAM Events
    await this.iamService.messagingService.unsubscribeFrom(
      this._iamSubscriptionId
    );
  }

  didCopied() {
    this.toastr.success('User DID is copied to clipboard.');
  }

  openDialogUser(): void {
    this.dialog.open(DialogUserComponent, {
      width: '440px',
      maxWidth: '100%',
      disableClose: true,
    });
  }

  openDidBook(): void {
    this.dialog.open(DidBookComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true,
    });
  }

  onExperimentalChange(event: MatSlideToggleChange) {
    this.store.dispatch(
      event.checked
        ? SettingsActions.enableExperimental()
        : SettingsActions.disableExperimental()
    );
  }

  ngOnInit() {
    this.store
      .select(userSelectors.getUserProfile)
      .pipe(filter(Boolean), takeUntil(this._subscription$))
      .subscribe(() => {
        this._initNotificationsAndTasks();
      });
  }

  private _initNotificationsAndTasks() {
    // Init Notif Count
    if (!this.isInitNotificationCount) {
      this._initNotificationsAndTasksCount();
      this.isInitNotificationCount = true;
    }
  }

  private _calcTotalCount() {
    this.notif.totalCount = this.notif.pendingSyncCount;
    this.tasks.totalCount =
      this.tasks.assetsOfferedToMeCount +
      this.tasks.pendingAssetSyncCount +
      this.tasks.pendingApprovalCount;
    if (this.notif.totalCount < 0) {
      this.notif.totalCount = 0;
    }
    if (this.tasks.totalCount < 0) {
      this.tasks.totalCount = 0;
    }
  }

  private async _initNotificationAndTasksListeners() {
    // Initialize Notif Counts
    this.notifService.initNotifCounts(
      this.tasks.pendingApprovalCount,
      this.notif.pendingSyncCount,
      this.tasks.assetsOfferedToMeCount,
      this.tasks.pendingAssetSyncCount
    );

    // Listen to Count Changes
    this._pendingApprovalCountListener = this.notifService.pendingApproval
      .pipe(takeUntil(this._subscription$))
      .subscribe(async () => {
        await this._initPendingClaimsCount();
        this._calcTotalCount();
      });
    this._pendingSyncCountListener = this.notifService.pendingDidDocSync
      .pipe(takeUntil(this._subscription$))
      .subscribe(async () => {
        await this._initApprovedClaimsForSyncCount();
        this._calcTotalCount();
      });
    this._assetsOfferedToMeCountListener = this.notifService.assetsOfferedToMe
      .pipe(takeUntil(this._subscription$))
      .subscribe(async () => {
        await this._initAssetsOfferedToMeSyncCount();
        this._calcTotalCount();
      });
    this._pendingAssetSyncCountListener =
      this.notifService.pendingAssetDidDocSync
        .pipe(takeUntil(this._subscription$))
        .subscribe(async () => {
          await this._initApprovedClaimsForAssetSyncCount();
          this._calcTotalCount();
        });

    // Listen to External Messages
    this._iamSubscriptionId =
      await this.iamService.messagingService.subscribeTo({
        messageHandler: this._handleMessage.bind(this),
      });
  }

  private _handleMessage(message: any) {
    if (message.type) {
      this._handleAssetEvents(message.type);
      this._handleClaimEvents(message.type);
    }
  }

  private _handleAssetEvents(type: string) {
    switch (type) {
      case AssetHistoryEventType.ASSET_OFFERED:
        this.toastr.info('An asset is offered to you.', 'Asset Offered');
        this.notifService.increaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_TRANSFERRED:
        this.toastr.success(
          'Your asset is successfully tranferred to a new owner.',
          'Asset Transferred'
        );
        break;
      case AssetHistoryEventType.ASSET_OFFER_CANCELED:
        this.toastr.warning(
          'An asset offered to you is cancelled by the owner.',
          'Asset Offer Cancelled'
        );
        this.notifService.decreaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_OFFER_REJECTED:
        this.toastr.warning(
          'An asset you offered is rejected.',
          'Asset Offer Rejected'
        );
        break;
    }
  }

  private _handleClaimEvents(type: string) {
    switch (type) {
      case ClaimEventType.REQUEST_CREDENTIALS:
        this.notifService.increasePendingApprovalCount();
        this.toastr.info(
          'A new enrolment request is waiting for your approval.',
          'New Enrolment Request'
        );
        break;
      case ClaimEventType.ISSUE_CREDENTIAL:
        this.notifService.increasePendingDidDocSyncCount();
        this.toastr.info(
          'Your enrolment request is approved. ' +
            'Please sync your approved claims in your DID Document.',
          'Enrolment Approved'
        );
        break;
      case ClaimEventType.REJECT_CREDENTIAL:
        this.toastr.warning(
          'Your enrolment request is rejected.',
          'New Enrolment Request'
        );
        break;
    }
  }

  private async _initPendingClaimsCount() {
    // Get Pending Claims to be Approved
    const pendingClaimsList = (
      await this.iamService.claimsService.getClaimsByIssuer({
        did: this.iamService.signerService.did,
        isAccepted: false,
      })
    ).filter((item) => !item.isRejected);
    this.tasks.pendingApprovalCount = pendingClaimsList.length;
    if (this.tasks.pendingApprovalCount < 0) {
      this.tasks.pendingApprovalCount = 0;
    }
  }

  private async _initApprovedClaimsForSyncCount() {
    // Get Approved Claims
    const approvedClaimsList =
      await this.iamService.claimsService.getClaimsByRequester({
        did: this.iamService.signerService.did,
        isAccepted: true,
      });

    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    let claims: any[] = await this.iamService.claimsService.getUserClaims();
    claims = claims.filter((item: any) => {
      if (item && item.claimType) {
        const arr = item.claimType.split('.');
        if (arr.length > 1 && arr[1] === NamespaceType.Role) {
          return true;
        }
        return false;
      } else {
        return false;
      }
    });

    this.notif.pendingSyncCount = approvedClaimsList.length - claims.length;
    if (this.notif.pendingSyncCount < 0) {
      this.notif.pendingSyncCount = 0;
    }
    this._initZeroCheckerForPendingSyncCount();
  }

  private _initZeroCheckerForPendingSyncCount(): void {
    this.notifService.pendingSyncCount$
      .pipe(
        takeUntil(this._subscription$),
        filter((count) => count === 0)
      )
      .subscribe((count) => {
        this.notif.pendingSyncCount = count;
        this._calcTotalCount();
      });
  }

  private async _initAssetsOfferedToMeSyncCount() {
    this.tasks.assetsOfferedToMeCount = (
      await this.iamService.assetsService.getOfferedAssets()
    ).length;
    if (this.tasks.assetsOfferedToMeCount < 0) {
      this.tasks.assetsOfferedToMeCount = 0;
    }
  }

  private async _initApprovedClaimsForAssetSyncCount() {
    this.tasks.pendingAssetSyncCount = 0;
    if (this.tasks.pendingAssetSyncCount < 0) {
      this.tasks.pendingAssetSyncCount = 0;
    }
  }

  private async _initNotificationsAndTasksCount() {
    try {
      await this._initPendingClaimsCount();
      await this._initApprovedClaimsForSyncCount();
      await this._initAssetsOfferedToMeSyncCount();
      await this._initApprovedClaimsForAssetSyncCount();
    } catch (e) {
      console.error(e);
      this.toastr.error(e);
    } finally {
      this.isLoadingNotif = false;
      await this._initNotificationAndTasksListeners();
    }
  }

  logout() {
    this.clearToastr();
    this.store.dispatch(logoutWithRedirectUrl());
  }

  clearToastr(): void {
    this.toastr.reset();
  }

  userNotifClosedHandler(): void {
    this.toastr.readAllItems();
  }
}
