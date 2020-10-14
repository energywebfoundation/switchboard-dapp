import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ENSNamespaceTypes, IAppDefinition, IRole } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';

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
  public enrolSuccess   = false;

  private appNamespace  : string;
  private appCallbackUrl: string;
  private selectedRole  : any;
  
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
        this.appNamespace = params.app;
        this.appCallbackUrl = params.returnUrl;

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
            this.appError = true;
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
    });
  }

  ngOnInit() {
    
  }

  private async initRoles() {
    // Change it later to GET NOT ENROLLED ROLES BY USER
    try {
      this.roleList = await this.iamService.iam.getRolesByNamespace({
        parentType: ENSNamespaceTypes.Application,
        namespace: this.appNamespace
      });

      if (this.roleList && this.roleList.length) {
        this.roleList = this.roleList[0].roles;
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
    this.enrolSuccess = false;
    this.selectedRole = undefined;

    this.roleTypeForm.reset();
    
    if (this.fieldList) {
      this.fieldList = [];
    }
    
    if (this.enrolmentForm) {
      this.enrolmentForm.reset();
    }
  }

  roleTypeSelected(e: any) {
    console.log('roleTypeSelected', e);
    if (e && e.value && e.value.definition && e.value.definition.fields) {
      this.fieldList = e.value.definition.fields;
      this.selectedRole = e.value.definition;

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
  }

  async submit() {
    if (this.enrolmentForm.valid) {
      if (this.selectedRole.issuer && this.selectedRole.issuer.did && this.selectedRole.issuer.did.length) {
        let claim = {
          fields: this.enrolmentForm.value,
          claimType: this.appNamespace
        };
        
        await this.iamService.iam.createClaimRequest({
          issuerDID: this.selectedRole.issuer.did[0],
          claim: claim
        });
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
