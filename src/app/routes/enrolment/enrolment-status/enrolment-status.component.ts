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

  isAccepted() {
    return this.claim?.isAccepted && !this.claim?.isRevokedOnChain;
  }

  isSynced() {
    return this.claim?.isSynced;
  }

  isRejected() {
    return !this.claim?.isAccepted && this.claim?.isRejected;
  }

  isRevoked() {
    return this.claim?.isRevokedOnChain;
  }

  isPending() {
    return !this.claim?.isAccepted && !this.claim?.isRejected;
  }

  isPendingSync() {
    return !this.claim?.isSynced;
  }
}
