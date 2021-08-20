import { Event, NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Md5 } from 'ts-md5/dist/md5';
import { AssetHistoryEventType, ENSNamespaceTypes } from 'iam-client-lib';

import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { Identicon } from '../../shared/directives/identicon/identicon';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { IamService } from '../../shared/services/iam.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import * as userSelectors from '../../state/user-claim/user.selectors';
import { Store } from '@ngrx/store';
import { UserClaimState } from '../../state/user-claim/user.reducer';
import { SwitchboardToastr, SwitchboardToastrService } from '../../shared/services/switchboard-toastr.service';
import { LoginService } from '../../shared/services/login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  navCollapsed = true; // for horizontal layout
  menuItems = []; // for horizontal layout

  currentUserDid = 'did:ewc:';
  currentUserRole = '';
  currentTheme: any;

  isNavSearchVisible: boolean;
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
    pendingSyncCount: 0
  };

  isLoadingNotif = true;
  userName$ = this.store.select(userSelectors.getUserName).pipe(map(value => value ? value : 'Manage Profile'));
  userDid$ = this.store.select(userSelectors.getDid);
  notificationNewItems = 0;
  notificationList$: Observable<SwitchboardToastr[]> = this.toastr.getMessageList()
    .pipe(tap(items => this.notificationNewItems = items.filter(item => item.isNew).length));

  private _pendingApprovalCountListener: any;
  private _pendingSyncCountListener: any;
  private _assetsOfferedToMeCountListener: any;
  private _pendingAssetSyncCountListener: any;
  private _subscription$ = new Subject();
  private _iamSubscriptionId: number;
  private isInitNotificationCount = false;

  @ViewChild('fsbutton', {static: true}) fsbutton;  // the fullscreen button

  constructor(public menu: MenuService,
              // private authenticationService: AuthService,
              private iamService: IamService,
              private router: Router,
              private toastr: SwitchboardToastrService,
              private notifService: NotificationService,
              public settings: SettingsService, public dialog: MatDialog, private sanitizer: DomSanitizer,
              private store: Store<UserClaimState>,
              private loginService: LoginService) {
    // show only a few items on demo
    this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout

    if (localStorage.getItem('currentUser')) {
      this.currentUserDid = JSON.parse(localStorage.getItem('currentUser')).did;
      this.currentUserRole = JSON.parse(localStorage.getItem('currentUser')).organizationType;
    }

    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this._subscription$)
      )
      .subscribe((event: any) => {
        this.loginService.setDeepLink(event.url);
        this.isNavMenuVisible = true;
        if (event.url === '/dashboard') {
          this.isNavMenuVisible = false;
        }

        const pathArr = event.url.split('/');
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
    await this.iamService.iam.unsubscribeFrom(this._iamSubscriptionId);
  }

  didCopied() {
    this.toastr.success('User DID is copied to clipboard.');
  }

  openDialogUser(): void {
    const dialogRef = this.dialog.open(DialogUserComponent, {
      width: '440px',
      data: {},
      maxWidth: '100%',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this._subscription$))
      .subscribe(result => {
        if (result) {
          // Update User Name
        }
      });
  }

  ngOnInit() {
    this.isNavSearchVisible = false;

    const ua = window.navigator.userAgent;
    if (ua.indexOf('MSIE ') > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
      this.fsbutton.nativeElement.style.display = 'none';
    }

    this.store.select(userSelectors.getUserProfile)
      .pipe(takeUntil(this._subscription$))
      .subscribe(() => {
        if (this.iamService.accountAddress) {
          this._initNotificationsAndTasks();
        } else {
          this.isLoadingNotif = false;
        }
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
    this.tasks.totalCount = this.tasks.assetsOfferedToMeCount + this.tasks.pendingAssetSyncCount +
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
    this.notifService.initNotifCounts(this.tasks.pendingApprovalCount,
      this.notif.pendingSyncCount,
      this.tasks.assetsOfferedToMeCount,
      this.tasks.pendingAssetSyncCount);

    // Listen to Count Changes
    this._pendingApprovalCountListener = this.notifService.pendingApproval
      .pipe(takeUntil(this._subscription$))
      .subscribe(async (count: number) => {
        await this._initPendingClaimsCount();
        this._calcTotalCount();
      });
    this._pendingSyncCountListener = this.notifService.pendingDidDocSync
      .pipe(takeUntil(this._subscription$))
      .subscribe(async (count: number) => {
        await this._initApprovedClaimsForSyncCount();
        this._calcTotalCount();
      });
    this._assetsOfferedToMeCountListener = this.notifService.assetsOfferedToMe
      .pipe(takeUntil(this._subscription$))
      .subscribe(async (count: number) => {
        await this._initAssetsOfferedToMeSyncCount();
        this._calcTotalCount();
      });
    this._pendingAssetSyncCountListener = this.notifService.pendingAssetDidDocSync
      .pipe(takeUntil(this._subscription$))
      .subscribe(async (count: number) => {
        await this._initApprovedClaimsForAssetSyncCount();
        this._calcTotalCount();
      });

    // Listen to External Messages
    this._iamSubscriptionId = await this.iamService.iam.subscribeTo({
      messageHandler: this._handleMessage.bind(this)
    });
  }

  private _handleMessage(message: any) {
    if (message.type) {
      // Handle Asset-related Events
      this._handleAssetEvents(message.type);
    } else if (message.issuedToken) {
      // Message has issued token ===> Newly Approved Claim
      this.notifService.increasePendingDidDocSyncCount();
      this.toastr.info('Your enrolment request is approved. ' +
        'Please sync your approved claims in your DID Document.', 'Enrolment Approved');
    } else if (message.isRejected) {
      this.toastr.warning('Your enrolment request is rejected.', 'New Enrolment Request');
    } else {
      // Message has no issued token ===> Newly Requested Claim
      this.notifService.increasePendingApprovalCount();
      this.toastr.info('A new enrolment request is waiting for your approval.', 'New Enrolment Request');
    }
  }

  private _handleAssetEvents(type: string) {
    switch (type) {
      case AssetHistoryEventType.ASSET_OFFERED:
        this.toastr.info('An asset is offered to you.', 'Asset Offered');
        this.notifService.increaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_TRANSFERRED:
        this.toastr.success('Your asset is successfully tranferred to a new owner.', 'Asset Transferred');
        break;
      case AssetHistoryEventType.ASSET_OFFER_CANCELED:
        this.toastr.warning('An asset offered to you is cancelled by the owner.', 'Asset Offer Cancelled');
        this.notifService.decreaseAssetsOfferedToMeCount();
        break;
      case AssetHistoryEventType.ASSET_OFFER_REJECTED:
        this.toastr.warning('An asset you offered is rejected.', 'Asset Offer Rejected');
        break;
    }
  }

  private async _initPendingClaimsCount() {
    try {
      // Get Pending Claims to be Approved
      const pendingClaimsList = (await this.iamService.iam.getClaimsByIssuer({
        did: this.iamService.iam.getDid(),
        isAccepted: false
      })).filter(item => !item.isRejected);
      this.tasks.pendingApprovalCount = pendingClaimsList.length;
      if (this.tasks.pendingApprovalCount < 0) {
        this.tasks.pendingApprovalCount = 0;
      }
    } catch (e) {
      throw e;
    }
  }

  private async _initApprovedClaimsForSyncCount() {
    try {
      // Get Approved Claims
      const approvedClaimsList = await this.iamService.iam.getClaimsByRequester({
        did: this.iamService.iam.getDid(),
        isAccepted: true
      });

      // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
      let claims: any[] = await this.iamService.iam.getUserClaims();
      claims = claims.filter((item: any) => {
        if (item && item.claimType) {
          const arr = item.claimType.split('.');
          if (arr.length > 1 && arr[1] === ENSNamespaceTypes.Roles) {
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
    } catch (e) {
      throw e;
    }
  }

  private _initZeroCheckerForPendingSyncCount(): void {
    this.notifService.pendingSyncCount$
      .pipe(
        takeUntil(this._subscription$),
        filter(count => count === 0)
      )
      .subscribe((count) => {
        this.notif.pendingSyncCount = count;
        this._calcTotalCount();
      });
  }

  private async _initAssetsOfferedToMeSyncCount() {
    try {
      this.tasks.assetsOfferedToMeCount = (await this.iamService.iam.getOfferedAssets()).length;
      if (this.tasks.assetsOfferedToMeCount < 0) {
        this.tasks.assetsOfferedToMeCount = 0;
      }
    } catch (e) {
      throw e;
    }
  }

  private async _initApprovedClaimsForAssetSyncCount() {
    // TODO:
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

  getUserIdenticon() {
    const userDid = this.currentUserDid ? this.currentUserDid : 'ewc:did:governingbody';
    return this.sanitizer.bypassSecurityTrustResourceUrl((
      'data:image/svg+xml; utf8,'
      + encodeURI(new Identicon(Md5.hashStr(userDid), {size: 128, format: 'svg'}).toString(true))
    ));
  }

  openNavSearch(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setNavSearchVisible(true);
  }

  setNavSearchVisible(stat: boolean) {
    this.isNavSearchVisible = stat;
  }

  getNavSearchVisible() {
    return this.isNavSearchVisible;
  }

  toggleOffsidebar() {
    this.settings.toggleLayoutSetting('offsidebarOpen');
  }

  toggleCollapsedSideabar() {
    this.settings.toggleLayoutSetting('isCollapsed');
  }

  isCollapsedText() {
    return this.settings.getLayoutSetting('isCollapsedText');
  }

  logout() {
    this.clearSwitchboardToaster();
    this.loginService.logoutAndRefresh();
  }

  clearSwitchboardToaster(): void {
    this.toastr.reset();
  }

  onHiddenNotificationList(): void {
    this.toastr.readAllItems();
  }
}
