import { TestBed } from '@angular/core/testing';

import { EnrolmentListService } from './enrolment-list.service';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';
import { NamespaceType, RegistrationTypes } from 'iam-client-lib';

describe('EnrolmentListService', () => {
  let service: EnrolmentListService;
  let claimsFacadeSpy;
  beforeEach(() => {
    claimsFacadeSpy = jasmine.createSpyObj('ClaimsFacadeService', [
      'getUserClaims',
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: ClaimsFacadeService, useValue: claimsFacadeSpy }],
    });
    service = TestBed.inject(EnrolmentListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('appendDidDocSyncStatus', () => {
    it('should return empty list when getting empty list', async () => {
      claimsFacadeSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(await service.appendDidDocSyncStatus([])).toEqual([]);
    });

    it('should return not changed list when UserClaims is empty', async () => {
      claimsFacadeSpy.getUserClaims.and.returnValue(Promise.resolve([]));
      expect(
        await service.appendDidDocSyncStatus([{ claimType: '123' }] as any[])
      ).toEqual([{ claimType: '123', isSynced: false }] as any[]);
    });

    it('should return list with object containing isSynced property', async () => {
      const claimType = createClaimType('123');
      claimsFacadeSpy.getUserClaims.and.returnValue(
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
      claimsFacadeSpy.getUserClaims.and.returnValue(
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

  describe('isPendingSync', () => {
    it('should return false when is synced', () => {
      expect(
        service.isPendingSync({ isSynced: true, registrationTypes: [] })
      ).toBeFalse();
    });

    it('should return false when is only OnChain', () => {
      expect(
        service.isPendingSync({
          isSynced: true,
          registrationTypes: [RegistrationTypes.OnChain],
        })
      ).toBeFalse();
    });

    it('should return true when is only OffChain', () => {
      expect(
        service.isPendingSync({
          isSynced: false,
          registrationTypes: [RegistrationTypes.OffChain],
        })
      ).toBeTrue();
    });

    it('should return true when it is OnChain and OffChain', () => {
      expect(
        service.isPendingSync({
          isSynced: false,
          registrationTypes: [
            RegistrationTypes.OffChain,
            RegistrationTypes.OnChain,
          ],
        })
      ).toBeTrue();
    });
  });
});

const createClaimType = (value: string) => {
  return `${value}.${NamespaceType.Role}`;
};
