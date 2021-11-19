import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StakeComponent } from './stake.component';
import { StakeListComponent } from './stake-list/stake-list.component';

const routes: Routes = [
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
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class StakeRoutingModule {
}
