import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import {
  Claim,
  ClaimData,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { forkJoin, from, Observable } from 'rxjs';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../loading.service';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { SwitchboardToastrService } from '../switchboard-toastr.service';

@Injectable({
  providedIn: 'root',
})
export class ClaimsFacadeService {
  constructor(
    private iamService: IamService,
    private loadingService: LoadingService,
    private toastrService: SwitchboardToastrService
  ) {}

  createSelfSignedClaim(data: { data: ClaimData; subject?: string }) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    return from(this.iamService.claimsService.createSelfSignedClaim(data)).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  hasOnChainRole(role: string, version: number) {
    return this.iamService.claimsService.hasOnChainRole(
      this.iamService.signerService.did,
      role,
      version
    );
  }

  getClaimsBySubject(did) {
    return from(
      this.iamService.claimsService.getClaimsBySubject({
        did,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims);
  }

  getClaimsByRequester(
    isAccepted: boolean = undefined
  ): Observable<EnrolmentClaim[]> {
    return from(
      this.iamService.claimsService.getClaimsByRequester({
        did: this.iamService.signerService.did,
        isAccepted,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims);
  }

  getClaimsByIssuer(): Observable<EnrolmentClaim[]> {
    return from(
      this.iamService.claimsService.getClaimsByIssuer({
        did: this.iamService.signerService.did,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims);
  }

  getUserClaims(did: string) {
    return this.iamService.claimsService.getUserClaims({ did });
  }

  publishPublicClaim({
    registrationTypes,
    claim,
  }: {
    registrationTypes?: RegistrationTypes[];
    claim: {
      token: string;
      claimType: string;
    };
  }): Observable<string | undefined> {
    return from(
      this.iamService.claimsService.publishPublicClaim({
        registrationTypes,
        claim,
      })
    );
  }

  registerOnchain(claim: {
    claimType?: string;
    claimTypeVersion?: string;
    token?: string;
    subjectAgreement?: string;
    onChainProof: string;
    acceptedBy: string;
    subject?: string;
  }): Observable<void> {
    return from(this.iamService.claimsService.registerOnchain(claim));
  }

  revoke(claim: EnrolmentClaim): Observable<boolean> {
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
        return err;
      }),
      finalize<boolean>(() => this.loadingService.hide())
    );
  }

  private createEnrolmentClaimsFromClaims(
    source: Observable<Claim[]>
  ): Observable<EnrolmentClaim[]> {
    return source.pipe(
      map((claims) => claims.map((claim) => new EnrolmentClaim(claim))),
      switchMap((enrolments: EnrolmentClaim[]) =>
        from(this.appendDidDocSyncStatus(enrolments))
      ),
      switchMap((enrolments: EnrolmentClaim[]) =>
        this.setIsRevokedStatus(enrolments)
      )
    );
  }

  private async appendDidDocSyncStatus(
    list: EnrolmentClaim[],
    did?: string
  ): Promise<EnrolmentClaim[]> {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const claims: ClaimData[] = (await this.getUserClaims(did))
      .filter((item) => item && item.claimType)
      .filter((item: ClaimData) => {
        const arr = item.claimType.split('.');
        return arr.length > 1 && arr[1] === NamespaceType.Role;
      });

    return list.map((item: EnrolmentClaim) => {
      return item.setIsRevoked(
        claims.some((claim) => claim.claimType === item.claimType)
      );
    });
  }

  private setIsRevokedStatus(
    list: EnrolmentClaim[]
  ): Observable<EnrolmentClaim[]> {
    return forkJoin(
      list.map((claim) =>
        from(
          this.iamService.claimsService.isClaimRevoked({
            claimId: claim.id,
          })
        ).pipe(
          map((isRevoked: boolean) => {
            claim.isRevoked = isRevoked;
            return claim;
          })
        )
      )
    );
  }
}
