import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { utils } from 'ethers';
import { ENSNamespaceTypes } from 'iam-client-lib';


export interface IStakingPool {
  org: string;
  minStakingPeriod: number | utils.BigNumber;
  patronRewardPortion: number;
  principal: utils.BigNumber;
  patronRoles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StakingPoolService {

  constructor(private iamService: IamService,
              private sbToastr: SwitchboardToastrService,
              private loadingService: LoadingService) {
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
