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
import { LoadingService } from '../../../shared/services/loading.service';
import { IamService } from '../../../shared/services/iam.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { truthy } from '@operators';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { sortingEnrolmentData } from '../utils/sorting-enrolment-data';
import {
  ColumnDefinition,
  ColumnType,
} from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentListType } from '../enrolment-list/models/enrolment-list-type.enum';
import { FilterStatus } from '../enrolment-list/models/filter-status.enum';

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-my-enrolment-list',
  templateUrl: './my-enrolment-list.component.html',
  styleUrls: ['./my-enrolment-list.component.scss'],
})
export class MyEnrolmentListComponent implements OnInit {
  @ViewChild('actions', { static: true }) actions;
  @ViewChild('status', { static: true }) status;
  @Input() list: EnrolmentClaim[];

  @ViewChild(MatSort) sort: MatSort;
  @Output() refreshList = new EventEmitter<EnrolmentClaim>();
  @Output() removeEnrolment = new EventEmitter<EnrolmentClaim>();
  columns: ColumnDefinition[];
  sorting = sortingEnrolmentData;
  enrolmentType = EnrolmentListType.APPLICANT;
  enrolmentViewFilters: FilterStatus[] = [
    FilterStatus.All,
    FilterStatus.Pending,
    FilterStatus.Approved,
    FilterStatus.Rejected,
    FilterStatus.Revoked,
    FilterStatus.Expired,
  ];

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService
  ) {}

  ngOnInit() {
    this.defineColumns();
  }

  getEnrolmentClaim(element: EnrolmentClaim) {
    return element;
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
      .subscribe(() => this.updateList(element));
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
        this.removeEnrolment.emit(element);
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

  updateList(enrolment: EnrolmentClaim): void {
    this.refreshList.emit(enrolment);
  }

  private defineColumns() {
    this.columns = [
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
        header: 'Issuance Status',
        customElement: this.status,
      },
      {
        type: ColumnType.String,
        field: 'expirationStatus',
        header: 'Expiration Status',
      },
      {
        type: ColumnType.Date,
        field: 'expirationDate',
        header: 'Expiration Date',
      },
      {
        type: ColumnType.Actions,
        field: 'actions',
        customElement: this.actions,
      },
    ];
  }
}
