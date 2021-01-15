import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlParamService } from 'src/app/shared/services/url-param.service';
import { EnrolmentListComponent } from './enrolment-list/enrolment-list.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements OnInit, AfterViewInit {
  @ViewChild("enrolmentTabGroup", { static: false }) enrolmentTabGroup: MatTabGroup;
  @ViewChild('issuerList', undefined ) issuerList       : EnrolmentListComponent;
  @ViewChild('enrolmentList', undefined ) enrolmentList : EnrolmentListComponent;

  issuerListAccepted = false;
  enrolmentListAccepted = undefined;

  issuerDropdown = new FormControl('false');
  enrolmentDropdown = new FormControl('none');

  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true'
  };

  public isMyEnrolmentShown = false;
  private _queryParamSelectedTabInit = false;

  constructor(private activeRoute: ActivatedRoute, 
    private urlParamService: UrlParamService,
    private router: Router) { }

  private initDefault() {
    if (!this._queryParamSelectedTabInit) {
      this.issuerListAccepted = false;
      this.asyncSetDropdownValue(this.dropdownValue.pending);
    }

    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 0;
    }
  }

  private initDefaultMyEnrolments() {
    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 1;
    }
  }

  private asyncSetDropdownValue(value: any) {
    let timeout$ = setTimeout(() => {
      this.enrolmentDropdown.setValue(value);
      this.enrolmentList.getList(this.enrolmentDropdown.value === 'true' ? true : this.enrolmentDropdown.value === 'false' ? false : undefined);
      clearTimeout(timeout$);
    }, 30);
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
          }
          else if (queryParams.notif === 'myEnrolments') {
            // Display All Claims
            this.asyncSetDropdownValue(this.dropdownValue.all);
  
            if (this.enrolmentTabGroup) {
              this.enrolmentTabGroup.selectedIndex = 1;
            }
          }
          else {
            this.initDefault();
          }
        }
        else if (queryParams.selectedTab) {
          if (queryParams.selectedTab == 1) {
            this.initDefaultMyEnrolments();
          }
          else {
            this.initDefault();
          }
          this._queryParamSelectedTabInit = true;
        }
        else {
          this.initDefault();
        }
      }
      else {
        this.initDefault();
      }
    });
  }

  ngOnInit() {}

  showMe(i: any) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(this.router, this.activeRoute, {
      selectedTab: i.index
    }, ['notif']);
    
    if (i.index === 1) {
      if (this.isMyEnrolmentShown) {
        this.enrolmentList.getList(this.enrolmentDropdown.value === 'true' ? true : this.enrolmentDropdown.value === 'false' ? false : undefined);
      }
      else {
        this.isMyEnrolmentShown = true;
      }
    }
    else {
      this.issuerList.getList(this.issuerDropdown.value === 'true' ? true : this.issuerDropdown.value === 'false' ? false : undefined);
    }
  }

  updateEnrolmentList (e: any) {
    console.log('enrolement list');
    let value = e.value;
    this.enrolmentList.getList(value === 'true' ? true : value === 'false' ? false : undefined);
  }

  updateIssuerList (e: any) {
    console.log('issuer list');
    let value = e.value;
    this.issuerList.getList(value === 'true' ? true : value === 'false' ? false : undefined);
  }
}