import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnrolmentListComponent } from './enrolment-list/enrolment-list.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements OnInit {
  @ViewChild('issuerList', undefined ) issuerList       : EnrolmentListComponent;
  @ViewChild('enrolmentList', undefined ) enrolmentList : EnrolmentListComponent;

  issuerDropdown = new FormControl('false');
  enrolmentDropdown = new FormControl('none');

  public dropdownValue = {
    all: 'none',
    pending: 'false',
    approved: 'true'
  };

  public isMyEnrolmentShown = false;

  constructor() { }

  ngOnInit() {
  }

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