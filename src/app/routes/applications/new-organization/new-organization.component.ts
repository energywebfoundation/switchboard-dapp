import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from '../../../../environments/environment'
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

const TOASTR_HEADER = 'Create New Organization';

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

  public constructor(
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewOrganizationComponent>,
    public dialog: MatDialog
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
  }

  ngOnInit() {
  }

  alphaNumericOnly(event: any) {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // Check if key is alphanumeric key
    if ((charCode > 96 && charCode < 123) || (charCode > 47 && charCode < 58)) {
      return true;
    }

    return false;
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
          this.toastr.error('Organization namespace exists. You have no access rights to it.', TOASTR_HEADER);
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
            this.toastr.error('Others must be in JSON format.', TOASTR_HEADER);
          }
        }
      }
    }
    else {
      this.toastr.error('Form is invalid.', TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
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
        this.toastr.error('Others must be in JSON format.', TOASTR_HEADER);
        return;
      }
    }
    else {
      delete req.data.others;
    }

    console.info('myreq', req);

    // Set the first step to non-editable
    this.stepper.steps.first.editable = false;

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

  cancelOrgDetails() {
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

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
    if (this.orgForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes. Do you wish to continue?')) {
        this.dialogRef.close(false);
      }
    }
    else {
      if (isSuccess) {
        this.toastr.success('Organization is successfully created.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
