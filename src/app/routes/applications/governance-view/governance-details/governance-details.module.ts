import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { GovernanceDetailsComponent } from './governance-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { GovernanceViewComponent } from '../governance-view.component';
import { FieldsDetailsComponent } from './fields-details/fields-details.component';
import { DefaultValueModule } from '../../pipes/default-value.module';
import { JsonEditorModule } from '@modules';

@NgModule({
  declarations: [
    GovernanceDetailsComponent,
    GovernanceViewComponent,
    FieldsDetailsComponent,
  ],
  imports: [
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    DefaultValueModule,
    JsonEditorModule,
  ],
  exports: [GovernanceDetailsComponent, GovernanceViewComponent],
})
export class GovernanceDetailsModule {}
