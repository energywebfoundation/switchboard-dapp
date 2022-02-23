import { IOrganization } from 'iam-client-lib';

export interface OrganizationProvider extends Omit<IOrganization, 'subOrgs'> {
  isOwnedByCurrentUser?: boolean;
  subOrgs?: OrganizationProvider[];
  containsApps?: boolean;
  containsRoles?: boolean;
}
