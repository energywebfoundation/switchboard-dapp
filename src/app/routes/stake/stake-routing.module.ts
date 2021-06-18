import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StakeComponent } from './stake.component';
import { StakeListComponent } from './stake-list/stake-list.component';
import { ProviderComponent } from './provider/provider/provider.component';

const routes = [
  {
    path: '',
    component: StakeComponent,
    children: [
      {path: '', component: StakeListComponent},
      {path: 'ewf', component: ProviderComponent}
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
