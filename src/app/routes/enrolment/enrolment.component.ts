/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParamService } from '../../shared/services/url-param.service';
import { EnrolmentListComponent } from './enrolment-list/enrolment-list.component';
import { MatTabGroup } from '@angular/material/tabs';
import { NotificationService } from '../../shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NewIssueVcComponent } from '../../modules/issue-vc/new-issue-vc/new-issue-vc.component';
import { Store } from '@ngrx/store';
import {
  OwnedEnrolmentsActions,
  OwnedEnrolmentsSelectors,
  SettingsSelectors,
} from '@state';
import { IssuanceVcService } from '../../modules/issue-vc/services/issuance-vc.service';
import { FilterStatus } from '../../shared/components/table/enrolment-list-filter/enrolment-list-filter.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss'],
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;
  @ViewChild('issuerList') issuerList: EnrolmentListComponent;
  @ViewChild('enrolmentList') enrolmentList: EnrolmentListComponent;

  issuerListAccepted = false;
  enrolmentListAccepted = undefined;
  myEnrolmentList$ = this.store.select(OwnedEnrolmentsSelectors.getEnrolments);

  issuerDropdown = FilterStatus.Pending;
  enrolmentDropdown = FilterStatus.All;
  namespaceControlIssuer = new FormControl(undefined);
  namespaceControlMyEnrolments = new FormControl(undefined);
  searchByDid = new FormControl(undefined);
  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true',
    rejected: 'rejected',
  };

  public isMyEnrolmentShown = false;
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  private _queryParamSelectedTabInit = false;

  get issuesRoles(): boolean {
    return this.issuanceVCService.hasRoles();
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private urlParamService: UrlParamService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store,
    private issuanceVCService: IssuanceVcService
  ) {}

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      if (queryParams) {
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
        this.store.dispatch(OwnedEnrolmentsActions.getOwnedEnrolments());
        this.enrolmentList.getList(
          this.enrolmentDropdown === FilterStatus.Rejected,
          this.issuerDropdown === FilterStatus.Approved
            ? true
            : this.issuerDropdown === FilterStatus.Pending
            ? false
            : undefined
        );
      } else {
        this.isMyEnrolmentShown = true;
      }
    } else {
      this.issuerList.getList(
        this.enrolmentDropdown === FilterStatus.Rejected,
        this.issuerDropdown === FilterStatus.Approved
          ? true
          : this.issuerDropdown === FilterStatus.Pending
          ? false
          : undefined
      );
    }
    this.store.dispatch(OwnedEnrolmentsActions.getOwnedEnrolments());
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

  updateIssuerList(e: any) {
    const value = e.value;
    this.issuerList.getList(
      value === FilterStatus.Rejected,
      value === FilterStatus.Approved
        ? true
        : value === FilterStatus.Pending
        ? false
        : undefined
    );
  }

  updateSearchByDidValue(value: string) {
    this.searchByDid.setValue(value);
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
    }
  }

  private asyncSetDropdownValue(value: FilterStatus) {
    if (this.enrolmentList) {
      const timeout$ = setTimeout(() => {
        this.enrolmentDropdown = value;
        this.enrolmentList.getList(
          this.enrolmentDropdown === FilterStatus.Rejected,
          this.enrolmentDropdown === FilterStatus.Approved
            ? true
            : this.enrolmentDropdown === FilterStatus.Pending
            ? false
            : undefined
        );
        clearTimeout(timeout$);
      }, 30);
    }
  }
}
