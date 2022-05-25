import { NgModule } from '@angular/core';
import { EnrolmentStatusComponent } from '../enrolment-status/enrolment-status.component';
import { EnrolmentListComponent } from './enrolment-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { EnrolmentListFilterComponent } from './enrolment-list-filter/enrolment-list-filter.component';

@NgModule({
  declarations: [
    EnrolmentListComponent,
    EnrolmentListFilterComponent,
    EnrolmentStatusComponent,
  ],
  imports: [SharedModule],
  exports: [
    EnrolmentListComponent,
    EnrolmentListFilterComponent,
    EnrolmentStatusComponent,
  ],
})
export class EnrolmentListModule {}
