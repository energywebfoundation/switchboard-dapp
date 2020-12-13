import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatStepper, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-remove-org-app',
  templateUrl: './remove-org-app.component.html',
  styleUrls: ['./remove-org-app.component.scss']
})
export class RemoveOrgAppComponent implements OnInit {
  private stepper: MatStepper;
  @ViewChild('stepper', { static: false }) set content(content: MatStepper) {
    if(content) { // initially setter gets called with undefined
        this.stepper = content;
    }
  }
  
  TOASTR_HEADER: string;
  ListType = ListType;

  listType: string;
  namespace: string;
  steps: any[];

  constructor(
    private iamService: IamService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<RemoveOrgAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    // console.log(data);
    this.listType = data.listType;
    this.namespace = data.namespace;
    this.steps = data.steps;

    if (this.listType === ListType.ORG) {
      this.TOASTR_HEADER = 'Remove Organization'
    }
    else if (this.listType === ListType.APP) {
      this.TOASTR_HEADER = 'Remove Application';
    }
  }

  async ngOnInit() {
    try {
      if (this.steps) {
        for (let index = 0; index < this.steps.length; index++) {
          let step = this.steps[index];
          // console.log('Processing', step.info);

          // Process the next steap
          await step.next();
          this.toastr.info(step.info, `Transaction Success (${index + 1}/${this.steps.length})`);
  
          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        };
      }
    }
    catch (e) {
      console.error(this.TOASTR_HEADER, e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  async closeDialog(isSuccess?: boolean) {
    if (!isSuccess) {
      this.dialogRef.close(false);
    }
    else {
      if (isSuccess) {
        this.toastr.success('Transaction completed.', this.TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
