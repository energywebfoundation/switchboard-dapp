import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { EnrolmentClaim } from '../../../models/enrolment-claim';
import { IRoleDefinition, IRoleDefinitionV2 } from 'iam-client-lib';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDetailsComponent {
  @Input() claim: EnrolmentClaim;
}
