export interface IEnrolmentClaim {
  roleName: string;
  requestDate: Date;
  isSyncedOnChain: boolean;
  isRevoked: boolean;
  createdAt: string;
  isSyncedOffChain?: boolean;
}
