import { IVerifiableCredential } from '@sphereon/pex';

interface ICredentialData {
  role: string;
  credential: IVerifiableCredential;
  descriptor: string;
}

export interface ICredentialTableData {
  descriptor: string;
  selfSign: boolean;
  descId: string;
  credentials?: ICredentialData[];
}
