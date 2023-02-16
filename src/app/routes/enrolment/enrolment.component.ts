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
  RevocableEnrolmentsActions,
  RevocableEnrolmentsSelectors,
  SettingsSelectors,
} from '@state';
import { IssuanceVcService } from '../../modules/issue-vc/services/issuance-vc.service';
import { filter, tap } from 'rxjs/operators';
import { FilterStatus } from './enrolment-list/models/filter-status.enum';
import { EnrolmentClaim } from './models/enrolment-claim';
import { removeEnrolment } from '../../state/enrolments/owned/owned.actions';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss'],
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;
  myEnrolmentList$ = this.store.select(OwnedEnrolmentsSelectors.getAllEnrolments);
  requestedEnrolmentsList$ = this.store.select(
    RequestedEnrolmentsSelectors.getAllEnrolments
  );
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  revocableList$ = this.store.select(
    RevocableEnrolmentsSelectors.getAllEnrolments
  ).pipe(tap(enrolments => {
    // If there are no revocable enrolments, get the list
    if (enrolments.length === 0) {
      this.getRevocableList();
    }
  }));
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
    this.activeRoute.queryParams
      .pipe(filter((queryParams) => !!queryParams))
      .subscribe(async (queryParams: any) => {
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
          if (queryParams.selectedTab === '1') {
            this.initDefaultMyEnrolments();
          } else if (queryParams.selectedTab === '2') {
            this.initDefaultMyRevokables();
          } else {
            this.initDefault();
          }
          this._queryParamSelectedTabInit = true;
        } else {
          this.initDefault();
        }
      });
  }

  showMe(i: any) {
    this.urlParamService.updateQueryParams(
      this.router,
      this.activeRoute,
      {
        selectedTab: i.index,
      },
      ['notif']
    );
  }

  updateEnrolmentListStatus(value: FilterStatus): void {
    this.enrolmentStatus = value;
  }

  refreshIssuerList(enrolment:EnrolmentClaim) {
    this.store.dispatch(RequestedEnrolmentsActions.updateEnrolment({enrolment}));
  }

  refreshMyEnrolmentsList(enrolment: EnrolmentClaim): void {
    this.store.dispatch(OwnedEnrolmentsActions.updateEnrolment({enrolment}));
  }

  removeEnrolmentFromMyList(enrolment: EnrolmentClaim): void {
    this.store.dispatch(OwnedEnrolmentsActions.removeEnrolment({enrolment}));
  }

  refreshRevocableList(enrolment: EnrolmentClaim): void {
    this.store.dispatch(RevocableEnrolmentsActions.updateEnrolment({enrolment}));
  }

  createVC() {
    this.dialog.open(NewIssueVcComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true,
    });
  }

  private initDefault(index?: number): void {
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

  private getRevocableList(): void {
    this.store.dispatch(RevocableEnrolmentsActions.getRevocableEnrolments());
  }

}
