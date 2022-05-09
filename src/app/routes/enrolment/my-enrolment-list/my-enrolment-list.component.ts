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
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { Store } from '@ngrx/store';
import { PublishRoleService } from '../../../shared/services/publish-role/publish-role.service';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { truthy } from '@operators';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { EnrolmentListType } from '../enrolment-list/enrolment-list.component';
import { isAsset } from 'src/app/state/enrolments/utils/remove-assets-from-list/remove-assets-from-list';
import { sortingDataAccessor } from '../utils/sorting-data-accessor';

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-my-enrolment-list',
  templateUrl: './my-enrolment-list.component.html',
  styleUrls: ['./my-enrolment-list.component.scss'],
})
export class MyEnrolmentListComponent implements OnInit, OnDestroy {
  @Input() set list(data: EnrolmentClaim[]) {
    if (data.length > 0) {
      this.dataSource.data = data;
    }
  }

  @ViewChild(MatSort) sort: MatSort;
  @Output() refreshList = new EventEmitter<void>();

  dataSource = new MatTableDataSource<EnrolmentClaim>([]);
  displayedColumns: string[] = [
    'requestDate',
    'roleName',
    'parentNamespace',
    'status',
    'actions',
  ];

  private _iamSubscriptionId: number;

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService,
    private store: Store,
    private publishRoleService: PublishRoleService
  ) {}

  isAsset(element) {
    isAsset(element);
  }

  async ngOnInit() {
    // Subscribe to IAM events
    this._iamSubscriptionId =
      await this.iamService.messagingService.subscribeTo({
        messageHandler: this._handleMessage.bind(this),
      });

    // Initialize table
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = sortingDataAccessor;
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
          listType: EnrolmentListType.APPLICANT,
          claimData: element,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => this.updateList());
  }

  addToDidDoc(element: EnrolmentClaim) {
    this.publishRoleService
      .addToDidDoc({
        issuedToken: element.issuedToken,
        registrationTypes: element.registrationTypes,
        claimType: element.claimType,
      })
      .pipe(truthy())
      .subscribe(() => this.updateList());
  }

  async cancelClaimRequest(element: EnrolmentClaim) {
    const dialogRef = this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: TOASTR_HEADER,
          message: 'Are you sure to cancel this enrolment request?',
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .toPromise();

    if (await dialogRef) {
      this.loadingService.show();

      try {
        await this.iamService.claimsService.deleteClaim({
          id: element.id,
        });
        this.toastr.success(
          'Action is successful.',
          'Cancel Enrolment Request'
        );
        this.updateList();
      } catch (e) {
        console.error(e);
        this.toastr.error(
          'Failed to cancel the enrolment request.',
          TOASTR_HEADER
        );
      } finally {
        this.loadingService.hide();
      }
    }
  }

  private updateList(): void {
    this.refreshList.emit();
  }

  private async _handleMessage(message: any) {
    if (message.issuedToken || message.isRejected) {
    }
  }
}
