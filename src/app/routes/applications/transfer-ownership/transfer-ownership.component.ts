import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ExpiredRequestError } from 'src/app/shared/errors/errors';
import { IamRequestService } from 'src/app/shared/services/iam-request.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { NewApplicationComponent } from '../new-application/new-application.component';

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
export class TransferOwnershipComponent implements OnInit {
  private stepper: MatStepper;
  @ViewChild('stepper', { static: false }) set content(content: MatStepper) {
    if(content) { // initially setter gets called with undefined
        this.stepper = content;
    }
  }

  namespace       = '';
  type            : string;

  newOwnerAddress = new FormControl('', Validators.compose([Validators.required, 
    Validators.maxLength(256),
    this.iamService.isValidEthAddress]));

  public mySteps           = [];
  isProcessing             = false;

  private _currentIdx = 0;

  constructor(private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private iamRequestService: IamRequestService,
    private changeDetector : ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
      private configService: ConfigService) {
      this.namespace = this.data.namespace;
      this.type = this.data.type;
    }

  ngOnInit() { }

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
    if (this.newOwnerAddress.valid) {
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
            console.error('New Role Error', e);
            this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
          }
          break;
        }
      };
    }
  }
}
