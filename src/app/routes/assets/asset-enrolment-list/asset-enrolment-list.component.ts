import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, from, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { EnrolmentListComponent } from '../../enrolment/enrolment-list/enrolment-list.component';
import { UrlService } from '../../../shared/services/url-service/url.service';
import { IamService } from '../../../shared/services/iam.service';
import { Asset } from 'iam-client-lib';
import { AssetProfile } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { ASSET_DEFAULT_LOGO } from '../models/asset-default-logo';
import { mapClaimsProfile } from '../operators/map-claims-profile';

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
  asset$: Observable<Asset & AssetProfile>;

  private subscription$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private urlService: UrlService,
              private iamService: IamService) {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this.asset$ = this.getAssetsWithClaims();
  }

  private getAssetsWithClaims() {
    return forkJoin([
        from(
          this.iamService.iam.getUserClaims()).pipe(
          mapClaimsProfile(),
        ),
      this.activatedRoute.params
        .pipe(
          map( params => params.subject),
          filter(Boolean),
          take(1),
          switchMap((subject: string) => this.iamService.iam.getAssetById({id: subject})),
          map((asset) => asset)
        )
      ]
    ).pipe(
      map(([profile, asset]) => this.addClaimData(profile, asset)),
    );
  }

  private addClaimData(profile, asset) {
    return {
      ...asset,
      ...(profile && profile.assetProfiles && profile.assetProfiles[asset.id]),
    };
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
