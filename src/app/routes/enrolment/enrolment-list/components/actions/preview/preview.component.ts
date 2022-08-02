import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EnrolmentClaim } from '../../../../models/enrolment-claim';
import { truthy } from '@operators';
import { MatDialog } from '@angular/material/dialog';
import { EnrolmentListType } from '../../../models/enrolment-list-type.enum';
import { GetPreviewComponent } from './get-preview-component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  private readonly VIEW_CREDENTIAL = 'View Credential';
  private readonly VIEW_REQUEST = 'View Request';
  @Input() enrolmentType: EnrolmentListType;
  @Input() experimentalEnabled: boolean;
  @Input() set element(claim: EnrolmentClaim) {
    this.enrolmentClaim = claim;
    this.updateHeader(claim);
  }
  @Output() refreshList = new EventEmitter();
  header: string;
  enrolmentClaim: EnrolmentClaim;
  constructor(private dialog: MatDialog) {}

  view() {
    this.dialog
      .open(GetPreviewComponent.get(this.enrolmentType), {
        width: '600px',
        data: {
          experimentalEnabled: this.experimentalEnabled,
          claimData: this.enrolmentClaim,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => {
        this.refreshList.emit();
      });
  }

  updateHeader(claim: EnrolmentClaim) {
    this.header =
      claim.isAccepted || claim.isRevoked
        ? this.VIEW_CREDENTIAL
        : this.VIEW_REQUEST;
  }
}
