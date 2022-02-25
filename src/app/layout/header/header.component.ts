/* eslint-disable @typescript-eslint/no-explicit-any */
import { Event, NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AssetHistoryEventType, ClaimEventType } from 'iam-client-lib';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { IamService } from '../../shared/services/iam.service';
import { NotificationService } from '../../shared/services/notification.service';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import * as userSelectors from '../../state/user-claim/user.selectors';
import { Store } from '@ngrx/store';
import { LoginService } from '../../shared/services/login/login.service';
import { logoutWithRedirectUrl } from '../../state/auth/auth.actions';
import { DidBookComponent } from '../../modules/did-book/components/did-book/did-book.component';
import { DidBookService } from '../../modules/did-book/services/did-book.service';
import { AuthSelectors, SettingsActions, SettingsSelectors } from '@state';
import { truthy } from '@operators';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MessageSubscriptionService } from '../../shared/services/message-subscription/message-subscription.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isNavMenuVisible = true;

  currentNav = '';

  assetsOfferedToMeCount: number;
  pendingApprovalCount: number;
  pendingSyncToDIDCount: number;
  assetsOfferedToMeCount$ = this.notifService.assetsOfferedToMe;
  pendingApprovalCount$ = this.notifService.pendingApproval;
  pendingSyncToDIDCount$ = this.notifService.pendingDidDocSync;

  userName$ = this.store
    .select(userSelectors.getUserName)
    .pipe(map((value) => (value ? value : 'Manage Profile')));
  userDid$ = this.store.select(userSelectors.getDid);
  isExperimentalEnabled$ = this.store.select(
    SettingsSelectors.isExperimentalEnabled
  );

  private _subscription$ = new Subject();
  private _iamSubscriptionId: number;

  constructor(
    private iamService: IamService,
    private router: Router,
    private notifService: NotificationService,
    public dialog: MatDialog,
    private store: Store,
    private loginService: LoginService,
    private didBookService: DidBookService,
    private messageSubscriptionService: MessageSubscriptionService
  ) {
  }

  async ngOnDestroy(): Promise<void> {
    this._subscription$.next();
    this._subscription$.complete();

    // Unsubscribe to IAM Events
    await this.iamService.messagingService.unsubscribeFrom(
      this._iamSubscriptionId
    );
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
      .select(AuthSelectors.isUserLoggedIn)
      .pipe(truthy(), takeUntil(this._subscription$))
      .subscribe(async () => {
        this.didBookService.getList();
        await this.notifService.init();
        await this.messageSubscriptionService.init();
      });

    this.handleRouterEvents();
  }

  handleRouterEvents() {
    this.router.events
      .pipe(
        filter((event: Event) => event instanceof NavigationEnd),
        takeUntil(this._subscription$)
      )
      .subscribe((event: NavigationEnd) => {
        this.loginService.setDeepLink(event.url);

        this.isNavMenuVisible = event.url !== '/dashboard';

        const pathArr = event.url.split('/');

        // TODO: use routerLinkActive instead
        this.currentNav = pathArr[1];
      });
  }

  logout() {
    this.store.dispatch(logoutWithRedirectUrl());
  }
}
