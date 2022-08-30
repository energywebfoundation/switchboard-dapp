import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { ASSET_DEFAULT_LOGO } from '../models/asset-default-logo';
import { Store } from '@ngrx/store';
import { AssetDetailsActions, AssetDetailsSelectors } from '@state';
import { RouterConst } from '../../router-const';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.scss'],
})
export class AssetDetailsComponent implements OnInit, OnDestroy {
  subject: string;
  defaultLogo = ASSET_DEFAULT_LOGO;
  asset$ = this.store.select(AssetDetailsSelectors.getAssetDetails);

  private subscription$ = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private urlService: UrlService,
    private store: Store
  ) {}

  ngOnDestroy(): void {
    this.subscription$.next(null);
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this.getAssetsWithClaims();
  }

  private getAssetsWithClaims() {
    this.activatedRoute.params
      .pipe(
        map((params) => params.subject),
        filter<string>(Boolean),
        take(1)
      )
      .subscribe((assetId) => {
        this.subject = assetId;
        this.store.dispatch(AssetDetailsActions.getDetails({ assetId }));
      });
  }

  back() {
    this.urlService.previous
      .pipe(takeUntil(this.subscription$))
      .subscribe((url) => this.navigateBackHandler(url));
  }

  private navigateBackHandler(url: string): void {
    // 'returnUrl' is taken as an indicator back() would trigger an loop back to asset-enrolment
    if (url.includes(RouterConst.ReturnUrl)) {
      this.urlService.goTo(RouterConst.Assets);
      return;
    }
    this.urlService.back();
  }
}
