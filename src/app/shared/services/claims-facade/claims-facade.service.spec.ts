import { TestBed } from '@angular/core/testing';

import { ClaimsFacadeService } from './claims-facade.service';
import { IamService } from '../iam.service';
import { loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';
import { Claim, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

describe('ClaimsFacadeService', () => {
  let service: ClaimsFacadeService;
  const claimsServiceSpy = jasmine.createSpyObj('IamService', [
    'createSelfSignedClaim',
    'hasOnChainRole',
    'getUserClaims',
    'getClaimsByIssuer',
    'getClaimsByRequester',
    'publishPublicClaim',
    'registerOnchain',
    'isClaimRevoked',
  ]);

  const signerServiceSpy = jasmine.createSpyObj('IamService', ['did']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: IamService,
          useValue: {
            claimsService: claimsServiceSpy,
            signerService: signerServiceSpy,
          },
        },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(ClaimsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addStatusIfIsSyncedOffChain', () => {
    const createClaim = (claimType: string) => {
      return new EnrolmentClaim({
        isAccepted: true,
        registrationTypes: [RegistrationTypes.OffChain],
        claimType: createClaimType(claimType),
      } as Claim);
    };

    it('should return empty list when getting empty list', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(await service.addStatusIfIsSyncedOffChain([])).toEqual([]);
    });

    it('should return not changed list when UserClaims is empty', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(
        await service.addStatusIfIsSyncedOffChain([createClaim('123')])
      ).toEqual([
        jasmine.objectContaining({
          claimType: createClaimType('123'),
          isSyncedOffChain: false,
        }),
      ]);
    });

    it('should return list with object containing isSynced property', async () => {
      const claimType = createClaimType('123');
      claimsServiceSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType }])
      );
      expect(
        await service.addStatusIfIsSyncedOffChain([
          createClaim('123'),
          createClaim('111'),
        ])
      ).toEqual([
        jasmine.objectContaining({ claimType, isSyncedOffChain: true }),
        jasmine.objectContaining({
          claimType: createClaimType('111'),
          isSyncedOffChain: false,
        }),
      ]);
    });

    it('should not change list when claimType do not match', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType: createClaimType('12') }])
      );

      expect(
        await service.addStatusIfIsSyncedOffChain([createClaim('123')])
      ).toEqual([
        jasmine.objectContaining({
          claimType: createClaimType('123'),
          isSyncedOffChain: false,
        }),
      ]);
    });
  });

  describe('setIsRevokedStatus', () => {
    it('should set isRevoked property to the claims', (done) => {
      claimsServiceSpy.isClaimRevoked.and.returnValues(
        Promise.resolve(true),
        Promise.resolve(false)
      );

      service
        .setIsRevokedOnChainStatus([
          new EnrolmentClaim({
            subject:
              'did:ethr:volta:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
          } as Claim),
          new EnrolmentClaim({
            subject:
              'did:ethr:volta:0xA028720Bc0cc22d296DCD3a26E7E8AAe73c9B6F3',
          } as Claim),
        ])
        .subscribe((list) => {
          expect(list).toEqual([
            jasmine.objectContaining({ isRevokedOnChain: true }),
            jasmine.objectContaining({ isRevokedOnChain: false }),
          ]);
          done();
        });
    });
  });

  describe('addStatusIfIsSyncedOnChain', () => {
    it('should set status to true', async () => {
      claimsServiceSpy.hasOnChainRole.and.returnValue(Promise.resolve(true));
      expect(
        await service.addStatusIfIsSyncedOnChain(
          new EnrolmentClaim({
            isAccepted: true,
            registrationTypes: [RegistrationTypes.OnChain],
          } as Claim)
        )
      ).toEqual(jasmine.objectContaining({ isSyncedOnChain: true }));
    });

    it('should set status to false when enrolment is not approved', async () => {
      expect(
        await service.addStatusIfIsSyncedOnChain(
          new EnrolmentClaim({
            isAccepted: false,
            registrationTypes: [RegistrationTypes.OnChain],
          } as Claim)
        )
      ).toEqual(jasmine.objectContaining({ isSyncedOnChain: false }));
    });

    it('should set status to false when enrolment is not registered on chain', async () => {
      expect(
        await service.addStatusIfIsSyncedOnChain(
          new EnrolmentClaim({
            isAccepted: true,
            registrationTypes: [],
          } as Claim)
        )
      ).toEqual(jasmine.objectContaining({ isSyncedOnChain: false }));
    });
  });
});

const createClaimType = (value: string) => {
  return `${value}.${NamespaceType.Role}`;
};
