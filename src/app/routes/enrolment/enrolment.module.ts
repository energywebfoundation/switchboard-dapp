import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EnrolmentComponent } from './enrolment.component';
import { EnrolToRoleComponent } from './enrol-to-role/enrol-to-role.component';
import { FormsModule } from '@angular/forms';
import { ViewRequestsComponent } from './view-requests/view-requests.component';
import { ViewRoleComponent } from './view-role/view-role.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {path: '', component: EnrolmentComponent}
];

@NgModule({
  declarations: [EnrolmentComponent, EnrolToRoleComponent, ViewRequestsComponent, ViewRoleComponent],
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
    MatInputModule
  ],
  entryComponents: [ViewRequestsComponent, ViewRoleComponent]
})
export class EnrolmentModule {
}
