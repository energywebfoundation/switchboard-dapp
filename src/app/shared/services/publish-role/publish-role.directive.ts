import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { PublishRoleService } from './publish-role.service';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';

@Directive({
  selector: '[appPublishRole]',
  standalone: true,
})
export class PublishRoleDirective {
  @Input() appPublishRole: EnrolmentClaim;
  @Output() updated = new EventEmitter<void>();
  constructor(private publishRoleService: PublishRoleService) {}

  @HostListener('click') publishRole() {
    this.publishRoleService.addToDidDoc(this.appPublishRole).subscribe({
      next: () => {
        this.appPublishRole.setIsSyncedOffChain(true).setIsSyncedOnChain(true);
        this.updated.emit();
      },
    });
  }
}
