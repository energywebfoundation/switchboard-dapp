import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, ENSNamespaceTypes, PreconditionTypes } from 'iam-client-lib';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RoleType } from '../../applications/new-role/new-role.component';
import { ConnectToWalletDialogComponent } from '../connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { SelectAssetDialogComponent } from '../select-asset-dialog/select-asset-dialog.component';

const SWAL = require('sweetalert');

const TOASTR_HEADER = 'Enrolment';
const DEFAULT_CLAIM_TYPE_VERSION = '1.0.0';
const REDIRECT_TO_ENROLMENT = true;
const EnrolForType = {
  ME: 'me',
  ASSET: 'asset'
};
const SwalButtons = {
  VIEW_MY_ENROMENTS: 'viewMyEnrolments',
  ENROL_FOR_ASSET: 'enrolForAsset',
  ENROL_FOR_MYSELF: 'enrolForSelf'
};

@Component({
  selector: 'app-request-claim',
  templateUrl: './request-claim.component.html',
  styleUrls: ['./request-claim.component.scss']
})
export class RequestClaimComponent implements OnInit {

  public RoleType = RoleType;
  public EnrolForType = EnrolForType;

  public enrolmentForm: FormGroup;
  public roleTypeForm = this.fb.group({
    roleType: '',
    enrolFor: EnrolForType.ME,
    assetDid: ''
  });
  public fieldList: {
    fieldType: string,
    label: string,
    required: boolean,
    minLength: number,
    maxLength: number,
    pattern: string,
    minValue: number,
    maxValue: number,
    minDate: string,
    maxDate: string,
    minDateValue: Date,
    maxDateValue: Date
  }[];

  public orgAppDetails: any;
  public roleList: any;
  public submitting = false;
  public appError = false;
  public bgColor: Object = undefined;
  public txtColor: Object = undefined;
  public btnColor: Object = {};
  public listColor: Object = {};
  public txtboxColor: Object = {};
  public isLoggedIn = false;
  public isPrecheckSuccess = false;
  isLoading = false;
  rolePreconditionList = [];
  RolePreconditionType = {
    SYNCED: 'synced',
    APPROVED: 'approved',
    PENDING: 'pending'
  };
  private userRoleList: any;
  private namespace: string;
  private callbackUrl: string;
  private defaultRole: string;
  private roleType: string;
  private selectedRole: any;
  private selectedNamespace: string;
  private stayLoggedIn = false;

  constructor(private fb: FormBuilder,
              private route: Router,
              private activeRoute: ActivatedRoute,
              private iamService: IamService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private loadingService: LoadingService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload($event: BeforeUnloadEvent) {
    if (this.isLoggedIn && !this.stayLoggedIn) {
      // Always logout if user refreshes this screen or closes this tab
      this.iamService.logout();
    }
  }

  async ngOnInit() {
    this.activeRoute.queryParams.subscribe(async (params: any) => {
      this.loadingService.show();
      this.isLoading = true;
      this.stayLoggedIn = params.stayLoggedIn;

      // Check Login Status
      await this.initLoginUser();

      if (params.app || params.org) {
        // Check if namespace is correct
        if (!this.isCorrectNamespace(params)) {
          this.isLoading = false;
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
          } else {
            // Display Error
            if (this.roleType === RoleType.APP) {
              this.displayAlert('Application Details cannot be retrieved.', 'error');
            } else {
              this.displayAlert('Organization Details cannot be retrieved.', 'error');
            }
          }
        } catch (e) {
          console.error(TOASTR_HEADER, e);
          this.toastr.error(e, TOASTR_HEADER);
        }
      } else {
        console.error('Enrolment Param Error', params);
        this.displayAlert('URL is invalid.', 'error');
      }
      this.isLoading = false;
      this.loadingService.hide();
    });
  }

  roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);

      this.updateForm();

    }
  }

  async enrolForSelected(e: any) {
    this.roleTypeForm.patchValue({
      enrolType: '',
      assetDid: ''
    });
    this.resetForm();

    if (e.value === EnrolForType.ME) {
      // Initialize Roles
      await this.initRoles();
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
        } else if (this.selectedRole.issuer.did) {
          did = this.selectedRole.issuer.did;
        }
      }

      if (did && did.length) {
        this.submitting = true;
        this.loadingService.show('Please confirm this transaction in your connected wallet.');

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
            claimType: this.selectedNamespace,
            claimTypeVersion: this.selectedRole.version || DEFAULT_CLAIM_TYPE_VERSION
          };

          await this.iamService.iam.createClaimRequest({
            issuer: did,
            claim,
            subject: this.roleTypeForm.value.assetDid ? this.roleTypeForm.value.assetDid : undefined
          });

        } catch (e) {
          console.error('Enrolment Failed', e);
          this.toastr.error(e, TOASTR_HEADER);
          this.submitting = false;
        } finally {
          this.loadingService.hide();
        }

          this.displayAlert('Request to enrol as ' + this.roleTypeForm.value.roleType.name.toUpperCase() + ' is submitted for review and approval.',
            'success');
      } else {
        this.toastr.error('Cannot identify issuer for this role.', TOASTR_HEADER);
      }
    } else {
      this.toastr.error('Enrolment Form is invalid.', TOASTR_HEADER);
    }

    this.loadingService.hide();
  }

  goToEnrolment() {
    if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
      // Navigate to My Enrolments Page
      this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/assets/enrolment/' + this.roleTypeForm.value.assetDid } });
    } else {
      // Navigate to My Enrolments Page
      this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/enrolment?notif=myEnrolments' } });
    }
  }

  logout() {
    this.iamService.logoutAndRefresh();
  }

  selectAsset() {
    const dialogRef = this.dialog.open(SelectAssetDialogComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().subscribe(async (res: Asset) => {
      if (res) {
        this.roleTypeForm.patchValue({
          assetDid: res.id
        });

        // Initialize Roles
        await this.initRoles();
      }
      dialogRef.unsubscribe();
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
        others = this.orgAppDetails.others;
      }

      this.callbackUrl = params.returnUrl || (others ? others.returnUrl : undefined);

      if (params.bgcolor) {
        this.bgColor = { 'background-color': `#${params.bgcolor}` };
        this.listColor['background-color'] = `#${params.bgcolor}`;
      } else if (others && others.bgcolor) {
        this.bgColor = { 'background-color': `#${others.bgcolor}` };
        this.listColor['background-color'] = `#${others.bgcolor}`;
      }

      if (params.btncolor) {
        this.btnColor['background-color'] = `#${params.btncolor}`;
        this.txtboxColor['color'] = `#${params.btncolor}`;
      } else if (others && others.btncolor) {
        this.btnColor['background-color'] = `#${others.btncolor}`;
        this.txtboxColor['color'] = `#${others.btncolor}`;
      }

      if (params.txtcolor) {
        this.txtColor = { 'color': `#${params.txtcolor}` };
        this.listColor['color'] = `#${params.txtcolor}`;
        this.btnColor['color'] = `#${params.txtcolor}`;
      } else if (others && others.txtcolor) {
        this.txtColor = { 'color': `#${others.txtcolor}` };
        this.listColor['color'] = `#${others.txtcolor}`;
        this.btnColor['color'] = `#${others.txtcolor}`;
      } else {
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
      delete config.button;
      if (this.iamService.iam.isSessionActive()) {
        if (icon !== 'success') {
          config['buttons'] = {
            viewMyEnrolments: 'View My Enrolments',
            enrolForAsset: 'Enrol For My Asset'
          };
          if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
            config['buttons'].enrolForSelf = 'Enrol For Myself';
            config['buttons'].enrolForAsset = 'Choose Another Asset';
            config['buttons'].viewMyEnrolments = 'View Asset Enrolments';
          }
        } else if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
          config.button = 'View Asset Enrolments';
        } else {
          config.button = 'View My Enrolments';
        }
      } else {
        // No Buttons
        config['buttons'] = false;
      }
    }

    // Navigate to callback URL
    let result = await SWAL(config);
    if (result) {
      switch (result) {
        case SwalButtons.ENROL_FOR_MYSELF:
          this.roleTypeForm.patchValue({
            enrolFor: EnrolForType.ME,
            enrolType: ''
          });
          await this.initRoles();
          break;
        case SwalButtons.ENROL_FOR_ASSET:
          this.roleTypeForm.patchValue({
            enrolFor: EnrolForType.ASSET,
            enrolType: '',
            assetDid: ''
          });
          this.resetForm();
          if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
            this.selectAsset();
          }
          break;
        default:
          if (this.callbackUrl && !this.stayLoggedIn) {
            // Logout
            this.iamService.logout();

            // Redirect to Callback URL
            location.href = this.callbackUrl;
          } else if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
            // Navigate to My Enrolments Page
            this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/assets/enrolment/' + this.roleTypeForm.value.assetDid } });
          } else {
            // Navigate to My Enrolments Page
            this.route.navigate(['dashboard'], { queryParams: { returnUrl: '/enrolment?notif=myEnrolments' } });
          }
      }
    } else {
      this.roleTypeForm.patchValue({
        enrolType: ''
      });
    }
  }

  private isCorrectNamespace(params: any) {
    let retVal = false;

    if (params.app &&
      params.app.includes(`.${ENSNamespaceTypes.Application}.`) &&
      !params.app.includes(`.${ENSNamespaceTypes.Roles}.`)) {
      retVal = true;
    } else if (params.org &&
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
    } else {
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

  private async _getDIDSyncedRoles() {
    try {
      let claims: any[] = await this.iamService.iam.getUserClaims({
        did: this.roleTypeForm.value.enrolFor === EnrolForType.ASSET ? this.roleTypeForm.value.assetDid : this.iamService.iam.getDid()
      });
      claims = claims.filter((item: any) => {
        if (item && item.claimType) {
          let arr = item.claimType.split('.');
          if (arr.length > 1 && arr[1] === ENSNamespaceTypes.Roles) {
            return true;
          }
          return false;
        }
        return false;
      });

      if (claims && claims.length && this.userRoleList) {
        claims.forEach((item: any) => {
          for (let i = 0; i < this.userRoleList.length; i++) {
            if (item.claimType === this.userRoleList[i].claimType) {
              this.userRoleList[i].isSynced = true;
            }
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async getNotEnrolledRoles() {
    let roleList = await this.iamService.iam.getRolesByNamespace({
      parentType: this.roleType === RoleType.APP ? ENSNamespaceTypes.Application : ENSNamespaceTypes.Organization,
      namespace: this.namespace
    });

    if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
      this.userRoleList = (await this.iamService.iam.getClaimsBySubject({
        did: this.roleTypeForm.value.assetDid
      })).filter((claim: Claim) => !claim.isRejected);
    } else {
      this.userRoleList = (await this.iamService.iam.getClaimsByRequester({
        did: this.iamService.iam.getDid()
      })).filter((claim: Claim) => !claim.isRejected);
    }

    if (roleList && roleList.length) {
      roleList = roleList.filter((role: any) => {
        let retVal = true;
        let defaultRole = `${this.defaultRole}.${ENSNamespaceTypes.Roles}.${this.namespace}`;
        for (let i = 0; i < this.userRoleList.length; i++) {
          if (role.namespace === this.userRoleList[i].claimType && role.definition.version === this.userRoleList[i].claimTypeVersion) {
            if (role.namespace === defaultRole) {
              // Display Error
              if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
                this.displayAlert('Your asset has already enrolled to this role.', 'error');
              } else {
                this.displayAlert('You have already enrolled to this role.', 'error');
              }
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

      // Initialize Claims Synced in DID
      await this._getDIDSyncedRoles();

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

              // Init Preconditions
              this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);
            }
          }
        }
      }
    } catch (e) {
      throw e;
    } finally {
      this.loadingService.hide();
    }
  }

  private resetData() {
    this.resetForm();

    this.roleTypeForm.reset();
    this.roleTypeForm.get('enrolFor').setValue(EnrolForType.ME);
  }

  private resetForm() {
    this.submitting = false;
    this.appError = false;
    this.selectedRole = undefined;
    this.selectedNamespace = undefined;

    if (this.fieldList) {
      this.fieldList = [];
    }

    if (this.enrolmentForm) {
      this.enrolmentForm.reset();
    }
  }

  private updateForm() {
    let controls = [];
    for (let field of this.fieldList) {
      let control = new FormControl();
      switch (field.fieldType) {
        case 'text':
          break;
        case 'number':
          break;
        case 'date':
          if (field.maxDate) {
            field.maxDateValue = new Date(field.maxDate);
          }
          if (field.minDate) {
            field.minDateValue = new Date(field.minDate);
          }
          break;
        case 'boolean':
          control.setValue(false);
          break;
      }

      // Set Validations
      let validations = this.buildValidationOptions(field);
      if (validations.length) {
        control.setValidators(validations);
      }

      // add control to array
      controls.push(control);
    }

    this.enrolmentForm = this.fb.group({
      fields: this.fb.array(controls)
    });
  }

  private buildValidationOptions(field: any) {
    let validations = [];

    if (field.required) {
      validations.push(Validators.required);
    }

    if (field.minLength) {
      validations.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validations.push(Validators.maxLength(field.maxLength));
    }

    if (field.pattern) {
      validations.push(Validators.pattern(field.pattern));
    }

    if (field.minValue) {
      validations.push(Validators.min(field.minValue));
    }

    if (field.maxValue) {
      validations.push(Validators.max(field.maxValue));
    }

    return validations;
  }

  private _getRoleConditionStatus(namespace: string) {
    let status = this.RolePreconditionType.PENDING;

    // Check if namespace exists in synced DID Doc Roles
    for (let roleObj of this.userRoleList) {
      if (roleObj.claimType === namespace) {
        if (roleObj.isAccepted) {
          if (roleObj.isSynced) {
            status = this.RolePreconditionType.SYNCED;
          } else {
            status = this.RolePreconditionType.APPROVED;
          }
        }
        break;
      }
    }

    return status;
  }

  private _preconditionCheck(preconditionList: any[]) {
    let retVal = true;

    if (preconditionList && preconditionList.length) {
      for (let precondition of preconditionList) {
        switch (precondition.type) {
          case PreconditionTypes.Role:
            // Check for Role Conditions
            this.rolePreconditionList = [];

            let conditions = precondition.conditions;
            if (conditions) {
              for (let roleCondition of conditions) {
                let status = this._getRoleConditionStatus(roleCondition);
                this.rolePreconditionList.push({
                  namespace: roleCondition,
                  status: status
                });

                if (status !== this.RolePreconditionType.SYNCED) {
                  retVal = false;
                }
              }
            }
            break;
        }
      }
    }

    return retVal;
  }
}
