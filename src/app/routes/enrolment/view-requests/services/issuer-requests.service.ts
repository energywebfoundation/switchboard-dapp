import { Injectable } from '@angular/core';
import { IamService } from '../../../../shared/services/iam.service';
import { CancelButton } from '../../../../layout/loading/loading.component';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IssueClaimRequestOptions } from 'iam-client-lib/dist/src/modules/claims/claims.types';
import { ConfirmationDialogComponent } from '../../../widgets/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { truthy } from '@operators';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';

const TOASTR_HEADER = 'Enrolment Request';

@Injectable({
  providedIn: 'root',
})
export class IssuerRequestsService {
  constructor(
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService
  ) {}

  getRoleIssuerFields(namespace: string) {
    return this.iamService.wrapWithLoadingService(
      this.iamService.getRolesDefinition(namespace)
    );
  }

  approve(
    claim: EnrolmentClaim,
    issuerFields: any[],
    expirationTimestamp: number = undefined
  ) {
    const req: IssueClaimRequestOptions = {
      requester: claim.requester,
      id: claim.id,
      token: claim.token,
      subjectAgreement: claim.subjectAgreement,
      registrationTypes: claim.registrationTypes,
      issuerFields: issuerFields,
      publishOnChain: false,
      expirationTimestamp,
    };
    return this.iamService.wrapWithLoadingService(
      this.iamService.claimsService.issueClaimRequest(req),
      {
        message: 'Please confirm this transaction in your connected wallet.',
        cancelable: CancelButton.ENABLED,
      }
    ).pipe(map(() => {
        this.toastr.success('Request is approved.', TOASTR_HEADER);
      }),
      catchError((err) => {
        this.toastr.error(err?.message, TOASTR_HEADER);
        return of(err);
      }));
  }

  reject(claim: EnrolmentClaim) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: TOASTR_HEADER,
          message: 'Are you sure to reject this request?',
          isDiscardButton: false,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        truthy(),
        map(
          () =>
            this.iamService
              .wrapWithLoadingService(
                this.iamService.claimsService.rejectClaimRequest({
                  id: claim.id,
                  requesterDID: claim.requester,
                })
              )
              .pipe(
                map(() =>
                  this.toastr.success(
                    'Request is rejected successfully.',
                    TOASTR_HEADER
                  )
                )
              ),
          catchError((err) => {
            console.error(err);
            this.toastr.error(err.message, TOASTR_HEADER);
            return of(err);
          })
        )
      );
  }
}
