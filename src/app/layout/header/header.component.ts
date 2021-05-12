import { NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import { AssetHistoryEventType, ENSNamespaceTypes } from 'iam-client-lib';

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { Identicon } from 'src/app/shared/directives/identicon/identicon';
import { DialogUser } from './dialog-user/dialog-user.component';
import { IamService } from 'src/app/shared/services/iam.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
    userName = '';

    // Notifications
    notif = {
        totalCount: 0,
        pendingApprovalCount: 0,
        pendingSyncCount: 0,
        assetsOfferedToMeCount: 0,
        pendingAssetSyncCount: 0
    };

    isLoadingNotif = true;

    private _pendingApprovalCountListener: any;
    private _pendingSyncCountListener: any;
    private _assetsOfferedToMeCountListener: any;
    private _pendingAssetSyncCountListener: any;
    private _subscription$ = new Subject();
    private _iamSubscriptionId: number;

    @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

    constructor(public menu: MenuService,
                // private authenticationService: AuthService,
                private iamService: IamService,
                private router: Router,
                private toastr: ToastrService,
                private notifService: NotificationService,
                public userblockService: UserblockService,
                public settings: SettingsService, public dialog: MatDialog, private sanitizer: DomSanitizer) {
        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout

        if (localStorage.getItem('currentUser')) {
            this.currentUserDid = JSON.parse(localStorage.getItem('currentUser')).did;
            this.currentUserRole = JSON.parse(localStorage.getItem('currentUser')).organizationType;
        }

        this.router.events
            .pipe(takeUntil(this._subscription$))
            .subscribe((event: any) => {
                if (event instanceof NavigationEnd) {
                    this.iamService.setDeepLink(event.url);
                    this.isNavMenuVisible = true;
                    if (event.url === '/dashboard') {
                        this.isNavMenuVisible = false;
                    }

                    const pathArr = event.url.split('/');
                    this.currentNav = pathArr[1];
                }
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

    openDialogUser(): void {
        const dialogRef = this.dialog.open(DialogUser, {
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

        // Stay in current screen and display user name if available
        this.iamService.userProfile
            .pipe(takeUntil(this._subscription$))
            .subscribe((data: any) => {
                if (data && data.name) {
                    this.userName = data.name;
                }

                if (this.iamService.accountAddress) {
                    // Initialize Notifications
                    this._initNotifications();
                } else {
                    this.isLoadingNotif = false;
                }
            });
    }

    private _initNotifications() {
        // Init Notif Count
        this._initNotificationCount();
    }

    private _calcTotalCount() {
        this.notif.totalCount =  this.notif.pendingSyncCount +
            this.notif.pendingApprovalCount +
            this.notif.assetsOfferedToMeCount +
            this.notif.pendingAssetSyncCount;
        if (this.notif.totalCount < 0) {
            this.notif.totalCount = 0;
        }
    }

    private async _initNotificationListeners() {

        // Initialize Notif Counts
        this.notifService.initNotifCounts(this.notif.pendingApprovalCount,
            this.notif.pendingSyncCount,
            this.notif.assetsOfferedToMeCount,
            this.notif.pendingAssetSyncCount);

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
        }
        else if (message.issuedToken) {
            // Message has issued token ===> Newly Approved Claim
            this.notifService.increasePendingDidDocSyncCount();
            this.toastr.info('Your enrolment request is approved. Please sync your approved claims in your DID Document.', 'Enrolment Approved');
        }
        else if (message.isRejected) {
            this.toastr.warning('Your enrolment request is rejected.', 'New Enrolment Request');
        }
        else {
            // Message has no issued token ===> Newly Requested Claim
            this.notifService.increasePendingApprovalCount();
            this.toastr.info('A new enrolment request is waiting for your approval.', 'New Enrolment Request');
        }
    }

    private _handleAssetEvents(type: string) {
        switch(type) {
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
            let pendingClaimsList = (await this.iamService.iam.getClaimsByIssuer({
                did: this.iamService.iam.getDid(),
                isAccepted: false
            })).filter(item => !item['isRejected']);
            this.notif.pendingApprovalCount = pendingClaimsList.length;
            if (this.notif.pendingApprovalCount < 0) {
                this.notif.pendingApprovalCount = 0;
            }
        }
        catch (e) {
            throw e;
        }
    }

    private async _initApprovedClaimsForSyncCount() {
        try {
            // Get Approved Claims
            let approvedClaimsList = await this.iamService.iam.getClaimsByRequester({
                did: this.iamService.iam.getDid(),
                isAccepted: true
            });

            // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
            let claims: any[] = await this.iamService.iam.getUserClaims();
            claims = claims.filter((item: any) => {
                if (item && item.claimType) {
                    let arr = item.claimType.split('.');
                    if (arr.length > 1 && arr[1] === ENSNamespaceTypes.Roles) {
                        return true;
                    }
                    return false;
                }
                else {
                    return false;
                }
            });

            this.notif.pendingSyncCount = approvedClaimsList.length - claims.length;
            if (this.notif.pendingSyncCount < 0) {
                this.notif.pendingSyncCount = 0;
            }
        }
        catch (e) {
            throw e;
        }
    }

    private async _initAssetsOfferedToMeSyncCount(){
        try {
            this.notif.assetsOfferedToMeCount = (await this.iamService.iam.getOfferedAssets()).length;
            if (this.notif.assetsOfferedToMeCount < 0) {
                this.notif.assetsOfferedToMeCount = 0;
            }
        }
        catch (e) {
            throw e;
        }
    }

    private async _initApprovedClaimsForAssetSyncCount() {
        // TODO:
        this.notif.pendingAssetSyncCount = 0;
        if (this.notif.pendingAssetSyncCount < 0) {
            this.notif.pendingAssetSyncCount = 0;
        }
    }

    private async _initNotificationCount() {
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
            await this._initNotificationListeners();
        }
    }

    getUserIdenticon() {
        let userDid = this.currentUserDid ? this.currentUserDid : 'ewc:did:governingbody';
        return this.sanitizer.bypassSecurityTrustResourceUrl( (
            'data:image/svg+xml; utf8,'
            + encodeURI(new Identicon( Md5.hashStr(userDid), {size: 128, format: 'svg'} ).toString(true))
        ));
    }

    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
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
        this.iamService.logoutAndRefresh();
    }
}
