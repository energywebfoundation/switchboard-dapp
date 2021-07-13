import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StakeSuccessComponent } from '../stake-success/stake-success.component';
import { WithdrawComponent } from '../withdraw/withdraw.component';
import { ClaimRewardComponent } from '../claim-reward/claim-reward.component';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent implements OnInit {
  inputFocused: boolean;
  tokenAmount: number = 200;
  stakeAmount = new FormControl();
  earnedReward = 0;
  compound = new FormControl(false);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.inputFocused = false;
    this.stakeAmount.setValue('');
  }

  calcStakeAmount(percent: number) {
    this.stakeAmount.setValue(Math.floor(this.tokenAmount * percent / 100));
  }

  stake() {
    this.dialog.open(StakeSuccessComponent, {
      width: '400px',
      maxWidth: '100%',
      disableClose: true
    });
  }

  withdraw() {
    this.dialog.open(WithdrawComponent, {
      width: '400px',
      maxWidth: '100%',
      disableClose: true
    });
  }

  claimReward() {
    this.dialog.open(ClaimRewardComponent, {
      width: '400px',
      maxWidth: '100%',
      disableClose: true
    });
  }

}
