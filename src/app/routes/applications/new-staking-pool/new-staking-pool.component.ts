import { Component, Inject } from '@angular/core';
import { StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent {

  form = new FormGroup({
    patrons: new FormControl(''),
    revenue: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000)]),
    range: new FormGroup({
      start: new FormControl('', [Validators.required]),
      end: new FormControl('', [Validators.required])
    })
  });

  constructor(private stakingPoolService: StakingPoolService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  getRangeControlError(control: string, error: string) {
    return this.form.get('range').get(control).hasError(error);
  }

  isFormInvalid() {
    return this.form.invalid;
  }

  getTimeInSeconds(): number {
    const {start, end}: { start: Date, end: Date } = this.form.get('range').value;
    return (end.getTime() - start.getTime()) / 1000;
  }

  submit() {
    if (this.isFormInvalid()) {
      return;
    }
    this.stakingPoolService.createStakingPool(this.data.namespace, this.form.get('revenue').value, this.getTimeInSeconds());
  }

}
