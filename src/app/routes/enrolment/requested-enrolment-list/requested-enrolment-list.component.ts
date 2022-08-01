import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { EnrolmentClaim } from '../models/enrolment-claim';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { truthy } from '@operators';
import { isAsset } from '../../../state/enrolments/utils/remove-assets-from-list/remove-assets-from-list';
import {
  ColumnDefinition,
  ColumnType,
} from '../../../shared/components/table/generic-table/generic-table.component';
import { sortingEnrolmentData } from '../utils/sorting-enrolment-data';
import { FilterStatus } from '../enrolment-list/models/filter-status.enum';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';

@Component({
  selector: 'app-requested-enrolment-list',
  templateUrl: './requested-enrolment-list.component.html',
  styleUrls: ['./requested-enrolment-list.component.scss'],
})
export class RequestedEnrolmentListComponent {
  @ViewChild('actions', { static: true }) actions;
  @ViewChild('status', { static: true }) status;
  @Input() list: EnrolmentClaim[];
  @Input() enrolmentStatus: FilterStatus;
  @Input() set showAssets(value: boolean) {
    if (value) {
      this.columns = this.defineColumns();
    } else {
      this.columns = this.defineColumns().filter(
        (item) => item.field !== 'subject'
      );
    }
  }
  @Output() refreshList = new EventEmitter<void>();

  enrolmentType = EnrolmentListType.ISSUER;

  columns: ColumnDefinition[];
  sorting = sortingEnrolmentData;

  @ViewChild(MatSort) sort: MatSort;

  isAccepted(element: EnrolmentClaim) {
    return element?.isAccepted;
  }

  updateList() {
    this.refreshList.emit();
  }

  private defineColumns() {
    return [
      { type: ColumnType.Date, field: 'requestDate', header: 'Request Date' },
      { type: ColumnType.String, field: 'roleName', header: 'Claim Name' },
      {
        type: ColumnType.String,
        field: 'namespace',
        header: 'Parent Namespace',
      },
      {
        type: ColumnType.DID,
        field: 'requester',
        header: 'Requestor DID',
      },
      {
        type: ColumnType.DID,
        field: 'subject',
        header: 'Asset DID',
        condition: (element: EnrolmentClaim) => element.isAsset(),
      },
      {
        type: ColumnType.Custom,
        field: 'status',
        header: 'status',
        customElement: this.status,
      },
      {
        type: ColumnType.Actions,
        field: 'actions',
        customElement: this.actions,
      },
    ];
  }
}
