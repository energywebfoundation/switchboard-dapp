import {
  Claim,
  isRoleCredential,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';
import { EnrolmentClaimAbstract } from './enrolment-claim.abstract';
import { IEnrolmentClaim } from './enrolment-claim.interface';
import { ExpirationStatus } from './expiration-statys.enum';
import { FilterStatus } from '../enrolment-list/models/filter-status.enum';
import { DomainUtils } from '@utils';

export class EnrolmentClaim
  extends EnrolmentClaimAbstract
  implements IEnrolmentClaim
{
  roleName: string;
  organization: string;
  application?: string;
  requestDate: Date;
  expirationStatus?: string;
  expirationDate?: Date;

  isRevokedOnChain: boolean;
  isRevokedOffChain: boolean;
  decodedToken: string | { [key: string]: any };
  createdAt: string;
  status: FilterStatus;

  constructor(iclClaim: Claim) {
    super(iclClaim);
    this.defineProperties();
  }

  private _isSyncedOnChain: boolean;

  get isSyncedOnChain(): boolean {
    return (
      this.iclClaim.isAccepted &&
      this.isRegisteredOnChain() &&
      !!this._isSyncedOnChain
    );
  }

  private _isSyncedOffChain: boolean;

  get isSyncedOffChain(): boolean {
    return (
      this.iclClaim.isAccepted &&
      this.isRegisteredOffChain() &&
      !!this._isSyncedOffChain
    );
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

  get isExpired() {
    return (
      !!this.iclClaim.expirationTimestamp &&
      parseInt(this.iclClaim.expirationTimestamp) < Date.now()
    );
  }

  get canPublishClaim() {
    return this.isAccepted && this.isPendingSync && !this.isExpired;
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

  get canShowRawEip712(): boolean {
    return !!this.credential && this.isIssued;
  }

  get canShowRawEip191(): boolean {
    return !!this.decodedToken && this.isIssued;
  }

  get canCancelClaimRequest(): boolean {
    return (
      !this.iclClaim.isAccepted &&
      !this.iclClaim.isRejected &&
      !this.isRevokedOffChain &&
      !this.isRevokedOnChain
    );
  }

  get isIssued(): boolean {
    return this.iclClaim.isAccepted && !this.iclClaim.isRejected;
  }

  setIsRevokedOnChain(isRevoked: boolean): EnrolmentClaim {
    this.isRevokedOnChain = isRevoked;
    return this;
  }

  setDecodedToken(token: string | { [key: string]: any }) {
    this.decodedToken = token;
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

  defineStatus(): void {
    this.status = this.defineEnrolmentStatus();
  }

  private defineProperties(): void {
    this.defineRoleName();
    this.defineRequestDate();
    this.defineOrganization();
    this.defineApplication();
    this.defineExpirationStatus();
    this.defineExpirationDate();
  }

  private defineRoleName(): void {
    this.roleName = DomainUtils.getRoleNameFromDomain(this.claimType);
  }

  private defineOrganization(): void {
    this.organization = DomainUtils.getOrgName(this.claimType);
  }

  private defineApplication(): void {
    if (!this.claimType?.includes(`.${NamespaceType.Application}.`)) {
      this.application = '';
      return;
    }
    this.application = DomainUtils.getAppName(this.claimType);
  }

  private defineRequestDate(): void {
    this.requestDate = new Date((this.iclClaim as any).createdAt);
  }

  private defineExpirationStatus() {
    if (!this.iclClaim.expirationTimestamp) {
      this.expirationStatus = undefined;
    } else {
      this.expirationStatus = this.isExpired
        ? ExpirationStatus.EXPIRED
        : ExpirationStatus.NOT_EXPIRED;
    }
  }

  private defineExpirationDate(): void {
    this.expirationDate = this.iclClaim.expirationTimestamp
      ? new Date(parseInt(this.iclClaim.expirationTimestamp))
      : null;
  }

  private defineEnrolmentStatus(): FilterStatus {
    if (this.isPending) {
      return FilterStatus.Pending;
    }

    if (this.isRejected) {
      return FilterStatus.Rejected;
    }

    if (this.isAccepted) {
      return FilterStatus.Approved;
    }

    if (this.isRevoked) {
      return FilterStatus.Revoked;
    }

    if (!this.isRevoked) {
      return FilterStatus.NotRevoked;
    }

    if (this.isRevokedOffChain && !this.isRevokedOnChain) {
      return FilterStatus.RevokedOffChainOnly;
    }
    if (this.isExpired) {
      return FilterStatus.Expired;
    }
  }
}
