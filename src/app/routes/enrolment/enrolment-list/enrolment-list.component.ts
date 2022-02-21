/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClaimData, NamespaceType, RegistrationTypes } from 'iam-client-lib';
import { take, takeUntil } from 'rxjs/operators';
import { combineLatest, of, Subject } from 'rxjs';
import { CancelButton } from '../../../layout/loading/loading.component';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { NotificationService } from '../../../shared/services/notification.service';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewRequestsComponent } from '../view-requests/view-requests.component';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { truthy } from '@operators';
import { Store } from '@ngrx/store';
import { SettingsSelectors } from '@state';

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
    private notifService: NotificationService,
    private store: Store
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
          ).map((item) => this.checkForNotSyncedOnChain(item))
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

  async checkForNotSyncedOnChain(item) {
    if (item.registrationTypes.includes(RegistrationTypes.OnChain)) {
      return {
        ...item,
        notSyncedOnChain: !(await this.iamService.claimsService.hasOnChainRole(
          this.iamService.signerService.did,
          item.claimType,
          parseInt(item.claimTypeVersion.toString(), 10)
        )),
      };
    }
    return item;
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
    return (
      !this.viewedByIssuer() &&
      !this.isSynced(element) &&
      this.isOffChain(element) &&
      !this.isOnlyOnChain(element)
    );
  }

  viewedByIssuer() {
    return this.listType === EnrolmentListType.ISSUER;
  }

  isOnlyOnChain(element) {
    return (
      element.registrationTypes.length === 1 &&
      element.registrationTypes.includes(RegistrationTypes.OnChain)
    );
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
      .pipe(truthy(), takeUntil(this._subscription$))
      .subscribe(() => {
        this.getList(this.dynamicRejected, this.dynamicAccepted);
      });
  }

  async addToDidDoc(element: any) {
    this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData>(
        ConfirmationDialogComponent,
        {
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
        }
      )
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => this.syncClaimToDidDoc(element));
  }

  async addToClaimManager(element: any) {
    this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData>(
        ConfirmationDialogComponent,
        {
          width: '600px',
          maxHeight: 'auto',
          data: {
            header: 'Sync to Claim Manager',
            svgIcon: 'add-to-claimmanager-icon',
            message:
              'It is necessary to register your role on-chain in order to make it available to verifying smart contracts. However, please note that this will make your role data permanently public.',
          },
          maxWidth: '100%',
          disableClose: true,
        }
      )
      .afterClosed()
      .pipe(truthy())
      .subscribe(() => this.syncToClaimManager(element));
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

  private async appendDidDocSyncStatus(list: any[]) {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const did =
      this.listType === EnrolmentListType.ASSET
        ? { did: this.subject }
        : undefined;
    const claims: ClaimData[] = (
      await this.iamService.claimsService.getUserClaims(did)
    ).filter((item: ClaimData) => {
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
        claim: {
          token: element.issuedToken,
        },
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
      this.toastr.error(e?.message, 'Sync to DID Document');
    }

    this.loadingService.hide();
  }

  private async syncToClaimManager(element: any) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );

    console.log(element);
    try {
      await this.iamService.claimsService.registerOnchain(element);

      this.toastr.success('Action is successful.', 'Sync to Claim Manager');
      await this.getList(this.rejected, this.accepted);
    } catch (e) {
      console.error(e);
      this.toastr.error(e?.message, 'Sync to Claim Manager');
    }

    this.loadingService.hide();
  }

  private setDisplayedColumns(isExperimental) {
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
