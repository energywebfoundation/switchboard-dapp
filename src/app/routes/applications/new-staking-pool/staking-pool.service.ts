import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { utils } from 'ethers';
import { MatDialog } from '@angular/material/dialog';
import { ENSNamespaceTypes } from 'iam-client-lib';

const {parseEther} = utils;

export interface StakingPool {
  org: string;
  minStakingPeriod: number | utils.BigNumber;
  patronRewardPortion: number;
  principal: utils.BigNumber;
  patronRoles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StakingPoolService {

  constructor(private iamService: IamService,
              private sbToastr: SwitchboardToastrService,
              private loadingService: LoadingService,
              private dialog: MatDialog) {
  }

  createStakingPool(stakingPool: StakingPool) {
    this.loadingService.show();
    from(
      // TODO: remove 'any' type when new version of IAM will be deployed.
      this.iamService.iam.launchStakingPool(stakingPool as any)
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

  getListOfOrganizationRoles(org: string) {
    this.loadingService.show();
    return from(
      this.iamService.iam.getENSTypesByOwner({
        type: ENSNamespaceTypes.Roles,
        owner: org
      })
    ).pipe(
      catchError(err => {
        console.error(err);
        this.sbToastr.error('Error occurs while getting list of possible roles');
        return err;
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
