/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParamService } from '../../shared/services/url-param.service';
import { MatLegacyTabGroup as MatTabGroup } from '@angular/material/legacy-tabs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { NewIssueVcComponent } from '../../modules/issue-vc/new-issue-vc/new-issue-vc.component';
import { Store } from '@ngrx/store';
import { EnrolmentsFacadeService, SettingsSelectors } from '@state';
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
  myEnrolmentList$ = this.enrolmentFacade.ownedList$;
  requestedEnrolmentsList$ = this.enrolmentFacade.requestedList$;
  isExperimental$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  revocableList$ = this.enrolmentFacade.revokableList$;
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
    private issuanceVCService: IssuanceVcService,
    private enrolmentFacade: EnrolmentsFacadeService
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

  refreshIssuerList(enrolment: EnrolmentClaim) {
    this.enrolmentFacade.update(enrolment.id);
  }

  refreshMyEnrolmentsList(enrolment: EnrolmentClaim): void {
    this.enrolmentFacade.update(enrolment.id);
  }

  removeEnrolment(enrolment: EnrolmentClaim): void {
    this.enrolmentFacade.remove(enrolment.id);
  }

  refreshRevocableList(enrolment: EnrolmentClaim): void {
    this.enrolmentFacade.updateRevokable(enrolment.id);
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
}
