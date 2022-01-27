/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { IamService } from '../iam.service';
import { from, of } from 'rxjs';
import { BigNumber } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class StakingPoolServiceFacade {
  constructor(private iamService: IamService) {}

  allServices() {
    return from(this.iamService.stakingService.allServices());
  }

  launchStakingPool(pool: {
    org: string;
    minStakingPeriod: number | BigNumber;
    patronRewardPortion: number;
    patronRoles: string[];
    principal: BigNumber;
  }) {
    // return from(this.stakingPoolService.launchPool(pool));
    return of();
  }
}
