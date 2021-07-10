import { Component, Inject, OnInit } from '@angular/core';
import { StakingPool, StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface IRoleOption {
  namespace: string;
}

@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent implements OnInit {

  form: FormGroup = this.fb.group({
    patrons: 'Yes',
    revenue: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
    range: this.fb.group({
      start: ['', [Validators.required]],
      end: ['', [Validators.required]]
    }),
    patronRoles: [[]],
    principal: ['', [Validators.required, Validators.min(100)]]
  });

  rolesOptions: IRoleOption[];

  constructor(private stakingPoolService: StakingPoolService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { namespace: string, owner: string }) {
  }

  ngOnInit() {
    this.getRolesList();
  }

  getRangeControlError(control: string, error: string): boolean {
    return this.form.get('range').get(control).hasError(error);
  }

  isFormInvalid(): boolean {
    return this.form.invalid;
  }

  submit(): void {
    if (this.isFormInvalid()) {
      return;
    }
    this.stakingPoolService.createStakingPool(this.createStakingPoolObject());
  }

  private getRolesList(): void {
    this.stakingPoolService.getListOfOrganizationRoles(this.data.owner)
      .subscribe((list: IRoleOption[]) => this.rolesOptions = list);
  }

  private createStakingPoolObject(): StakingPool {
    const rawValues = this.form.getRawValue();
    return {
      org: this.data.namespace,
      patronRewardPortion: rawValues.revenue,
      minStakingPeriod: this.getTimeInSeconds(),
      patronRoles: rawValues.patronRoles,
      principal: rawValues.principal
    };
  }

  private getTimeInSeconds(): number {
    const {start, end}: { start: Date, end: Date } = this.form.get('range').value;
    return (end.getTime() - start.getTime()) / 1000;
  }

}
