import { TestBed } from '@angular/core/testing';

import { CascadingFilterService } from '@modules';
import { EnrolmentClaim } from '../../../../routes/enrolment/models/enrolment-claim';
import { FilterStatus } from '../../../../routes/enrolment/enrolment-list/models/filter-status.enum';

const CLAIMS = [
  {
    application: 'application',
    organization: 'firstorg.iam.ewc',
    roleName: 'firstrole',
    status: FilterStatus.Pending,
    subject: 'first-did',
  },
  {
    organization: 'second.iam.ewc',
    roleName: 'secondrole',
    status: FilterStatus.Rejected,
    subject: 'second-did',
  },
  {
    organization: 'thirdorg.iam.ewc',
    roleName: 'thirdrole',
    application: 'app',
    status: FilterStatus.Approved,
    subject: 'third-did',
  },
] as EnrolmentClaim[];

describe('CascadingFilterService', () => {
  let service: CascadingFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CascadingFilterService],
    });
    service = TestBed.inject(CascadingFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setClaims', () => {
    it('should update filters when setting new list', (done) => {
      service.setItems([...CLAIMS]);
      service.setItems([]);
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(0);
        done();
      });
    });
  });

  describe('check setOrganizationFilter', () => {
    beforeEach(() => {
      service.setItems([...CLAIMS]);
    });

    it('should display all organizations names when setting empty filter', (done) => {
      service.setOrganizationFilter('');
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
      service.setItems([...CLAIMS]);
    });
    it('should display all application names when setting empty filter', (done) => {
      service.setApplicationFilter('');
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
      service.setItems([...CLAIMS]);
    });

    it('should get all roleNames when setting empty filter', (done) => {
      service.setRoleFilter('');
      service.getRoleNames$().subscribe((list) => {
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
      service.setItems([...CLAIMS]);
    });

    it('should get all Claims', (done) => {
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        expect(list).toEqual(CLAIMS);
        done();
      });
    });

    it('should filter list by application name', (done) => {
      const appName = 'app';
      service.setApplicationFilter(appName);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(2);
        expect(list).toEqual(
          CLAIMS.filter((claim) => claim?.application?.includes(appName))
        );
        done();
      });
    });

    it('should filter list by organization name', (done) => {
      const orgName = 'firstorg.iam.ewc';
      service.setOrganizationFilter(orgName);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list).toEqual(
          CLAIMS.filter((claim) => claim.organization.includes(orgName))
        );
        done();
      });
    });

    it('should filter list by role name', (done) => {
      const roleName = 'firstrole';
      service.setRoleFilter(roleName);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list).toEqual(
          CLAIMS.filter((claim) => claim.roleName.includes(roleName))
        );
        done();
      });
    });

    it('should filter list by status', (done) => {
      service.setStatus(FilterStatus.Pending);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list).toEqual(
          CLAIMS.filter((claim) => claim.status === FilterStatus.Pending)
        );
        done();
      });
    });

    it('should filter list by DID', (done) => {
      const DID = 'first';
      service.setDID(DID);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(1);
        expect(list).toEqual(
          CLAIMS.filter((claim) => claim.subject.includes(DID))
        );
        done();
      });
    });
  });

  describe('check setStatus', () => {
    beforeEach(() => {
      service.setItems([...CLAIMS]);
    });

    it('should return all claims when setting default filter', (done) => {
      service.setStatus(FilterStatus.All);
      service.getList$().subscribe((list) => {
        expect(list.length).toEqual(CLAIMS.length);
        done();
      });
    });

    it('should reset organization filter', (done) => {
      service.setOrganizationFilter('123');
      service.setStatus(FilterStatus.Pending);
      service.getOrganizations$().subscribe((list) => {
        expect(list.length).toEqual(1);
        done();
      });
    });

    it('should reset application filter', (done) => {
      service.setApplicationFilter('123');
      service.setStatus(FilterStatus.Pending);
      service.getApplications$().subscribe((list) => {
        expect(list.length).toEqual(1);
        done();
      });
    });

    it('should reset application filter', (done) => {
      service.setRoleFilter('123');
      service.setStatus(FilterStatus.Pending);
      service.getRoleNames$().subscribe((list) => {
        expect(list.length).toEqual(1);
        done();
      });
    });
  });
});
