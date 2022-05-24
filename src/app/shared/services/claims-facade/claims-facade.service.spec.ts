import { TestBed } from '@angular/core/testing';

import { ClaimsFacadeService } from './claims-facade.service';
import { IamService } from '../iam.service';
import { loadingServiceSpy } from '@tests';
import { LoadingService } from '../loading.service';
import { NamespaceType } from 'iam-client-lib';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: { claimsService: claimsServiceSpy } },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    service = TestBed.inject(ClaimsFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('appendDidDocSyncStatus', () => {
    it('should return empty list when getting empty list', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(await service.appendDidDocSyncStatus([])).toEqual([]);
    });

    it('should return not changed list when UserClaims is empty', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(
        await service.appendDidDocSyncStatus([{ claimType: '123' }] as any[])
      ).toEqual([{ claimType: '123', isSynced: false }] as any[]);
    });

    it('should return list with object containing isSynced property', async () => {
      const claimType = createClaimType('123');
      claimsServiceSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType }])
      );
      expect(
        await service.appendDidDocSyncStatus([
          { claimType },
          { claimType: createClaimType('111') },
        ] as any[])
      ).toEqual([
        { claimType, isSynced: true },
        { claimType: createClaimType('111'), isSynced: false },
      ] as any[]);
    });

    it('should not change list when claimType do not match', async () => {
      claimsServiceSpy.getUserClaims.and.returnValue(
        Promise.resolve([{ claimType: createClaimType('12') }])
      );

      expect(
        await service.appendDidDocSyncStatus([
          { claimType: createClaimType('123') },
        ] as any[])
      ).toEqual([
        { claimType: createClaimType('123'), isSynced: false },
      ] as any[]);
    });
  });

  describe('setIsRevokedStatus', () => {
    it('should set isRevoked property to the claims', (done) => {
      claimsServiceSpy.isClaimRevoked.and.returnValues(
        Promise.resolve(true),
        Promise.resolve(false),
      );

      service
        .setIsRevokedStatus([{ id: 1 }, { id: 2 }] as any)
        .subscribe((list) => {
          expect(list).toEqual([
            { id: 1, isRevoked: true },
            { id: 2, isRevoked: false },
          ] as any);
          done();
        });
    });
  });
});

const createClaimType = (value: string) => {
  return `${value}.${NamespaceType.Role}`;
};
