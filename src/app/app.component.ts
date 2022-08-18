import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { UrlService } from './shared/services/url-service/url.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './state/auth/auth.actions';
import { ThemesService } from './core/themes/themes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private urlHistoryService: UrlService,
    private themeService: ThemesService,
    private store: Store
  ) {
    this.matIconRegistry.addSvgIcon(
      'wallet-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/wallet-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'constraints-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/constraints-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'home-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/home-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'statistics-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/statistics-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'admin-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/admin-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'warning-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/warning-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'clear-data-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/clear-data-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'battery-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/battery-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'battery-empty-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/battery-empty-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'account-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/account-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'offer-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/offer-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'offer-bundles-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/offer-bundles-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'order-book-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/order-book-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'reject-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/reject-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'logout-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/logout-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'approved-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/approved-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'generate-qr-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/generate-qr-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'scan-qr-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/scan-qr-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'view-qr-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/qr-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'new-claim-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/new-claim-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'approved-claim-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/approved-claim-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'view-application-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/view-application-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'view-role-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/view-role-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'view-role-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/view-role-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'view-organization-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/view-organization-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'add-organization-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/add-organization-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'transfer-ownership-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/transfer-ownership-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'copy-url-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/copy-url-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'add-application-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/add-application-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'add-role-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/add-role-icon.svg'
      )
    );
    // for search list
    this.matIconRegistry.addSvgIcon(
      'application-list-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/application-list-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'organization-list-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/organization-list-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'ethereum',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/assets-icons/ethereum-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'bitcoin',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/assets-icons/bitcoin-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'ethereum-bitcoin',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/assets-icons/bitcoin-or-ethereum-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'sync-did-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/sync-did-icon.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'add-to-claimmanager-icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../assets/img/icons/add-to-claim-manager-icon.svg'
      )
    );
  }

  ngOnInit() {
    this.urlHistoryService.init();
    // prevent empty links to reload the page
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' &&
        ['', '#'].indexOf(target.getAttribute('href')) > -1
      ) {
        e.preventDefault();
      }
    });

    this.store.dispatch(AuthActions.init());
  }
}
