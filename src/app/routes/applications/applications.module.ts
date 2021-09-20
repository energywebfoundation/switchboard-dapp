import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../../shared/shared.module';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { NewStakingPoolComponent } from './new-staking-pool/new-staking-pool.component';
import { RoleFieldComponent } from './new-role/components/role-field/role-field.component';
import { OrganizationActionsComponent } from './actions/organization-actions/organization-actions.component';
import { ApplicationActionsComponent } from './actions/application-actions/application-actions.component';
import { RoleActionsComponent } from './actions/role-actions/role-actions.component';
import { NgxEditorModule } from 'ngx-editor';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { FieldsSummaryComponent } from './new-role/components/fields-summary/fields-summary.component';

const routes: Routes = [
  {path: '', component: ApplicationsComponent}
];

@NgModule({
  declarations: [
    ApplicationsComponent,
    NewOrganizationComponent,
    ViewOrganizationComponent,
    NewApplicationComponent,
    NewRoleComponent,
    GovernanceListComponent,
    GovernanceViewComponent,
    TransferOwnershipComponent,
    RemoveOrgAppComponent,
    NewStakingPoolComponent,
    RoleFieldComponent,
    OrganizationActionsComponent,
    ApplicationActionsComponent,
    RoleActionsComponent,
    OrganizationListComponent,
    FieldsSummaryComponent
  ],
  imports: [
    CommonModule,
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
    MatInputModule,
    GovernanceDetailsModule,
    MatExpansionModule,
    NgxEditorModule
  ],
  entryComponents: [
    NewOrganizationComponent,
    NewApplicationComponent,
    NewRoleComponent,
    GovernanceViewComponent,
    TransferOwnershipComponent,
    RemoveOrgAppComponent]
})
export class ApplicationsModule {
}
