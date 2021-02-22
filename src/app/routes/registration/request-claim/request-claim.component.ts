import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ENSNamespaceTypes, WalletProvider } from 'iam-client-lib';
import { ToastrService } from 'ngx-toastr';
import { IamService, LoginType } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RoleType } from '../../applications/new-role/new-role.component';
import { ConnectToWalletDialogComponent } from '../connect-to-wallet-dialog/connect-to-wallet-dialog.component';

const SWAL = require('sweetalert');

const TOASTR_HEADER = 'Enrolment';

@Component({
  selector: 'app-request-claim',
  templateUrl: './request-claim.component.html',
  styleUrls: ['./request-claim.component.scss']
})
export class RequestClaimComponent implements OnInit {

  public RoleType       = RoleType;
  public enrolmentForm  : FormGroup;
  public roleTypeForm   : FormGroup;
  public fieldList      : {type: string, label: string, validation: string}[];
  
  public orgAppDetails  : any;
  public roleList       : any;

  public submitting     = false;
  public appError       = false;

  private namespace  : string;
  private callbackUrl: string;
  private defaultRole: string;

  private roleType      : string;
  private selectedRole  : any;
  private selectedNamespace: string;

  public bgColor        : Object = undefined;
  public txtColor       : Object = undefined;
  public btnColor       : Object = {};
  public listColor      : Object = {};
  public txtboxColor    : Object = {};

  public isLoggedIn     = false;
  private stayLoggedIn  = false;

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.isLoggedIn && !this.stayLoggedIn) {
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
      private loadingService: LoadingService) { 
    
    this.roleTypeForm = fb.group({
      roleType: ''
    });
  }

  private setUrlParams(params: any) {
    this.namespace = params.app || params.org;
    this.defaultRole = params.roleName;
  }

  private updateColors(params: any) {
    if (this.orgAppDetails) {
      let others = undefined;

      // re-construct others
      if (this.orgAppDetails.others) {
        others = {};
        for (let item of this.orgAppDetails.others) {
          others[item.key] = item.value;
        }
      }

      this.callbackUrl = params.returnUrl || (others ? others.returnUrl : undefined);

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
      button: this.roleType === RoleType.APP ? 'Back to Application' : 'Back',
      closeOnClickOutside: false
    };

    // Hide button if callback url is not available
    if (!this.callbackUrl) {
      if (this.iamService.iam.isSessionActive()) {
        config.button = 'View My Enrolments';
      }
      else {
        // No Buttons
        delete config.button;
        config['buttons'] = false;
      }
    }

    // Navigate to callback URL
    let result = await SWAL(config);
    if (result) {
      if (this.callbackUrl && !this.stayLoggedIn) {
        // Logout
        this.iamService.logout();

        // Redirect to Callback URL
        location.href = this.callbackUrl;
      }
      else {
        // Navigate to My Enrolments Page
        this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/enrolment?notif=myEnrolments' }});
      }
    }
  }

  async ngOnInit() {
    this.activeRoute.queryParams.subscribe(async (params: any) => {
      this.loadingService.show();
      this.stayLoggedIn = params.stayLoggedIn;

      // Check Login Status
      await this.initLoginUser();

      if (params.app || params.org) {
        // Check if namespace is correct
        if (!this.isCorrectNamespace(params)) {
          this.loadingService.hide();
          this.displayAlert('Namespace provided is incorrect.', 'error');
          return;
        }

        // Set Role Type
        this.roleType = params.app ? RoleType.APP : RoleType.ORG;

        // URL Params
        this.setUrlParams(params);

        // Show loading and reset data
        this.resetData();
        
        try {
          // Get org/app definition
          this.orgAppDetails = await this.iamService.iam.getDefinition({
            type: this.roleType === RoleType.APP ? ENSNamespaceTypes.Application : ENSNamespaceTypes.Organization,
            namespace: this.namespace
          });

          if (this.orgAppDetails) {
            // Update Colors
            this.updateColors(params);

            // Initialize Roles
            await this.initRoles();
          }
          else {
            // Display Error
            if (this.roleType === RoleType.APP) {
              this.displayAlert('Application Details cannot be retrieved.', 'error');
            }
            else {
              this.displayAlert('Organization Details cannot be retrieved.', 'error');
            }
          }
        } 
        catch (e) {
          console.error(TOASTR_HEADER, e);
          this.toastr.error(e, TOASTR_HEADER);
        }
      }
      else {
        console.error('Enrolment Param Error', params);
        this.displayAlert('URL is invalid.', 'error');
      }
      this.loadingService.hide();
    });
  }

  private isCorrectNamespace(params: any) {
    let retVal = false;

    if (params.app && 
      params.app.includes(`.${ENSNamespaceTypes.Application}.`) && 
      !params.app.includes(`.${ENSNamespaceTypes.Roles}.`)) {
        retVal = true;
    }
    else if (params.org && 
      !params.org.includes(`.${ENSNamespaceTypes.Application}.`) && 
      !params.org.includes(`.${ENSNamespaceTypes.Roles}.`)) {
        retVal = true;
    }

    return retVal;
  }

  private async initLoginUser() {
    // Check Login
    if (this.iamService.iam.isSessionActive()) {
      this.loadingService.show();
      await this.iamService.login();
      this.iamService.clearWaitSignatureTimer();

      // Setup User Data
      await this.iamService.setupUser();

      // Set Loggedin Flag to true
      this.isLoggedIn = true;
    }
    else {
      this.loadingService.hide();
      // Launch Login Dialog
      await this.dialog.open(ConnectToWalletDialogComponent, {
        width: '434px',
        panelClass: 'connect-to-wallet',
        data: {
          appName: ''
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().toPromise();

      // Set Loggedin Flag to true
      this.isLoggedIn = true;
      this.loadingService.show();
    }
  }

  private async getNotEnrolledRoles() {
    let roleList = await this.iamService.iam.getRolesByNamespace({
      parentType: this.roleType === RoleType.APP ? ENSNamespaceTypes.Application : ENSNamespaceTypes.Organization,
      namespace: this.namespace
    });
    let enrolledRoles = await this.iamService.iam.getRequestedClaims({
      did: this.iamService.iam.getDid()
    });

    if (roleList && roleList.length) {
      roleList = roleList.filter((role: any) => {
        let retVal = true;
        let defaultRole = `${this.defaultRole}.${ENSNamespaceTypes.Roles}.${this.namespace}`;
        for (let i = 0; i < enrolledRoles.length; i++) {
          if (role.namespace === enrolledRoles[i].claimType) {
            if (role.namespace === defaultRole) {
              // Display Error
              this.displayAlert('You have already enrolled to this role.', 'error');
            }
            retVal = false;
            break;
          }
        }
  
        return retVal;
      });
    }

    return roleList;
  }

  private async initRoles() {
    // Change it later to GET NOT ENROLLED ROLES BY USER
    try {
      this.loadingService.show();
      this.roleList = await this.getNotEnrolledRoles();

      if (this.roleList && this.roleList.length) {

        // Set Default Selected
        if (this.defaultRole) {
          for (let i = 0; i < this.roleList.length; i++) {
            if (this.roleList[i].name.toUpperCase() === this.defaultRole.toUpperCase()) {
              this.selectedRole = this.roleList[i].definition;
              this.selectedNamespace = this.roleList[i].namespace;
              this.fieldList = this.selectedRole.fields || [];
              this.updateForm();

              this.roleTypeForm.get('roleType').setValue(this.roleList[i]);
            }
          }
        }
      }
    }
    catch (e) {
      throw e;
    }
    finally {
      this.loadingService.hide();
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
  }

  roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      this.updateForm();
    }
  }

  async submit() {
    this.loadingService.show();
    if (this.enrolmentForm.valid) {
      let did = undefined;
      if (this.selectedRole.issuer) {
        if (this.selectedRole.issuer.roleName) {
          // Retrieve list of issuers by roleName
          did = await this.iamService.iam.getRoleDIDs({
            namespace: this.selectedRole.issuer.roleName
          });
        }
        else if (this.selectedRole.issuer.did) {
          did = this.selectedRole.issuer.did;
        }
      }

      if (did && did.length) {
        this.submitting = true;
        this.loadingService.show('Please confirm this transaction in your connected wallet.');

        let success = true;

        try {
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

          await this.iamService.iam.createClaimRequest({
            issuer: did,
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
          this.loadingService.hide();
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

    this.loadingService.hide();
  }

  logout() {
    this.iamService.logoutAndRefresh();
  }
}
