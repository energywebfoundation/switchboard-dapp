import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StakeComponent } from './stake.component';
import { StakeListComponent } from './stake-list/stake-list.component';
import { DetailsComponent } from './details/details/details.component';
import { EnrolmentComponent } from './enrolment/enrolment.component';

const routes: Routes = [
  {
    path: '',
    component: StakeComponent,
    children: [
      {path: '', component: StakeListComponent},
      {
        path: ':id',
        component: DetailsComponent,
      },
      {path: ':id/enrolment', component: EnrolmentComponent}
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
