import { Injectable } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BigNumber } from 'ethers';
import { NamespaceType } from 'iam-client-lib';


export interface IStakingPool {
  org: string;
  minStakingPeriod: number | BigNumber;
  patronRewardPortion: number;
  principal: BigNumber;
  patronRoles: string[];
  terms?: string[];
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
      this.iamService.domainsService.getENSTypesByOwner({
        type: NamespaceType.Role,
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
