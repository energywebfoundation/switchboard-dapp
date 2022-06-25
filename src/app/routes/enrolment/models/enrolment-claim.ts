import { Claim, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaimAbstract } from './enrolment-claim.abstract';
import { IEnrolmentClaim } from './enrolment-claim.interface';

export class EnrolmentClaim
  extends EnrolmentClaimAbstract
  implements IEnrolmentClaim
{
  roleName: string;
  requestDate: Date;
  isSyncedOnChain: boolean;
  isSyncedOffChain: boolean;

  isRevoked: boolean;
  createdAt: string;
  constructor(iclClaim: Claim) {
    super(iclClaim);
    this.defineProperties();
    this.defineRequestDate();
    this.defineSyncedOnChain();
  }

  isSynced() {
    return this.isAccepted() && this.syncedOnChain() && this.syncedOffChain();
  }

  isAccepted() {
    return this.iclClaim.isAccepted && !this.isRevoked;
  }

  isRejected() {
    return !this.iclClaim?.isAccepted && this.iclClaim?.isRejected;
  }

  isPending() {
    return !this.iclClaim?.isAccepted && !this.iclClaim?.isRejected;
  }

  isPendingSync() {
    return (
      this.isAccepted() && !(this.syncedOffChain() && this.syncedOnChain())
    );
  }

  syncedOnChain(): boolean {
    return this.iclClaim.registrationTypes.includes(RegistrationTypes.OnChain)
      ? this.isSyncedOnChain
      : true;
  }

  syncedOffChain(): boolean {
    return this.iclClaim.registrationTypes.includes(RegistrationTypes.OffChain)
      ? this.isSyncedOffChain
      : true;
  }

  setIsRevoked(isRevoked: boolean): EnrolmentClaim {
    this.isRevoked = isRevoked;
    return this;
  }

  setIsSyncedOffChain(isSyncedOffChain: boolean): EnrolmentClaim {
    this.isSyncedOffChain = isSyncedOffChain;
    return this;
  }

  private defineProperties(): void {
    this.defineRoleName();
  }

  private defineRoleName(): void {
    this.roleName = this.iclClaim?.claimType
      ?.split(`.${NamespaceType.Role}.`)
      ?.shift();
  }

  private defineRequestDate(): void {
    this.requestDate = new Date((this.iclClaim as any).createdAt);
  }

  private defineSyncedOnChain(): void {
    this.isSyncedOnChain = Boolean(
      this.iclClaim.issuedToken &&
        this.iclClaim.onChainProof &&
        this.iclClaim.vp
    );
  }

  isAsset() {
    return (
      this.iclClaim?.subject !== this.iclClaim?.claimType &&
      this.iclClaim?.subject !== this.iclClaim?.requester
    );
  }
}
