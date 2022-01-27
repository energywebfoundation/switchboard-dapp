import { TestBed } from '@angular/core/testing';

import { IssuanceVcService } from './issuance-vc.service';
import { IamService } from '../../../shared/services/iam.service';
import { iamServiceSpy, loadingServiceSpy } from '@tests';
import { LoadingService } from '../../../shared/services/loading.service';
import { of } from 'rxjs';

describe('IssuanceVcService', () => {
  let service: IssuanceVcService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: IamService, useValue: iamServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
      ],
    });
    iamServiceSpy.getAllowedRolesByIssuer.and.returnValue(
      of([
        {
          namespace: 'role.roles.test.iam.ewc',
          definition: {
            version: 2,
          },
        },
        {
          namespace: 'test.roles.test.iam.ewc',
          definition: {
            version: 1,
          },
        },
        {
          namespace: 'example.roles.test.iam.ewc',
          definition: {
            version: 1,
          },
        },
      ])
    );
    service = TestBed.inject(IssuanceVcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all roles when assets claims is empty', () => {
    iamServiceSpy.getClaimsBySubject.and.returnValue(of([]));
    service.getNotEnrolledRoles('').subscribe((list) => {
      expect(list.length).toEqual(3);
    });
  });

  it('should get 2 roles when asset claims contains test role', () => {
    iamServiceSpy.getClaimsBySubject.and.returnValue(
      of([
        {
          claimType: 'role.roles.test.iam.ewc',
          claimTypeVersion: 2,
        },
      ])
    );
    service.getNotEnrolledRoles('').subscribe((list) => {
      expect(list.length).toEqual(2);
    });
  });

  it('should get all roles when asset claim contain test role but with different version', () => {
    iamServiceSpy.getClaimsBySubject.and.returnValue(
      of([
        {
          claimType: 'role.roles.test.iam.ewc',
          claimTypeVersion: 1,
        },
      ])
    );
    service.getNotEnrolledRoles('').subscribe((list) => {
      expect(list.length).toEqual(3);
    });
  });

  it('should return 0 roles when asset claim contains all roles', () => {
    iamServiceSpy.getClaimsBySubject.and.returnValue(
      of([
        {
          claimType: 'role.roles.test.iam.ewc',
          claimTypeVersion: 2,
        },
        {
          claimType: 'test.roles.test.iam.ewc',
          claimTypeVersion: 1,
        },
        {
          claimType: 'example.roles.test.iam.ewc',
          claimTypeVersion: 1,
        },
      ])
    );
    service.getNotEnrolledRoles('').subscribe((list) => {
      expect(list.length).toEqual(0);
    });
  });
});
