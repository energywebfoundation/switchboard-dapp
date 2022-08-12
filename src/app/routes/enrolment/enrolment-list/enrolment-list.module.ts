import { NgModule } from '@angular/core';
import { EnrolmentStatusComponent } from '../enrolment-status/enrolment-status.component';
import { EnrolmentListComponent } from './enrolment-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { PreviewComponent } from './components/actions/preview/preview.component';
import { CascadingFilterModule } from '@modules';

@NgModule({
  declarations: [
    EnrolmentListComponent,
    EnrolmentStatusComponent,
    PreviewComponent,
  ],
  imports: [SharedModule, CascadingFilterModule],
  exports: [EnrolmentListComponent, EnrolmentStatusComponent, PreviewComponent],
})
export class EnrolmentListModule {}
