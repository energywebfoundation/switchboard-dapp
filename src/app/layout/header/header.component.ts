import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Md5} from 'ts-md5/dist/md5';
import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Identicon } from 'src/app/shared/directives/identicon/identicon';
import { HttpClient } from '@angular/common/http';
import { DialogUser } from './dialog-user/dialog-user.component';
import { IamService } from 'src/app/shared/services/iam.service';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

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
        pendingSyncCount: 0
    };

    isLoadingNotif = true;
    isNotifInitialized = false;

    @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

    constructor(public menu: MenuService, 
        // private authenticationService: AuthService,
        private iamService: IamService,
        private router: Router,
        private toastr: ToastrService,
        private notifService: NotificationService,
        public userblockService: UserblockService, private http: HttpClient,
        public settings: SettingsService, public dialog: MatDialog, private sanitizer: DomSanitizer) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
        
        if (localStorage.getItem('currentUser')) {
            this.currentUserDid = JSON.parse(localStorage.getItem('currentUser')).did;
            this.currentUserRole = JSON.parse(localStorage.getItem('currentUser')).organizationType;
        }

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
                this.iamService.setDeepLink(event.url);
                this.isNavMenuVisible = true;
                if (event.url  === '/dashboard') {
                    this.isNavMenuVisible = false;
                }

                let pathArr = event.url.split('/');
                this.currentNav = pathArr[1];
            }
        });

        // Stay in current screen and display user name if available
        this.iamService.userProfile.subscribe((data: any) => {
            if (data && data.name) {
                this.userName = data.name;
            }
        
            if (this.iamService.accountAddress && !this.isNotifInitialized) {
                // Initialize Notifications
                this.initNotifications();
            }
        });
    }

    openDialogUser(): void {
        const dialogRef = this.dialog.open(DialogUser, {
          width: '440px',data:{},
          maxWidth: '100%',
          disableClose: true
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Update User Name
          }
        });
      }

    ngOnInit() {
        this.isNavSearchVisible = false;

        var ua = window.navigator.userAgent;
        if (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }
    }

    private initNotifications() {
        // Init Notif Count
        this.initNotificationCount();
        this.isNotifInitialized = true;
    }

    private async initNotificationListeners(pendingApprovalCount: number, pendingSyncCount: number) {
        // Initialize Notif Counts
        this.notifService.initNotifCounts(pendingApprovalCount, pendingSyncCount);

        // Listen to Count Changes
        this.notifService.pendingApproval.subscribe(async (count: number) => {
            await this.initPendingClaimsCount();
            this.notif.totalCount = this.notif.totalCount = this.notif.pendingSyncCount + this.notif.pendingApprovalCount;
        });
        this.notifService.pendingDidDocSync.subscribe(async (count: number) => {
            await this.initApprovedClaimsForSyncCount();
            this.notif.totalCount = this.notif.totalCount = this.notif.pendingSyncCount + this.notif.pendingApprovalCount;
        });

        // Listen to External Messages
        await this.iamService.iam.subscribeToMessages({
            messageHandler: this.handleMessage.bind(this)
        });
    }

    private handleMessage(message: any) {
        if (message.issuedToken) {
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

    private async initPendingClaimsCount() {
        try {
            // Get Pending Claims to be Approved
            let pendingClaimsList = (await this.iamService.iam.getIssuedClaims({
                did: this.iamService.iam.getDid(),
                isAccepted: false
            })).filter(item => !item['isRejected']);
            this.notif.pendingApprovalCount = pendingClaimsList.length;
        }
        catch (e) {
            throw e;
        }
    }

    private async initApprovedClaimsForSyncCount() {
        try {
            // Get Approved Claims
            let approvedClaimsList = await this.iamService.iam.getRequestedClaims({
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
        }
        catch (e) {
            throw e;
        }
    }

    private async initNotificationCount() {
        try {
            await this.initPendingClaimsCount();
            await this.initApprovedClaimsForSyncCount();
        }
        catch (e) {
            console.error(e);
            this.toastr.error(e);
        }
        finally {
            this.isLoadingNotif = false;
            await this.initNotificationListeners(this.notif.pendingApprovalCount, this.notif.pendingSyncCount);
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
        // console.log(stat);
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