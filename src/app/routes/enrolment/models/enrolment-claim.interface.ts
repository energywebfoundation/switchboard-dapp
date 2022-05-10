import { Claim } from 'iam-client-lib';

export interface EnrolmentClaim extends Claim {
  roleName: string;
  requestDate: Date;
  isSynced: boolean;
  createdAt: string;
  notSyncedOnChain?: boolean;
}
