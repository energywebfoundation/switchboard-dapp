import { Injectable } from '@angular/core';
import { StakingPoolServiceFacade } from '../../../shared/services/staking/staking-pool-service-facade';
import { IamService } from '../../../shared/services/iam.service';
import { forkJoin } from 'rxjs';
import { ENSNamespaceTypes, IOrganization } from 'iam-client-lib';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private stakingService: StakingPoolServiceFacade,
              private iamService: IamService) {
  }

  getOrganizationList() {
    return this.iamService.wrapWithLoadingService(forkJoin([
      this.iamService.getENSTypesByOwner$(ENSNamespaceTypes.Organization),
      this.stakingService.allServices()
    ]))
      .pipe(
        map(([organizations, providers]) => {
          const servicesNames = providers.map((service) => service.org);
          return (organizations as IOrganization[]).map((org: IOrganization) => ({
            ...org,
            isProvider: servicesNames.includes(org.namespace)
          }));
        }),
      );
  }
}
