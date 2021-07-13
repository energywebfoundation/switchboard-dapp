import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StakeSuccessComponent } from '../stake-success/stake-success.component';
import { WithdrawComponent } from '../withdraw/withdraw.component';
import { ClaimRewardComponent } from '../claim-reward/claim-reward.component';

import { PatronService } from '../patron.service';
import { tap } from 'rxjs/operators';
import { PercentButtonsComponent } from '../percent-buttons/percent-buttons.component';


@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent implements OnInit {
  inputFocused: boolean;
  tokenAmount: number = 200;
  tokenAmount$ = this.patronService.balance$.pipe(tap(balance => this.tokenAmount = balance));
  stakeAmount = new FormControl();
  earnedReward = 0;
  compound = new FormControl(false);
  @ViewChild('percentButtons') percentButtons: PercentButtonsComponent;

  constructor(private dialog: MatDialog, private patronService: PatronService) {
  }

  clear(e) {
    e.preventDefault();
    e.stopPropagation();
    this.inputFocused = false;
    this.percentButtons.selectedPercentButton = null;
    this.stakeAmount.setValue('');
  }

  inputChangeHandler() {
    this.percentButtons.selectedPercentButton = null;
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
