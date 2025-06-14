import { CredentialSubject } from '@ew-did-registry/credentials-interface';

export interface RoleCredentialSubject extends CredentialSubject {
  id: string;
  role: {
    namespace: string;
    version: string;
  };
  issuerFields: Array<{
    key: string;
    value: string;
  }>;
  [key: string]: any; // Add index signature to satisfy CredentialSubject constraint
}
