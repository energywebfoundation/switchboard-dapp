import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnrolmentClaim } from '../models/enrolment-claim';

@Component({
  selector: 'app-enrolment-status',
  templateUrl: './enrolment-status.component.html',
  styleUrls: ['./enrolment-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrolmentStatusComponent {
  @Input() claim: EnrolmentClaim;
}
