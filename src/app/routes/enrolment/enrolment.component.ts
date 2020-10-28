import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
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

  issuerListAccepted = false;;
  enrolmentListAccepted = undefined;

  issuerDropdown = new FormControl('false');
  enrolmentDropdown = new FormControl('none');

  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true'
  };

  public isMyEnrolmentShown = false;

  constructor(private activeRoute: ActivatedRoute) { 
    this.activeRoute.queryParams.subscribe(async (queryParams: any) => {
      if (queryParams && queryParams.notif) {
        if (queryParams.notif === 'pendingSyncToDidDoc') {
          // Display Approved Claims
          this.enrolmentListAccepted = true;
          this.enrolmentDropdown.setValue(this.dropdownValue.approved);
          console.log('hey');

          if (this.enrolmentTabGroup) {
            this.enrolmentTabGroup.selectedIndex = 1;
          }
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

  private initDefault() {
    this.issuerListAccepted = false;
    this.issuerDropdown.setValue(this.dropdownValue.pending);

    if (this.enrolmentTabGroup) {
      this.enrolmentTabGroup.selectedIndex = 0;
    }
  }

  ngAfterViewInit(): void {
    if (this.enrolmentListAccepted) {
      this.enrolmentTabGroup.selectedIndex = 1;
    }
  }

  ngOnInit() {}

  showMe(i: any) {
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
    let value = e.value;
    this.enrolmentList.getList(value === 'true' ? true : value === 'false' ? false : undefined);
  }

  updateIssuerList (e: any) {
    let value = e.value;
    this.issuerList.getList(value === 'true' ? true : value === 'false' ? false : undefined);
  }
}