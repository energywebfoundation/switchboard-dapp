/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParamService } from '../../shared/services/url-param.service';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { NewIssueVcComponent } from '../../modules/issue-vc/new-issue-vc/new-issue-vc.component';
import { Store } from '@ngrx/store';
import {
  OwnedEnrolmentsActions,
  OwnedEnrolmentsSelectors,
  RequestedEnrolmentsActions,
  RequestedEnrolmentsSelectors,
  RevokableEnrolmentsActions,
  RevokableEnrolmentsSelectors,
  SettingsSelectors,
} from '@state';
import { IssuanceVcService } from '../../modules/issue-vc/services/issuance-vc.service';
import { filter } from 'rxjs/operators';
import { FilterStatus } from './enrolment-list/models/filter-status.enum';
import { EnrolmentClaim } from './models/enrolment-claim';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss'],
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;
  myEnrolmentList$ = this.store.select(OwnedEnrolmentsSelectors.getEnrolments);
  requestedEnrolmentsList$ = this.store.select(
    RequestedEnrolmentsSelectors.getEnrolments
  );
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  myRevokablesList$ = this.store.select(
    RevokableEnrolmentsSelectors.getRevokableEnrolments
  );
  isMyEnrolmentShown = false;
  enrolmentStatus: FilterStatus = FilterStatus.Pending;

  private _queryParamSelectedTabInit = false;

  get issuesRoles(): boolean {
    return this.issuanceVCService.hasRoles();
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private urlParamService: UrlParamService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store,
    private issuanceVCService: IssuanceVcService
  ) {}

  ngAfterViewInit(): void {
    console.log(this.myRevokablesList$, 'THE LIST');
    console.log(this.enrolmentTabGroup, 'THE ENROLMENT TAB GROUP');
    this.initDefault();
    this.activeRoute.queryParams
      .pipe(filter((queryParams) => !!queryParams))
      .subscribe(async (queryParams: any) => {
        console.log(queryParams, 'THE QUERY PARAMS');
        console.log(queryParams.notif, 'NOTIF');
        if (queryParams.notif) {
          if (queryParams.notif === 'pendingSyncToDidDoc') {
            // Display Approved Claims
            this.asyncSetDropdownValue(FilterStatus.Approved);

            if (this.enrolmentTabGroup) {
              this.enrolmentTabGroup.selectedIndex = 1;
            }
          } else if (queryParams.notif === 'myEnrolments') {
            // Display All Claims
            this.asyncSetDropdownValue(FilterStatus.All);

            if (this.enrolmentTabGroup) {
              this.enrolmentTabGroup.selectedIndex = 1;
            }
          } else {
            this.initDefault();
          }
        } else if (queryParams.selectedTab) {
          console.log('IN THIS ELSE IF');

          if (queryParams.selectedTab === '1') {
            this.initDefaultMyEnrolments();
          } else if (queryParams.selectedTab === '2') {
            console.log('SelECTED TAB IS 2');
            this.initDefaultMyRevokables();
          } else {
            console.log('GETTING INTO THIS ELSE AND INITING DEFAULT');
            this.initDefault();
          }
          this._queryParamSelectedTabInit = true;
        } else {
          this.initDefault();
        }
      });
  }

  showMe(i: any) {
    console.log('IN SHOW ME!!!');
    console.log(this.myRevokablesList$, 'REVOKABLES IN SHOWME');
    console.log(this.myEnrolmentList$, 'ENROLLMENTS IN SHOW ME');
    this.urlParamService.updateQueryParams(
      this.router,
      this.activeRoute,
      {
        selectedTab: i.index,
      },
      ['notif']
    );

    if (i.index === 1) {
      if (this.isMyEnrolmentShown) {
        this.store.dispatch(OwnedEnrolmentsActions.updateOwnedEnrolments());
      } else {
        this.isMyEnrolmentShown = true;
      }
    } else if (i.index === 0) {
      this.store.dispatch(RequestedEnrolmentsActions.updateEnrolmentRequests());
    } else {
      console.log(
        'getting into index',
        this.isMyEnrolmentShown,
        'ENROLMENTS SHWON'
      );
      this.store.dispatch(
        RevokableEnrolmentsActions.updateRevokableEnrolments()
      );
      //this.isMyEnrolmentShown = true;
    }
  }

  updateEnrolmentListStatus(value: FilterStatus): void {
    this.enrolmentStatus = value;
  }

  refreshIssuerList() {
    this.store.dispatch(RequestedEnrolmentsActions.updateEnrolmentRequests());
  }

  refreshMyEnrolmentsList(): void {
    this.store.dispatch(OwnedEnrolmentsActions.updateOwnedEnrolments());
  }

  refreshMyRevokablesList(): void {
    console.log('refreshing');
    this.store.dispatch(RevokableEnrolmentsActions.updateRevokableEnrolments());
  }

  createVC() {
    this.dialog.open(NewIssueVcComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true,
    });
  }

  private initDefault(index?: number) {
    if (!this._queryParamSelectedTabInit) {
      this.asyncSetDropdownValue(FilterStatus.Pending);
    }

    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = index || 0;
    }
  }

  private initDefaultMyEnrolments() {
    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 1;
    }
  }

  private initDefaultMyRevokables() {
    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 2;
    }
  }

  private asyncSetDropdownValue(value: FilterStatus) {
    this.updateEnrolmentListStatus(value);
  }
}
