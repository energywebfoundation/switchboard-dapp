import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IamService } from '../../../../shared/services/iam.service';
import { isRoleCredential, StatusList2021Credential } from 'iam-client-lib';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';
import { CancelButton } from 'src/app/layout/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class RevokeService {
  constructor(
    private iamService: IamService,
    private loadingService: LoadingService,
    private toastrService: SwitchboardToastrService
  ) {}

  revokeOffChain(enrolment: EnrolmentClaim) {
    this.loadingService.show();
    if (enrolment.credential && isRoleCredential(enrolment.credential))
      return from(
        this.iamService.verifiableCredentialsService.revokeCredential(
          enrolment.credential
        )
      ).pipe(this.handleRevokeResponse());
  }

  revokeOnChain(claim: EnrolmentClaim): Observable<boolean> {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    return from(
      this.iamService.claimsService.revokeClaim({
        claim: { namespace: claim.claimType, subject: claim.subject },
      })
    ).pipe(this.handleRevokeResponse());
  }

  private handleRevokeResponse() {
    return (source) =>
      source.pipe(
        map((value: boolean | StatusList2021Credential) => {
          if (value) {
            this.toastrService.success(
              'Successfully revoked claim',
              'Claim Revoke'
            );
          } else {
            this.toastrService.error('Claim was not revoked', 'Claim Revoke');
          }
          return Boolean(value);
        }),
        catchError((err) => {
          console.log(err);
          this.toastrService.error(err.message);
          return of(err);
        }),
        finalize<boolean>(() => this.loadingService.hide())
      );
  }
}
