import { IOrganizationDefinition } from '@energyweb/iam-contracts';

export interface Provider {
  org: string;
  pool: string;
  provider: string;
  name: string;
  namespace: string;
  owner: string;
  definition: IOrganizationDefinition;
}
