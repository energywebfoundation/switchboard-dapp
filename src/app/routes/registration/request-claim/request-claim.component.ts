import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Asset,
  ENSNamespaceTypes,
  IRoleDefinition,
  PreconditionTypes,
  RegistrationTypes
} from 'iam-client-lib';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { RoleType } from '../../applications/new-role/new-role.component';
import { ConnectToWalletDialogComponent } from '../connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { SelectAssetDialogComponent } from '../select-asset-dialog/select-asset-dialog.component';
import { SubjectElements, ViewColorsSetter } from '../models/view-colors-setter';
import swal from 'sweetalert';
import { requireCheckboxesToBeCheckedValidator } from '../../../utils/validators/require-checkboxes-to-be-checked.validator';

const TOASTR_HEADER = 'Enrolment';
const DEFAULT_CLAIM_TYPE_VERSION = 1;
const EnrolForType = {
  ME: 'me',
  ASSET: 'asset'
};
const SwalButtons = {
  VIEW_MY_ENROMENTS: 'viewMyEnrolments',
  ENROL_FOR_ASSET: 'enrolForAsset',
  ENROL_FOR_MYSELF: 'enrolForSelf'
};

interface FormClaim extends Claim {
  isSynced?: boolean;
  claimTypeVersion?: string;
}

enum RolePreconditionType{
  SYNCED= 'synced',
  APPROVED = 'approved',
  PENDING = 'pending'
}

@Component({
  selector: 'app-request-claim',
  templateUrl: './request-claim.component.html',
  styleUrls: ['./request-claim.component.scss']
})
export class RequestClaimComponent implements OnInit, SubjectElements {

  public EnrolForType = EnrolForType;
  public enrolmentForm: FormGroup = this.fb.group({
    registrationTypes: new FormGroup({
      offChain: new FormControl({value: true, disabled: false}),
      onChain: new FormControl({value: false, disabled: true}),
    }, requireCheckboxesToBeCheckedValidator()),
    fields: this.fb.array([])
  });
  public roleTypeForm = this.fb.group({
    roleType: '',
    enrolFor: EnrolForType.ME,
    assetDid: ''
  });

  registrationTypesOfRole: Record<string, Set<RegistrationTypes>>;

  public fieldList: IRoleDefinition['fields'];

  public orgAppDetails: any;
  public roleList: any;
  public submitting = false;
  public bgColor = {};
  public txtColor = {};
  public btnColor = {};
  public listColor = {};
  public txtboxColor = {};
  public isLoggedIn = false;
  public isPrecheckSuccess = false;
  isLoading = false;
  rolePreconditionList = [];
  public roleType: string;

  private userRoleList: FormClaim[];
  private namespace: string;
  private callbackUrl: string;
  private defaultRole: string;
  private selectedRole: IRoleDefinition;
  private selectedNamespace: string;
  private stayLoggedIn = false;
  private swalReference;

  constructor(private fb: FormBuilder,
              private route: Router,
              private activeRoute: ActivatedRoute,
              private iamService: IamService,
              private toastr: ToastrService,
              public dialog: MatDialog,
              private loadingService: LoadingService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload() {
    if (this.isLoggedIn && !this.stayLoggedIn) {
      // Always logout if user refreshes this screen or closes this tab
      this.iamService.logout();
    }
  }

  isOrganization(): boolean {
    return this.roleType === RoleType.ORG;
  }

  isApplication(): boolean {
    return this.roleType === RoleType.APP;
  }

  isRolePreconditionApproved(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.APPROVED;
  }

  isRolePreconditionPending(status: RolePreconditionType): boolean {
    return status === RolePreconditionType.PENDING;
  }

  async ngOnInit() {
    this.activeRoute.queryParams.subscribe(async (params: any) => {
      this.cleanUpSwal();
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

        this.setUrlParams(params);

        this.resetData();

        try {
          // Get org/app definition
          this.orgAppDetails = await this.iamService.iam.getDefinition({
            type: this.roleType === RoleType.APP ? ENSNamespaceTypes.Application : ENSNamespaceTypes.Organization,
            namespace: this.namespace
          });

          if (this.orgAppDetails) {
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

  private async getRegistrationTypesOfRoles() {
    this.registrationTypesOfRole = await this.iamService.iam.registrationTypesOfRoles(this.roleList.map(role => role.namespace));
  }

  roleTypeSelected(e: any) {
    if (e && e.value && e.value.definition) {
      this.fieldList = e.value.definition.fields || [];
      this.selectedRole = e.value.definition;
      this.selectedNamespace = e.value.namespace;

      // Init Preconditions
      this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);

      this.updateEnrolmentForm();

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
    if (!this.enrolmentForm.valid) {
      this.toastr.error('Enrolment Form is invalid.', TOASTR_HEADER);
      return;
    }
    this.loadingService.show();

    let issuerDids = [];
    if (this.registrationTypesGroup.get('offChain').value) {
      issuerDids = await this.getIssuerDid();
      if (!(issuerDids && issuerDids.length > 0)) {
        this.toastr.error('Cannot identify issuer for this role.', TOASTR_HEADER);
        this.loadingService.hide();
        return;
      }
    }

    this.submitting = true;
    this.loadingService.show('Please confirm this transaction in your connected wallet.');

    try {
      await this.iamService.iam.createClaimRequest({
        issuer: issuerDids,
        claim: this.createClaim(),
        subject: this.roleTypeForm.value.assetDid ? this.roleTypeForm.value.assetDid : undefined,
        registrationTypes: this.getRegistrationTypes()
      } as any);

      this.displayAlert('Request to enrol as ' + this.roleTypeForm.value.roleType.name.toUpperCase() + ' is submitted for review and approval.',
        'success');
    } catch (e) {
      console.error('Enrolment Failed', e);
      this.toastr.error(e.message, TOASTR_HEADER);
      this.submitting = false;
    } finally {
      this.loadingService.hide();
    }

    this.loadingService.hide();
  }

  private async getIssuerDid(): Promise<string[]> {
    if (this.selectedRole.issuer) {
      if (this.selectedRole.issuer.roleName) {
        // Retrieve list of issuers by roleName
        return await this.iamService.iam.getRoleDIDs({
          namespace: this.selectedRole.issuer.roleName
        });
      } else if (this.selectedRole.issuer.did) {
        return this.selectedRole.issuer.did;
      }
    }
  }

  goToEnrolment() {
    if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
      // Navigate to My Enrolments Page
      this.route.navigate(['dashboard'], {queryParams: {returnUrl: '/assets/enrolment/' + this.roleTypeForm.value.assetDid}});
    } else {
      // Navigate to My Enrolments Page
      this.route.navigate(['dashboard'], {queryParams: {returnUrl: '/enrolment?notif=myEnrolments'}});
    }
  }

  logout() {
    this.iamService.logoutAndRefresh();
  }

  selectAsset() {
    const dialogRef = this.dialog.open(SelectAssetDialogComponent, {
      width: '600px',
      maxWidth: '100%',
      disableClose: true,
      data: {
        assetDiD: this.roleTypeForm?.value?.assetDid
      }
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

  private cleanUpSwal() {
    if (this.swalReference) {
      swal.close();
      this.swalReference = null;
    }
  }

  private createClaim() {
    // Submit first digit of version
    // because legacy role's had version format of '1.0.0'
    // but we version should be persisted as numbers
    const parseVersion = (version: string | number) => {
      if (typeof (version) === 'string') {
        return parseInt(version.split('.')[0], 10);
      }
      return version;
    };

    return {
      fields: JSON.parse(JSON.stringify(this.buildEnrolmentFormFields())),
      claimType: this.selectedNamespace,
      claimTypeVersion: parseVersion(this.selectedRole.version) || DEFAULT_CLAIM_TYPE_VERSION
    };
  }

  private get registrationTypesGroup(): AbstractControl {
    return this.enrolmentForm.get('registrationTypes');
  }

  private getRegistrationTypes(): string[] {
    const result = [];
    if (this.registrationTypesGroup.get('offChain').value) {
      result.push(RegistrationTypes.OffChain);
    }

    if (this.registrationTypesGroup.get('onChain').value) {
      result.push(RegistrationTypes.OnChain);
    }

    return result;
  }

  private buildEnrolmentFormFields() {
    const values = this.enrolmentForm.value.fields;
    return this.fieldList.map((field, index) => (
      {
        key: field.label,
        value: values[index]
      }
    ));
  }

  private setUrlParams(params: any) {
    this.roleType = params.app ? RoleType.APP : RoleType.ORG;
    this.namespace = params.app || params.org;
    this.defaultRole = params.roleName;
  }

  private updateColors(params: any) {
    let others;

    // re-construct others
    if (this.orgAppDetails.others) {
      others = this.orgAppDetails.others;
    }

    this.callbackUrl = params.returnUrl || (others ? others.returnUrl : undefined);

    const viewColorsSetter = new ViewColorsSetter({...others, ...params});
    viewColorsSetter.applyTo(this);
  }

  private async displayAlert(text: string, icon: string) {

    // Navigate to callback URL
    this.swalReference = swal(this.createSwalConfig(text, icon));
    const result = await this.swalReference;
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
            this.route.navigate(['dashboard'], {queryParams: {returnUrl: '/assets/enrolment/' + this.roleTypeForm.value.assetDid}});
          } else {
            // Navigate to My Enrolments Page
            this.route.navigate(['dashboard'], {queryParams: {returnUrl: '/enrolment?notif=myEnrolments'}});
          }
      }
    } else {
      this.roleTypeForm.patchValue({
        enrolType: ''
      });
    }
  }

  private createSwalConfig(text: string, icon: string) {
    const config = {
      title: TOASTR_HEADER,
      text,
      icon,
      button: this.roleType === RoleType.APP ? 'Back to Application' : 'Back',
      closeOnClickOutside: false
    };

    // Hide button if callback url is not available
    if (!this.callbackUrl) {
      delete config.button;
      if (this.iamService.iam.isSessionActive()) {
        if (icon !== 'success') {
          config['buttons'] = {
            [SwalButtons.VIEW_MY_ENROMENTS]: 'View My Enrolments',
            [SwalButtons.ENROL_FOR_ASSET]: 'Enrol For My Asset'
          };
          if (this.roleTypeForm.value.enrolFor === EnrolForType.ASSET) {
            config['buttons'] = {
              [SwalButtons.ENROL_FOR_MYSELF]: 'Enrol For Myself',
              [SwalButtons.ENROL_FOR_ASSET]: 'Choose Another Asset',
              [SwalButtons.VIEW_MY_ENROMENTS]: 'View Asset Enrolments'
            };
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

    return config;
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
      claims = claims
        .filter((item: any) => item && item.claimType)
        .filter((item) => {
          const arr = item.claimType.split('.');
          return arr.length > 1 && arr[1] === ENSNamespaceTypes.Roles;
        });

      if (claims && claims.length && this.userRoleList) {
        claims.map((item: any) => {
          this.userRoleList
            .filter(userRole => item.claimType === userRole.claimType)
            .map(userRole => {
              userRole.isSynced = true;
            });
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
        const defaultRole = `${this.defaultRole}.${ENSNamespaceTypes.Roles}.${this.namespace}`;
        for (let i = 0; i < this.userRoleList.length; i++) {
          if (role.namespace === this.userRoleList[i].claimType &&
            // split on '.' and take first digit in order to handle legacy role version format of '1.0.0'
            role.definition.version.toString().split('.')[0] === this.userRoleList[i].claimTypeVersion.toString().split('.')[0]) {
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
        await this.getRegistrationTypesOfRoles();
        // Set Default Selected
        if (this.defaultRole) {
          this.roleList
            .filter((role) => role.name.toUpperCase() === this.defaultRole.toUpperCase())
            .map((role) => {
              this.selectedRole = role.definition;
              this.selectedNamespace = role.namespace;
              this.fieldList = this.selectedRole.fields || [];
              this.updateEnrolmentForm();
              this.roleTypeForm.get('roleType').setValue(role);

              // Init Preconditions
              this.isPrecheckSuccess = this._preconditionCheck(this.selectedRole.enrolmentPreconditions);
            });
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
    this.selectedRole = undefined;
    this.selectedNamespace = undefined;

    if (this.fieldList) {
      this.fieldList = [];
    }

    if (this.enrolmentForm) {
      this.enrolmentForm.reset();
    }
  }

  private createControls() {
    return this.fieldList.map((field) => {
      this.setFieldDefaults(field);

      const control = new FormControl();
      control.setValidators(this.buildValidationOptions(field));
      return control;
    });
  }

  private setFieldDefaults(field) {
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
        break;
    }
  }

  private updateEnrolmentForm() {
    this.enrolmentForm.removeControl('fields');
    this.enrolmentForm.registerControl('fields', new FormArray(this.createControls()));
    this.registrationTypesGroup.reset(
      {
        offChain: {value: true, disabled: false},
        onChain: {
          value: false,
          disabled: !this.registrationTypesOfRole[this.selectedNamespace].has(RegistrationTypes.OnChain)
        }
      }
    );
  }

  private buildValidationOptions(field: any) {
    const validations = [];

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
    let status = RolePreconditionType.PENDING;

    // Check if namespace exists in synced DID Doc Roles
    for (const roleObj of this.userRoleList) {
      if (roleObj.claimType === namespace) {
        if (roleObj.isAccepted) {
          if (roleObj.isSynced) {
            status = RolePreconditionType.SYNCED;
          } else {
            status = RolePreconditionType.APPROVED;
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
      for (const precondition of preconditionList) {
        switch (precondition.type) {
          case PreconditionTypes.Role:
            // Check for Role Conditions
            this.rolePreconditionList = [];

            const conditions = precondition.conditions;
            if (conditions) {
              for (const roleCondition of conditions) {
                const status = this._getRoleConditionStatus(roleCondition);
                this.rolePreconditionList.push({
                  namespace: roleCondition,
                  status
                });

                if (status !== RolePreconditionType.SYNCED) {
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
