import { IAppDefinition } from '@energyweb/iam-contracts';

export interface AppDomainDefinition extends Omit<IAppDefinition, 'others'> {
  others?: string;
}
