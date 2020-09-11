import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatFormFieldModule, MatButtonModule, MatDividerModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { EnrolToRoleComponent } from './enrol-to-role/enrol-to-role.component';

const routes: Routes = [
  { path: '', component: EnrolmentComponent }
];

@NgModule({
  declarations: [EnrolmentComponent, NewRoleComponent, EnrolToRoleComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    NgxSpinnerModule
  ]
})
export class EnrolmentModule { }
