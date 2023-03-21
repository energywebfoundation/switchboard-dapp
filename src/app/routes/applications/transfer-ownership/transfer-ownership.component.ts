import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ExpiredRequestError } from '../../../shared/errors/errors';
import { IamRequestService } from '../../../shared/services/iam-request.service';
import { IamService } from '../../../shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { CancelButton } from '../../../layout/loading/loading.component';
import { LoadingService } from '../../../shared/services/loading.service';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialog as MatDialog,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subject } from 'rxjs';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { extractAddress } from '../../../utils/functions/extract-address/extract-address';

const TOASTR_HEADER = 'Transfer Ownership';

const ListType = {
  ORG: 'org',
  APP: 'app',
  ROLE: 'role',
};

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss'],
})
export class TransferOwnershipComponent implements OnDestroy {
  destroy$ = new Subject();

  private stepper: MatStepper;

  @ViewChild('stepper') set content(content: MatStepper) {
    if (content) {
      // initially setter gets called with undefined
      this.stepper = content;
    }
  }

  namespace = '';
  assetDid = '';
  type: string;

  didValid: boolean;
  newOwnerDID: string;

  public mySteps = [];
  isProcessing = false;

  private _currentIdx = 0;

  constructor(
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private iamRequestService: IamRequestService,
    private loadingService: LoadingService,
    private changeDetector: ChangeDetectorRef,
    public dialogRef: MatDialogRef<TransferOwnershipComponent>,
    public dialog: MatDialog,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.namespace = this.data.namespace;
    this.type = this.data.type;
    this.assetDid = this.data.assetDid;
  }

  didChangeHandler(e) {
    if (e.valid) {
      this.newOwnerDID = e.did;
    }
    this.didValid = e.valid;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  private async confirm(confirmationMsg: string, showDiscardButton?: boolean) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: TOASTR_HEADER,
          message: confirmationMsg,
          isDiscardButton: showDiscardButton,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.didValid && !isSuccess) {
      if (
        await this.confirm(
          'There are unsaved changes. Do you wish to continue?',
          true
        )
      ) {
        this.dialogRef.close(false);
      }
    } else {
      if (isSuccess) {
        this.toastr.success('Transfer ownership completed.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }

  async submit() {
    if (this.newOwnerDID === this.iamService.signerService.did) {
      this.toastr.error('You cannot transfer to your own DID.', TOASTR_HEADER);
    } else if (this.didValid) {
      if (this.namespace) {
        await this._transferOrgAppRole();
      } else if (this.assetDid) {
        await this._transferAsset();
      } else {
        this.toastr.error('Invalid action.', TOASTR_HEADER);
      }
    }
  }

  private async _transferOrgAppRole() {
    if (
      await this.confirm(
        'You will no longer be the owner of this namespace. Do you wish to continue?'
      )
    ) {
      this.loadingService.show();
      const returnSteps =
        this.iamService.signerService.address === this.data.owner;
      const req = {
        namespace: this.namespace,
        newOwner: extractAddress(this.newOwnerDID),
        returnSteps,
      };

      let call;
      try {
        switch (this.type) {
          case ListType.ORG:
            call = this.iamService.domainsService.changeOrgOwnership(req);
            break;
          case ListType.APP:
            call = this.iamService.domainsService.changeAppOwnership(req);
            break;
          case ListType.ROLE:
            call = this.iamService.domainsService.changeRoleOwnership(req);
            break;
        }
        this.mySteps = returnSteps
          ? await call
          : [
              {
                info: 'Confirm transaction in your safe wallet',
                next: async () => await call,
              },
            ];

        this.isProcessing = true;
        this.changeDetector.detectChanges();
        this.loadingService.hide();

        // Proceed
        this.proceedSteps(0);
      } catch (e) {
        console.error(e);
        this.loadingService.hide();
        this.toastr.error(
          e.message || 'Please contact system administrator.',
          TOASTR_HEADER
        );
      }
    } else {
      this.dialogRef.close(false);
    }
  }

  private async _transferAsset() {
    if (
      await this.confirm(
        'You will no longer be the owner of this asset. Do you wish to continue?'
      )
    ) {
      this.loadingService.show(
        'Please confirm this transaction in your connected wallet.',
        CancelButton.ENABLED
      );

      try {
        await this.iamService.assetsService.offerAsset({
          assetDID: this.assetDid,
          offerTo: extractAddress(this.newOwnerDID),
        });
        this.dialogRef.close(true);
      } catch (e) {
        console.error(e);
        this.toastr.error(
          e.message || 'Please contact system administrator.',
          TOASTR_HEADER
        );
      } finally {
        this.loadingService.hide();
      }
    } else {
      this.dialogRef.close(false);
    }
  }

  retry() {
    this.proceedSteps(this._currentIdx);
  }

  private async proceedSteps(startIndex: number) {
    const steps = this.mySteps;
    if (steps) {
      for (let index = startIndex; index < steps.length; index++) {
        this._currentIdx = index;
        const step = steps[index];

        // Process the next step
        try {
          await this.iamRequestService.enqueue(step.next);
          this.toastr.info(
            step.info,
            `Transaction Success (${index + 1}/${steps.length})`
          );

          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        } catch (e) {
          if (!(e instanceof ExpiredRequestError)) {
            console.error('Transfer Ownership Error', e);
            this.toastr.error(
              e.message || 'Please contact system administrator.',
              'System Error'
            );
          }
          break;
        }
      }
    }
  }
}
