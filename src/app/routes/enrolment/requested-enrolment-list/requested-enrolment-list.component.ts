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
import { EnrolmentClaim } from '../models/enrolment-claim.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { truthy } from '@operators';
import { EnrolmentListType } from '../../assets/asset-enrolment-list/asset-enrolment-list.component';
import { isAsset } from '../../../state/enrolments/utils/remove-assets-from-list/remove-assets-from-list';
import {
  ColumnDefinition,
  ColumnType,
} from '../../../shared/components/table/generic-table/generic-table.component';
import { sortingEnrolmentData } from '../utils/sorting-enrolment-data';
import { FilterStatus } from '../enrolment-list/enrolment-list-filter/enrolment-list-filter.component';

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

  view(element: EnrolmentClaim) {
    this.dialog
      .open(ViewRequestsComponent, {
        width: '600px',
        data: {
          listType: EnrolmentListType.ISSUER,
          claimData: element,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => {
        this.updateList();
      });
  }

  private async _handleMessage(message) {
    if (!message.issuedToken) {
      this.updateList();
    }
  }

  private updateList() {
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
        condition: (element: EnrolmentClaim) => isAsset(element),
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
