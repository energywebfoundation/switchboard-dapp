import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EnrolmentListComponent } from '../../enrolment/enrolment-list/enrolment-list.component';
import { UrlService } from '../../../shared/services/url-service/url.service';

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

  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true',
    rejected: 'rejected'
  };

  private subscription$ = new Subject();

  constructor(private activatedRoute: ActivatedRoute,
              private urlService: UrlService) {
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntil(this.subscription$))
      .subscribe(params => {
        this.subject = params.subject;
      });
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
