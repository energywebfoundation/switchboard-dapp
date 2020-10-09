import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper } from '@angular/material';
import { ENSPrefixes } from 'iam-client-lib';
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
  public ENSPrefixes = ENSPrefixes;

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
        others: ''
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
      // Check if org namespace is taken
      let orgData = this.orgForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.orgName}.${orgData.namespace}`
      });

      if (exists) {
        // Do not allow to proceed if org namespace already exists
        this.toastr.error('Organization namespace already exists.', TOASTR_HEADER);
      }
      else {
        // Let the user confirm the info before proceeding to the next step
        this.stepper.selected.completed = true;
        this.stepper.next();
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
    req.data = JSON.stringify(req.data);
    console.log('req', req);

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

  closeDialog(isSuccess?: boolean) {
    if (this.orgForm.touched) {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          header: TOASTR_HEADER,
          message: 'There are unsaved changes. Do you wish to continue?'
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().subscribe((exit: any) => {
        if (exit) {
          this.dialogRef.close(false);
        }
      });
    }
    else {
      if (isSuccess) {
        this.toastr.success('Organization is successfully created.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
