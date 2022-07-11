/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { KeyValue } from '@angular/common';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';
import { TokenDecodeService } from './services/token-decode.service';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewRequestsComponent implements OnInit {
  requestorFields: KeyValue<string, string | number>[] = [];
  issuerFields: KeyValue<string, string | number>[] = [];

  constructor(
    public dialogRef: MatDialogRef<ViewRequestsComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: { claimData: EnrolmentClaim; listType: EnrolmentListType },
    private dialog: MatDialog,
    private tokenDecodeService: TokenDecodeService
  ) {}

  get claim() {
    return this.data.claimData;
  }

  ngOnInit() {
    if (this.claim) {
      this.setIssuerFields();
      this.setRequestorFields();
    }
  }

  private setIssuerFields() {
    if (!this.claim.issuedToken) {
      return;
    }
    this.tokenDecodeService
      .getIssuerFields(this.claim.issuedToken)
      .subscribe((fields) => (this.issuerFields = fields));
  }

  private setRequestorFields() {
    if (!this.claim.token) {
      return;
    }
    this.tokenDecodeService
      .getRequestorFields(this.claim?.token)
      .subscribe((fields) => (this.requestorFields = fields));
  }
}
