import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ENSNamespaceTypes, IAppDefinition, IRole } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService, LoginType } from 'src/app/shared/services/iam.service';
import { ConnectToWalletDialogComponent } from '../connect-to-wallet-dialog/connect-to-wallet-dialog.component';

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
  private selectedNamespace: string;

  public bgColor        : Object = undefined;
  public txtColor       : Object = undefined;
  public btnColor       : Object = {};
  public listColor      : Object = {};
  public txtboxColor    : Object = {};

  public isLoggedIn     = false;


  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.isLoggedIn) {
      // Always logout if user refreshes this screen or closes this tab
      this.iamService.logout();
    }
  }
  
  constructor(private fb: FormBuilder, 
      private route: Router,
      private activeRoute: ActivatedRoute,
      private iamService: IamService,
      private toastr: ToastrService,
      public dialog: MatDialog,
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
            // Check Login Status
            this.initLoginUser(this.appDetails.appName);

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
    if (this.appDetails) {
      let others = undefined;

      // re-construct others
      if (this.appDetails.others) {
        others = {};
        for (let item of this.appDetails.others) {
          others[item.key] = item.value;
        }
      }

      if (params.bgcolor) {
        this.bgColor = { 'background-color': `#${params.bgcolor}` };
        this.listColor['background-color'] = `#${params.bgcolor}`;
      }
      else if (others && others.bgcolor) {
        this.bgColor = { 'background-color': `#${others.bgcolor}` };
        this.listColor['background-color'] = `#${others.bgcolor}`;
      }

      if (params.btncolor) {
        this.btnColor['background-color'] = `#${params.btncolor}`;
        this.txtboxColor['color'] = `#${params.btncolor}`;
      }
      else if (others && others.btncolor) {
        this.btnColor['background-color'] = `#${others.btncolor}`;
        this.txtboxColor['color'] = `#${others.btncolor}`;
      }

      if (params.txtcolor) {
        this.txtColor = { 'color': `#${params.txtcolor}` };
        this.listColor['color'] = `#${params.txtcolor}`;
        this.btnColor['color'] = `#${params.txtcolor}`;
      }
      else if (others && others.txtcolor) {
        this.txtColor = { 'color': `#${others.txtcolor}` };
        this.listColor['color'] = `#${others.txtcolor}`;
        this.btnColor['color'] = `#${others.txtcolor}`;
      }
      else {
        this.txtColor = { 'color': 'white' };
        this.listColor['color'] = 'white';
        this.btnColor['color'] = 'white';
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
      // delete config.button;
      // config['buttons'] = false;
      config.button = 'View My Enrolments'
    }

    // Navigate to callback URL
    let result = await SWAL(config);
    if (result) {
      if (this.appCallbackUrl) {
        // Logout
        this.iamService.logout();

        // Redirect to Callback URL
        location.href = this.appCallbackUrl;
      }
      else {
        // Navigate to My Enrolments Page
        this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/enrolment?notif=myEnrolments' }});
      }
    }
  }

  ngOnInit() {}

  private async initLoginUser(appName: string) {
    let loginStatus = this.iamService.getLoginStatus();

    // Check Login
    if (loginStatus) {
      console.log(loginStatus);
      if (loginStatus === LoginType.LOCAL) {
        console.log('local > login');

        // Set metamask extension options if connecting with metamask extension
        let useMetamaskExtension = undefined;
        if (window.localStorage.getItem('METAMASK_EXT_CONNECTED')) {
          useMetamaskExtension = true;
        }

        // Proceed Login
        await this.iamService.login(useMetamaskExtension);

        // Setup User Data
        await this.iamService.setupUser();
      }
    }
    else {
      // Launch Login Dialog
      await this.dialog.open(ConnectToWalletDialogComponent, {
        width: '500px',
        data: {
          appName: appName
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().toPromise();

      // Set Loggedin Flag to true
      this.isLoggedIn = true;
    }
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
              this.selectedNamespace = this.roleList[i].namespace;
              this.fieldList = this.selectedRole.fields || [];
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
    this.selectedNamespace = undefined;

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
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

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
            claimType: this.selectedNamespace
          };
          
          console.info('createClaimRequest', {
            issuer: this.selectedRole.issuer.did,
            claim: claim
          });

          await this.iamService.iam.createClaimRequest({
            issuer: this.selectedRole.issuer.did,
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

  logout() {
    this.iamService.logout();
    let $navigate = setTimeout(() => {
        clearTimeout($navigate);
        location.reload();
    }, 100);
  }
}
