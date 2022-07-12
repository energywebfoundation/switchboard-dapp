/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';
import { TokenDecodeService } from './services/token-decode.service';

@Component({
  selector: 'app-view-requests',
  templateUrl: './view-requests.component.html',
  styleUrls: ['./view-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewRequestsComponent {
  requestorFields$ = this.tokenDecodeService.getRequestorFields(
    this.claim?.token
  );
  issuerFields$ = this.tokenDecodeService.getIssuerFields(
    this.claim.issuedToken
  );

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { claimData: EnrolmentClaim; listType: EnrolmentListType },
    private tokenDecodeService: TokenDecodeService
  ) {}

  get claim() {
    return this.data.claimData;
  }
}
