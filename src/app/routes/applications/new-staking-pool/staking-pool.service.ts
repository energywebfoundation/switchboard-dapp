import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { utils } from 'ethers';
import { MatDialog } from '@angular/material/dialog';

const {parseEther} = utils;

@Injectable({
  providedIn: 'root'
})
export class StakingPoolService {

  constructor(private iamService: IamService,
              private sbToastr: SwitchboardToastrService,
              private loadingService: LoadingService,
              private dialog: MatDialog) {
  }

  createStakingPool(org: string, revenue: number, period: number) {
    this.loadingService.show();
    from(
      this.iamService.iam.launchStakingPool({
        org,
        patronRewardPortion: revenue,
        minStakingPeriod: period,
        patronRoles: [`patron.roles.${org}`],
        principal: parseEther('100')
      })
    )
      .pipe(
        catchError(err => {
          console.error(err);
          this.sbToastr.error('Error occurs while creating staking pool');
          return err;
        }),
        finalize(() => this.loadingService.hide())
      ).subscribe(() => {
        this.sbToastr.success('You successfully created a staking pool');
        this.dialog.closeAll();
    });
  }
}
