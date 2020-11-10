import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatFormFieldModule, MatButtonModule, MatDividerModule, MatDialogModule, MatSelectModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { EnrolToRoleComponent } from './enrol-to-role/enrol-to-role.component';
import { FormsModule } from '@angular/forms';
import { NgxSelectModule } from 'ngx-select-ex';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { EnrolmentListComponent } from './enrolment-list/enrolment-list.component';

const routes: Routes = [
  { path: '', component: EnrolmentComponent }
];

@NgModule({
  declarations: [EnrolmentComponent, EnrolToRoleComponent, ViewRequestsComponent, ViewRoleComponent, EnrolmentListComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,
    NgxSelectModule,
    MatInputModule
  ],
  entryComponents: [ViewRequestsComponent,ViewRoleComponent],
})
export class EnrolmentModule { }
