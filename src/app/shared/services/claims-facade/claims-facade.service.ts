import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { ClaimData } from 'iam-client-lib';
import { from, Observable } from 'rxjs';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';
import { Claim } from 'iam-client-lib';
import { RegistrationTypes } from 'iam-client-lib/dist/src/modules/claims/claims.types';

@Injectable({
  providedIn: 'root',
})
export class ClaimsFacadeService {
  constructor(
    private iamService: IamService,
    private loadingService: LoadingService
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

  async getNotRejectedClaimsByIssuer() {
    return (
      await this.iamService.claimsService.getClaimsByIssuer({
        did: this.iamService.signerService.did,
        isAccepted: false,
      })
    ).filter((item) => !item.isRejected);
  }

  getClaimsByRequester(isAccepted: boolean = undefined): Promise<Claim[]> {
    return this.iamService.claimsService.getClaimsByRequester({
      did: this.iamService.signerService.did,
      isAccepted,
    });
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
}
