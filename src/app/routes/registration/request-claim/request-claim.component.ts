import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Asset, ENSNamespaceTypes, IRoleDefinition, PreconditionTypes, RegistrationTypes } from 'iam-client-lib';
import { Claim } from 'iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types';
import { IamService } from '../../../shared/services/iam.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { RoleType } from '../../applications/new-role/new-role.component';
import { ConnectToWalletDialogComponent } from '../../../modules/connect-to-wallet/connect-to-wallet-dialog/connect-to-wallet-dialog.component';
import { SelectAssetDialogComponent } from '../select-asset-dialog/select-asset-dialog.component';
import { SubjectElements, ViewColorsSetter } from '../models/view-colors-setter';
import swal from 'sweetalert';
import { EnrolmentField, EnrolmentSubmission } from '../enrolment-form/enrolment-form.component';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { LoginService } from '../../../shared/services/login/login.service';

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
  claimTypeVersion: string;
}

enum RolePreconditionType {
  SYNCED = 'synced',
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
  public roleTypeForm = this.fb.group({
    roleType: '',
    enrolFor: EnrolForType.ME,
    assetDid: ''
  });

  private registrationTypesOfRole: Record<string, Set<RegistrationTypes>>;

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
              private toastr: SwitchboardToastrService,
              public dialog: MatDialog,
              private loadingService: LoadingService,
              private loginService: LoginService) {
  }

  @HostListener('window:beforeunload', ['$event'])
  public onPageUnload() {
    if (this.isLoggedIn && !this.stayLoggedIn) {
      // Always logout if user refreshes this screen or closes this tab
      this.loginService.logout();
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

  getNamespaceRegistrationRoles(): Set<RegistrationTypes> {
    return this.registrationTypesOfRole[this.selectedNamespace];
  }

  // TODO: check if everything is needed.
  isSubmitDisabled(): boolean {
    return !this.roleTypeForm?.value?.roleType ||
      this.submitting ||
      !this.roleTypeForm?.valid ||
      (this.roleTypeForm?.value?.enrolFor === EnrolForType.ASSET && !this.roleTypeForm?.value?.assetDid);
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

  async submit(enrolForm?: EnrolmentSubmission) {
    if (!enrolForm.valid) {
      this.toastr.error('Enrolment Form is invalid.', TOASTR_HEADER);
      return;
    }
    this.loadingService.show();

    let issuerDids = [];
    if (enrolForm.registrationTypes.includes(RegistrationTypes.OffChain)) {
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
        claim: this.createClaim(enrolForm.fields),
        subject: this.roleTypeForm.value.assetDid ? this.roleTypeForm.value.assetDid : undefined,
        registrationTypes: enrolForm.registrationTypes
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
    this.loginService.logout();
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

  private createClaim(fields: EnrolmentField[]) {
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
      fields: JSON.parse(JSON.stringify(fields)),
      claimType: this.selectedNamespace,
      claimTypeVersion: parseVersion(this.selectedRole.version) || DEFAULT_CLAIM_TYPE_VERSION
    };
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
            this.loginService.logout();

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
    if (this.loginService.isSessionActive()) {
      this.loadingService.show();
      await this.loginService.login();
      this.loginService.clearWaitSignatureTimer();

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
