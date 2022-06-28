import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import {
  Claim,
  ClaimData,
  isRoleCredential,
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
    ).pipe(this.createEnrolmentClaimsFromClaims());
  }

  getClaimsByRequester(
    isAccepted: boolean = undefined
  ): Observable<EnrolmentClaim[]> {
    return from(
      this.iamService.claimsService.getClaimsByRequester({
        did: this.iamService.signerService.did,
        isAccepted,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims());
  }

  private async addStatusIfIsSyncedOnChain(enrolment: EnrolmentClaim, requesterIsDid: boolean = true) {
    if (enrolment.isRegisteredOnChain()) {
    
      const hasOnChainRole = await this.iamService.claimsService.hasOnChainRole(
        requesterIsDid ? this.iamService.signerService.did : enrolment.subject,
        enrolment.claimType,
        +enrolment.claimTypeVersion
      );
      console.log(hasOnChainRole , "HAS ON CHAIN ROLE", enrolment)
      return enrolment.setIsSyncedOnChain(hasOnChainRole);
    }
    console.log("NOT REGISTERED", enrolment)
    return enrolment.setIsSyncedOnChain(false);
  }

  getClaimsByRevoker(): Observable<EnrolmentClaim[]> {
    const requesterIsDid = false;
    return from(
      this.iamService.claimsService.getClaimsByRevoker({
        did: this.iamService.signerService.did,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims(requesterIsDid));
  }

  getClaimsByIssuer(): Observable<EnrolmentClaim[]> {
    return from(
      this.iamService.claimsService.getClaimsByIssuer({
        did: this.iamService.signerService.did,
      })
    ).pipe(this.createEnrolmentClaimsFromClaims());
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

  private createEnrolmentClaimsFromClaims(requesterIsDid: boolean = true) {
    return (source: Observable<Claim[]>) =>
      source.pipe(
        map((claims: Claim[]) =>
          claims.map((claim: Claim) => new EnrolmentClaim(claim))
        ),
        switchMap((enrolments: EnrolmentClaim[]) =>
          from(this.addStatusIfIsSyncedOffChain(enrolments))
        ),
        switchMap((enrolments: EnrolmentClaim[]) =>
          forkJoin([
            ...enrolments.map((enrolment) =>
              from(this.addStatusIfIsSyncedOnChain(enrolment, requesterIsDid))
            ),
          ])
        ),
        switchMap((enrolments: EnrolmentClaim[]) =>
          this.setIsRevokedOnChainStatus(enrolments)
        ),
        switchMap((enrolments: EnrolmentClaim[]) =>
          forkJoin([
            ...enrolments.map((enrolment) =>
              from(this.setIsRevokedOffChainStatus(enrolment))
            ),
          ])
        )
      );
  }

  private async addStatusIfIsSyncedOffChain(
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
      return item.setIsSyncedOffChain(
        claims.some((claim) => claim.claimType === item.claimType)
      );
    });
  }

  private setIsRevokedOnChainStatus(
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
            return claim.setIsRevokedOnChain(isRevoked);
          })
        )
      )
    );
  }

  private async setIsRevokedOffChainStatus(enrolment: EnrolmentClaim) {
    if (
      enrolment.isSyncedOffChain &&
      enrolment.credential &&
      isRoleCredential(enrolment.credential) &&
      enrolment.credential?.credentialStatus
    ) {
      return enrolment.setIsRevokedOffChain(
        await this.iamService.verifiableCredentialsService.isRevoked(
          enrolment.credential
        )
      );
    }

    return enrolment.setIsRevokedOffChain(false);
  }

  // public async appendDidDocSyncStatus(
  //   list: EnrolmentClaim[],
  //   did?: string
  // ): Promise<EnrolmentClaim[]> {
  //   // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
  //   const claims: ClaimData[] = (await this.getUserClaims(did))
  //     .filter((item) => item && item.claimType)
  //     .filter((item: ClaimData) => {
  //       const arr = item.claimType.split('.');
  //       return arr.length > 1 && arr[1] === NamespaceType.Role;
  //     });

  //   return list.map((item) => {
  //     return {
  //       ...item,
  //       isSynced: claims.some((claim) => claim.claimType === item.claimType),
  //     };
  //   });
  // }
}
