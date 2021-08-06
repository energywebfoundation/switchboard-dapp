import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FinalReviewComponent } from './final-review/final-review.component';

@Component({
  selector: 'app-enrolment',
  templateUrl: './enrolment.component.html',
  styleUrls: ['./enrolment.component.scss']
})
export class EnrolmentComponent implements OnInit {

  provider = 'Energy Web Foundation';
  logo = '../assets/img/ew-flex-single-logo.png';
  since = new Date();

  summaryList = [

    {
      title: 'Patron revenue share',
      value: '2222.2222 EWT'
    },
    {
      title: 'Commitment Term',
      value: '2 Years'
    }, {
      title: 'Stake Amount',
      value: '100 EWT'
    },
  ];

  stakeAmountGroup: FormGroup;
  commitmentGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.stakeAmountGroup = this.fb.group({
      amount: ['', Validators.required]
    });
    this.commitmentGroup = this.fb.group({
      years: ['', Validators.required]
    });
  }

  finalReview() {
    this.dialog.open(FinalReviewComponent, {
      width: '500px',
      data: {},
      maxWidth: '100%',
      disableClose: true
    });
  }
}
