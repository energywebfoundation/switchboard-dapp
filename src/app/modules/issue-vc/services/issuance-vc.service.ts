import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { finalize, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssuanceVcService {
  private roles;
  assetClaims: Claim[];

  constructor(private iamService: IamService,
              private loadingService: LoadingService) {
    this.iamService.getAllowedRolesByIssuer().subscribe((roles) => {
      this.roles = roles;
    });
  }

  create(data: { subject: string, claim: any }) {
    return this.iamService.issueClaim(data);
  }

  getNotEnrolledRoles(did) {
    this.loadingService.show();
    let roleList = [...this.roles];
    return this.iamService.getClaimsBySubject(did)
      .pipe(
        tap(assets => this.assetClaims = assets),
        map((assetsClaims: Claim[]) => {
          if (roleList && roleList.length) {
            roleList = roleList.filter((role: any) => {
              let retVal = true;
              for (let i = 0; i < assetsClaims.length; i++) {
                if (role.namespace === assetsClaims[i].claimType &&
                  // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
                  role.definition.version.toString().split('.')[0] === assetsClaims[i].claimTypeVersion.toString().split('.')[0]) {

                  retVal = false;
                  break;
                }
              }

              return retVal;
            });

            return roleList;
          }
        }),
        finalize(() => this.loadingService.hide())
      );
  }

}
