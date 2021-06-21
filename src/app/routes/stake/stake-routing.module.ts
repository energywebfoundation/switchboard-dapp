import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { StakeComponent } from './stake.component';
import { ProvidersComponent } from './providers/providers.component';
import { StakeListComponent } from './stake-list/stake-list.component';

const routes = [
  {
    path: '',
    component: StakeComponent,
    children: [
      {path: '', component: StakeListComponent},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StakeRoutingModule { }
