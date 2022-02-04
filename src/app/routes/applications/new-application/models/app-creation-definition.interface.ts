import { IAppDefinition } from '@energyweb/iam-contracts';

export interface AppCreationDefinition {
  orgNamespace: string;
  data: IAppDefinition;
  domain?: string;
  name?: string;
}
