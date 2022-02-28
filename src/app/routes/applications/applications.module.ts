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
import { OrganizationActionsComponent } from './actions/organization-actions/organization-actions.component';
import { ApplicationActionsComponent } from './actions/application-actions/application-actions.component';
import { RoleActionsComponent } from './actions/role-actions/role-actions.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { TransactionsCompleteComponent } from './transactions-complete/transactions-complete.component';
import { RoleListComponent } from './role-list/role-list.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ActionsMenuComponent } from './actions/actions-menu/actions-menu.component';
import { FilterComponent } from './filter/filter.component';
import { CreateFieldsModule } from './new-role/components/create-fields/create-fields.module';
import { DidBookModule } from '../../modules/did-book/did-book.module';
import { RoleNameComponent } from './new-role/components/role-name/role-name.component';
import { IssuerDidListComponent } from './new-role/components/issuer-did-list/issuer-did-list.component';
import { IssuerDidComponent } from './new-role/components/issuer-did/issuer-did.component';
import { SearchIssuerRoleComponent } from './new-role/components/search-issuer-role/search-issuer-role.component';
import { NamespaceDetailsComponent } from './namespace-details/namespace-details.component';
import { ApplicationCreationFormComponent } from './new-application/application-creation-form/application-creation-form.component';
import { DefaultValueModule } from './pipes/default-value.module';

const routes: Routes = [{ path: '', component: ApplicationsComponent }];

@NgModule({
  declarations: [
    ApplicationsComponent,
    NewOrganizationComponent,
    ViewOrganizationComponent,
    NewApplicationComponent,
    NewRoleComponent,
    TransferOwnershipComponent,
    RemoveOrgAppComponent,
    OrganizationActionsComponent,
    ApplicationActionsComponent,
    RoleActionsComponent,
    OrganizationListComponent,
    RoleListComponent,
    ApplicationListComponent,
    ActionsMenuComponent,
    FilterComponent,
    ActionsMenuComponent,
    TransactionsCompleteComponent,
    RoleNameComponent,
    IssuerDidListComponent,
    IssuerDidComponent,
    SearchIssuerRoleComponent,
    NamespaceDetailsComponent,
    ApplicationCreationFormComponent,
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
    CreateFieldsModule,
    DidBookModule,
    DefaultValueModule,
  ],
})
export class ApplicationsModule {}
