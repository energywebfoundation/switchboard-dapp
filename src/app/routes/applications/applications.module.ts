import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MAT_COLOR_FORMATS, NgxMatColorPickerModule, NGX_MAT_COLOR_FORMATS } from '@angular-material-components/color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule, MatFormFieldModule, MatButtonModule, MatDividerModule, MatDialogModule, MatSelectModule, MatInputModule, MatProgressSpinnerModule, MatExpansionModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ApplicationsComponent } from './applications.component';
import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { ViewOrganizationComponent } from './view-organization/view-organization.component';
import { NewApplicationComponent } from './new-application/new-application.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { GovernanceListComponent } from './governance-list/governance-list.component';
import { GovernanceViewComponent } from './governance-view/governance-view.component';
import { TransferOwnershipComponent } from './transfer-ownership/transfer-ownership.component';
import { RemoveOrgAppComponent } from './remove-org-app/remove-org-app.component';
import { GovernanceDetailsModule } from './governance-view/governance-details/governance-details.module';

const routes: Routes = [
  { path: '', component: ApplicationsComponent }
];

@NgModule({
  declarations: [ApplicationsComponent, NewOrganizationComponent, ViewOrganizationComponent, NewApplicationComponent, NewRoleComponent, GovernanceListComponent, GovernanceViewComponent, TransferOwnershipComponent, RemoveOrgAppComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    RouterModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    NgxMatColorPickerModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatDialogModule,
    MatInputModule,
    GovernanceDetailsModule,
    MatExpansionModule
  ],
  providers: [
    { provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS }
   ], 
  entryComponents: [
    NewOrganizationComponent, 
    NewApplicationComponent, 
    NewRoleComponent, 
    GovernanceViewComponent, 
    TransferOwnershipComponent,
    RemoveOrgAppComponent] 
})
export class ApplicationsModule { }
