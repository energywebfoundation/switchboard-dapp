import { TestBed } from '@angular/core/testing';

import { OrganizationService } from './organization.service';
import { IamService } from '../../../shared/services/iam.service';
import { StakingPoolServiceFacade } from '../../../shared/services/staking/staking-pool-service-facade';
import { of } from 'rxjs';
import { iamServiceSpy } from '@tests';

describe('OrganizationService', () => {
  let service: OrganizationService;
  const stakingServiceSpy = jasmine.createSpyObj('StakingPoolServiceFacade', ['allServices']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationService,
        {provide: IamService, useValue: iamServiceSpy},
        {provide: StakingPoolServiceFacade, useValue: stakingServiceSpy}
      ]
    });
    service = TestBed.inject(OrganizationService);
    iamServiceSpy.wrapWithLoadingService.and.callFake((source) => source);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrganizationList', () => {
    it('should check if organization is also a provider', ((done) => {
      const org = {namespace: 'test'};
      iamServiceSpy.isOwner.and.returnValue(of(true));
      iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));
      stakingServiceSpy.allServices.and.returnValue(of([{org: 'test'}]));

      service.getOrganizationList().subscribe((orgs) => {
        expect(orgs.length).toEqual(1);
        expect(orgs[0].isProvider).toBeTruthy();
        expect(orgs[0].isOwnedByCurrentUser).toBeTruthy();
        done();
      });
    }));

    it('should check if sub organization is not a provider', ((done) => {
      const org = {namespace: 'test'};
      iamServiceSpy.isOwner.and.returnValue(of(true));
      iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));
      stakingServiceSpy.allServices.and.returnValue(of([{org: 'test.test'}]));

      service.getOrganizationList().subscribe((orgs) => {
        expect(orgs.length).toEqual(1);
        expect(orgs[0].isProvider).toBeFalsy();

        done();
      });
    }));

    it('should check if organization do not belongs to current user', ((done) => {
      const org = {namespace: 'test'};
      iamServiceSpy.isOwner.and.returnValue(of(false));
      iamServiceSpy.getOrganizationsByOwner.and.returnValue(of([org]));
      stakingServiceSpy.allServices.and.returnValue(of([{org: 'test'}]));

      service.getOrganizationList().subscribe((orgs) => {
        expect(orgs[0].isOwnedByCurrentUser).toBeFalsy();

        done();
      });
    }));
  });

  describe('getHistory', () => {
    it('should get history and check if suborgs belongs to current user', (done) => {
      iamServiceSpy.getOrgHistory.and.returnValue(of({namespace: 'test', subOrgs: [{isOwnedByCurrentUser: true}]}));
      iamServiceSpy.isOwner.and.returnValue(of(true));

      service.getHistory('').subscribe((org) => {
        expect(org.subOrgs[0].isOwnedByCurrentUser).toBeTruthy();
        done();
      });
    });

    it('should get history and check if suborgs do not belongs to current user', (done) => {
      iamServiceSpy.getOrgHistory.and.returnValue(of({namespace: 'test', subOrgs: [{isOwnedByCurrentUser: true}]}));
      iamServiceSpy.isOwner.and.returnValue(of(false));

      service.getHistory('').subscribe((org) => {
        expect(org.subOrgs[0].isOwnedByCurrentUser).toBeFalsy();
        done();
      });
    });
  });

});
