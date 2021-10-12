import { Provider } from '../../../stake/models/provider.interface';
import { IOrganization } from 'iam-client-lib';

export interface OrganizationProvider extends Provider, IOrganization {
  isProvider: boolean;
  isOwnedByCurrentUser: boolean;
}
