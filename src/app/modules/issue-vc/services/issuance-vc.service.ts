import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {
  roles;
  assetClaims: Claim[];

  constructor(private iamService: IamService,
              private loadingService: LoadingService) {
    this.getIssuerRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  create(data: { subject: string, claim: any }) {
    return this.iamService.issueClaim(data);
  }

  getIssuerRoles() {
    return this.iamService.wrapWithLoadingService(this.iamService.iam.getAllowedRolesByIssuer({did: this.iamService.iam.getDid()}));
  }

  async getAssetClaims(did: string) {
    return (await this.iamService.iam.getClaimsBySubject({
      did
    })).filter((claim) => !claim.isRejected);
  }

  async getNotEnrolledRoles(did) {
    this.loadingService.show();
    let roleList = [...this.roles];

    this.assetClaims = await this.getAssetClaims(did);

    if (roleList && roleList.length) {
      roleList = roleList.filter((role: any) => {
        let retVal = true;
        for (let i = 0; i < this.assetClaims.length; i++) {
          if (role.namespace === this.assetClaims[i].claimType &&
            // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
            role.definition.version.toString().split('.')[0] === this.assetClaims[i].claimTypeVersion.toString().split('.')[0]) {

            retVal = false;
            break;
          }
        }

        return retVal;
      });
    }
    this.loadingService.hide();
    return roleList;
  }
}
