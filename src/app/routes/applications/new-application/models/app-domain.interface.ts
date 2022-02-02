import { AppDomainDefinition } from './app-domain-definition.interface';

export interface AppDomain {
  orgNamespace: string;
  definition?: AppDomainDefinition;
  domain?: string;
  name?: string;
  owner?: string;
}
