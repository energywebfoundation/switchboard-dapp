import { Claim, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaimAbstract } from './enrolment-claim.abstract';
import { IEnrolmentClaim } from './enrolment-claim.interface';

export class EnrolmentClaim
  extends EnrolmentClaimAbstract
  implements IEnrolmentClaim
{
  roleName: string;
  requestDate: Date;

  isRevoked: boolean;
  createdAt: string;

  private _isSyncedOnChain: boolean;
  private _isSyncedOffChain: boolean;
  constructor(iclClaim: Claim) {
    super(iclClaim);
    this.defineProperties();
  }

  isSynced() {
    return this.isSyncedOnChain() && this.isSyncedOffChain();
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
    if (
      this.iclClaim.registrationTypes.includes(RegistrationTypes.OnChain) &&
      this.iclClaim.registrationTypes.includes(RegistrationTypes.OffChain)
    ) {
      return !this.isSyncedOffChain() || !this.isSyncedOnChain();
    }
    if (this.iclClaim.registrationTypes.includes(RegistrationTypes.OnChain)) {
      return !this.isSyncedOnChain();
    }

    if (this.iclClaim.registrationTypes.includes(RegistrationTypes.OffChain)) {
      return !this.isSyncedOffChain();
    }

    return false;
  }

  isSyncedOffChain(): boolean {
    return (
      this.isAccepted() && this.isRegisteredOffChain() && this._isSyncedOffChain
    );
  }

  isSyncedOnChain(): boolean {
    return this.isAccepted() && this.isRegisteredOnChain() && this._isSyncedOnChain;
  }

  syncedOnChain(): boolean {
    return this.isRegisteredOnChain() && this._isSyncedOnChain;
  }

  syncedOffChain(): boolean {
    return this.isRegisteredOffChain() && this._isSyncedOffChain;
  }

  setIsRevoked(isRevoked: boolean): EnrolmentClaim {
    this.isRevoked = isRevoked;
    return this;
  }

  setIsSyncedOffChain(isSyncedOffChain: boolean): EnrolmentClaim {
    this._isSyncedOffChain = isSyncedOffChain;
    return this;
  }

  private isRegisteredOnChain(): boolean {
    return this.iclClaim.registrationTypes.includes(RegistrationTypes.OnChain);
  }

  private isRegisteredOffChain(): boolean {
    return this.iclClaim.registrationTypes.includes(RegistrationTypes.OffChain);
  }

  private defineProperties(): void {
    this.defineRoleName();
    this.defineRequestDate();
    this.defineSyncedOnChain();
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
    this._isSyncedOnChain = Boolean(
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
