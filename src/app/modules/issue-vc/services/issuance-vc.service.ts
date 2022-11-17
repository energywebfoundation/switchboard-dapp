/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { finalize, map, tap } from 'rxjs/operators';
import { Claim, IRole, RegistrationTypes } from 'iam-client-lib';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IssuanceVcService {
  private roles: IRole[] = [];
  assetClaims: Claim[];

  constructor(
    private iamService: IamService,
    private loadingService: LoadingService
  ) {
    this.getAllowedRoles();
  }

  hasRoles(): boolean {
    return this.roles.length > 0;
  }

  create(data: { subject: string; claim: any; expirationTimestamp?: number }) {
    return this.iamService.issueClaim({
      ...data,
      registrationTypes: [
        RegistrationTypes.OffChain,
        RegistrationTypes.OnChain,
      ],
    });
  }

  getNotEnrolledRoles(did): Observable<IRole[]> {
    this.loadingService.show();
    return this.iamService.getClaimsBySubject(did).pipe(
      tap((assets) => (this.assetClaims = assets)),
      map((assetsClaims: Claim[]) => {
        return this.roles.filter((role: any) => {
          return !assetsClaims.some(
            (asset) =>
              role.namespace === asset.claimType &&
              // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
              role.definition.version.toString().split('.')[0] ===
                asset.claimTypeVersion.toString().split('.')[0]
          );
        });
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  private getAllowedRoles(): void {
    this.iamService
      .getAllowedRolesByIssuer()
      .subscribe((roles: IRole[]) => (this.roles = roles));
  }
}
