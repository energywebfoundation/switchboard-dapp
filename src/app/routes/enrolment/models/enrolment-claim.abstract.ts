import { Claim, RegistrationTypes } from 'iam-client-lib';

export abstract class EnrolmentClaimAbstract {
  protected constructor(protected iclClaim: Claim) {}

  get issuedToken(): string {
    return this.iclClaim.issuedToken;
  }

  get registrationTypes(): RegistrationTypes[] {
    return this.iclClaim.registrationTypes;
  }

  get claimType(): string {
    return this.iclClaim.claimType;
  }

  get claimTypeVersion(): string {
    return this.iclClaim.claimTypeVersion;
  }

  get id(): string {
    return this.iclClaim.id;
  }

  get namespace(): string {
    return this.iclClaim.namespace;
  }

  get subject(): string {
    return this.iclClaim.subject;
  }

  get requester(): string {
    return this.iclClaim.requester;
  }

  get token(): string {
    return this.iclClaim.token;
  }

  get subjectAgreement(): string {
    return this.iclClaim.subjectAgreement;
  }

  get acceptedBy(): string {
    return this.iclClaim.acceptedBy;
  }
}
