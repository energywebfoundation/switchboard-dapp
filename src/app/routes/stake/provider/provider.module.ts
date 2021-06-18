import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryStatisticsComponent } from './summary-statistics/summary-statistics.component';
import { ProviderComponent } from './provider/provider.component';
import { TermsComponent } from './terms/terms.component';
import { PerformanceChartComponent } from './performance-chart/performance-chart.component';
import { ProviderDescriptionComponent } from './provider-description/provider-description.component';


@NgModule({
  declarations: [
    ProviderComponent,
    SummaryStatisticsComponent,
    TermsComponent,
    PerformanceChartComponent,
    ProviderDescriptionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ProviderComponent]
})
export class ProviderModule {
}
