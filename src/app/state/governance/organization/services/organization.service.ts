import { Injectable } from '@angular/core';
import { IamService } from '../../../../shared/services/iam.service';
import { forkJoin, Observable } from 'rxjs';
import { IOrganization } from 'iam-client-lib';
import { map, switchMap } from 'rxjs/operators';
import { OrganizationProvider } from '../models/organization-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private iamService: IamService) {}

  getOrganizationList(): Observable<any[]> {
    return this.iamService
      .wrapWithLoadingService(
        this.iamService
          .getOrganizationsByOwner()
          .pipe(
            switchMap((organizations: IOrganization[]) =>
              this.isOrganizationOwner(organizations)
            )
          )
      )
      .pipe(
        map((organizations) => {
          return (organizations as IOrganization[]).map(
            (org: IOrganization) => ({
              ...org,
              containsApps: org?.apps?.length > 0,
              containsRoles: org?.roles?.length > 0,
            })
          );
        })
      );
  }

  getHistory(namespace: string): Observable<OrganizationProvider> {
    return this.iamService.wrapWithLoadingService<OrganizationProvider>(
      this.iamService.getOrgHistory(namespace).pipe(
        switchMap(async (organization: IOrganization) => {
          return {
            ...organization,
            subOrgs: await this.isOrganizationOwner(
              organization.subOrgs
            ).toPromise(),
          };
        })
      )
    );
  }

  /**
   * When we get list of organization there is property owner. However that property is  not very reliable.
   * That's why we need to check if current user is the owner of organization from the list.
   */
  private isOrganizationOwner(
    organizations: OrganizationProvider[]
  ): Observable<OrganizationProvider[]> {
    return forkJoin(
      organizations.map((org) =>
        this.iamService.isOwner(org.namespace).pipe(
          map((isOwnedByCurrentUser) => ({
            ...org,
            isOwnedByCurrentUser,
          }))
        )
      )
    );
  }
}
