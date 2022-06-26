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

  get isSynced() {
    return this.isSyncedOnChain && this.isSyncedOffChain;
  }

  get isAccepted() {
    return this.iclClaim.isAccepted && !this.isRevoked;
  }

  get isRejected() {
    return !this.iclClaim?.isAccepted && this.iclClaim?.isRejected;
  }

  get isPending() {
    return !this.iclClaim?.isAccepted && !this.iclClaim?.isRejected;
  }

  get isPendingSync() {
    if (
      this.isRegisteredOnChain() &&
      this.isRegisteredOffChain()
    ) {
      return !this.isSyncedOffChain || !this.isSyncedOnChain;
    }
    if (this.isRegisteredOnChain()) {
      return !this.isSyncedOnChain;
    }

    if (this.isRegisteredOffChain()) {
      return !this.isSyncedOffChain;
    }

    return false;
  }

  get isSyncedOffChain(): boolean {
    return (
      this.isAccepted && this.isRegisteredOffChain() && this._isSyncedOffChain
    );
  }

  get isSyncedOnChain(): boolean {
    return (
      this.isAccepted && this.isRegisteredOnChain() && this._isSyncedOnChain
    );
  }

  get isRevocable(): boolean {
    return this.isAccepted && this.isSynced && !this.isRevoked;
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
