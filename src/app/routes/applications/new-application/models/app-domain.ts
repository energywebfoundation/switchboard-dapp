import { IAppDefinition } from '@energyweb/iam-contracts';

export interface AppDomainDefinition extends Omit<IAppDefinition, 'others'> {
  others?: string;
}

export interface AppDomain {
  orgNamespace: string;
  definition?: AppDomainDefinition;
  domain?: string;
  name?: string;
  owner: string;
}

export interface AppCreationDefinition {
  orgNamespace: string;
  data: IAppDefinition;
  domain?: string;
  name?: string;
}

export enum ViewType {
  Update = 'update',
  New = 'new',
}

export interface ApplicationData extends AppDomain {
  viewType: ViewType;
}
