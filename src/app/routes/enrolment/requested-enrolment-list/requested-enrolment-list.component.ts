import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { EnrolmentClaim } from '../models/enrolment-claim';
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
export class RequestedEnrolmentListComponent implements OnInit {
  @ViewChild('actions', { static: true }) actions;
  @ViewChild('status', { static: true }) status;
  @Input() list: EnrolmentClaim[];
  @Input() enrolmentStatus: FilterStatus;
  @Output() refreshList = new EventEmitter<EnrolmentClaim>();

  enrolmentType = EnrolmentListType.ISSUER;
  enrolmentViewFilters = [
    FilterStatus.All,
    FilterStatus.Pending,
    FilterStatus.Approved,
    FilterStatus.Rejected,
    FilterStatus.Revoked,
  ];
  columns: ColumnDefinition[];
  sorting = sortingEnrolmentData;

  @ViewChild(MatSort) sort: MatSort;

  isAccepted(element: EnrolmentClaim) {
    return element?.isAccepted;
  }

  updateList(enrolment: EnrolmentClaim) {
    this.refreshList.emit(enrolment);
  }

  ngOnInit() {
    this.columns = this.defineColumns();
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
