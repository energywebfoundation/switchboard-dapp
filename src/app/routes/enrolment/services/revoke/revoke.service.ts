import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../models/enrolment-claim';
import { IamService } from '../../../../shared/services/iam.service';
import { isRoleCredential } from 'iam-client-lib';
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../../shared/services/switchboard-toastr.service';

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
    if (enrolment.credential && isRoleCredential(enrolment.credential))
      return from(
        this.iamService.verifiableCredentialsService.revokeCredential(
          enrolment.credential
        )
      );
  }

  revokeOnChain(claim: EnrolmentClaim): Observable<boolean> {
    this.loadingService.show();
    return from(
      this.iamService.claimsService.revokeClaim({
        claim: { namespace: claim.claimType, subject: claim.subject },
      })
    ).pipe(
      map((value: boolean) => {
        if (value) {
          this.toastrService.success(
            'Successfully revoked claim',
            'Claim Revoke'
          );
        } else {
          this.toastrService.error('Claim was not revoked', 'Claim Revoke');
        }
        return value;
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
