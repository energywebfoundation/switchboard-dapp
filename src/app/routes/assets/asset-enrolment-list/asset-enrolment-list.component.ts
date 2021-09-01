import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { EnrolmentListComponent } from '../../enrolment/enrolment-list/enrolment-list.component';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { ASSET_DEFAULT_LOGO } from '../models/asset-default-logo';
import { Store } from '@ngrx/store';
import * as AssetDetailsActions from '../../../state/assets/details/asset-details.actions';
import { getAssetDetails } from '../../../state/assets/details/asset-details.selectors';

@Component({
  selector: 'app-asset-enrolment-list',
  templateUrl: './asset-enrolment-list.component.html',
  styleUrls: ['./asset-enrolment-list.component.scss']
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
    rejected: 'rejected'
  };
  asset$ = this.store.select(getAssetDetails);

  private subscription$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private urlService: UrlService,
              private store: Store) {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this.getAssetsWithClaims();
  }

  private getAssetsWithClaims() {
    this.activatedRoute.params
      .pipe(
        map(params => params.subject),
        filter<string>(Boolean),
        take(1)
      ).subscribe((assetId) => this.store.dispatch(AssetDetailsActions.getDetails({assetId})));
  }

  updateEnrolmentList(e: any) {
    const value = e.value;
    this.enrolmentList.getList(value === 'rejected',
      value === 'true' ? true : value === 'false' ? false : undefined);
  }

  back() {
    this.urlService.previous.pipe(
      takeUntil(this.subscription$)
    ).subscribe(url => this.navigateBackHandler(url));
  }

  private navigateBackHandler(url: string): void {
    // 'returnUrl' is taken as an indicator back() would trigger an loop back to asset-enrolment
    if (url.includes('returnUrl')) {
      this.urlService.goTo('assets');
      return;
    }
    this.urlService.back();
  }
}
