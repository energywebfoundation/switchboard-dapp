import { TestBed } from '@angular/core/testing';

import { StakingPoolService } from './staking-pool.service';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';

describe('StakingPoolService', () => {
  let service: StakingPoolService;
  const iamSpy = jasmine.createSpyObj('iam', ['launchStakingPool', 'getENSTypesByOwner']);
  const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
  const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['closeAll']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: IamService, useValue: {iam: iamSpy}},
        {provide: LoadingService, useValue: loadingServiceSpy},
        {provide: SwitchboardToastrService, useValue: toastrSpy},
        {
          provide: MatDialog, useValue: matDialogSpy
        },
      ]
    });
    service = TestBed.inject(StakingPoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if loader is shown for getting list', (done) => {
    iamSpy.getENSTypesByOwner.and.returnValue(Promise.resolve([]));
    service.getListOfOrganizationRoles('org').subscribe(() => {
      expect(loadingServiceSpy.show).toHaveBeenCalled();
      expect(loadingServiceSpy.hide).toHaveBeenCalled();
      done();
    });

  });

  it('should catch error when getting list', (done) => {
    iamSpy.getENSTypesByOwner.and.returnValue(Promise.reject());

    service.getListOfOrganizationRoles('org').subscribe(() => {
    }, () => {
      expect(toastrSpy.error).toHaveBeenCalled();
      done();
    });
  })

});
