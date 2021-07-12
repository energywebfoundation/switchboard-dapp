import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.scss']
})
export class StakeComponent implements OnInit {
  inputFocused: boolean;
  tokenAmount: number = 200;
  stakeAmount = new FormControl();
  compound = new FormControl(false);

  constructor() { }

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

}
