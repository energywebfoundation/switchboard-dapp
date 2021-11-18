import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { StakeComponent } from './stake.component';
import { StakeRoutingModule } from './stake-routing.module';
import { StakeListComponent } from './stake-list/stake-list.component';
import { StakeListCardComponent } from './stake-list/stake-list-card/stake-list-card.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    CommonModule,
    StakeRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule
  ],
  declarations: [
    StakeComponent,
    StakeListComponent,
    StakeListCardComponent,
    ProgressBarComponent,
    TopBarComponent,
  ]
})
export class StakeModule {
}
