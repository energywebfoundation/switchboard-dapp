import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { EnrolmentClaim } from '../../../../models/enrolment-claim.interface';
import { ViewRequestsComponent } from '../../../../view-requests/view-requests.component';
import { truthy } from '@operators';
import { MatDialog } from '@angular/material/dialog';
import { EnrolmentListType } from '../../../models/enrolment-list-type.enum';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  @Input() element: EnrolmentClaim;
  @Input() enrolmentType: EnrolmentListType;
  @Output() refreshList = new EventEmitter();
  constructor(private dialog: MatDialog) {}

  view(element: EnrolmentClaim) {
    this.dialog
      .open(ViewRequestsComponent, {
        width: '600px',
        data: {
          listType: this.enrolmentType,
          claimData: element,
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
}
