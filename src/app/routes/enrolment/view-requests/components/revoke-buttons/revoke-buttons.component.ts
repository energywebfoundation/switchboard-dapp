import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnrolmentClaim } from '../../../models/enrolment-claim';
import { RevokeService } from '../../../services/revoke/revoke.service';

@Component({
  selector: 'app-revoke-buttons',
  templateUrl: './revoke-buttons.component.html',
  styleUrls: ['./revoke-buttons.component.scss'],
})
export class RevokeButtonsComponent {
  @Input() claim: EnrolmentClaim;
  @Output() revoked = new EventEmitter();
  constructor(private revokeService: RevokeService) {}

  revokeOffChain() {
    this.revokeService.revokeOffChain(this.claim).subscribe(() => {
      this.revoked.emit();
    });
  }

  revokeOnChain() {
    this.revokeService.revokeOnChain(this.claim).subscribe(() => {
      this.revoked.emit();
    });
  }
}
