import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { StakeComponent } from './stake.component';
import { StakeRoutingModule } from './stake-routing.module';
import { ProvidersComponent } from './providers/providers.component';
import { StakeListComponent } from './stake-list/stake-list.component';
import { StakeListCardComponent } from './stake-list/stake-list-card/stake-list-card.component';
import { ProviderModule } from './provider/provider.module';


@NgModule({
  imports: [
    CommonModule,
    StakeRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    ProviderModule
  ],
  declarations: [StakeComponent, ProvidersComponent, StakeListComponent, StakeListCardComponent]
})
export class StakeModule { }
