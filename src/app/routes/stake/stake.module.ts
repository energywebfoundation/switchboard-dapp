import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StakeComponent } from './stake.component';
import { StakeRoutingModule } from './stake-routing.module';
import { ProvidersComponent } from './providers/providers.component';


@NgModule({
  declarations: [StakeComponent, ProvidersComponent],
  imports: [
    CommonModule,
    StakeRoutingModule
  ]
})
export class StakeModule { }
