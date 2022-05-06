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
  SettingsSelectors
} from '@state';
import { IssuanceVcService } from '../../modules/issue-vc/services/issuance-vc.service';
import { FilterStatus } from '../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss'],
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;

  issuerListAccepted = false;
  enrolmentListAccepted = undefined;
  myEnrolmentList$ = this.store.select(OwnedEnrolmentsSelectors.getEnrolments);
  requestedEnrolmentsList$ = this.store.select(
    RequestedEnrolmentsSelectors.getEnrolments
  );

  issuerDropdown = FilterStatus.Pending;
  enrolmentDropdown = FilterStatus.All;

  public isMyEnrolmentShown = false;
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
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
    this.activeRoute.queryParams
      .pipe(filter((queryParams) => !!queryParams))
      .subscribe(async (queryParams: any) => {
        if (queryParams.notif) {
          if (queryParams.notif === 'pendingSyncToDidDoc') {
            // Display Approved Claims
            this.enrolmentListAccepted = true;
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
    // Preserve Selected Tab
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
    } else {
      this.store.dispatch(RequestedEnrolmentsActions.updateEnrolmentRequests());
    }
  }

  updateEnrolmentList(value: FilterStatus): void {
    this.store.dispatch(
      OwnedEnrolmentsActions.changeFilterStatus({ status: value })
    );
  }

  myEnrolmentsNamespaceFilterChangeHandler(value: string): void {
    this.store.dispatch(
      OwnedEnrolmentsActions.changeNamespaceFilter({ value })
    );
  }

  updateIssuerFilterStatus(status: FilterStatus) {
    this.store.dispatch(
      RequestedEnrolmentsActions.changeFilterStatus({ status })
    );
  }

  updateSearchByDidValue(value: string) {
    this.store.dispatch(RequestedEnrolmentsActions.changeDIDFilter({ value }));
  }

  refreshIssuerList() {
    this.store.dispatch(RequestedEnrolmentsActions.updateEnrolmentRequests());
  }

  enrolmentsNamespaceFilterChangeHandler(value) {
    this.store.dispatch(
      RequestedEnrolmentsActions.changeNamespaceFilter({ value })
    );
  }

  refreshMyEnrolmentsList(): void {
    this.store.dispatch(OwnedEnrolmentsActions.updateOwnedEnrolments());
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
      this.issuerListAccepted = false;
      this.asyncSetDropdownValue(FilterStatus.Pending);
    }

    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = index || 0;
    }
  }

  private initDefaultMyEnrolments() {
    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 1;
      this.store.dispatch(OwnedEnrolmentsActions.getOwnedEnrolments());
    }
  }

  private asyncSetDropdownValue(value: FilterStatus) {
    const timeout$ = setTimeout(() => {
      this.enrolmentDropdown = value;
      clearTimeout(timeout$);
    }, 30);
    this.store.dispatch(RequestedEnrolmentsActions.getEnrolmentRequests());
    this.updateIssuerFilterStatus(value);
  }
}
