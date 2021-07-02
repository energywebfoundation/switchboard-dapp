import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ExpiredRequestError } from 'src/app/shared/errors/errors';
import { IamRequestService } from 'src/app/shared/services/iam-request.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { NewApplicationComponent } from '../new-application/new-application.component';
import { CancelButton } from 'src/app/layout/loading/loading.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';

const TOASTR_HEADER = 'Transfer Ownership';

const ListType = {
  ORG: 'org',
  APP: 'app',
  ROLE: 'role'
};

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  isShowingDIDDropDown = false;


  private stepper: MatStepper;
  @ViewChild('stepper') set content(content: MatStepper) {
    if(content) { // initially setter gets called with undefined
        this.stepper = content;
    }
  }

  namespace       = '';
  assetDid        = '';
  type            : string;

  newOwnerModifiedAddress = new FormControl('');
  newOwnerAddress = new FormControl('');
  prefixDropDown = new FormControl('did:ethr:');

  public mySteps           = [];
  isProcessing             = false;

  private _currentIdx = 0;

  ethAddrPattern = '^0x[A-Fa-f0-9]{40}';
  DIDPattern = `^did:ethr:[a-z0-9]+:(${this.ethAddrPattern})$`;

  constructor(private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private spinner: NgxSpinnerService,
    private iamRequestService: IamRequestService,
    private loadingService: LoadingService,
    private changeDetector : ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
      private configService: ConfigService) {
      this.namespace = this.data.namespace;
      this.type = this.data.type;
      this.assetDid = this.data.assetDid;
    }

  ngOnInit() {
    if (this.namespace) {
      this.newOwnerAddress.setValidators(Validators.compose([Validators.required,
        Validators.maxLength(256),
        this.iamService.isValidEthAddress]));
    }
    else {
      this.newOwnerAddress.setValidators(Validators.compose([Validators.required,
        Validators.maxLength(256),
        this.iamService.isValidDid]));
    }
    this.setValidatorsToModAddress();
    this.checkModAddressChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setValidatorsToModAddress(): void {
    this.newOwnerModifiedAddress.setValidators(Validators.compose([Validators.required,
      Validators.maxLength(256),
      this.iamService.isValidEthAddress]));
  }

  private checkModAddressChanges(): void {
    this.newOwnerModifiedAddress.valueChanges
        .pipe(takeUntil(this.destroy$),
            distinctUntilChanged((prev, curr) => prev === curr))
        .subscribe((result) => {
          this.changeNewOwnerAddressValue(result);
        });
  }

  changeNewOwnerAddressValue(result: string): void {
    // TODO      temporary removal of logic with different types DiD
    // if (result.match(this.ethAddrPattern) && !result.match(this.DIDPattern)) {
    //   this.isShowingDIDDropDown = true;
    //   this.newOwnerAddress.patchValue(this.prefixDropDown.value + result);
    // } else {
    //   this.isShowingDIDDropDown = false;
    //   this.newOwnerAddress.patchValue(result);
    // }
    // TODO end!

      this.isShowingDIDDropDown = false;
      this.newOwnerAddress.patchValue(result);
  }

  private async confirm(confirmationMsg: string, showDiscardButton?: boolean) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: TOASTR_HEADER,
        message: confirmationMsg,
        isDiscardButton: showDiscardButton
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.newOwnerAddress.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes. Do you wish to continue?', true)) {
        this.dialogRef.close(false);
      }
    }
    else {
      if (isSuccess) {
        this.toastr.success('Transfer ownership completed.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }

  async submit() {
    if (this.newOwnerAddress.value === this.iamService.iam.getDid()) {
      this.toastr.error('You cannot transfer to your own DID.', TOASTR_HEADER);
    } else if (this.newOwnerAddress.valid) {
      if (this.namespace) {
        await this._transferOrgAppRole();
      }
      else if (this.assetDid) {
        await this._transferAsset();
      }
      else {
        this.toastr.error('Invalid action.', TOASTR_HEADER);
      }
    }
  }

  private async _transferOrgAppRole() {
    if (await this.confirm('You will no longer be the owner of this namespace. Do you wish to continue?')) {
      this.spinner.show();
      const returnSteps = this.iamService.iam.address === this.data.owner ? true : false;
      let req = {
        namespace: this.namespace,
        newOwner: this.newOwnerAddress.value,
        returnSteps
      };

      let call;
      try {
        switch (this.type) {
          case ListType.ORG:
            call = this.iamService.iam.changeOrgOwnership(req);
            break;
          case ListType.APP:
            call = this.iamService.iam.changeAppOwnership(req);
            break;
          case ListType.ROLE:
            call = this.iamService.iam.changeRoleOwnership(req);
            break;
        }
        this.mySteps = returnSteps ?
          await call :
          [{
            info: "Confirm transaction in your safe wallet",
            next: async () => await call
          }]

        this.newOwnerAddress.disable();
        this.isProcessing = true;
        this.changeDetector.detectChanges();
        this.spinner.hide();

        // Proceed
        this.proceedSteps(0);
      }
      catch (e) {
        console.error(e);
        this.spinner.hide();
        this.toastr.error(e.message || 'Please contact system administrator.', TOASTR_HEADER);
      }
    }
    else {
      this.dialogRef.close(false);
    }
  }

  private async _transferAsset() {
    if (await this.confirm('You will no longer be the owner of this asset. Do you wish to continue?')) {
      this.loadingService.show('Please confirm this transaction in your connected wallet.', CancelButton.ENABLED);

      try {
        await this.iamService.iam.offerAsset({
          assetDID: this.assetDid,
          offerTo: this.newOwnerAddress.value
        });
        this.dialogRef.close(true);
      }
      catch (e) {
        console.error(e);
        this.toastr.error(e.message || 'Please contact system administrator.', TOASTR_HEADER);
      }
      finally {
        this.loadingService.hide();
      }
    }
    else {
      this.dialogRef.close(false);
    }
  }

  retry() {
    this.proceedSteps(this._currentIdx);
  }

  private async proceedSteps(startIndex: number) {
    let steps = this.mySteps;
    if (steps) {
      for (let index = startIndex; index < steps.length; index++) {
        this._currentIdx = index;
        let step = steps[index];

        // Process the next step
        try {
          await this.iamRequestService.enqueue(step.next);
          this.toastr.info(step.info, `Transaction Success (${index + 1}/${steps.length})`);

          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
        catch (e) {
          if (!(e instanceof ExpiredRequestError)) {
            console.error('Transfer Ownership Error', e);
            this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
          }
          break;
        }
      };
    }
  }
}
