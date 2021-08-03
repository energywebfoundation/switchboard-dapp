import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { GovernanceDetailsComponent } from './governance-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [GovernanceDetailsComponent],
  imports: [
    SharedModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule
  ],
  exports: [
    GovernanceDetailsComponent
  ]
})
export class GovernanceDetailsModule {
}
