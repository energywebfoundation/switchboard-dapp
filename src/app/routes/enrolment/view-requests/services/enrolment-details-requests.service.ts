import { Injectable } from '@angular/core';
import { IamService } from '../../../../shared/services/iam.service';
import { CancelButton } from '../../../../layout/loading/loading.component';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IssueClaimRequestOptions } from 'iam-client-lib/dist/src/modules/claims/claims.types';

@Injectable({
  providedIn: 'root',
})
export class EnrolmentDetailsRequestsService {
  constructor(private iamService: IamService) {}

  getRoleIssuerFields(namespace: string) {
    return this.iamService.wrapWithLoadingService(
      this.iamService.getRolesDefinition(namespace)
    );
  }

  approve(claim: EnrolmentClaim, issuerFields: any[], expirationTimestamp: number = undefined) {
    const req: IssueClaimRequestOptions = {
      requester: claim.requester,
      id: claim.id,
      token: claim.token,
      subjectAgreement: claim.subjectAgreement,
      registrationTypes: claim.registrationTypes,
      issuerFields: issuerFields,
      publishOnChain: false,
      expirationTimestamp
    };
    return this.iamService.wrapWithLoadingService(
      this.iamService.claimsService.issueClaimRequest(req),
      {
        message: 'Please confirm this transaction in your connected wallet.',
        cancelable: CancelButton.ENABLED,
      }
    );
  }
}
