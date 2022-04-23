/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NamespaceType } from 'iam-client-lib';
import { take, takeUntil } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { truthy } from '@operators';
import { Store } from '@ngrx/store';
import { SettingsSelectors } from '@state';
import { EnrolmentClaim } from '../models/enrolment-claim.interface';
import { PublishRoleService } from '../../../shared/services/publish-role/publish-role.service';

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
  dataSource = new MatTableDataSource<EnrolmentClaim>([]);
  displayedColumns: string[];
  dynamicAccepted: boolean;
  dynamicRejected: boolean;

  private _subscription$ = new Subject();
  private _iamSubscriptionId: number;
  private _shadowList: EnrolmentClaim[] = [];

  constructor(
    private loadingService: LoadingService,
    private iamService: IamService,
    private dialog: MatDialog,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService,
    private store: Store,
    private publishRoleService: PublishRoleService
  ) {}

  isAsset(element) {
    return (
      element?.subject !== element?.claimType &&
      element?.subject !== element?.requester
    );
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
    await this.getList(this.rejected, this.accepted);

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
      this.store
        .select(SettingsSelectors.isExperimentalEnabled)
        .subscribe((isExperimental: boolean) => {
          this.displayedColumns = this.setDisplayedColumns(isExperimental);
          this.dataSource.data = this.removeEnrollmentToAssets(
            this._shadowList,
            isExperimental
          );
        });
    }

    this.setFilters();
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
        list = await Promise.all(
          this._getRejectedOnly(
            isRejected,
            isAccepted,
            await this.iamService.claimsService.getClaimsByRequester({
              did: this.iamService.signerService.did,
              isAccepted,
            })
          ).map((item) =>
            this.publishRoleService.checkForNotSyncedOnChain(item)
          )
        );
      }

      if (list && list.length) {
        for (const item of list) {
          const arr = item.claimType.split(`.${NamespaceType.Role}.`);
          item.roleName = arr[0];
          item.requestDate = new Date(item.createdAt);
        }

        if (this.listType !== EnrolmentListType.ISSUER) {
          list = await this.publishRoleService.appendDidDocSyncStatus(list);
        }
      }
    } catch (e) {
      console.error(e);
      this.toastr.error(e, TOASTR_HEADER);
    }

    this._shadowList = list;
    const isExperimental = await this.store
      .select(SettingsSelectors.isExperimentalEnabled)
      .pipe(take<boolean>(1))
      .toPromise();
    this.dataSource.data = this.removeEnrollmentToAssets(
      this.filterByNamespace(
        this.filterByDid(this._shadowList, this.didFilterControl?.value),
        this.namespaceFilterControl?.value
      ),
      isExperimental
    );
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
    return !this.viewedByIssuer() && !element?.isSynced;
  }

  viewedByIssuer() {
    return this.listType === EnrolmentListType.ISSUER;
  }

  view(element: EnrolmentClaim) {
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
      .pipe(truthy(), takeUntil(this._subscription$))
      .subscribe(() => {
        this.getList(this.dynamicRejected, this.dynamicAccepted);
      });
  }

  addToDidDoc(element: EnrolmentClaim) {
    this.publishRoleService
      .addToDidDoc({
        issuedToken: element.issuedToken,
        registrationTypes: element.registrationTypes,
        claimType: element.claimType,
      })
      .pipe(truthy())
      .subscribe(async () => await this.getList(this.rejected, this.accepted));
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

  private setFilters() {
    const controls = [
      this.store.select(SettingsSelectors.isExperimentalEnabled),
      this.namespaceFilterControl
        ? this.namespaceFilterControl.valueChanges
        : of(''),
      this.didFilterControl ? this.didFilterControl.valueChanges : of(''),
    ];
    combineLatest(controls)
      .pipe(takeUntil(this._subscription$))
      .subscribe(
        ([isExperimental, namespace, did]: [boolean, string, string]) =>
          (this.dataSource.data = this.removeEnrollmentToAssets(
            this.filterByNamespace(
              this.filterByDid(this._shadowList, did),
              namespace
            ),
            isExperimental
          ))
      );
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

  private setDisplayedColumns(isExperimental: boolean) {
    if (isExperimental) {
      return [
        'requestDate',
        'roleName',
        'parentNamespace',
        'requester',
        'asset',
        'status',
        'actions',
      ];
    } else {
      return [
        'requestDate',
        'roleName',
        'parentNamespace',
        'requester',
        'status',
        'actions',
      ];
    }
  }

  private filterByDid(list: any[], value: string) {
    if (!value) {
      return list;
    }
    return list.filter(
      (item) => item.subject.includes(value) || item.requester.includes(value)
    );
  }

  private filterByNamespace(list: any[], value: string) {
    if (!value) {
      return list;
    }
    return list.filter((item) => item.namespace.includes(value));
  }

  private removeEnrollmentToAssets(
    list: any[],
    isExperimentalEnabled: boolean
  ) {
    if (isExperimentalEnabled) {
      return list;
    }
    return list.filter((item) => !this.isAsset(item));
  }
}
