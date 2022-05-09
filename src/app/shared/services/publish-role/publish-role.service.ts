import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim.interface';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../routes/widgets/confirmation-dialog/confirmation-dialog.component';
import { truthy } from '@operators';
import { MatDialog } from '@angular/material/dialog';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../loading.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { NotificationService } from '../notification.service';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';
import {
  Claim,
  ClaimData,
  NamespaceType,
  RegistrationTypes,
} from 'iam-client-lib';

@Injectable({
  providedIn: 'root',
})
export class PublishRoleService {
  constructor(
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private toastr: SwitchboardToastrService,
    private notifService: NotificationService,
    private claimsFacade: ClaimsFacadeService
  ) {}

  addToDidDoc(element: {
    issuedToken: string;
    registrationTypes: RegistrationTypes[];
    claimType: string;
    claimTypeVersion: string;
  }) {
    return this.openConfirmationDialog({
      header: 'Publish credential to my DID document',
      svgIcon: 'sync-did-icon',
      message:
        'It is currently necessary to publish the credential to your DID document in order to make it available. However, please note that this will make your role data public and permanent.',
    }).pipe(switchMap(() => this.syncClaimToDidDoc(element)));
  }

  addToClaimManager(element: EnrolmentClaim) {
    return this.openConfirmationDialog({
      header: 'Sync to Claim Manager',
      svgIcon: 'add-to-claimmanager-icon',
      message:
        'It is necessary to register your role on-chain in order to make it available to verifying smart contracts. However, please note that this will make your role data permanently public.',
    }).pipe(switchMap(() => this.syncToClaimManager(element)));
  }

  async checkForNotSyncedOnChain(item) {
    if (item.registrationTypes.includes(RegistrationTypes.OnChain)) {
      return {
        ...item,
        notSyncedOnChain: !(await this.claimsFacade.hasOnChainRole(
          item.claimType,
          parseInt(item.claimTypeVersion.toString(), 10)
        )),
      };
    }
    return item;
  }

  public async appendDidDocSyncStatus(
    list: Claim[],
    did?: string
  ): Promise<(Claim & { isSynced: boolean })[]> {
    // Get Approved Claims in DID Doc & Idenitfy Only Role-related Claims
    const claims: ClaimData[] = (await this.claimsFacade.getUserClaims(did))
      .filter((item) => item && item.claimType)
      .filter((item: ClaimData) => {
        const arr = item.claimType.split('.');
        return arr.length > 1 && arr[1] === NamespaceType.Role;
      });

    return list.map((item) => {
      return {
        ...item,
        isSynced: claims.some((claim) => claim.claimType === item.claimType),
      };
    });
  }

  async getNotSyncedDIDsDocsList() {
    return (
      await this.appendDidDocSyncStatus(
        await this.claimsFacade.getClaimsByRequester(true)
      )
    ).filter((item) => !item?.isSynced);
  }

  private openConfirmationDialog(data: {
    header: string;
    svgIcon: string;
    message: string;
  }) {
    return this.dialog
      .open<ConfirmationDialogComponent, ConfirmationDialogData>(
        ConfirmationDialogComponent,
        {
          width: '600px',
          maxHeight: 'auto',
          data,
          maxWidth: '100%',
          disableClose: true,
        }
      )
      .afterClosed()
      .pipe(truthy());
  }

  private async syncClaimToDidDoc(element: {
    issuedToken: string;
    registrationTypes: RegistrationTypes[];
    claimType: string;
    claimTypeVersion: string;
  }) {
    const isRegisteredOnChain = await this.checkForNotSyncedOnChain(element);
    const { notSyncedOnChain } = isRegisteredOnChain;
    // If the element is already synced on chain, only off-chain registration is needed:
    const registrationTypes = notSyncedOnChain
      ? element.registrationTypes
      : [RegistrationTypes.OffChain];
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    return this.claimsFacade
      .publishPublicClaim({
        registrationTypes: registrationTypes,
        claim: {
          token: element.issuedToken,
          claimType: element.claimType,
        },
      })
      .pipe(
        map((retVal) => {
            console.log(retVal, "THE RET VAL@@@@")
          if (retVal) {
            this.notifService.decreasePendingDidDocSyncCount();
            this.toastr.success('Action is successful.', 'Publish');
          } else {
            this.toastr.warning(
              'Unable to proceed with this action. Please contact system administrator.',
              'Publish'
            );
          }
          return Boolean(retVal);
        }),
        catchError((err) => {
          console.error(err);
          this.toastr.error(err?.message, 'Sync to DID Document');
          return of(err);
        }),
        finalize(() => this.loadingService.hide())
      );
  }

  private syncToClaimManager(element) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    return this.claimsFacade.registerOnchain(element).pipe(
      map(() => {
        this.toastr.success('Action is successful.', 'Sync to Claim Manager');
        return true;
      }),
      catchError((err) => {
        console.error(err);
        this.toastr.error(err?.message, 'Sync to Claim Manager');
        return of(err);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}
