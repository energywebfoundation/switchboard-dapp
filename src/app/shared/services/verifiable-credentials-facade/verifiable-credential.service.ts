import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { forkJoin, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';


@Injectable({
  providedIn: 'root',
})
export class CredentialsFacadeService {
  constructor(
    private iamService: IamService,
  ) {}



public setCredentialRevokedStatus(list: EnrolmentClaim[]): Observable<EnrolmentClaim[]> {
  return forkJoin(
    list.map((claim) =>
      from(
        this.iamService.verifiableCredentialsService.isRevoked(claim as any)
      ).pipe(
        map((v) => ({
          ...claim,
          isRevokedOffChain: v,
        }))
      )
    )
  );
}










  
}