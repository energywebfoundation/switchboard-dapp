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
      ).pipe(this.handleOffChainRevokeResponse());
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
    ).pipe(this.handleOnChainRevokeResponse());
  }

  private handleOnChainRevokeResponse() {
    return (source) =>
      source.pipe(
        map((value: boolean) => {
          if (value) {
            this.toastrService.success(
              'Successfully revoked on-chain claim',
              'Claim Revoke'
            );
          } else {
            this.toastrService.error(
              'An error occured. On-chain claim was not revoked',
              'Claim Revoke'
            );
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

  private handleOffChainRevokeResponse() {
    return (source) =>
      source.pipe(
        map((value: StatusList2021Credential) => {
          if (value) {
            this.toastrService.success(
              'Successfully revoked off-chain claim',
              'Claim Revoke'
            );
          } else {
            this.toastrService.error(
              'An error occured. Off-chain claim was not revoked',
              'Claim Revoke'
            );
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
