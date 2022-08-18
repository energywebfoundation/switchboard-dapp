import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IssueClaimRequestOptions } from 'iam-client-lib/dist/src/modules/claims/claims.types';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { DialogService } from '../../../../shared/services/dialog/dialog.service';
import { truthy } from '@operators';
import { ClaimsFacadeService } from '../../../../shared/services/claims-facade/claims-facade.service';
import { IssuerFields } from 'iam-client-lib';

const TOASTR_HEADER = 'Enrolment Request';

@Injectable({
  providedIn: 'root',
})
export class IssuerRequestsService {
  constructor(
    private claimsFacade: ClaimsFacadeService,
    private dialog: DialogService,
    private toastr: SwitchboardToastrService
  ) {}

  approve(
    claim: EnrolmentClaim,
    issuerFields: IssuerFields[],
    expirationTimestamp: number
  ) {
    const req: IssueClaimRequestOptions = {
      requester: claim.requester,
      id: claim.id,
      token: claim.token,
      subjectAgreement: claim.subjectAgreement,
      registrationTypes: claim.registrationTypes,
      issuerFields: issuerFields.filter(
        (field) => field.value !== null && field.value !== undefined
      ),
      publishOnChain: false,
      expirationTimestamp,
    };
    return this.claimsFacade.issueClaimRequest(req).pipe(
      map(() => {
        this.toastr.success('Request is approved.', TOASTR_HEADER);
      }),
      catchError((err) => {
        this.toastr.error(err?.message, TOASTR_HEADER);
        return of(err);
      })
    );
  }

  reject(claim: EnrolmentClaim) {
    return this.dialog
      .confirm({
        header: TOASTR_HEADER,
        message: 'Are you sure to reject this request?',
        isDiscardButton: false,
      })
      .pipe(
        truthy(),
        switchMap(() =>
          this.claimsFacade
            .rejectClaimRequest({
              id: claim.id,
              requesterDID: claim.requester,
            })
            .pipe(
              map(() =>
                this.toastr.success(
                  'Request is rejected successfully.',
                  TOASTR_HEADER
                )
              ),
              catchError((err) => {
                console.error(err);
                this.toastr.error(err.message, TOASTR_HEADER);
                return of(err);
              })
            )
        )
      );
  }
}
