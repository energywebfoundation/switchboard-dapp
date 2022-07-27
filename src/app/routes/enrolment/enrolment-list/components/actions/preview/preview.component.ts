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
  @Input() element: EnrolmentClaim;
  @Input() enrolmentType: EnrolmentListType;
  @Output() refreshList = new EventEmitter();
  constructor(private dialog: MatDialog) {}

  view(element: EnrolmentClaim) {
    this.dialog
      .open(GetPreviewComponent.get(this.enrolmentType), {
        width: '600px',
        data: {
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
