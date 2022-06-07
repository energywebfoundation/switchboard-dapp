import { IssuerType } from './issuer-type.enum';

export interface IRoleType {
  type: IssuerType;
  did: string[];
  roleName: string;
}
