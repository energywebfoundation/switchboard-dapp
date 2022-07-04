import {
  Claim,
  isRoleCredential,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { EnrolmentClaimAbstract } from './enrolment-claim.abstract';
import { IEnrolmentClaim } from './enrolment-claim.interface';

export class EnrolmentClaim
  extends EnrolmentClaimAbstract
  implements IEnrolmentClaim
{
  roleName: string;
  requestDate: Date;

  isRevokedOnChain: boolean;
  isRevokedOffChain: boolean;
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

  get isRevoked() {
    return !!this.isRevokedOnChain || !!this.isRevokedOffChain;
  }

  get isPending() {
    return !this.iclClaim?.isAccepted && !this.iclClaim?.isRejected;
  }

  get isPendingSync() {
    if (this.isRegisteredOnChain() && this.isRegisteredOffChain()) {
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
      this.iclClaim.isAccepted &&
      this.isRegisteredOffChain() &&
      !!this._isSyncedOffChain
    );
  }

  get isSyncedOnChain(): boolean {
    return (
      this.iclClaim.isAccepted &&
      this.isRegisteredOnChain() &&
      !!this._isSyncedOnChain
    );
  }

  get canRevokeOnChain(): boolean {
    return this.isSyncedOnChain && !this.isRevokedOnChain;
  }

  get canRevokeOffChain(): boolean {
    return (
      this.isSyncedOffChain &&
      !this.isRevokedOffChain &&
      !!this.credential?.credentialStatus
    );
  }

  get isRevocableOffChain(): boolean {
    return (
      this.isSyncedOffChain &&
      this.credential &&
      isRoleCredential(this.credential) &&
      !!this.credential?.credentialStatus
    );
  }

  setIsRevokedOnChain(isRevoked: boolean): EnrolmentClaim {
    this.isRevokedOnChain = isRevoked;
    return this;
  }

  setIsRevokedOffChain(isRevoked: boolean): EnrolmentClaim {
    this.isRevokedOffChain = isRevoked;
    return this;
  }

  setIsSyncedOffChain(isSyncedOffChain: boolean): EnrolmentClaim {
    this._isSyncedOffChain = isSyncedOffChain;
    return this;
  }

  setIsSyncedOnChain(isSyncedOnChain: boolean): EnrolmentClaim {
    this._isSyncedOnChain = isSyncedOnChain;
    return this;
  }

  isRegisteredOnChain(): boolean {
    return this.iclClaim.registrationTypes?.includes(RegistrationTypes.OnChain);
  }

  isRegisteredOffChain(): boolean {
    return this.iclClaim.registrationTypes?.includes(
      RegistrationTypes.OffChain
    );
  }

  private defineProperties(): void {
    this.defineRoleName();
    this.defineRequestDate();
  }

  private defineRoleName(): void {
    this.roleName = this.iclClaim?.claimType
      ?.split(`.${NamespaceType.Role}.`)
      ?.shift();
  }

  private defineRequestDate(): void {
    this.requestDate = new Date((this.iclClaim as any).createdAt);
  }

  isAsset() {
    return (
      this.iclClaim?.subject !== this.iclClaim?.claimType &&
      this.iclClaim?.subject !== this.iclClaim?.requester
    );
  }
}
