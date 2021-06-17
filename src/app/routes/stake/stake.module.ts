import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeComponent } from './stake.component';
import { StakeRoutingModule } from './stake-routing.module';


@NgModule({
  declarations: [StakeComponent],
  imports: [
    CommonModule,
    StakeRoutingModule
  ]
})
export class StakeModule { }
