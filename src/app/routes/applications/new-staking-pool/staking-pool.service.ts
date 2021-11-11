import { Injectable } from '@angular/core';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { from } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { BigNumber } from 'ethers';
import { NamespaceType } from 'iam-client-lib';
import { DomainsFacadeService } from '../../../shared/services/domains-facade/domains-facade.service';


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

  constructor(private domainsFacade: DomainsFacadeService,
              private sbToastr: SwitchboardToastrService,
              private loadingService: LoadingService) {
  }

  getListOfOrganizationRoles(org: string) {
    this.loadingService.show();
    return from(
      this.domainsFacade.getENSTypesByOwner({
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
