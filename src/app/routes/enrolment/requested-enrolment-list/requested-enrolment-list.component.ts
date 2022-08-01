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
export class RequestedEnrolmentListComponent implements OnInit, OnDestroy {
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

  private _iamSubscriptionId: number;

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    // Subscribe to IAM events
    this._iamSubscriptionId =
      await this.iamService.messagingService.subscribeTo({
        messageHandler: this._handleMessage.bind(this),
      });
  }

  async ngOnDestroy(): Promise<void> {
    // Unsubscribe from IAM Events
    await this.iamService.messagingService.unsubscribeFrom(
      this._iamSubscriptionId
    );
  }

  isAccepted(element: EnrolmentClaim) {
    return element?.isAccepted;
  }

  private async _handleMessage(message) {
    if (!message.issuedToken) {
      this.updateList();
    }
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
