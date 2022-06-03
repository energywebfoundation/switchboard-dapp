import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { EnrolmentListComponent } from '../../enrolment/enrolment-list/enrolment-list.component';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { ASSET_DEFAULT_LOGO } from '../models/asset-default-logo';
import { Store } from '@ngrx/store';
import { AssetDetailsActions, AssetDetailsSelectors } from '@state';
import { RouterConst } from '../../router-const';

@Component({
  selector: 'app-asset-enrolment-list',
  templateUrl: './asset-enrolment-list.component.html',
  styleUrls: ['./asset-enrolment-list.component.scss'],
})
export class AssetEnrolmentListComponent implements OnInit, OnDestroy {
  @ViewChild('enrolmentList') enrolmentList: EnrolmentListComponent;

  enrolmentDropdown = new FormControl('none');
  subject: string;
  namespaceControlIssuer = new FormControl(undefined);
  defaultLogo = ASSET_DEFAULT_LOGO;

  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true',
    rejected: 'rejected',
  };
  asset$ = this.store.select(AssetDetailsSelectors.getAssetDetails);

  private subscription$ = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private urlService: UrlService,
    private store: Store
  ) {}

  ngOnDestroy(): void {
    this.subscription$.next(undefined);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateEnrolmentList(e: any) {
    const value = e.value;
    this.enrolmentList.getList(
      value === 'rejected',
      value === 'true' ? true : value === 'false' ? false : undefined
    );
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
