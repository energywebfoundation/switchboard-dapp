/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NamespaceType } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { IamService } from '../../../shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewType } from '../new-organization/new-organization.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { isAlphanumericValidator, isValidJsonFormatValidator } from '@utils';
import { CreationBaseAbstract } from '../utils/creation-base.abstract';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss'],
})
export class NewApplicationComponent
  extends CreationBaseAbstract
  implements OnInit, AfterViewInit
{
  private stepper: MatStepper;

  @ViewChild('stepper') set content(content: MatStepper) {
    if (content) {
      this.stepper = content;
    }
  }

  public appForm = this.fb.group({
    orgNamespace: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
      ]),
    ],
    appName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
        isAlphanumericValidator,
      ],
    ],
    namespace: '',
    data: this.fb.group({
      applicationName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(256),
        ]),
      ],
      logoUrl: ['', Validators.pattern('https?://.*')],
      websiteUrl: ['', Validators.pattern('https?://.*')],
      description: '',
      others: ['', isValidJsonFormatValidator],
    }),
  });
  public isChecking = false;
  private _isLogoUrlValid = true;
  public ENSPrefixes = NamespaceType;
  public ViewType = ViewType;

  viewType: string = ViewType.NEW;
  origData: any;

  private TOASTR_HEADER = 'Create New Application';

  public txs: any[];
  private _retryCount = 0;
  private _currentIdx = 0;
  private _requests = {};

  constructor(
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    if (data && data.viewType) {
      this.viewType = data.viewType;

      if (this.viewType === ViewType.UPDATE && data.origData) {
        this.origData = data.origData;
        this.TOASTR_HEADER = 'Update Application';
      } else if (this.viewType === ViewType.NEW && data.organizationNamespace) {
        this.appForm.patchValue({ orgNamespace: data.organizationNamespace });
      }
    }
  }

  async ngAfterViewInit() {
    await this.confirmOrgNamespace();
  }

  ngOnInit() {
    this.initFormData();
  }

  private initFormData() {
    if (this.origData) {
      const def = this.origData.definition;
      let others;

      // Construct Others
      if (def.others) {
        others = JSON.stringify(def.others);
      }

      // Construct Organization
      const arr = this.origData.namespace.split(NamespaceType.Application);

      this.appForm.patchValue({
        orgNamespace: arr[1].substring(1),
        appName: this.origData.name,
        data: {
          applicationName: def.appName,
          logoUrl: def.logoUrl,
          websiteUrl: def.websiteUrl,
          description: def.description,
          others,
        },
      });
    }
  }

  async confirmOrgNamespace() {
    if (this.appForm.value.orgNamespace) {
      try {
        this.spinner.show();
        this.isChecking = true;

        // Check if organization namespace exists
        let exists =
          await this.iamService.domainsService.checkExistenceOfDomain({
            domain: this.appForm.value.orgNamespace,
          });

        if (exists) {
          // Check if application sub-domain exists in this organization
          exists = await this.iamService.domainsService.checkExistenceOfDomain({
            domain: `${this.ENSPrefixes.Application}.${this.appForm.value.orgNamespace}`,
          });

          if (exists) {
            // check if user is authorized to create an app under the application namespace
            const isOwner = await this.iamService.domainsService.isOwner({
              domain: this.appForm.value.orgNamespace,
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
        this.isChecking = false;
        this.spinner.hide();
      }
    } else {
      this.toastr.error(
        'Organization Namespace is missing.',
        this.TOASTR_HEADER
      );
      this.dialog.closeAll();
    }
  }

  backToOrg() {
    this.stepper.steps.first.editable = true;
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  logoUrlError() {
    this._isLogoUrlValid = false;
  }

  logoUrlSuccess() {
    this._isLogoUrlValid = true;
  }

  cancelAppDetails() {
    // Set the second step to editable
    const list = this.stepper.steps.toArray();
    list[0].editable = true;

    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  async createNewApp() {
    this.spinner.show();
    this.isChecking = true;

    if (this.appForm.valid) {
      let allowToProceed = true;

      // Check if app namespace is taken
      const orgData = this.appForm.value;
      const exists =
        await this.iamService.domainsService.checkExistenceOfDomain({
          domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`,
        });

      if (exists) {
        // If exists check if current user is the owner of this namespace and allow him/her to overwrite
        const isOwner = await this.iamService.domainsService.isOwner({
          domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`,
        });

        if (!isOwner) {
          allowToProceed = false;

          // Do not allow to proceed if app namespace already exists
          this.toastr.error(
            'Application namespace already exists. You have no access rights to it.',
            this.TOASTR_HEADER
          );
        } else {
          this.spinner.hide();

          // Prompt if user wants to overwrite this namespace
          if (
            !(await this.confirm(
              'Application namespace already exists. Do you wish to continue?'
            ))
          ) {
            allowToProceed = false;
          } else {
            this.spinner.show();
          }
        }
      }

      if (allowToProceed) {
        if (!orgData.data.others || !orgData.data.others.trim()) {
          // Let the user confirm the info before proceeding to the next step
          this.stepper.selected.editable = false;
          this.stepper.selected.completed = true;
          this.stepper.next();
        } else {
          try {
            // Check if others is in JSON Format
            // console.info(JSON.parse(orgData.data.others));

            // Let the user confirm the info before proceeding to the next step
            this.stepper.selected.editable = false;
            this.stepper.selected.completed = true;
            this.stepper.next();
          } catch (e) {
            console.error(orgData.data.others, e);
            this.toastr.error(
              'Others must be in JSON format.',
              this.TOASTR_HEADER
            );
          }
        }
      }
    } else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  async updateApp() {
    this.spinner.show();
    this.isChecking = true;

    if (this.appForm.valid) {
      let allowToProceed = true;
      const orgData = this.appForm.value;

      // Check if current user is the owner of this namespace and allow him/her to overwrite
      const isOwner = await this.iamService.domainsService.isOwner({
        domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`,
      });

      if (!isOwner) {
        allowToProceed = false;

        // Do not allow to proceed if app namespace already exists
        this.toastr.error(
          'You have no update rights to this namespace.',
          this.TOASTR_HEADER
        );
      } else {
        this.spinner.hide();

        // Prompt if user wants to overwrite this namespace
        if (
          !(await this.confirm(
            'You are updating details of this application. Do you wish to continue?'
          ))
        ) {
          allowToProceed = false;
        } else {
          this.spinner.show();
        }
      }

      if (allowToProceed) {
        if (!orgData.data.others || !orgData.data.others.trim()) {
          // Let the user confirm the info before proceeding to the next step
          this.stepper.selected.editable = false;
          this.stepper.selected.completed = true;
          this.stepper.next();
        } else {
          try {
            // Check if others is in JSON Format
            // console.info(JSON.parse(orgData.data.others));

            // Let the user confirm the info before proceeding to the next step
            this.stepper.selected.editable = false;
            this.stepper.selected.completed = true;
            this.stepper.next();
          } catch (e) {
            console.error(orgData.data.others, e);
            this.toastr.error(
              'Others must be in JSON format.',
              this.TOASTR_HEADER
            );
          }
        }
      }
    } else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  async confirmApp(skipNextStep?: boolean) {
    const req = JSON.parse(
      JSON.stringify({ ...this.appForm.value, returnSteps: true })
    );

    req.namespace = `${this.ENSPrefixes.Application}.${req.orgNamespace}`;
    delete req.orgNamespace;

    req.data.appName = req.data.applicationName;
    delete req.data.applicationName;

    // Check if logoUrl resolves
    if (req.data.logoUrl && !this._isLogoUrlValid) {
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

    // console.info('myreq', req);

    if (!skipNextStep) {
      // Set the second step to non-editable
      const list = this.stepper.steps.toArray();
      list[1].editable = false;
    }

    if (this.viewType === ViewType.UPDATE) {
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

  private async proceedCreateSteps(req: any) {
    const returnSteps =
      this.data.owner === this.iamService.signerService.address;
    req = { ...req, returnSteps };
    try {
      const call = this.iamService.domainsService.createApplication(req);
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
    if (this.viewType !== ViewType.UPDATE) {
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

      // Set Definition
      const newDomain = `${req.appName}.${req.namespace}`;
      this.txs = [
        {
          info: 'Setting up definitions',
          next: async () =>
            await this.iamService.domainsService.setRoleDefinition({
              data: req.data,
              domain: newDomain,
            }),
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

  async closeDialog(isSuccess?: boolean) {
    if (this.appForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes.', true)) {
        this.dialogRef.close(false);
      }
    } else {
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
  }
}
