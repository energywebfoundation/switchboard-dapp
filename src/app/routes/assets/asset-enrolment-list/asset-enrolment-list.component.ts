/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { truthy } from '@operators';
import { Store } from '@ngrx/store';
import { EnrolmentClaim } from '../../enrolment/models/enrolment-claim';
import { PublishRoleService } from '../../../shared/services/publish-role/publish-role.service';
import { ClaimsFacadeService } from '../../../shared/services/claims-facade/claims-facade.service';
import {
  ColumnDefinition,
  ColumnType,
} from '../../../shared/components/table/generic-table/generic-table.component';
import { EnrolmentListType } from '../../enrolment/enrolment-list/models/enrolment-list-type.enum';

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-asset-enrolment-list',
  templateUrl: './asset-enrolment-list.component.html',
  styleUrls: ['./asset-enrolment-list.component.scss'],
})
export class AssetEnrolmentListComponent implements OnInit {
  @ViewChild('actions', { static: true }) actions;
  @ViewChild('status', { static: true }) status;
  @Input() subject: string;

  @ViewChild(MatSort) sort: MatSort;
  columns: ColumnDefinition[];
  list: EnrolmentClaim[];
  enrolmentType = EnrolmentListType.ASSET;

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService,
    private store: Store,
    private publishRoleService: PublishRoleService,
    private claimsFacade: ClaimsFacadeService
  ) {}

  ngOnInit() {
    this.defineColumns();
    this.getList();
  }

  public getList() {
    this.loadingService.show();

    this.claimsFacade
      .getClaimsBySubject(this.subject)
      .subscribe((enrolments) => {
        this.list = enrolments;
      });
    this.loadingService.hide();
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

  async addToDidDoc(element: EnrolmentClaim) {
    this.publishRoleService
      .addToDidDoc({
        issuedToken: element.issuedToken,
        registrationTypes: element.registrationTypes,
        claimType: element.claimType,
        claimTypeVersion: element.claimTypeVersion,
        subject: element.subject,
      })
      .pipe(truthy())
      .subscribe(() => this.getList());
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
        this.getList();
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
