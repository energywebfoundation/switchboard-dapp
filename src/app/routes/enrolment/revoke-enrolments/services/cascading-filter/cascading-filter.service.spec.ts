import { TestBed } from '@angular/core/testing';

import { CascadingFilterService } from './cascading-filter.service';
import { EnrolmentClaim } from '../../../models/enrolment-claim';

const CLAIMS = [
  {
    application: 'application',
    organization: 'firstorg.iam.ewc',
    roleName: 'firstrole',
  },
  { organization: 'second.iam.ewc', roleName: 'secondrole' },
  {
    organization: 'thirdorg.iam.ewc',
    roleName: 'thirdrole',
    application: 'app',
  },
] as EnrolmentClaim[];

describe('CascadingFilterService', () => {
  let service: CascadingFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CascadingFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setClaims', () => {
    it('should update filters when setting new list', (done) => {
      service.setClaims([...CLAIMS]);
      service.setClaims([]);
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(0);
        done();
      });
    });
  });

  describe('check setOrganizationFilter', () => {
    beforeEach(() => {
      service.setClaims([...CLAIMS]);
    });

    it('should display all organizations names when filters are empty', (done) => {
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        done();
      });
    });

    it('should check if roleFilter do not change organizations list', (done) => {
      service.setRoleFilter('dummy');
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        done();
      });
    });

    it('should check if application filter do not change organizations list', (done) => {
      service.setApplicationFilter('dummy');
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        done();
      });
    });

    it('should filter organization and display only third', (done) => {
      service.setOrganizationFilter('third');
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(CLAIMS[2].organization);
        done();
      });
    });

    it('should reset application and roleName filter', (done) => {
      service.setApplicationFilter('app1');
      service.setRoleFilter('role123');
      service.setOrganizationFilter('thirdorg');
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(1);
        done();
      });
    });
  });

  describe('check setApplicationFilter', () => {
    beforeEach(() => {
      service.setClaims([...CLAIMS]);
    });
    it('should display all application names', (done) => {
      service.getApplications$().subscribe((list) => {
        expect(list.length).toEqual(2);
        done();
      });
    });

    it('should filter applications and display only first', (done) => {
      service.setApplicationFilter('application');
      service.getApplications$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(CLAIMS[0].application);
        done();
      });
    });

    it('should clear roleName filter when changing application', (done) => {
      service.setRoleFilter('dummy value');
      service.setApplicationFilter('application');
      service.getApplications$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(CLAIMS[0].application);
        done();
      });
    });

    it('should check if roleName filter do not change applications list', (done) => {
      service.setRoleFilter('dummy');
      service.getApplications$().subscribe((list) => {
        expect(list.length).toEqual(2);
        done();
      });
    });
  });

  describe('check setRoleFilter', () => {
    beforeEach(() => {
      service.setClaims([...CLAIMS]);
    });

    it('should get all roleNames', (done) => {
      service.getRoleNames$().subscribe((list) => {
        console.log(list);
        expect(list.length).toEqual(CLAIMS.length);
        done();
      });
    });

    it('should display only first role', (done) => {
      service.setRoleFilter('firstrole');
      service.getRoleNames$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list[0]).toEqual(CLAIMS[0].roleName);
        done();
      });
    });
  });

  describe('check getList$', () => {
    beforeEach(() => {
      service.setClaims([...CLAIMS]);
    });

    it('should get all Claims', (done) => {
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        expect(list).toEqual(CLAIMS);
        done();
      });
    });

    it('should ');
  });
});
