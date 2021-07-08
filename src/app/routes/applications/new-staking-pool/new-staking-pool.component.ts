import { Component, Inject, OnInit } from '@angular/core';
import { StakingPoolService } from './staking-pool.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-new-staking-pool',
  templateUrl: './new-staking-pool.component.html',
  styleUrls: ['./new-staking-pool.component.scss']
})
export class NewStakingPoolComponent implements OnInit {

  form = new FormGroup({
    patrons: new FormControl(''),
    revenue: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1000)]),
    range: new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    })
  });

  constructor(private stakingPoolService: StakingPoolService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  isFormInvalid() {
    return this.form.invalid;
  }

  submit() {

    console.log(this.form.value);
    this.stakingPoolService.createStakingPool(this.data.namespace, this.form.get('revenue').value, 100);
  }

}
