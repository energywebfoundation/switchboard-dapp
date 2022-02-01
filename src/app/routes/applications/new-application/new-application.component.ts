/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NamespaceType } from 'iam-client-lib';
import { IamService } from '../../../shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { CreationBaseAbstract } from '../utils/creation-base.abstract';
import {
  AppCreationDefinition,
  AppDomain,
  ViewType,
} from './models/app-domain';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss'],
})
export class NewApplicationComponent
  extends CreationBaseAbstract
  implements AfterViewInit
{
  private stepper: MatStepper;

  @ViewChild('stepper') set content(content: MatStepper) {
    if (content) {
      this.stepper = content;
    }
  }

  public isLogoUrlValid = true;

  get origData() {
    return this.data;
  }
  applicationData: AppCreationDefinition;

  private TOASTR_HEADER = 'Create New Application';

  public txs: any[];
  private _retryCount = 0;
  private _currentIdx = 0;
  private _requests = {};

  constructor(
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private loadingService: LoadingService,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AppDomain & { viewType: ViewType }
  ) {
    super();
    this.prepareOriginalData();
  }

  private prepareOriginalData() {
    if (this.data && this.data.viewType && this.isUpdating) {
      this.TOASTR_HEADER = 'Update Application';
    }
  }

  get namespace(): string {
    return this.applicationData.domain;
  }

  get isUpdating() {
    return this.data.viewType === ViewType.Update;
  }

  async ngAfterViewInit() {
    await this.confirmOrgNamespace();
  }

  async confirmOrgNamespace() {
    if (this.origData.orgNamespace) {
      try {
        this.loadingService.show();

        // Check if organization namespace exists
        let exists =
          await this.iamService.domainsService.checkExistenceOfDomain({
            domain: this.origData.orgNamespace,
          });

        if (exists) {
          // Check if application sub-domain exists in this organization
          exists = await this.iamService.domainsService.checkExistenceOfDomain({
            domain: `${NamespaceType.Application}.${this.origData.orgNamespace}`,
          });

          if (exists) {
            // check if user is authorized to create an app under the application namespace
            const isOwner = await this.iamService.domainsService.isOwner({
              domain: this.origData.orgNamespace,
            });

            if (!isOwner) {
              this.toastr.error(
                'You are not authorized to create an application in this organization.',
                this.TOASTR_HEADER
              );
              this.dialog.closeAll();
            }
          } else {
            this.toastr.error(
              'Application subdomain in this organization does not exist.',
              this.TOASTR_HEADER
            );
            this.dialog.closeAll();
          }
        } else {
          this.toastr.error(
            'Organization namespace does not exist.',
            this.TOASTR_HEADER
          );
          this.dialog.closeAll();
        }
      } catch (e) {
        this.toastr.error(e.message, 'System Error');
        this.dialog.closeAll();
      } finally {
        this.loadingService.hide();
      }
    } else {
      this.toastr.error(
        'Organization Namespace is missing.',
        this.TOASTR_HEADER
      );
      this.dialog.closeAll();
    }
  }

  cancelAppDetails() {
    // Set the second step to editable
    const list = this.stepper.steps.toArray();
    list[0].editable = true;

    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  async createNewApp(data: AppCreationDefinition) {
    this.loadingService.show();
    this.applicationData = data;

    let allowToProceed = true;

    // Check if app namespace is taken
    const exists = await this.iamService.domainsService.checkExistenceOfDomain({
      domain: data.domain,
    });

    if (exists) {
      // If exists check if current user is the owner of this namespace and allow him/her to overwrite
      const isOwner = await this.iamService.domainsService.isOwner({
        domain: data.domain,
      });

      if (!isOwner) {
        allowToProceed = false;

        // Do not allow to proceed if app namespace already exists
        this.toastr.error(
          'Application namespace already exists. You have no access rights to it.',
          this.TOASTR_HEADER
        );
      } else {
        this.loadingService.hide();

        // Prompt if user wants to overwrite this namespace
        if (
          !(await this.confirm(
            'Application namespace already exists. Do you wish to continue?'
          ))
        ) {
          allowToProceed = false;
        } else {
          this.loadingService.show();
        }
      }
    }

    if (allowToProceed) {
      this.goNextStep();
    }

    this.loadingService.hide();
  }

  async updateApp(data: AppCreationDefinition) {
    this.applicationData = data;
    this.loadingService.show();

    let allowToProceed = true;

    // Check if current user is the owner of this namespace and allow him/her to overwrite
    const isOwner = await this.iamService.domainsService.isOwner({
      domain: data.domain,
    });

    if (!isOwner) {
      allowToProceed = false;

      // Do not allow to proceed if app namespace already exists
      this.toastr.error(
        'You have no update rights to this namespace.',
        this.TOASTR_HEADER
      );
    } else {
      this.loadingService.hide();

      // Prompt if user wants to overwrite this namespace
      if (
        !(await this.confirm(
          'You are updating details of this application. Do you wish to continue?'
        ))
      ) {
        allowToProceed = false;
      } else {
        this.loadingService.show();
      }
    }

    if (allowToProceed) {
      this.goNextStep();
    }

    this.loadingService.hide();
  }

  async confirmApp(skipNextStep?: boolean) {
    const req = JSON.parse(
      JSON.stringify({ ...this.applicationData, returnSteps: true })
    );

    req.namespace = `${NamespaceType.Application}.${req.orgNamespace}`;
    delete req.orgNamespace;

    // Check if logoUrl resolves
    if (req.data.logoUrl && !this.isLogoUrlValid) {
      this.toastr.error(
        'Logo URL cannot be resolved. Please change it to a correct and valid image URL.',
        this.TOASTR_HEADER
      );
      return;
    }

    // Make sure others is in correct JSON Format
    if (req.data.others && req.data.others.trim()) {
      try {
        req.data.others = JSON.parse(req.data.others);
      } catch (e) {
        this.toastr.error('Others must be in JSON format.', this.TOASTR_HEADER);
        return;
      }
    } else {
      delete req.data.others;
    }

    if (!skipNextStep) {
      // Set the second step to non-editable
      const list = this.stepper.steps.toArray();
      list[1].editable = false;
    }

    if (this.isUpdating) {
      this.proceedUpdateStep(req, skipNextStep);
    } else {
      this.proceedCreateSteps(req);
    }
  }

  private async next(requestIdx: number, skipNextStep?: boolean) {
    const steps = this._requests[`${requestIdx}`];

    if (steps && steps.length) {
      const step = steps[0];

      if (!skipNextStep) {
        // Show the next step
        this.stepper.selected.completed = true;
        this.stepper.next();
      }

      // Process the next step
      await step.next();

      // Make sure that the current step is not retried
      if (this._requests[`${requestIdx}`]) {
        this._currentIdx++;
        this.toastr.info(
          step.info,
          `Transaction Success (${this._currentIdx}/${this.txs.length})`
        );

        // Remove 1st element
        steps.shift();

        // Process
        await this.next(requestIdx);
      }
    } else if (this._requests['0']) {
      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }

  private async proceedCreateSteps(
    req: AppCreationDefinition & { namespace: string }
  ) {
    const returnSteps =
      this.origData.owner === this.iamService.signerService.address;
    try {
      const call = this.iamService.domainsService.createApplication({
        ...req,
        appName: req.name,
        returnSteps,
      });
      // Retrieve the steps to create an organization
      this.txs = returnSteps
        ? await call
        : [
            {
              info: 'Confirm transaction in your safe wallet',
              next: async () => await call,
            },
          ];
      // Retrieve the steps to create an application
      this._requests[`${this._retryCount}`] = [...this.txs];

      // Process
      await this.next(0);
    } catch (e) {
      console.error('New App Error', e);
      this.toastr.error(
        e.message || 'Please contact system administrator.',
        'System Error'
      );
    }
  }

  async retry() {
    if (!this.isUpdating) {
      // Copy pending steps
      this._requests[`${this._retryCount + 1}`] = [
        ...this._requests[`${this._retryCount}`],
      ];

      // Remove previous request
      delete this._requests[`${this._retryCount}`];
      const retryCount = ++this._retryCount;

      try {
        // Process
        await this.next(retryCount, true);

        if (this._requests[retryCount]) {
          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      } catch (e) {
        console.error('New App Error', e);
        this.toastr.error(
          e.message || 'Please contact system administrator.',
          'System Error'
        );
      }
    } else {
      delete this._requests[`${this._retryCount++}`];
      await this.confirmApp(true);
    }
  }

  private async proceedUpdateStep(req: any, skipNextStep?: boolean) {
    try {
      const retryCount = this._retryCount;
      if (!skipNextStep) {
        // Update steps
        this.stepper.selected.completed = true;
        this.stepper.next();
      }

      const definition = {
        data: req.data,
        domain: req.domain,
      };
      this.txs = [
        {
          info: 'Setting up definitions',
          next: async () =>
            await this.iamService.domainsService.setRoleDefinition(definition),
        },
      ];

      this._requests[`${retryCount}`] = [...this.txs];

      // Process
      await this.next(retryCount, skipNextStep);

      // Make sure that all steps are not yet complete
      if (this.stepper.selectedIndex !== 3 && retryCount === this._retryCount) {
        // Move to Complete Step
        this.toastr.info(
          'Set definition for application',
          'Transaction Success'
        );
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
    } catch (e) {
      console.error('Update App Error', e);
      this.toastr.error(
        e.message || 'Please contact system administrator.',
        'System Error'
      );
    }
  }

  private async confirm(confirmationMsg: string, isDiscardButton?: boolean) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: this.TOASTR_HEADER,
          message: confirmationMsg,
          isDiscardButton,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .toPromise();
  }

  update(data: AppCreationDefinition): void {
    if (this.isUpdating) {
      this.updateApp(data);
    } else {
      this.createNewApp(data);
    }
  }

  async closeDialog2(value: boolean) {
    if (value) {
      if (await this.confirm('There are unsaved changes.', true)) {
        this.dialogRef.close(false);
      }
    }
  }

  async closeDialog(isSuccess?: boolean) {
    if (isSuccess) {
      if (this.origData) {
        this.toastr.success(
          'Application is successfully updated.',
          this.TOASTR_HEADER
        );
      } else {
        this.toastr.success(
          'Application is successfully created.',
          this.TOASTR_HEADER
        );
      }
    }
    this.dialogRef.close(isSuccess);
  }

  private goNextStep() {
    this.stepper.selected.editable = false;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }
}
