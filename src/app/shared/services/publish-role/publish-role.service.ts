import { Injectable } from '@angular/core';
import { EnrolmentClaim } from '../../../routes/enrolment/models/enrolment-claim';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../routes/widgets/confirmation-dialog/confirmation-dialog.component';
import { truthy } from '@operators';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../loading.service';
import { SwitchboardToastrService } from '../switchboard-toastr.service';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClaimsFacadeService } from '../claims-facade/claims-facade.service';
import { RegistrationTypes } from 'iam-client-lib';
import { Store } from '@ngrx/store';
import { UserClaimActions } from '@state';

@Injectable({
  providedIn: 'root',
})
export class PublishRoleService {
  constructor(
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private toastr: SwitchboardToastrService,
    private claimsFacade: ClaimsFacadeService,
    private store: Store
  ) {}

  addToDidDoc(element: EnrolmentClaim) {
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

  private syncClaimToDidDoc(element: EnrolmentClaim) {
    this.loadingService.show(
      'Please confirm this transaction in your connected wallet.',
      CancelButton.ENABLED
    );
    const registrationTypes = element.isSyncedOnChain
      ? [RegistrationTypes.OffChain]
      : element.registrationTypes;

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
          if (retVal) {
            this.toastr.success('Action is successful.', 'Publish');
            this.store.dispatch(UserClaimActions.loadUserClaims());
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
