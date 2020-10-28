import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatStepper } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
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
    Validators.minLength(3)]));

  public mySteps           = [];
  isProcessing             = false;

  constructor(private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private changeDetector : ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.namespace = this.data.namespace;
      this.type = this.data.type;
    }

  ngOnInit() { }

  private async confirm(confirmationMsg: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '180px',
      data: {
        header: TOASTR_HEADER,
        message: confirmationMsg
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.newOwnerAddress.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes. Do you wish to continue?')) {
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
        let req = {
          namespace: this.namespace,
          newOwner: this.newOwnerAddress.value,
          returnSteps: true
        };
        let items = undefined;
        switch (this.type) {
          case ListType.ORG:
            items = await this.iamService.iam.changeOrgOwnership(req);
            break;
          case ListType.APP:
            items = await this.iamService.iam.changeAppOwnership(req);
            break;
          case ListType.ROLE:
            items = await this.iamService.iam.changeRoleOwnership(req);
            break;
        }

        this.mySteps = items.reverse();
        this.newOwnerAddress.disable();
        this.isProcessing = true;
        this.changeDetector.detectChanges();
        this.spinner.hide();

        // Proceed
        this.proceedSteps(this.mySteps);
      }
      else {
        this.dialogRef.close(false);
      }
    }
  }

  private async proceedSteps(steps: any[]) {
    try {
      if (steps) {
        for (let index = 0; index < steps.length; index++) {
          let step = steps[index];
          console.log('Processing', step.info);

          // Process the next steap
          await step.next();
          this.toastr.info(step.info, `Transaction Success (${index + 1}/${steps.length})`);
  
          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        };
      }
    }
    catch (e) {
      console.error('New Role Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }
}
