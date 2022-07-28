import {
  Claim,
  isRoleCredential,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { EnrolmentClaimAbstract } from './enrolment-claim.abstract';
import { IEnrolmentClaim } from './enrolment-claim.interface';
import { ExpirationStatus } from './expiration-statys.enum';

export class EnrolmentClaim
  extends EnrolmentClaimAbstract
  implements IEnrolmentClaim
{
  roleName: string;
  organization: string;
  application?: string;
  requestDate: Date;
  expirationStatus: string;

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

  get expirationDate() {
    return this.iclClaim?.expirationTimestamp
      ? `${this.iclClaim?.expirationTimestamp} / ${new Date(
          parseInt(this.iclClaim?.expirationTimestamp)
        ).toISOString()}`
      : '';
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

  /**
   * Role credential do not need to be synced OffChain to be able to revoke.
   * Issuer can revoke offchain credential when there exist credentialStatus in credential.
   */
  get canRevokeOffChain(): boolean {
    return (
      this.iclClaim.isAccepted &&
      this.isRegisteredOffChain() &&
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

  isRegisteredBoth(): boolean {
    return this.isRegisteredOnChain() && this.isRegisteredOffChain();
  }

  isAsset() {
    return (
      this.iclClaim?.subject !== this.iclClaim?.claimType &&
      this.iclClaim?.subject !== this.iclClaim?.requester
    );
  }

  private defineProperties(): void {
    this.defineRoleName();
    this.defineRequestDate();
    this.defineOrganization();
    this.defineApplication();
    this.defineExpirationStatus();
  }

  private defineRoleName(): void {
    this.roleName = this.claimType?.split(`.${NamespaceType.Role}.`)?.shift();
  }

  private defineOrganization(): void {
    this.organization = this.claimType
      ?.split(`.${NamespaceType.Role}.`)
      .pop()
      ?.split(`.${NamespaceType.Application}.`)
      .pop();
  }

  private defineApplication(): void {
    if (!this.claimType?.includes(`.${NamespaceType.Application}.`)) {
      this.application = '';
      return;
    }
    this.application = this.claimType
      ?.split(`.${NamespaceType.Role}.`)
      ?.pop()
      ?.split(`.${NamespaceType.Application}.`)
      ?.shift();
  }

  private defineRequestDate(): void {
    this.requestDate = new Date((this.iclClaim as any).createdAt);
  }

  private defineExpirationStatus() {
    this.expirationStatus = !this.iclClaim.expirationTimestamp
      ? ''
      : parseInt(this.iclClaim.expirationTimestamp) < Date.now()
      ? ExpirationStatus.EXPIRED
      : ExpirationStatus.NOT_EXPIRED;
  }
}
