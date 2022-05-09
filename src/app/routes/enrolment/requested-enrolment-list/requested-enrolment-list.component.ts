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
import { MatTableDataSource } from '@angular/material/table';
import { EnrolmentClaim } from '../models/enrolment-claim.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { truthy } from '@operators';
import { EnrolmentListType } from '../enrolment-list/enrolment-list.component';
import { isAsset } from '../../../state/enrolments/utils/remove-assets-from-list/remove-assets-from-list';

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-requested-enrolment-list',
  templateUrl: './requested-enrolment-list.component.html',
  styleUrls: ['./requested-enrolment-list.component.scss'],
})
export class RequestedEnrolmentListComponent implements OnInit, OnDestroy {
  @Input() set list(data: EnrolmentClaim[]) {
    if (data.length > 0) {
      this.dataSource.data = data;
    }
  }
  @Input() set showAssets(value: boolean) {
    this._showAssets = value;
    if (this.showAssets) {
      this.displayedColumns = [
        'requestDate',
        'roleName',
        'parentNamespace',
        'requester',
        'asset',
        'status',
        'actions',
      ];
    } else {
      this.displayedColumns = [
        'requestDate',
        'roleName',
        'parentNamespace',
        'requester',
        'status',
        'actions',
      ];
    }
  }
  @Output() refreshList = new EventEmitter<void>();

  get showAssets() {
    return this._showAssets;
  }

  private _showAssets: boolean;

  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource<EnrolmentClaim>([]);
  displayedColumns: string[];

  private _iamSubscriptionId: number;

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog
  ) {}

  isAsset(element) {
    return isAsset(element);
  }

  async ngOnInit() {
    // Subscribe to IAM events
    this._iamSubscriptionId =
      await this.iamService.messagingService.subscribeTo({
        messageHandler: this._handleMessage.bind(this),
      });

    // Initialize table
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'status') {
        if (item.isAccepted) {
          if (item.isSynced) {
            return 'approved';
          } else {
            return 'approved pending sync';
          }
        } else {
          if (item.isRejected) {
            return 'rejected';
          } else {
            return 'pending';
          }
        }
      } else {
        return item[property];
      }
    };
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

  isSynced(element: EnrolmentClaim) {
    return element?.isSynced;
  }

  isRejected(element: EnrolmentClaim) {
    return !element?.isAccepted && element?.isRejected;
  }

  isPending(element: EnrolmentClaim) {
    return !element?.isAccepted && !element?.isRejected;
  }

  isPendingSync(element: EnrolmentClaim) {
    return !element?.isSynced;
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

  private async _handleMessage(message: any) {
    if (!message.issuedToken) {
      this.updateList();
    }
  }

  private updateList() {
    this.refreshList.emit();
  }
}
