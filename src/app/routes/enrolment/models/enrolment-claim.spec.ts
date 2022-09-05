import { EnrolmentClaim } from './enrolment-claim';
import { Claim, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { ExpirationStatus } from './expiration-statys.enum';

describe('EnrolmentClaim tests', () => {
  describe('isAccepted', () => {
    it('should return true when is accepted', () => {
      expect(
        new EnrolmentClaim({ isAccepted: true } as Claim).setIsRevokedOnChain(
          false
        ).isAccepted
      ).toBeTrue();
    });

    it('should return false when is not accepted', () => {
      expect(
        new EnrolmentClaim({ isAccepted: false } as Claim).setIsRevokedOnChain(
          false
        ).isAccepted
      ).toBeFalse();
    });

    it('should return false when isAccepted but revoked', () => {
      expect(
        new EnrolmentClaim({ isAccepted: true } as Claim).setIsRevokedOnChain(
          true
        ).isAccepted
      ).toBeFalse();
    });
  });

  describe('isRejected', () => {
    it('should return true when claim is rejected', () => {
      expect(
        new EnrolmentClaim({ isRejected: true } as Claim).isRejected
      ).toBeTrue();
    });
  });

  describe('isPending', () => {
    it('should return true when is not accepted nor rejected', () => {
      expect(
        new EnrolmentClaim({
          isRejected: false,
          isAccepted: false,
        } as Claim).isPending
      ).toBeTrue();
    });

    it('should return false when is accepted', () => {
      expect(
        new EnrolmentClaim({
          isRejected: false,
          isAccepted: true,
        } as Claim).isPending
      ).toBeFalse();
    });

    it('should return false when is rejected', () => {
      expect(
        new EnrolmentClaim({
          isRejected: true,
          isAccepted: false,
        } as Claim).isPending
      ).toBeFalse();
    });
  });

  describe('isPendingSync', () => {
    it('should return true when is accepted and not published onChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
        } as Claim).isPendingSync
      ).toBeTrue();
    });

    it('should return true when is accepted and not published offChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim).setIsSyncedOffChain(false).isPendingSync
      ).toBeTrue();
    });

    it('should return false when is accepted and published offChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim).setIsSyncedOffChain(true).isPendingSync
      ).toBeFalse();
    });

    it('should return false when is accepted and published onChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim).setIsSyncedOnChain(true).isPendingSync
      ).toBeFalse();
    });

    it('should return true when is published onChain but not offChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [
            RegistrationTypes.OnChain,
            RegistrationTypes.OffChain,
          ],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim).setIsSyncedOffChain(false).isPendingSync
      ).toBeTrue();
    });

    it('should return true when is published offChain but not onChain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [
            RegistrationTypes.OnChain,
            RegistrationTypes.OffChain,
          ],
        } as Claim).setIsSyncedOffChain(true).isPendingSync
      ).toBeTrue();
    });
  });

  describe('isSynced', () => {
    it('should return false when offChain is not synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim).setIsSyncedOffChain(false).isSynced
      ).toBeFalse();
    });

    it('should return false when onChain is not synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
        } as Claim).isSynced
      ).toBeFalse();
    });

    it('should return true when onChain and offChain are synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [
            RegistrationTypes.OnChain,
            RegistrationTypes.OffChain,
          ],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim)
          .setIsSyncedOffChain(true)
          .setIsSyncedOnChain(true).isSynced
      ).toBeTrue();
    });
  });
  describe('isSyncedOnChain', () => {
    it('should return false when OnChain is not registered', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [],
        } as Claim).isSyncedOnChain
      ).toBeFalse();
    });

    it('should return false when onChain is not synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
        } as Claim).isSyncedOnChain
      ).toBeFalse();
    });

    it('should return true when onChain is synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim).setIsSyncedOnChain(true).isSyncedOnChain
      ).toBeTrue();
    });
  });
  describe('isSyncedOffChain', () => {
    it('should return false when offChain is not registered', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
        } as Claim).isSyncedOffChain
      ).toBeFalse();
    });

    it('should return false when offChain is not synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim).setIsSyncedOffChain(false).isSyncedOffChain
      ).toBeFalse();
    });

    it('should return true when offChain is synced', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim).setIsSyncedOffChain(true).isSyncedOffChain
      ).toBeTrue();
    });
  });
  describe('canCancelClaimRequest', () => {
    it('should return true when the claim is accepted, not rejected and not revoked on-chain and not-revoked off-chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: false,
          isRejected: false,
        } as Claim)
          .setIsRevokedOffChain(false)
          .setIsRevokedOnChain(false).canCancelClaimRequest
      ).toBeTrue();
    });
    it('should return false when the claim is accepted', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim)
          .setIsRevokedOffChain(false)
          .setIsRevokedOnChain(false).canCancelClaimRequest
      ).toBeFalse();
    });
    it('should return false when the claim is rejected', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: false,
          isRejected: true,
        } as Claim)
          .setIsRevokedOffChain(false)
          .setIsRevokedOnChain(false).canCancelClaimRequest
      ).toBeFalse();
    });

    it('should return false when the claim is revoked off-chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim)
          .setIsRevokedOffChain(true)
          .setIsRevokedOnChain(false).canCancelClaimRequest
      ).toBeFalse();
    });

    it('should return false when the claim is revoked off-chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim)
          .setIsRevokedOffChain(false)
          .setIsRevokedOnChain(true).canCancelClaimRequest
      ).toBeFalse();
    });
  });
  describe('canPublishClaim', () => {
    it('should return true if claim is not synced and claim is not expired', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          expirationTimestamp: (Date.now() + 500000).toString(),
        } as Claim).canPublishClaim
      ).toBeTrue();
    });
    it('should return false if claim is not synced and claim IS expired', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          expirationTimestamp: (Date.now() - 500).toString(),
        } as Claim).canPublishClaim
      ).toBeFalse();
    });
    it('should return false if claim IS synced and claim is not expired', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
          expirationTimestamp: (Date.now() + 5000).toString(),
        } as Claim).setIsSyncedOffChain(true).canPublishClaim
      ).toBeFalse();
    });
    it('should return false if claim IS synced and claim IS expired', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
          expirationTimestamp: (Date.now() - 50).toString(),
        } as Claim).setIsSyncedOffChain(true).canPublishClaim
      ).toBeFalse();
    });
  });

  describe('isExpired', () => {
    it('should return true if claim expiration timestamp is in the past', () => {
      expect(
        new EnrolmentClaim({
          expirationTimestamp: (Date.now() - 500).toString(),
        } as Claim).isExpired
      ).toBeTrue();
    });
    it('should return false if claim expiration timestamp is in the future', () => {
      expect(
        new EnrolmentClaim({
          expirationTimestamp: (Date.now() + 5000).toString(),
        } as Claim).isExpired
      ).toBeFalse();
    });
    it('should return false if there is no timestamp', () => {
      expect(
        new EnrolmentClaim({
          expirationTimestamp: null,
        } as Claim).isExpired
      ).toBeFalse();
    });
  });

  describe('isRevoked', () => {
    it('should return true if is revoked only off chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [
            RegistrationTypes.OffChain,
            RegistrationTypes.OnChain,
          ],
        } as Claim).setIsRevokedOffChain(true).isRevoked
      ).toBeTrue();
    });

    it('should return true if is revoked only on chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [
            RegistrationTypes.OffChain,
            RegistrationTypes.OnChain,
          ],
        } as Claim).setIsRevokedOnChain(true).isRevoked
      ).toBeTrue();
    });

    it('should return false if is not revoked on chain', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
        } as Claim).setIsRevokedOnChain(false).isRevoked
      ).toBeFalse();
    });
  });

  describe('isRevocableOnChain', () => {
    it('should return true when is synced and not revoked', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim)
          .setIsSyncedOnChain(true)
          .setIsRevokedOnChain(false).canRevokeOnChain
      ).toBeTrue();
    });

    it('should return false when is synced and revoked', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OnChain],
          issuedToken: 'test',
          vp: {},
          onChainProof: 'test',
        } as Claim)
          .setIsSyncedOnChain(true)
          .setIsRevokedOnChain(true).canRevokeOnChain
      ).toBeFalse();
    });
  });
  describe('canRevokeOffChain', () => {
    it('should return true when is synced and not revoked', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
          vp: { verifiableCredential: [{ credentialStatus: {} }] },
        } as Claim)
          .setIsSyncedOffChain(true)
          .setIsRevokedOffChain(false).canRevokeOffChain
      ).toBeTrue();
    });

    it('should return false when is synced and revoked', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          registrationTypes: [RegistrationTypes.OffChain],
        } as Claim)
          .setIsSyncedOffChain(true)
          .setIsRevokedOffChain(true).canRevokeOffChain
      ).toBeFalse();
    });
  });

  describe('organization', () => {
    it('should get organization from claimType where there is no application', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
        } as Claim).organization
      ).toEqual('test.iam.ewc');
    });

    it('should get organization from claimType where there is application', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.app.${NamespaceType.Application}.test.iam.ewc`,
        } as Claim).organization
      ).toEqual('test.iam.ewc');
    });
  });

  describe('expiration status', () => {
    it('should have an expiration status of "Not Expired" when not expired', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
          expirationTimestamp: (Date.now() + 500000).toString(),
        } as Claim).expirationStatus
      ).toEqual(ExpirationStatus.NOT_EXPIRED);
    });
    it('should have an expiration status of "Expired" when expired', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
          expirationTimestamp: (Date.now() - 1000).toString(),
        } as Claim).expirationStatus
      ).toEqual(ExpirationStatus.EXPIRED);
    });
    it('should not have an expiration status of when there is no expiration timestamp', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
          expirationTimestamp: null,
        } as Claim).expirationStatus
      ).toEqual(undefined);
    });
    it('should have an exporation date if there expiration timestamp', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
          expirationTimestamp: '193984857',
        } as Claim).expirationDate
      ).toEqual(new Date(193984857));
    });
  });

  describe('application', () => {
    it('should get empty application name from claimType', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.test.iam.ewc`,
        } as Claim).application
      ).toEqual('');
    });

    it('should get application from claimType', () => {
      expect(
        new EnrolmentClaim({
          claimType: `role.${NamespaceType.Role}.app.${NamespaceType.Application}.test.iam.ewc`,
        } as Claim).application
      ).toEqual('app');
    });
  });
  describe('canShowRawEip712', () => {
    it('should return true when the claim is issued and there is a credential', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
          vp: { verifiableCredential: [{ credentialStatus: {} }] },
        } as Claim).canShowRawEip712
      ).toBeTrue();
    });
    it('should return false when the claim is not issued', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: false,
          isRejected: false,
        } as Claim).canShowRawEip712
      ).toBeFalse();
    });
    it('should return true when the claim is issued and there is no credential', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim).canShowRawEip712
      ).toBeFalse();
    });
  });
  describe('canShowRawEip191', () => {
    it('should return true when the claim is accepted and there is a decoded token', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim).setDecodedToken({ token: 'token' }).canShowRawEip191
      ).toBeTrue();
    });
    it('should return false when the claim is not accepted and there is a decoded token', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: false,
          isRejected: false,
        } as Claim).setDecodedToken({ token: 'token' }).canShowRawEip191
      ).toBeFalse();
    });
    it('should return false when the claim does not have a decoded token', () => {
      expect(
        new EnrolmentClaim({
          isAccepted: true,
          isRejected: false,
        } as Claim).canShowRawEip191
      ).toBeFalse();
    });
  });
});
