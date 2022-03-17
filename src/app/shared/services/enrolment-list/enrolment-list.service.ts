import { Injectable } from '@angular/core';
import {
  Claim,
  ClaimData,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';

/**
  @deprecated
 Use PublishRoleService instead.
 */
@Injectable({
  providedIn: 'root',
})
export class EnrolmentListService {
  constructor(private claimsFacade: ClaimsFacadeService) {}

  public async appendDidDocSyncStatus(
    list: Claim[],
    did?: string
  ): Promise<(Claim & { isSynced: boolean })[]> {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const claims: ClaimData[] = (await this.claimsFacade.getUserClaims(did))
      .filter((item) => item && item.claimType)
      .filter((item: ClaimData) => {
        const arr = item.claimType.split('.');
        return arr.length > 1 && arr[1] === NamespaceType.Role;
      });

    return list.map((item) => {
      return {
        ...item,
        isSynced: claims.some((claim) => claim.claimType === item.claimType),
      };
    });
  }

  async getNotSyncedDIDsDocsList() {
    return (
      await this.appendDidDocSyncStatus(
        await this.claimsFacade.getClaimsByRequester(true)
      )
    ).filter((item) => this.isPendingSync(item));
  }

  isPendingSync(element: {
    isSynced: boolean;
    registrationTypes: RegistrationTypes[];
  }) {
    return (
      !element?.isSynced &&
      element.registrationTypes.includes(RegistrationTypes.OffChain) &&
      !(
        element.registrationTypes.length === 1 &&
        element.registrationTypes.includes(RegistrationTypes.OnChain)
      )
    );
  }
}
