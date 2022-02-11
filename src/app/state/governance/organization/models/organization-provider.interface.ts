import { IOrganization } from 'iam-client-lib';

export interface OrganizationProvider extends Omit<IOrganization, 'subOrgs'> {
  isProvider?: boolean;
  isOwnedByCurrentUser?: boolean;
  subOrgs?: OrganizationProvider[];
  containsApps?: boolean;
  containsRoles?: boolean;
}
