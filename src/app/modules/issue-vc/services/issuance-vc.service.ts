import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { finalize, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {
  private roles = [];
  assetClaims: Claim[];

  constructor(private iamService: IamService,
              private loadingService: LoadingService) {
    this.getAllowedRoles();
  }

  create(data: { subject: string, claim: any }) {
    return this.iamService.issueClaim(data);
  }

  getNotEnrolledRoles(did) {
    this.loadingService.show();
    return this.iamService.getClaimsBySubject(did)
      .pipe(
        tap(assets => this.assetClaims = assets),
        map((assetsClaims: Claim[]) => {
          return this.roles.filter((role: any) => {
            return !assetsClaims.some((asset) => role.namespace === asset.claimType &&
              // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
              role.definition.version.toString().split('.')[0] === asset.claimTypeVersion.toString().split('.')[0]);
          });
        }),
        finalize(() => this.loadingService.hide())
      );
  }

  private getAllowedRoles(): void {
    this.iamService.getAllowedRolesByIssuer().subscribe((roles) => this.roles = roles);
  }

}
