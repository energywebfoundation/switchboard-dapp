import { Injectable } from '@angular/core';
import { StakingFactoryService } from 'iam-client-lib';
import { IamService } from '../iam.service';
import { StakingPoolFacade } from '../pool/staking-pool-facade';
import { from, of } from 'rxjs';
import { BigNumber } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class StakingPoolServiceFacade {
  private stakingPoolService: StakingFactoryService;

  constructor(private iamService: IamService, private stakingPoolFacade: StakingPoolFacade) {
  }

  async init() {
    this.stakingPoolService = this.iamService.stakingService;
    return Boolean(this.stakingPoolService);
  }

  async createPool(org: string) {
    const pool = await this.stakingPoolService.getPool();
    this.stakingPoolFacade.setPool(pool);
    return Boolean(pool);
  }

  allServices() {
    return from(this.stakingPoolService.allServices());
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
