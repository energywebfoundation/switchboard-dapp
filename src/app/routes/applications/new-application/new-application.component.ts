import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper } from '@angular/material';
import { ENSNamespaceTypes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

const TOASTR_HEADER = 'Create New Application';

@Component({
  selector: 'app-new-application',
  templateUrl: './new-application.component.html',
  styleUrls: ['./new-application.component.scss']
})
export class NewApplicationComponent implements OnInit {
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  public appForm: FormGroup;
  public environment = environment;
  public isChecking = false;
  public ENSPrefixes = ENSNamespaceTypes;
  
  constructor(private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewApplicationComponent>,
    public dialog: MatDialog) { 
      this.appForm = fb.group({
        orgNamespace: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        appName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        namespace: '',
        data: fb.group({
          applicationName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
          logoUrl: ['', Validators.pattern('https?://.*')],
          websiteUrl: ['', Validators.pattern('https?://.*')],
          description: '',
          others: ''
        })
      });
    }

  ngOnInit() {
  }

  alphaNumericOnly(event: any, includeDot?: boolean) {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // Check if key is alphanumeric key
    if ((charCode > 96 && charCode < 123) || (charCode > 47 && charCode < 58) || (includeDot && charCode === 46)) {
      return true;
    }

    return false;
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

            if (isOwner) {
              this.stepper.selected.editable = false;
              this.stepper.selected.completed = true;
              this.stepper.next();
            }
            else {
              this.toastr.error('You are not authorized to create an application in this organization.', TOASTR_HEADER);
            }
          }
          else {
            this.toastr.error('Application subdomain in this organization does not exist.', TOASTR_HEADER);
          }
        }
        else {
          this.toastr.error('Organization namespace does not exist.', TOASTR_HEADER);
        }
      }
      catch (e) {
        this.toastr.error(e.message, 'System Error');
      } 
      finally {
        this.isChecking = false;
        this.spinner.hide();
      }
    }
  }

  backToOrg() {
    this.stepper.steps.first.editable = true;
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  cancelAppDetails() {
    // Set the second step to editable
    let list = this.stepper.steps.toArray();
    list[1].editable = true;

    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  async createNewApp() {
    this.spinner.show();
    this.isChecking = true;

    if (this.appForm.valid) {
      // Check if app namespace is taken
      let orgData = this.appForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.appName}.${this.ENSPrefixes.Application}.${orgData.orgNamespace}`
      });

      if (exists) {
        // Do not allow to proceed if app namespace already exists
        this.toastr.error('Application namespace already exists.', TOASTR_HEADER);
      }
      else {
        if (!orgData.data.others || !orgData.data.others.trim()) {
          // Let the user confirm the info before proceeding to the next step
          this.stepper.selected.editable = false;
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
        else {
          try {
            // Check if others is in JSON Format
            console.info(JSON.parse(orgData.data.others));

            // Let the user confirm the info before proceeding to the next step
            this.stepper.selected.editable = false;
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

  async confirmApp() {
    let req = { ...this.appForm.value, returnSteps: true };

    req.namespace = `${this.ENSPrefixes.Application}.${req.orgNamespace}`;
    delete req.orgNamespace;

    req.data.appName = req.data.applicationName;
    delete req.data.applicationName;

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

    // Set the second step to non-editable
    let list = this.stepper.steps.toArray();
    list[1].editable = false;

    try {
      // Retrieve the steps to create an application
      let steps = await this.iamService.iam.createApplication(req);
      for (let index = 0; index < steps.length; index++) {
        let step = steps[index];
        console.log('Processing', step.info);
        
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

  closeDialog(isSuccess?: boolean) {
    if (this.appForm.touched && !isSuccess) {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '180px',
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
        this.toastr.success('Application is successfully created.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
