import { TestBed } from '@angular/core/testing';

import { ClaimsFacadeService } from './claims-facade.service';
import { IamService } from '../iam.service';
import { loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';
import { Claim, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as userSelectors from '../../../state/user-claim/user.selectors';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { of } from 'rxjs';

describe('ClaimsFacadeService', () => {
  let service: ClaimsFacadeService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
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

  let store: MockStore;

  const signerServiceSpy = jasmine.createSpyObj('IamService', ['did']);

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
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
        { provide: EnvService, useValue: { cacheServerUrl: 'cache-server' } },
        {
          provide: HttpClient,
          useValue: httpSpy,
        },
        provideMockStore(),
      ],
    });
    service = TestBed.inject(ClaimsFacadeService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClaimsByRequesterPaginated', () => {
    it('should request claims in descending order', (done) => {
      signerServiceSpy.did = 'did:ethr:ewc:0x123';
      httpSpy.get.and.returnValue(of([]));

      service.getClaimsByRequesterPaginated(10, 5).subscribe(() => {
        expect(httpSpy.get).toHaveBeenCalledWith(
          'cache-server/claim/requester/did:ethr:ewc:0x123',
          {
            params: { skip: 10, take: 5, order: 'DESC' },
            withCredentials: true,
          }
        );
        done();
      });
    });
  });

  describe('addStatusIfIsSyncedOffChain', () => {
    const createClaim = (claimType: string) => {
      return new EnrolmentClaim({
        isAccepted: true,
        registrationTypes: [RegistrationTypes.OffChain],
        claimType: createClaimType(claimType),
      } as Claim);
    };
    it('should return true for isSyncedOffChain if the claim type matches the subject claims', async () => {
      const claimType = createClaimType('123');
      store.overrideSelector(userSelectors.claimRoleNames, [claimType]);
      expect(
        await service.addStatusIfIsSyncedOffChain(createClaim('123'))
      ).toEqual(jasmine.objectContaining({ isSyncedOffChain: true }));
    });

    it('should return false for isSyncedOffChain if the claim type does not match the subject claims', async () => {
      const claimType = createClaimType('12');
      store.overrideSelector(userSelectors.claimRoleNames, [claimType]);

      expect(
        await service.addStatusIfIsSyncedOffChain(createClaim('123'))
      ).toEqual(jasmine.objectContaining({ isSyncedOffChain: false }));
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
            registrationTypes: [RegistrationTypes.OnChain],
          } as Claim),
          new EnrolmentClaim({
            registrationTypes: [RegistrationTypes.OnChain],
          } as Claim),
        ])
        .subscribe((list) => {
          expect(list).toEqual([
            jasmine.objectContaining({ isRevokedOnChain: false }),
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

const createClaimType = (value: string): string => {
  return `${value}.${NamespaceType.Role}`;
};
