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
import { filter } from 'rxjs/operators';
import { FilterStatus } from './enrolment-list/models/filter-status.enum';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss'],
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;
  myEnrolmentList$ = this.store.select(OwnedEnrolmentsSelectors.getEnrolments);
  requestedEnrolmentsList$ = this.store.select(
    RequestedEnrolmentsSelectors.getAllEnrolments
  );
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  revocableList$ = this.store.select(
    RevocableEnrolmentsSelectors.getEnrolments
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
    this.initDefault();
    this.getRevocableList();
    this.getOwnedList();
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

    if (i.index === 1) {
      if (this.isMyEnrolmentShown) {
        this.store.dispatch(OwnedEnrolmentsActions.updateOwnedEnrolments());
      } else {
        this.isMyEnrolmentShown = true;
      }
    } else if (i.index === 0) {
      this.store.dispatch(RequestedEnrolmentsActions.updateEnrolmentRequests());
    } else {
      this.store.dispatch(
        RevocableEnrolmentsActions.updateRevocableEnrolments()
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

  refreshRevocableList(): void {
    this.store.dispatch(RevocableEnrolmentsActions.updateRevocableEnrolments());
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

  private getRevocableList(): void {
    this.store.dispatch(RevocableEnrolmentsActions.getRevocableEnrolments());
  }

  private getOwnedList(): void {
    this.store.dispatch(OwnedEnrolmentsActions.getOwnedEnrolments());
  }
}
