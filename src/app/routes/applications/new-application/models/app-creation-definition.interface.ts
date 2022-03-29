import { IAppDefinition } from 'iam-client-lib';

export interface AppCreationDefinition {
  orgNamespace: string;
  data: IAppDefinition;
  domain?: string;
  name?: string;
}
