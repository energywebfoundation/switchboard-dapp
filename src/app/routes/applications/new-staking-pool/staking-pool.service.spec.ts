import { TestBed } from '@angular/core/testing';

import { StakingPoolService } from './staking-pool.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { finalize } from 'rxjs/operators';
import { DomainsFacadeService } from '../../../shared/services/domains-facade/domains-facade.service';

describe('StakingPoolService', () => {
  let service: StakingPoolService;
  const domainsFacadeSpy = jasmine.createSpyObj(DomainsFacadeService, ['getENSTypesByOwner']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: DomainsFacadeService, useValue: domainsFacadeSpy},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
      ]
    });
    service = TestBed.inject(StakingPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('should check if loader is shown for getting list', (done) => {
    domainsFacadeSpy.getENSTypesByOwner.and.returnValue(Promise.resolve([]));
    service.getListOfOrganizationRoles('org').pipe(
      finalize(() => expect(loadingServiceSpy.hide).toHaveBeenCalled())
    ).subscribe(() => {
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      done();
    });

  });

  it('should catch error when getting list', (done) => {
    domainsFacadeSpy.getENSTypesByOwner.and.returnValue(Promise.reject());

    service.getListOfOrganizationRoles('org').subscribe(() => {
    }, () => {
      expect(toastrSpy.error).toHaveBeenCalled();
      done();
    });
  });

});
