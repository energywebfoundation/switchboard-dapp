import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ExpiredRequestError } from '../../../shared/errors/errors';
import { IamRequestService } from '../../../shared/services/iam-request.service';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { DomainTypeEnum } from '../new-role/new-role.component';
import { DomainTypePipe } from '../../../shared/pipes/domain-type/domain-type.pipe';

@Component({
  selector: 'app-remove-org-app',
  templateUrl: './remove-org-app.component.html',
  styleUrls: ['./remove-org-app.component.scss'],
})
export class RemoveOrgAppComponent implements OnInit {
  private stepper: MatStepper;

  @ViewChild('stepper') set content(content: MatStepper) {
    if (content) {
      // initially setter gets called with undefined
      this.stepper = content;
    }
  }

  TOASTR_HEADER: string;

  listType: DomainTypeEnum;
  namespace: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  steps: any[];

  private _currentIdx = 0;

  constructor(
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService,
    private iamRequestService: IamRequestService,
    public dialogRef: MatDialogRef<RemoveOrgAppComponent>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.listType = data.listType;
    this.namespace = data.namespace;
    this.steps = data.steps;

    this.TOASTR_HEADER = `Remove ${new DomainTypePipe().transform(
      this.listType
    )}`;
  }

  async ngOnInit() {
    this._processSteps(0);
  }

  private async _processSteps(startIndex: number) {
    if (this.steps) {
      for (let index = startIndex; index < this.steps.length; index++) {
        this._currentIdx = index;
        const step = this.steps[index];

        // Process the next step
        try {
          await this.iamRequestService.enqueue(step.next);
          this.toastr.info(
            step.info,
            `Transaction Success (${index + 1}/${this.steps.length})`
          );

          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        } catch (e) {
          if (!(e instanceof ExpiredRequestError)) {
            console.error(this.TOASTR_HEADER, e);
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

  retry() {
    this._processSteps(this._currentIdx);
  }

  async closeDialog(isSuccess?: boolean) {
    if (!isSuccess) {
      this.dialogRef.close(false);
    } else {
      if (isSuccess) {
        this.toastr.success('Transaction completed.', this.TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
