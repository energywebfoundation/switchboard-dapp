import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper, MAT_DIALOG_DATA } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from '../../../../environments/environment'
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

export const ViewType = {
  UPDATE: 'update',
  NEW: 'new'
};

@Component({
  selector: 'app-new-organization',
  templateUrl: './new-organization.component.html',
  styleUrls: ['./new-organization.component.scss']
})
export class NewOrganizationComponent implements OnInit {
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  public orgForm: FormGroup;
  public environment = environment;
  public isChecking = false;
  public ENSPrefixes = ENSNamespaceTypes;
  public ViewType = ViewType;

  viewType: string;
  origData: any;

  private TOASTR_HEADER = 'Create New Organization';

  public constructor(
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewOrganizationComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.orgForm = fb.group({
      orgName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
      namespace: environment.orgNamespace,
      data: fb.group({
        organizationName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        logoUrl: ['', Validators.pattern('https?://.*')],
        websiteUrl: ['', Validators.pattern('https?://.*')],
        description: '',
        others: undefined
      })
    });

    if (data && data.viewType && data.origData) {
      this.viewType = data.viewType;
      this.origData = data.origData;

      if (this.viewType === ViewType.UPDATE) {
        this.TOASTR_HEADER = 'Update Organization';
      }

      this.initFormData();
    }
  }

  ngOnInit() {
  }

  private initFormData() {
    if (this.origData) {
      let def = this.origData.definition;
      let others = undefined;

      if (def.others) {
        let tmp: any[] = def.others;
        others = {};

        for (let item of tmp) {
          others[item.key] = item.value;
        }

        others = JSON.stringify(others);
      }

      this.orgForm.patchValue({
        orgName: this.origData.name,
        data: {
          organizationName: def.orgName,
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

  async createNewOrg() {
    this.spinner.show();
    this.isChecking = true;

    if (this.orgForm.valid) {
      let allowToProceed = true;

      // Check if org namespace is taken
      let orgData = this.orgForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.orgName}.${orgData.namespace}`
      });

      if (exists) {
        // If exists check if current user is the owner of this namespace and allow him/her to overwrite
        let isOwner = await this.iamService.iam.isOwner({
          domain: `${orgData.orgName}.${orgData.namespace}`
        });

        if (!isOwner) {
          allowToProceed = false;

          // Do not allow to overwrite if user is not the owner
          this.toastr.error('Organization namespace exists. You have no access rights to it.', this.TOASTR_HEADER);
        }
        else {
          this.spinner.hide();
          
          // Prompt if user wants to overwrite this namespace
          if (!await this.confirm('Organization namespace already exists. Do you wish to continue?')) {
            allowToProceed = false;
          }
          else {
            this.spinner.show();
          }
        }
      }

      if (allowToProceed) {
        this.allowToProceed(orgData);
      }
    }
    else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  async updateOrg() {
    this.spinner.show();
    this.isChecking = true;

    if (this.orgForm.valid) {
      let allowToProceed = true;
      let orgData = this.orgForm.value;

      // If exists check if current user is the owner of this namespace and allow him/her to overwrite
      let isOwner = await this.iamService.iam.isOwner({
        domain: `${orgData.orgName}.${orgData.namespace}`
      });

      if (!isOwner) {
        allowToProceed = false;

        // Do not allow to overwrite if user is not the owner
        this.toastr.error('You have no update rights to this namespace.', this.TOASTR_HEADER);
      }
      else {
        this.spinner.hide();
        
        // Prompt if user wants to overwrite this namespace
        if (!await this.confirm('You are updating details of this organization. Do you wish to continue?')) {
          allowToProceed = false;
        }
        else {
          this.spinner.show();
        }
      }

      if (allowToProceed) {
        this.allowToProceed(orgData);
      }
    }
    else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  private allowToProceed(orgData: any) {
    if (!orgData.data.others || !orgData.data.others.trim()) {
      // Let the user confirm the info before proceeding to the next step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    else {
      try {
        // Check if others is in JSON Format
        console.info(JSON.parse(orgData.data.others));

        // Let the user confirm the info before proceeding to the next step
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
      catch (e) {
        console.error(orgData.data.others, e);
        this.toastr.error('Others must be in JSON format.', this.TOASTR_HEADER);
      }
    }
  }

  async confirmOrg() {
    let req = { ...this.orgForm.value, returnSteps: true };
    req.data.orgName = req.data.organizationName;
    delete req.data.organizationName;

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

    console.info('myreq', req);

    // Set the first step to non-editable
    this.stepper.steps.first.editable = false;

    if (this.viewType === ViewType.UPDATE) {
      this.proceedUpdateStep(req);
    }
    else {
      this.proceedCreateSteps(req);
    }
  }

  private async proceedCreateSteps(req: any) {
    try {
      // Retrieve the steps to create an organization
      let steps = await this.iamService.iam.createOrganization(req);
      for (let index = 0; index < steps.length; index++) {
        let step = steps[index];
        console.log('Processing', step.info);
        
        // Show the next step
        this.stepper.selected.completed = true;
        this.stepper.next();

        // Process the next step
        await step.next();
        this.toastr.info(step.info, `Transaction Success (${index + 1}/${steps.length})`);
      }

      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    catch (e) {
      console.error('New Org Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  private async proceedUpdateStep(req: any) {
    try {
      // Update steps
      this.stepper.selected.completed = true;
      this.stepper.next();

      // Set Definition
      const newDomain = `${req.orgName}.${req.namespace}`;
      await this.iamService.iam.setRoleDefinition({
        data: req.data,
        domain: newDomain
      });

      // Move to Complete Step
      this.toastr.info('Set definition for organization', 'Transaction Success');
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    catch (e) {
      console.error('Update Org Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  cancelOrgDetails() {
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  private async confirm(confirmationMsg: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: this.TOASTR_HEADER,
        message: confirmationMsg
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.orgForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes. Do you wish to continue?')) {
        this.dialogRef.close(false);
      }
    }
    else {
      if (isSuccess) {
        if (this.origData) {
          this.toastr.success('Organization is successfully updated.', this.TOASTR_HEADER);
        }
        else {
          this.toastr.success('Organization is successfully created.', this.TOASTR_HEADER);
        }
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
