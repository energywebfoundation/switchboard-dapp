import { NgModule } from '@angular/core';
import { MatCardModule, MatDividerModule, MatInputModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { GovernanceDetailsComponent } from './governance-details.component';

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
export class GovernanceDetailsModule { }
