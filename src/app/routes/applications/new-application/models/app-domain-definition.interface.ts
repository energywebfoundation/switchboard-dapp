import { IAppDefinition } from 'iam-client-lib';

export interface AppDomainDefinition extends Omit<IAppDefinition, 'others'> {
  others?: string;
}
