import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ENSNamespaceTypes, IAppDefinition, IRole } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';

const SWAL = require('sweetalert');

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-request-claim',
  templateUrl: './request-claim.component.html',
  styleUrls: ['./request-claim.component.scss']
})
export class RequestClaimComponent implements OnInit {

  public enrolmentForm  : FormGroup;
  public roleTypeForm   : FormGroup;
  public fieldList      : {type: string, label: string, validation: string}[];
  
  public appDetails     : any;
  public roleList       : any;

  public submitting     = false;
  public appError       = false;

  private appNamespace  : string;
  private appCallbackUrl: string;
  private appDefaultRole: string;

  private selectedRole  : any;

  public bgColor        : Object = undefined;
  public txtColor       : Object = undefined;
  
  constructor(private fb: FormBuilder, 
      private activeRoute: ActivatedRoute,
      private iamService: IamService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService) { 
    
    this.roleTypeForm = fb.group({
      roleType: ''
    });
    
    this.activeRoute.queryParams.subscribe(async (params: any) => {
      if (params.app) {
        // URL Params
        this.setUrlParams(params);

        // Show loading and reset data
        this.spinner.show();
        this.resetData();
        
        try {
          // Get app definition
          this.appDetails = await this.iamService.iam.getDefinition({
            type: ENSNamespaceTypes.Application,
            namespace: this.appNamespace
          });

          console.log('appDetails', this.appDetails);

          if (this.appDetails) {
            // Initialize Roles
            await this.initRoles();
          }
          else {
            // Display Error
            this.displayAlert('Application Details cannot be retrieved.', 'error');
          }
        } 
        catch (e) {
          console.error(TOASTR_HEADER, e);
          this.toastr.error(e, TOASTR_HEADER);
        }
        finally {
          this.spinner.hide();
        }
      }
      else {
        console.error('Enrolment Param Error', params);
      }

      // Update Colors
      this.updateColors(params);
    });
  }

  private setUrlParams(params: any) {
    this.appNamespace = params.app;
    this.appCallbackUrl = params.returnUrl;
    this.appDefaultRole = params.roleName;
  }

  private updateColors(params: any) {
    if (this.appDetails && this.appDetails.others) {
      if (params.bgcolor) {
        this.bgColor = { 'background-color': `#${params.bgcolor}` };
      }
      else if (this.appDetails.others.bgcolor) {
        this.bgColor = { 'background-color': `#${this.appDetails.others.bgcolor}` };
      }

      if (params.txtcolor) {
        this.txtColor = { 'color': `#${params.txtColor}` };
      }
      else if (this.appDetails.others.txtcolor) {
        this.txtColor = { 'color': `#${this.appDetails.others.txtcolor}` };
      }
      else {
        this.txtColor = { 'color': 'white' };
      }
    }
  }

  private async displayAlert(text: string, icon: string) {
    let config = {
      title: TOASTR_HEADER,
      text: text,
      icon: icon,
      button: 'Back to Application',
      closeOnClickOutside: false
    };

    // Hide button if callback url is not available
    if (!this.appCallbackUrl) {
      delete config.button;
      config['buttons'] = false;
    }

    // Navigate to callback URL
    let result = await SWAL(config);
    if (result && this.appCallbackUrl) {
      location.href = this.appCallbackUrl;
    }
  }

  async ngOnInit() {
    // login
    await this.iamService.login();

    // Setup User Data
    await this.iamService.setupUser();
  }

  private async initRoles() {
    // Change it later to GET NOT ENROLLED ROLES BY USER
    try {
      this.roleList = await this.iamService.iam.getRolesByNamespace({
        parentType: ENSNamespaceTypes.Application,
        namespace: this.appNamespace
      });

      console.log('Role List', this.roleList);

      if (this.roleList && this.roleList.length) {

        // Set Default Selected
        if (this.appDefaultRole) {
          for (let i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i].name.toUpperCase() === this.appDefaultRole.toUpperCase()) {
              this.selectedRole = this.roleList[i].definition;
              this.fieldList = this.selectedRole.fields;
              this.updateForm();

              this.roleTypeForm.get('roleType').setValue(this.roleList[i]);
            }
          }
        }
      }
      
      console.log('this.roleList', this.roleList);
    }
    catch (e) {
      throw e;
    }
  }

  private resetData() {
    this.submitting = false;
    this.appError = false;
    this.selectedRole = undefined;

    this.roleTypeForm.reset();
    
    if (this.fieldList) {
      this.fieldList = [];
    }
    
    if (this.enrolmentForm) {
      this.enrolmentForm.reset();
    }
  }

  private updateForm() {
    let controls = [];
    for (let { type, label, validation} of this.fieldList) {
      let control = new FormControl();
      switch (type) {
        case 'text':
          break;
        case 'number':
          break;
        case 'date':
          break;
        case 'boolean':
          break;
      }

      // TODO: add validations

      // add control to array
      controls.push(control);
    }

    this.enrolmentForm = this.fb.group({
      fields: this.fb.array(controls)
    });

    console.log(this.enrolmentForm);
  }

  roleTypeSelected(e: any) {
    console.log('roleTypeSelected', e);
    if (e && e.value && e.value.definition && e.value.definition.fields) {
      this.fieldList = e.value.definition.fields;
      this.selectedRole = e.value.definition;

      this.updateForm();
    }
  }

  async submit() {
    if (this.enrolmentForm.valid) {
      if (this.selectedRole.issuer && this.selectedRole.issuer.did && this.selectedRole.issuer.did.length) {
        this.submitting = true;
        this.spinner.show();

        let success = true;

        try {
          // Check if user has already enrolled in this role

          // Construct Fields
          let fields = [];
          let values = this.enrolmentForm.value.fields;
          for (let i = 0; i < this.fieldList.length; i++) {
            fields.push({
              key: this.fieldList[i].label,
              value: values[i]
            });
          }

          // Submit
          let claim = {
            fields: JSON.parse(JSON.stringify(fields)),
            claimType: this.appNamespace
          };
          
          console.info('createClaimRequest', {
              issuerDID: this.selectedRole.issuer.did[0],
              claim: claim
          });

          await this.iamService.iam.createClaimRequest({
            issuerDID: this.selectedRole.issuer.did[0],
            claim: claim
          });
          
          success = true;
        }
        catch (e) {
          console.error('Enrolment Failed', e);
          this.toastr.error(e, TOASTR_HEADER);
          this.submitting = false;
        }
        finally {
          this.spinner.hide();
        }

        if (success) {
          this.displayAlert('Request to enrol as ' + this.roleTypeForm.value.roleType.name.toUpperCase() + ' is submitted for review and approval.',
            'success');
        } 
      }
      else {
        this.toastr.error('Cannot identify issuer for this role.', TOASTR_HEADER);
      }
    }
    else {
      this.toastr.error('Enrolment Form is invalid.', TOASTR_HEADER);
    }
  }
}
