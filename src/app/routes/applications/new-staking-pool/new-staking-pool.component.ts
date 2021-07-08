import { Component, Inject } from '@angular/core';
import { StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent {

  form = this.fb.group({
    patrons: 'Yes',
    revenue: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
    range: this.fb.group({
      start: ['', [Validators.required]],
      end: ['', [Validators.required]]
    })
  });

  constructor(private stakingPoolService: StakingPoolService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { namespace }) {
  }

  getRangeControlError(control: string, error: string) {
    return this.form.get('range').get(control).hasError(error);
  }

  isFormInvalid() {
    return this.form.invalid;
  }

  submit() {
    if (this.isFormInvalid()) {
      return;
    }
    this.stakingPoolService.createStakingPool(this.data.namespace, this.form.get('revenue').value, this.getTimeInSeconds());
  }

  private getTimeInSeconds(): number {
    const {start, end}: { start: Date, end: Date } = this.form.get('range').value;
    return (end.getTime() - start.getTime()) / 1000;
  }

}
