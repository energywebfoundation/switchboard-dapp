import { Component, Inject, OnInit } from '@angular/core';
import { StakeState } from '../../../state/stake/stake.reducer';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../../state/stake/stake.actions';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { interval } from 'rxjs';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {
  currentSec = 0;
  progressbarValue;
  countFinished = false;

  constructor(private store: Store<StakeState>, @Inject(MAT_DIALOG_DATA) public data: { time: number }) {
  }

  ngOnInit() {
    this.runProgressBar();
  }

  runProgressBar() {
    if (this?.data?.time) {
      this.startTimer(this.data.time);
    } else {
      this.countFinished = true;
    }
  }

  startTimer(seconds: number) {
    const timer$ = interval(1000);

    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = sec * 100 / seconds;
      this.currentSec = sec;

      if (this.currentSec === seconds) {
        this.countFinished = true;
        sub.unsubscribe();
      }
    });
  }

  withdraw() {
    this.store.dispatch(StakeActions.withdrawReward());
  }

}
