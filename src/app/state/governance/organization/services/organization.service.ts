import { Injectable } from '@angular/core';
import { StakingPoolServiceFacade } from '../../../../shared/services/staking/staking-pool-service-facade';
import { IamService } from '../../../../shared/services/iam.service';
import { forkJoin, Observable } from 'rxjs';
import { IOrganization } from 'iam-client-lib';
import { map, switchMap } from 'rxjs/operators';
import { OrganizationProvider } from '../models/organization-provider.interface';

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
    ])
      .pipe(
        map(([organizations, providers]) => {
          const servicesNames = providers.map((service) => service.org);
          return (organizations as IOrganization[]).map((org: IOrganization) => ({
            ...org,
            containsApps: org?.apps?.length > 0,
            containsRoles: org?.roles?.length > 0,
            isProvider: servicesNames.includes(org.namespace)
          }));
        }),
      ));
  }

  getHistory(namespace: string): Observable<OrganizationProvider> {
    return this.iamService.wrapWithLoadingService(this.iamService.getOrgHistory(namespace)
      .pipe(
        switchMap(async (organization: OrganizationProvider) => {
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
      (organizations as OrganizationProvider[]).map((org) =>
        this.iamService.isOwner(org.namespace).pipe(
          map(isOwnedByCurrentUser => ({
              ...org,
              isOwnedByCurrentUser
            })
          )
        )
      ));
  }
}
