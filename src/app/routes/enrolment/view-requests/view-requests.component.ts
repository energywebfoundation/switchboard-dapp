import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnrolmentClaim } from '../models/enrolment-claim';
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
    @Inject(MAT_DIALOG_DATA) protected data: { claimData: EnrolmentClaim },
    protected tokenDecodeService: TokenDecodeService
  ) {}

  get claim() {
    return this.data.claimData;
  }
}
