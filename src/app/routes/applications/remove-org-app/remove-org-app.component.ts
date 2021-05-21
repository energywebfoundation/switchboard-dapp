import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { ExpiredRequestError } from 'src/app/shared/errors/errors';
import { IamRequestService } from 'src/app/shared/services/iam-request.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-remove-org-app',
  templateUrl: './remove-org-app.component.html',
  styleUrls: ['./remove-org-app.component.scss']
})
export class RemoveOrgAppComponent implements OnInit {
  private stepper: MatStepper;
  @ViewChild('stepper') set content(content: MatStepper) {
    if(content) { // initially setter gets called with undefined
        this.stepper = content;
    }
  }
  
  TOASTR_HEADER: string;
  ListType = ListType;

  listType: string;
  namespace: string;
  steps: any[];

  private _currentIdx = 0;

  constructor(
    private iamService: IamService,
    private toastr: ToastrService,
    private loadingService: LoadingService,
    private iamRequestService: IamRequestService,
    public dialogRef: MatDialogRef<RemoveOrgAppComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.listType = data.listType;
    this.namespace = data.namespace;
    this.steps = data.steps;

    if (this.listType === ListType.ORG) {
      this.TOASTR_HEADER = 'Remove Organization'
    } else if (this.listType === ListType.APP) {
      this.TOASTR_HEADER = 'Remove Application';
    }
  }

  async ngOnInit() {
    this._processSteps(0);
  }

  private async _processSteps(startIndex: number) {
    if (this.steps) {
      for (let index = startIndex; index < this.steps.length; index++) {
        this._currentIdx = index;
        let step = this.steps[index];

        // Process the next step
        try {
          await this.iamRequestService.enqueue(step.next);
          this.toastr.info(step.info, `Transaction Success (${index + 1}/${this.steps.length})`);

          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
        catch (e) {
          if (!(e instanceof ExpiredRequestError)) {
            console.error(this.TOASTR_HEADER, e);
            this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
          }
          break;
        }
      };
    }
  }

  retry() {
    this._processSteps(this._currentIdx);
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
