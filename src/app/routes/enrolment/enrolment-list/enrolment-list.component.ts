import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClaimData, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CancelButton } from '../../../layout/loading/loading.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData
} from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { truthy } from '@operators';

export const EnrolmentListType = {
  ISSUER: 'issuer',
  APPLICANT: 'applicant',
  ASSET: 'asset',
};

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-enrolment-list',
  templateUrl: './enrolment-list.component.html',
  styleUrls: ['./enrolment-list.component.scss'],
})
export class EnrolmentListComponent implements OnInit, OnDestroy {
  @Input() listType: string;
  @Input() accepted: boolean;
  @Input() rejected: boolean;
  @Input() subject: string;
  @Input() namespaceFilterControl!: FormControl;
  @Input() didFilterControl!: FormControl;

  @ViewChild(MatSort) sort: MatSort;

  ListType = EnrolmentListType;
  dataSource = new MatTableDataSource([]);
  displayedColumns: string[];
  dynamicAccepted: boolean;
  dynamicRejected: boolean;

  private _subscription$ = new Subject();
  private _iamSubscriptionId: number;
  private _shadowList = [];

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService
  ) {
  }

  async ngOnInit() {
    // Subscribe to IAM events
    this._iamSubscriptionId = await this.iamService.messagingService.subscribeTo(
      {
        messageHandler: this._handleMessage.bind(this),
      }
    );

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

    if (
      this.listType === EnrolmentListType.APPLICANT ||
      this.listType === EnrolmentListType.ASSET
    ) {
      this.displayedColumns = [
        'requestDate',
        'roleName',
        'parentNamespace',
        'status',
        'actions',
      ];
    } else {
      this.displayedColumns = [
        'requestDate',
        'roleName',
        'parentNamespace',
        'requester',
        'asset',
        'status',
        'actions',
      ];
    }

    await this.getList(this.rejected, this.accepted);
    this._checkNamespaceControlChanges();
    this._checkDidControlChanges();
  }

  async ngOnDestroy(): Promise<void> {
    this._subscription$.next();
    this._subscription$.complete();

    // Unsubscribe from IAM Events
    await this.iamService.messagingService.unsubscribeFrom(
      this._iamSubscriptionId
    );
  }

  public async getList(isRejected: boolean, isAccepted?: boolean) {
    this.loadingService.show();
    this.dynamicRejected = isRejected;
    this.dynamicAccepted = isAccepted;
    let list = [];

    try {
      if (this.listType === EnrolmentListType.ASSET) {
        list = this._getRejectedOnly(
          isRejected,
          isAccepted,
          await this.iamService.claimsService.getClaimsBySubject({
            did: this.subject,
            isAccepted,
          })
        );
      } else if (this.listType === EnrolmentListType.ISSUER) {
        list = this._getRejectedOnly(
          isRejected,
          isAccepted,
          await this.iamService.claimsService.getClaimsByIssuer({
            did: this.iamService.signerService.did,
            isAccepted,
          })
        );
      } else {
        list = this._getRejectedOnly(
          isRejected,
          isAccepted,
          await this.iamService.claimsService.getClaimsByRequester({
            did: this.iamService.signerService.did,
            isAccepted,
          })
        );
      }

      if (list && list.length) {
        for (const item of list) {
          const arr = item.claimType.split(`.${NamespaceType.Role}.`);
          item.roleName = arr[0];
          item.requestDate = new Date(item.createdAt);
        }

        if (this.listType !== EnrolmentListType.ISSUER) {
          await this.appendDidDocSyncStatus(list);
        }
      }
    } catch (e) {
      console.error(e);
      this.toastr.error(e, TOASTR_HEADER);
    }

    this._shadowList = list;
    if (this.namespaceFilterControl) {
      this.updateListByNamespace(this.namespaceFilterControl.value);
    }
    this.loadingService.hide();
  }

  isAccepted(element) {
    return element?.isAccepted;
  }

  isSynced(element) {
    return element?.isSynced;
  }

  isRejected(element) {
    return !element?.isAccepted && element?.isRejected;
  }

  isPending(element) {
    return !element?.isAccepted && !element?.isRejected;
  }

  isPendingSync(element) {
    return (!this.viewedByIssuer() && !this.isSynced(element) && this.isOffChain(element)) && !this.isOnlyOnChain(element);
  }

  viewedByIssuer() {
    return this.listType === EnrolmentListType.ISSUER;
  }

  isOnlyOnChain(element) {
    return element.registrationTypes.length === 1 && element.registrationTypes.includes(RegistrationTypes.OnChain);
  }

  isOffChain(element) {
    return element.registrationTypes.includes(RegistrationTypes.OffChain);
  }

  view(element: any) {
    this.dialog
      .open(ViewRequestsComponent, {
        width: '600px',
        data: {
          listType: this.listType,
          claimData: element,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(takeUntil(this._subscription$))
      .subscribe((reloadList: any) => {
        if (reloadList) {
          this.getList(this.dynamicRejected, this.dynamicAccepted);
        }
      });
  }

  async addToDidDoc(element: any) {
    this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData>(ConfirmationDialogComponent, {
        width: '600px',
        maxHeight: 'auto',
        data: {
          header: 'Sync credential to my DID document',
          svgIcon: 'sync-did-icon',
          message:
            'It is currently necessary to sync the credential to your DID document in order to make it available. However, please note that this will make your role data public and permanent.',
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => this.syncClaimToDidDoc(element));
  }

  async cancelClaimRequest(element: any) {
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
        await this.getList(this.rejected, this.accepted);
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

  private _getRejectedOnly(
    isRejected: boolean,
    isAccepted: boolean | undefined,
    list: any[]
  ) {
    if (list.length && isRejected) {
      list = list.filter((item) => item.isRejected === true);
    } else if (isAccepted === false) {
      list = list.filter(
        (item) => item.isAccepted === false && !item.isRejected
      );
    }
    return list;
  }

  private async _handleMessage(message: any) {
    if (
      (this.listType === EnrolmentListType.APPLICANT &&
        (message.issuedToken || message.isRejected)) ||
      (this.listType === EnrolmentListType.ISSUER && !message.issuedToken)
    ) {
      await this.getList(this.rejected, this.accepted);
    }
  }

  private async appendDidDocSyncStatus(list: any[]) {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const did = this.listType === EnrolmentListType.ASSET ? {did: this.subject} : undefined;
    const claims: ClaimData[] = (await this.iamService.claimsService.getUserClaims(did))
      .filter((item: ClaimData) => {
        if (item && item.claimType) {
          const arr = item.claimType.split('.');
          if (arr.length > 1 && arr[1] === NamespaceType.Role) {
            return true;
          }
          return false;
        }
        return false;
      });

    if (claims && claims.length) {
      claims.forEach((item: ClaimData) => {
        for (let i = 0; i < list.length; i++) {
          if (item.claimType === list[i].claimType) {
            list[i].isSynced = true;
          }
        }
      });
    }
  }

  private async syncClaimToDidDoc(element: any) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );

    try {
      const retVal = await this.iamService.claimsService.publishPublicClaim({
        token: element.issuedToken,
      });

      if (retVal) {
        this.notifService.decreasePendingDidDocSyncCount();
        this.toastr.success('Action is successful.', 'Sync to DID Document');
        await this.getList(this.rejected, this.accepted);
      } else {
        this.toastr.warning(
          'Unable to proceed with this action. Please contact system administrator.',
          'Sync to DID Document'
        );
      }
    } catch (e) {
      console.error(e);
      this.toastr.error(e, 'Sync to DID Document');
    }

    this.loadingService.hide();
  }

  private _checkNamespaceControlChanges(): void {
    if (!this.namespaceFilterControl) {
      return;
    }

    this.namespaceFilterControl.valueChanges
      .pipe(
        distinctUntilChanged(
          (prevValue, currentValue) => prevValue === currentValue
        ),
        takeUntil(this._subscription$)
      )
      .subscribe((value) => this.updateListByNamespace(value));
  }

  private _checkDidControlChanges(): void {
    if (!this.didFilterControl) {
      return;
    }
    this.didFilterControl.valueChanges
      .pipe(
        distinctUntilChanged(
          (prevValue, currentValue) => prevValue === currentValue
        ),
        takeUntil(this._subscription$)
      )
      .subscribe((value) => this.updateListByDid(value));
  }

  private updateListByDid(value: string): void {
    if (value) {
      this.dataSource.data = this._shadowList.filter(
        (item) => item.subject.includes(value) || item.requester.includes(value)
      );
    } else {
      this.dataSource.data = this._shadowList;
    }
  }

  private updateListByNamespace(value: string): void {
    if (value) {
      this.dataSource.data = this._shadowList.filter((item) =>
        item.namespace.includes(value)
      );
    } else {
      this.dataSource.data = this._shadowList;
    }
  }
}
