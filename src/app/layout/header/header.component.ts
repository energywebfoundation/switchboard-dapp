import { Component, OnInit, ViewChild, Inject } from '@angular/core';
const screenfull = require('screenfull');
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

    flexNode="";

    isNavSearchVisible: boolean;
    isNavMenuVisible = true;

    currentNav = '';
    userName = '';

    @ViewChild('fsbutton', { static: true }) fsbutton;  // the fullscreen button

    constructor(public menu: MenuService, 
        // private authenticationService: AuthService,
        private iamService: IamService,
        private router: Router,
        public userblockService: UserblockService, private http: HttpClient,
        public settings: SettingsService, public dialog: MatDialog, private sanitizer: DomSanitizer) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
        this.http.get('assets/flexhub/flexnode.json').toPromise().then((data:any) => {
            this.flexNode = data.NODENAME;
        });
        
        if (localStorage.getItem('currentUser')) {
            this.currentUserDid = JSON.parse(localStorage.getItem('currentUser')).did;
            this.currentUserRole = JSON.parse(localStorage.getItem('currentUser')).organizationType;
        }

        this.router.events.subscribe((event: any) => {
            if (event instanceof NavigationEnd) {
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

        // // Switch fullscreen icon indicator
        // const el = this.fsbutton.nativeElement.firstElementChild;
        // screenfull.on('change', () => {
        //     if (el)
        //         el.className = screenfull.isFullscreen ? 'fa fa-compress' : 'fa fa-expand';
        // });
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

    toggleFullScreen(event) {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    logout() {
        this.iamService.logout();
        let $navigate = setTimeout(() => {
            clearTimeout($navigate);
            location.reload();
        }, 100);
        
    }
}