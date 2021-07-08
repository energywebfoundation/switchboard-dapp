import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { StakingPoolService } from './staking-pool.service';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { MatDialog } from '@angular/material/dialog';

describe('StakingPoolService', () => {
  let service: StakingPoolService;
  const iamSpy = jasmine.createSpyObj('iam', ['launchStakingPool']);
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

  it('should check if will show and hide loader', fakeAsync(() => {
    iamSpy.launchStakingPool.and.returnValue(Promise.resolve());
    service.createStakingPool('', 0, 0);
    tick(1);
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  }));

  it('should close dialog and display message when launchStakingPool do not return an error', fakeAsync(() => {
    iamSpy.launchStakingPool.and.returnValue(Promise.resolve());
    service.createStakingPool('', 0, 0);
    tick(1);
    expect(matDialogSpy.closeAll).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalled();
  }));

});
