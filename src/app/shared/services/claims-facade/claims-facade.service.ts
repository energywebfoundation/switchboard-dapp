import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { ClaimData } from 'iam-client-lib/dist/src/modules/didRegistry/did.types';
import { from } from 'rxjs';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../loading.service';
import { finalize } from 'rxjs/operators';
import { Claim } from 'iam-client-lib';

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
}
