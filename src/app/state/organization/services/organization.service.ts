import { Injectable } from '@angular/core';
import { StakingPoolServiceFacade } from '../../../shared/services/staking/staking-pool-service-facade';
import { IamService } from '../../../shared/services/iam.service';
import { forkJoin, from } from 'rxjs';
import { IOrganization } from 'iam-client-lib';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private stakingService: StakingPoolServiceFacade,
              private iamService: IamService) {
  }

  getOrganizationList() {
    return this.iamService.wrapWithLoadingService(forkJoin([
      this.iamService.getOrganizationsByOwner().pipe(
        switchMap(organizations => this.isOrganizationOwner(organizations))),
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

  getHistory(namespace: string) {
    return this.iamService.wrapWithLoadingService(this.iamService.getOrgHistory(namespace)
      .pipe(
        switchMap(async (organization: IOrganization) => {
          return {...organization, subOrgs: await this.isOrganizationOwner(organization.subOrgs).toPromise()};
        })
      ));
  }

  /**
   * When we get list of organization there is property owner. However that property is  not very reliable.
   * That's why we need to check if current user is the owner of organization from the list.
   */
  private isOrganizationOwner(organizations) {
    return forkJoin(
      (organizations as IOrganization[]).map((org) =>
        from(this.iamService.isOwner(org.namespace)).pipe(
          map(isOwnedByCurrentUser => ({
              ...org,
              isOwnedByCurrentUser
            })
          )
        )
      ));
  }
}
