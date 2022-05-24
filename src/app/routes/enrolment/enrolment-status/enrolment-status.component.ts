import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnrolmentClaim } from '../models/enrolment-claim.interface';

@Component({
  selector: 'app-enrolment-status',
  templateUrl: './enrolment-status.component.html',
  styleUrls: ['./enrolment-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnrolmentStatusComponent {
  @Input() item: EnrolmentClaim;

  isAccepted() {
    return this.item?.isAccepted;
  }

  isSynced() {
    return this.item?.isSynced;
  }

  isRejected() {
    return !this.item?.isAccepted && this.item?.isRejected;
  }

  isRevoked() {
    return this.item?.isRevoked;
  }

  isPending() {
    return !this.item?.isAccepted && !this.item?.isRejected;
  }

  isPendingSync() {
    return !this.item?.isSynced;
  }
}
