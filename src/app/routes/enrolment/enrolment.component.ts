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
import { SettingsSelectors } from '@state';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements AfterViewInit {
  @ViewChild('enrolmentTabGroup') enrolmentTabGroup: MatTabGroup;
  @ViewChild('issuerList') issuerList: EnrolmentListComponent;
  @ViewChild('enrolmentList') enrolmentList: EnrolmentListComponent;

  issuerListAccepted = false;
  enrolmentListAccepted = undefined;

  issuerDropdown = new FormControl('false');
  enrolmentDropdown = new FormControl('none');
  namespaceControlIssuer = new FormControl(undefined);
  namespaceControlMyEnrolments = new FormControl(undefined);
  searchByDid = new FormControl(undefined);
  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true',
    rejected: 'rejected'
  };

  public isMyEnrolmentShown = false;
  isExperimentalEnabled$ = this.store.select(SettingsSelectors.isExperimentalEnabled);
  private _queryParamSelectedTabInit = false;

  constructor(private activeRoute: ActivatedRoute,
              private notificationService: NotificationService,
              private urlParamService: UrlParamService,
              private router: Router,
              private dialog: MatDialog,
              private store: Store) {
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      if (queryParams) {
        if (queryParams.notif) {
          if (queryParams.notif === 'pendingSyncToDidDoc') {
            // Display Approved Claims
            this.enrolmentListAccepted = true;
            this.asyncSetDropdownValue(this.dropdownValue.approved);

            if (this.enrolmentTabGroup) {
              this.enrolmentTabGroup.selectedIndex = 1;
            }
          } else if (queryParams.notif === 'myEnrolments') {
            // Display All Claims
            this.asyncSetDropdownValue(this.dropdownValue.all);

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
    this.urlParamService.updateQueryParams(this.router, this.activeRoute, {
      selectedTab: i.index
    }, ['notif']);

    if (i.index === 1) {
      if (this.isMyEnrolmentShown) {
        this.enrolmentList.getList(this.enrolmentDropdown.value === 'rejected',
          this.enrolmentDropdown.value === 'true' ? true : this.enrolmentDropdown.value === 'false' ? false : undefined);
      } else {
        this.isMyEnrolmentShown = true;
      }
    } else {
      this.issuerList.getList(this.enrolmentDropdown.value === 'rejected',
        this.issuerDropdown.value === 'true' ? true : this.issuerDropdown.value === 'false' ? false : undefined);
    }
  }

  updateEnrolmentList(e: any) {
    const value = e.value;
    this.enrolmentList.getList(value === 'rejected',
      value === 'true' ? true : value === 'false' ? false : undefined);
  }

  updateIssuerList(e: any) {
    const value = e.value;
    this.issuerList.getList(value === 'rejected',
      value === 'true' ? true : value === 'false' ? false : undefined);
  }

  updateSearchByDidValue(value) {
    this.searchByDid.setValue(value.did);
  }

  createVC() {
    this.dialog.open(NewIssueVcComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true
    });
  }

  private initDefault(index?: number) {
    if (!this._queryParamSelectedTabInit) {
      this.issuerListAccepted = false;
      this.asyncSetDropdownValue(this.dropdownValue.pending);
    }

    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = index || 0;
    }
  }

  private initDefaultMyEnrolments() {
    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 1;
      this.notificationService.setZeroToPendingDidDocSyncCount();
    }
  }

  private asyncSetDropdownValue(value: any) {
    if (this.enrolmentList) {
      const timeout$ = setTimeout(() => {
        this.enrolmentDropdown.setValue(value);
        this.enrolmentList.getList(this.enrolmentDropdown.value === 'rejected',
          this.enrolmentDropdown.value === 'true' ? true : this.enrolmentDropdown.value === 'false' ? false : undefined);
        clearTimeout(timeout$);
      }, 30);
    }
  }
}
