import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { IStakingPool, StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as StakeActions from '../../../state/stake/stake.actions';
import { utils } from 'ethers';
import { Editor, Toolbar } from 'ngx-editor';

interface IRoleOption {
  namespace: string;
}

const {parseEther} = utils;

@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent implements OnInit, OnDestroy {
  editor: Editor;
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

  toolbar: Toolbar = [
    ["bullet_list"],
    ["link"],

  ];

  constructor(private stakingPoolService: StakingPoolService,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: { namespace: string, owner: string },
              private store: Store) {
  }

  ngOnInit() {
    this.getRolesList();
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
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
    this.store.dispatch(StakeActions.launchStakingPool({pool: this.createStakingPoolObject()}));
  }

  private getRolesList(): void {
    this.stakingPoolService.getListOfOrganizationRoles(this.data.owner)
      .subscribe((list: IRoleOption[]) => this.rolesOptions = list);
  }

  private createStakingPoolObject(): IStakingPool {
    const rawValues = this.form.getRawValue();
    return {
      org: this.data.namespace,
      patronRewardPortion: rawValues.revenue,
      minStakingPeriod: this.getTimeInSeconds(),
      patronRoles: rawValues.patronRoles,
      principal: parseEther(rawValues.principal.toString())
    };
  }

  private getTimeInSeconds(): number {
    const {start, end}: { start: Date, end: Date } = this.form.get('range').value;
    return (end.getTime() - start.getTime()) / 1000;
  }

}
