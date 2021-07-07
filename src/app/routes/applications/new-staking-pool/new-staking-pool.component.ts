import { Component, Inject, OnInit } from '@angular/core';
import { StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent implements OnInit {

  constructor(private stakingPoolService: StakingPoolService,
              @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
