import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper, MAT_DIALOG_DATA } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewType } from '../new-organization/new-organization.component';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss']
})
export class NewApplicationComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  public appForm: FormGroup;
  public environment = environment;
  public isChecking = false;
  private _isLogoUrlValid = true;
  public ENSPrefixes = ENSNamespaceTypes;
  public ViewType = ViewType;

  viewType: string;
  origData: any;

  private TOASTR_HEADER = 'Create New Application';
  
  constructor(private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.appForm = fb.group({
        orgNamespace: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        appName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        namespace: '',
        data: fb.group({
          applicationName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
          logoUrl: ['', Validators.pattern('https?://.*')],
          websiteUrl: ['', Validators.pattern('https?://.*')],
          description: '',
          others: ['', this.iamService.isValidJsonFormat]
        })
      });

      if (data && data.viewType) {
        // console.log('origData', this.origData);
        this.viewType = data.viewType;
        
  
        if (this.viewType === ViewType.UPDATE && data.origData) {
          this.origData = data.origData;
          this.TOASTR_HEADER = 'Update Application';
        }
        else if (this.viewType === ViewType.NEW && data.organizationNamespace) {
          this.appForm.patchValue({ orgNamespace: data.organizationNamespace });
        }
  
        this.initFormData();
      }
    }

  async ngAfterViewInit() {
    await this.confirmOrgNamespace();
  }

  ngOnInit() {
  }

  private initFormData() {
    if (this.origData) {
      let def = this.origData.definition;
      let others = undefined;

      // Construct Others
      if (def.others) {
        let tmp: any[] = def.others;
        others = {};

        for (let item of tmp) {
          others[item.key] = item.value;
        }

        others = JSON.stringify(others);
      }

      // Construct Organization
      let arr = this.origData.namespace.split(ENSNamespaceTypes.Application);

      this.appForm.patchValue({
        orgNamespace: arr[1].substring(1),
        appName: this.origData.name,
        data: {
          applicationName: def.appName,
          logoUrl: def.logoUrl,
          websiteUrl: def.websiteUrl,
          description: def.description,
          others: others
        }
      });
    }
  }

  alphaNumericOnly(event: any) {
    return this.iamService.isAlphaNumericOnly(event);
  }

  async confirmOrgNamespace() {
    if (this.appForm.value.orgNamespace) {
      try {
        this.spinner.show();
        this.isChecking = true;
        
        // Check if organization namespace exists
        let exists = await this.iamService.iam.checkExistenceOfDomain({
          domain: this.appForm.value.orgNamespace
        });
        
        if (exists) {
          // Check if application sub-domain exists in this organization
          exists = await this.iamService.iam.checkExistenceOfDomain({
            domain: `${this.ENSPrefixes.Application}.${this.appForm.value.orgNamespace}`
          });

          if (exists) {
            // check if user is authorized to create an app under the application namespace
            let isOwner = await this.iamService.iam.isOwner({
              domain: this.appForm.value.orgNamespace
            });

            if (!isOwner) {
              this.toastr.error('You are not authorized to create an application in this organization.', this.TOASTR_HEADER);
              this.dialog.closeAll();
            }
          }
          else {
            this.toastr.error('Application subdomain in this organization does not exist.', this.TOASTR_HEADER);
            this.dialog.closeAll();
          }
        }
        else {
          this.toastr.error('Organization namespace does not exist.', this.TOASTR_HEADER);
          this.dialog.closeAll();
        }
      }
      catch (e) {
        this.toastr.error(e.message, 'System Error');
        this.dialog.closeAll();
      } 
      finally {
        this.isChecking = false;
        this.spinner.hide();
      }
    }
    else {
      this.toastr.error('Organization Namespace is missing.', this.TOASTR_HEADER);
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
    let list = this.stepper.steps.toArray();
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
      let orgData = this.appForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`
      });

      if (exists) {
        // If exists check if current user is the owner of this namespace and allow him/her to overwrite
        let isOwner = await this.iamService.iam.isOwner({
          domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`
        });

        if (!isOwner) {
          allowToProceed = false;

          // Do not allow to proceed if app namespace already exists
          this.toastr.error('Application namespace already exists. You have no access rights to it.', this.TOASTR_HEADER);
        }
        else {
          this.spinner.hide();
          
          // Prompt if user wants to overwrite this namespace
          if (!await this.confirm('Application namespace already exists. Do you wish to continue?')) {
            allowToProceed = false;
          }
          else {
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
        }
        else {
          try {
            // Check if others is in JSON Format
            // console.info(JSON.parse(orgData.data.others));

            // Let the user confirm the info before proceeding to the next step
            this.stepper.selected.editable = false;
            this.stepper.selected.completed = true;
            this.stepper.next();
          }
          catch (e) {
            console.error(orgData.data.others, e);
            this.toastr.error('Others must be in JSON format.', this.TOASTR_HEADER);
          }
        }
      }
    }
    else {
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
      let orgData = this.appForm.value;

      // Check if current user is the owner of this namespace and allow him/her to overwrite
      let isOwner = await this.iamService.iam.isOwner({
        domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`
      });

      if (!isOwner) {
        allowToProceed = false;

        // Do not allow to proceed if app namespace already exists
        this.toastr.error('You have no update rights to this namespace.', this.TOASTR_HEADER);
      }
      else {
        this.spinner.hide();
        
        // Prompt if user wants to overwrite this namespace
        if (!await this.confirm('You are updating details of this application. Do you wish to continue?')) {
          allowToProceed = false;
        }
        else {
          this.spinner.show();
        }
      }

      if (allowToProceed) {
        if (!orgData.data.others || !orgData.data.others.trim()) {
          // Let the user confirm the info before proceeding to the next step
          this.stepper.selected.editable = false;
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
        else {
          try {
            // Check if others is in JSON Format
            // console.info(JSON.parse(orgData.data.others));

            // Let the user confirm the info before proceeding to the next step
            this.stepper.selected.editable = false;
            this.stepper.selected.completed = true;
            this.stepper.next();
          }
          catch (e) {
            console.error(orgData.data.others, e);
            this.toastr.error('Others must be in JSON format.', this.TOASTR_HEADER);
          }
        }
      }
    }
    else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  async confirmApp() {
    let req = { ...this.appForm.value, returnSteps: true };

    req.namespace = `${this.ENSPrefixes.Application}.${req.orgNamespace}`;
    delete req.orgNamespace;

    req.data.appName = req.data.applicationName;
    delete req.data.applicationName;

    // Check if logoUrl resolves
    if (req.data.logoUrl && !this._isLogoUrlValid) {
      this.toastr.error('Logo URL cannot be resolved. Please change it to a correct and valid image URL.', this.TOASTR_HEADER);
      return;
    }

    // Make sure others is in correct JSON Format
    if (req.data.others && req.data.others.trim()) {
      try {
        req.data.others = JSON.parse(req.data.others);
      }
      catch (e) {
        this.toastr.error('Others must be in JSON format.', this.TOASTR_HEADER);
        return;
      }
    }
    else {
      delete req.data.others;
    }

    // console.info('myreq', req);

    // Set the second step to non-editable
    let list = this.stepper.steps.toArray();
    list[1].editable = false;

    if (this.viewType === ViewType.UPDATE) {
      this.proceedUpdateStep(req);
    }
    else {
      this.proceedCreateSteps(req);
    }
  }

  private async proceedCreateSteps(req: any) {
    try {
      // Retrieve the steps to create an application
      let steps = await this.iamService.iam.createApplication(req);
      for (let index = 0; index < steps.length; index++) {
        let step = steps[index];
        // console.log('Processing', step.info);
        
        // Show the next step
        this.stepper.selected.completed = true;
        this.stepper.next();

        // Process the next steap
        await step.next();
        this.toastr.info(step.info, `Transaction Success (${index + 1}/${steps.length})`);
      }

      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    catch (e) {
      console.error('New App Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  private async proceedUpdateStep(req: any) {
    try {
      // Update steps
      this.stepper.selected.completed = true;
      this.stepper.next();

      // Set Definition
      const newDomain = `${req.appName}.${req.namespace}`;
      await this.iamService.iam.setRoleDefinition({
        data: req.data,
        domain: newDomain
      });

      // Move to Complete Step
      this.toastr.info('Set definition for application', 'Transaction Success');
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    catch (e) {
      console.error('Update App Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  private async confirm(confirmationMsg: string, isDiscardButton?: boolean) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: this.TOASTR_HEADER,
        message: confirmationMsg,
        isDiscardButton: isDiscardButton
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.appForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes.', true)) {
        this.dialogRef.close(false);
      }
    }
    else {
      if (isSuccess) {
        if (this.origData) {
          this.toastr.success('Application is successfully updated.', this.TOASTR_HEADER);
        }
        else {
          this.toastr.success('Application is successfully created.', this.TOASTR_HEADER);
        }
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
