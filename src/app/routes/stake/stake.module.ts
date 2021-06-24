import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { StakeComponent } from './stake.component';
import { StakeRoutingModule } from './stake-routing.module';
import { ProvidersComponent } from './providers/providers.component';
import { StakeListComponent } from './stake-list/stake-list.component';
import { StakeListCardComponent } from './stake-list/stake-list-card/stake-list-card.component';
import { DetailsComponent } from './details/details/details.component';
import { SummaryComponent } from './details/summary/summary.component';
import { TermsComponent } from './details/terms/terms.component';
import { PerformanceChartComponent } from './details/performance-chart/performance-chart.component';
import { DescriptionComponent } from './details/description/description.component';
import { ChartsModule } from 'ng2-charts';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { EnrolmentComponent } from './enrolment/enrolment.component';
import { TopBarComponent } from './top-bar/top-bar.component';


@NgModule({
  imports: [
    CommonModule,
    StakeRoutingModule,
    MatCardModule,
    MatProgressBarModule,
    ChartsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  declarations: [
    StakeComponent,
    ProvidersComponent,
    StakeListComponent,
    StakeListCardComponent,
    DetailsComponent,
    SummaryComponent,
    TermsComponent,
    PerformanceChartComponent,
    DescriptionComponent,
    ProgressBarComponent,
    EnrolmentComponent,
    TopBarComponent
  ]
})
export class StakeModule {
}
