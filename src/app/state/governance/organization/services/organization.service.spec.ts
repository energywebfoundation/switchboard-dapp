import { TestBed } from '@angular/core/testing';

import { OrganizationService } from './organization.service';
import { IamService } from '../../../../shared/services/iam.service';
import { of } from 'rxjs';
import { iamServiceSpy } from '@tests';

describe('OrganizationService', () => {
  let service: OrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationService,
        { provide: IamService, useValue: iamServiceSpy },
      ],
    });
    service = TestBed.inject(OrganizationService);
    iamServiceSpy.wrapWithLoadingService.and.callFake((source) => source);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrganizationList', () => {
    it('should check if organization belongs to the current user', (done) => {
      const org = { namespace: 'test' };
      iamServiceSpy.isOwner.and.returnValue(of(true));
      iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));

      service.getOrganizationList().subscribe((orgs) => {
        expect(orgs.length).toEqual(1);
        expect(orgs[0].isOwnedByCurrentUser).toBeTruthy();
        done();
      });
    });

    it('should check if organization do not belongs to current user', (done) => {
      const org = { namespace: 'test' };
      iamServiceSpy.isOwner.and.returnValue(of(false));
      iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));

      service.getOrganizationList().subscribe((orgs) => {
        expect(orgs[0].isOwnedByCurrentUser).toBeFalsy();

        done();
      });
    });
  });

  it('should check if containsApp and containsRoles are set', (done) => {
    const org = { namespace: 'test', apps: [{}], roles: [{}] };
    iamServiceSpy.isOwner.and.returnValue(of(true));
    iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));

    service.getOrganizationList().subscribe((orgs) => {
      expect(orgs.length).toEqual(1);
      expect(orgs[0].containsRoles).toBeTruthy();
      expect(orgs[0].containsApps).toBeTruthy();
      done();
    });
  });

  it('should check if containsApp and containsRoles are false when org do not have apps and roles', (done) => {
    const org = { namespace: 'test' };
    iamServiceSpy.isOwner.and.returnValue(of(true));
    iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));

    service.getOrganizationList().subscribe((orgs) => {
      expect(orgs.length).toEqual(1);
      expect(orgs[0].containsRoles).toBeFalse();
      expect(orgs[0].containsApps).toBeFalse();
      done();
    });
  });

  describe('getHistory', () => {
    it('should get history and check if suborgs belongs to current user', (done) => {
      iamServiceSpy.getOrgHistory.and.returnValue(
        of({ namespace: 'test', subOrgs: [{ isOwnedByCurrentUser: true }] })
      );
      iamServiceSpy.isOwner.and.returnValue(of(true));

      service.getHistory('').subscribe((org) => {
        expect(org.subOrgs[0].isOwnedByCurrentUser).toBeTruthy();
        done();
      });
    });

    it('should get history and check if suborgs do not belongs to current user', (done) => {
      iamServiceSpy.getOrgHistory.and.returnValue(
        of({ namespace: 'test', subOrgs: [{ isOwnedByCurrentUser: true }] })
      );
      iamServiceSpy.isOwner.and.returnValue(of(false));

      service.getHistory('').subscribe((org) => {
        expect(org.subOrgs[0].isOwnedByCurrentUser).toBeFalsy();
        done();
      });
    });
  });
});
