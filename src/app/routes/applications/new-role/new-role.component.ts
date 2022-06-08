/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import {
  IFieldDefinition,
  IRole,
  IRoleDefinitionV2,
  NamespaceType,
  PreconditionType,
} from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { delay, take } from 'rxjs/operators';
import { of } from 'rxjs';

import { ListType } from '../../../shared/constants/shared-constants';
import { IamService } from '../../../shared/services/iam.service';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewType } from '../new-organization/new-organization.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { HexValidators, isAlphanumericValidator } from '@utils';
import { SwitchboardToastrService } from '../../../shared/services/switchboard-toastr.service';
import { SignerFacadeService } from '../../../shared/services/signer-facade/signer-facade.service';
import { RoleCreationService } from './services/role-creation.service';
import { ISmartSearch } from '../../../shared/components/smart-search/models/smart-search.interface';
import { SmartSearchType } from '../../../shared/components/smart-search/models/smart-search-type.enum';
import { IssuerType } from './models/issuer-type.enum';
import { CreateRoleOptions } from 'iam-client-lib/dist/src/modules/domains/domains.types';
import { IRoleType } from './models/role-type.interface';

export enum ENSPrefixes {
  Roles = 'roles',
  Apps = 'apps',
}

export const RoleType = {
  ORG: 'org',
  APP: 'app',
  CUSTOM: 'custom',
};

export enum DomainTypeEnum {
  ORG = 'org',
  APP = 'app',
  CUSTOM = 'custom',
}

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
  actions: string;
}

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss'],
})
export class NewRoleComponent implements OnInit, AfterViewInit {
  private stepper: MatStepper;

  @ViewChild('stepper') set content(content: MatStepper) {
    if (content) {
      this.stepper = content;
    }
  }

  IssuerTypes = [IssuerType.DID, IssuerType.ROLE];
  revoker: IRoleType;
  issuer: IRoleType;
  signerDID = this.signerFacade.getDid();

  public roleForm = this.fb.group({
    roleType: [null, Validators.required],
    parentNamespace: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
      ]),
    ],
    roleName: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256),
        isAlphanumericValidator,
      ],
    ],
    namespace: '',
    data: this.fb.group({
      version: 1,
      enrolmentPreconditions: [
        [{ type: PreconditionType.Role, conditions: [] }],
      ],
    }),
  });

  public restrictionRoleControl = this.fb.control('');
  public isChecking = false;
  public ENSPrefixes = ENSPrefixes;

  // Fields
  requestorFields = new MatTableDataSource<IFieldDefinition>([]);
  issuerFields = new MatTableDataSource<IFieldDefinition>([]);
  public ViewType = ViewType;
  viewType: string = ViewType.NEW;
  origData: IRole;
  roleName: string;
  private TOASTR_HEADER = 'Create New Role';
  public txs: any[];
  private _retryCount = 0;
  private _currentIdx = 0;
  private _requests = {};

  get roleType() {
    return this.roleForm.value.roleType;
  }

  get parentNamespace() {
    return this.roleForm.value.parentNamespace;
  }

  get namespace() {
    return (
      this.roleForm.get('roleName').value +
      '.' +
      ENSPrefixes.Roles +
      '.' +
      this.roleForm?.value?.parentNamespace
    );
  }

  get isCreatingNew() {
    return this.viewType !== ViewType.UPDATE;
  }

  get isIssuerDIDType(): boolean {
    return this.issuerType === IssuerType.DID;
  }

  get isIssuerRoleType(): boolean {
    return this.issuerType === IssuerType.ROLE;
  }

  get issuerType(): IssuerType {
    return this.issuer?.type;
  }

  get isRevokerDIDType(): boolean {
    return this.revokerType === IssuerType.DID;
  }

  get isRevokerRoleType(): boolean {
    return this.revokerType === IssuerType.ROLE;
  }

  get revokerType(): IssuerType {
    return this.revoker?.type;
  }

  constructor(
    private fb: FormBuilder,
    private iamService: IamService,
    private toastr: SwitchboardToastrService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<NewRoleComponent>,
    public dialog: MatDialog,
    private signerFacade: SignerFacadeService,
    private roleCreationService: RoleCreationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngAfterViewInit() {
    await this.confirmParentNamespace();
  }

  ngOnInit() {
    this._init(this.data);
  }

  private _init(data: any) {
    if (data && data.viewType) {
      this.viewType = data.viewType;

      if (this.viewType === ViewType.UPDATE && data.origData) {
        this.origData = data.origData;
        this.TOASTR_HEADER = 'Update Role';
      } else if (this.viewType === ViewType.NEW && data.namespace) {
        const tmp = {
          parentNamespace: data.namespace,
          roleType: undefined,
        };

        if (data.listType === ListType.ORG) {
          tmp.roleType = RoleType.ORG;
        } else if (data.listType === ListType.APP) {
          tmp.roleType = RoleType.APP;
        }

        this.roleForm.patchValue(tmp);
      }

      this._initFormData();
    }
  }

  private getRequestorFieldsFromDefinition(def: {
    requestorFields?: IFieldDefinition[];
    fields?: IFieldDefinition[];
  }): IFieldDefinition[] {
    if (def?.requestorFields) {
      return [...def.requestorFields];
    }

    if (def?.fields) {
      return [...def.fields];
    }

    return [];
  }

  private _initFormData() {
    if (this.origData) {
      const def = this.origData.definition as IRoleDefinitionV2;

      // Construct Parent Namespace
      const arrParentNamespace = this.origData.namespace.split(
        NamespaceType.Role
      );
      const parentNamespace = arrParentNamespace[1].substring(1);
      this.issuer = {
        type: def.issuer.issuerType as IssuerType,
        roleName: def.issuer.roleName,
        did: def.issuer.did ? [...def.issuer.did] : [],
      };
      this.revoker = {
        type: def.revoker.revokerType as IssuerType,
        roleName: def.issuer.roleName,
        did: def.issuer.did ? [...def.revoker.did] : [],
      };
      // Construct Fields
      this.requestorFields.data = this.getRequestorFieldsFromDefinition(def);
      this.issuerFields.data = def?.issuerFields ? [...def.issuerFields] : [];
      this.roleForm.patchValue({
        roleType: def.roleType,
        parentNamespace,
        roleName: def.roleName,
        namespace: `${this.ENSPrefixes.Roles}.${parentNamespace}`,
        data: {
          version: def.version,
          enrolmentPreconditions: this._initPreconditions(
            def.enrolmentPreconditions
          ),
        },
      });
    }
    this.roleName = this.roleForm.value.roleName;

    this.roleForm.valueChanges.subscribe((value) => {
      if (typeof value.roleName !== 'string') {
        this.roleName = value.roleName.namespace;
      } else {
        this.roleName = value.roleName;
      }
    });
  }

  private _initPreconditions(preconditionList: any[]) {
    const retVal = [];

    if (preconditionList) {
      for (const precondition of preconditionList) {
        if (precondition.conditions) {
          retVal.push(precondition);
        }
      }
    }

    return retVal;
  }

  back() {
    this.stepper.steps.toArray()[this.stepper.selectedIndex - 1].editable =
      true;
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  issuerFieldsChangeHandler(data) {
    this.issuerFields.data = [...data];
  }

  addRestriction(event: ISmartSearch) {
    if (event.searchType === SmartSearchType.Add) {
      const enrolmentPreconditions = this.roleForm
        .get('data')
        .get('enrolmentPreconditions').value;

      if (enrolmentPreconditions.length) {
        enrolmentPreconditions[0].conditions.push(event.role);
      } else {
        this.roleForm.get('data').patchValue({
          enrolmentPreconditions: [
            { type: PreconditionType.Role, conditions: [event.role] },
          ],
        });
      }

      this.restrictionRoleControl.setErrors(null);
    }
  }

  requestorFieldsChangeHandler(data) {
    this.requestorFields.data = [...data];
  }

  proceedSettingIssuer(roleName) {
    this.roleForm.get('roleName').setValue(roleName);
    this.goNextStep();
  }

  async proceedSettingRevokers(data: IRoleType): Promise<void> {
    const canProceed = await this.roleCreationService.isListOrRoleNameValid(
      data.type,
      data.roleName,
      data.did,
      'Issuer'
    );
    this.issuer = data;
    if (canProceed) {
      this.goNextStep();
    }
  }

  async proceedSettingRestrictions(data: IRoleType) {
    const canProceed = await this.roleCreationService.isListOrRoleNameValid(
      data.type,
      data.roleName,
      data.did,
      'Revoker'
    );
    this.revoker = data;
    if (canProceed) {
      this.goNextStep();
    }
  }

  async confirmParentNamespace() {
    if (this.roleForm.value.parentNamespace) {
      try {
        of(null)
          .pipe(take(1), delay(1))
          .subscribe(() => {
            this.isChecking = true;
            this.spinner.show();
          });

        // Check if namespace exists
        let exists =
          await this.iamService.domainsService.checkExistenceOfDomain({
            domain: this.roleForm.value.parentNamespace,
          });

        if (exists) {
          // Check if role sub-domain exists in this namespace
          exists = await this.iamService.domainsService.checkExistenceOfDomain({
            domain: `${this.ENSPrefixes.Roles}.${this.roleForm.value.parentNamespace}`,
          });

          if (exists) {
            // check if user is authorized to create a role under this namespace
            const isOwner = await this.iamService.domainsService.isOwner({
              domain: this.roleForm.value.parentNamespace,
            });

            if (!isOwner) {
              this.toastr.error(
                'You are not authorized to create a role under this namespace.',
                this.TOASTR_HEADER
              );
              this.dialog.closeAll();
            }
          } else {
            this.toastr.error(
              'Role subdomain in this namespace does not exist.',
              this.TOASTR_HEADER
            );
            this.dialog.closeAll();
          }
        } else {
          this.toastr.error('Namespace does not exist.', this.TOASTR_HEADER);
          this.dialog.closeAll();
        }
      } catch (e) {
        this.toastr.error(e.message, 'System Error');
        this.dialog.closeAll();
      } finally {
        this.isChecking = false;
        this.spinner.hide();
      }
    } else {
      this.toastr.error('Parent Namespace is missing.', this.TOASTR_HEADER);
      this.dialog.closeAll();
    }
  }

  async confirmRole(skipNextStep?: boolean) {
    const req = JSON.parse(
      JSON.stringify({ ...this.roleForm.value, returnSteps: true })
    );

    req.namespace = `${this.ENSPrefixes.Roles}.${req.parentNamespace}`;
    delete req.parentNamespace;

    req.data.roleType = req.roleType;
    delete req.roleType;

    req.data.roleName = req.roleName;

    req.data.issuer = { ...this.issuer, issuerType: this.issuer.type };
    req.data.requestorFields = this.requestorFields.data;
    req.data.issuerFields = this.issuerFields.data;
    req.data.revoker = { ...this.revoker, revokerType: this.revoker.type };

    if (!skipNextStep) {
      // Set the second step to non-editable
      const list = this.stepper.steps.toArray();
      list[1].editable = false;
    }

    if (this.viewType === ViewType.UPDATE) {
      this.proceedUpdateStep(req, skipNextStep);
    } else {
      this.proceedCreateSteps(req);
    }
  }

  private async next(requestIdx: number, skipNextStep?: boolean) {
    const steps = this._requests[`${requestIdx}`];

    if (steps && steps.length) {
      const step = steps[0];

      if (!skipNextStep) {
        // Show the next step
        this.stepper.selected.completed = true;
        this.stepper.next();
      }

      // Process the next step
      await step.next();

      // Make sure that the current step is not retried
      if (this._requests[`${requestIdx}`]) {
        this._currentIdx++;
        this.toastr.info(
          step.info,
          `Transaction Success (${this._currentIdx}/${this.txs.length})`
        );

        // Remove 1st element
        steps.shift();

        // Process
        await this.next(requestIdx);
      }
    } else if (this._requests['0']) {
      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }

  private async proceedCreateSteps(req: CreateRoleOptions) {
    const returnSteps =
      this.data.owner === this.iamService.signerService.address;
    try {
      const call = this.iamService.domainsService.createRole(req);
      // Retrieve the steps to create an organization
      this.txs = returnSteps
        ? await call
        : [
            {
              info: 'Confirm transaction in your safe wallet',
              next: async () => await call,
            },
          ];
      // Retrieve the steps to create an application
      this._requests[`${this._retryCount}`] = [...this.txs];

      // Process
      await this.next(0);
    } catch (e) {
      console.error('New Role Error', e);
      this.toastr.error(
        e.message || 'Please contact system administrator.',
        'System Error'
      );
    }
  }

  async retry() {
    if (this.viewType !== ViewType.UPDATE) {
      // Copy pending steps
      this._requests[`${this._retryCount + 1}`] = [
        ...this._requests[`${this._retryCount}`],
      ];

      // Remove previous request
      delete this._requests[`${this._retryCount}`];
      const retryCount = ++this._retryCount;

      try {
        // Process
        await this.next(retryCount, true);

        if (this._requests[retryCount]) {
          // Move to Complete Step
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      } catch (e) {
        console.error('New Role Error', e);
        this.toastr.error(
          e.message || 'Please contact system administrator.',
          'System Error'
        );
      }
    } else {
      delete this._requests[`${this._retryCount++}`];
      await this.confirmRole(true);
    }
  }

  private async proceedUpdateStep(req: any, skipNextStep?: boolean) {
    try {
      const retryCount = this._retryCount;
      if (!skipNextStep) {
        // Update steps
        this.stepper.selected.completed = true;
        this.stepper.next();
      }

      // Set Definition
      const newDomain = `${req.roleName}.${req.namespace}`;

      this.txs = [
        {
          info: 'Setting up definitions',
          next: async () =>
            await this.iamService.domainsService.setRoleDefinition({
              data: req.data,
              domain: newDomain,
            }),
        },
      ];

      this._requests[`${retryCount}`] = [...this.txs];

      // Process
      await this.next(retryCount, skipNextStep);

      // Make sure that all steps are not yet complete
      if (this.stepper.selectedIndex !== 4 && retryCount === this._retryCount) {
        // Move to Complete Step
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
    } catch (e) {
      console.error('Update Role Error', e);
      this.toastr.error(
        e.message || 'Please contact system administrator.',
        'System Error'
      );
    }
  }

  private async confirm(confirmationMsg: string, isDiscardButton?: boolean) {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '400px',
        maxHeight: '195px',
        data: {
          header: this.TOASTR_HEADER,
          message: confirmationMsg,
          isDiscardButton,
        },
        maxWidth: '100%',
        disableClose: true,
      })
      .afterClosed()
      .toPromise();
  }

  async confirmClose(touched: boolean) {
    if (!touched) {
      return;
    }
    if (await this.confirm('There are unsaved changes.', true)) {
      this.dialogRef.close(false);
    }
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.roleForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes.', true)) {
        this.dialogRef.close(false);
      }
    } else {
      if (isSuccess) {
        if (this.origData) {
          this.toastr.success(
            'Role is successfully updated.',
            this.TOASTR_HEADER
          );
        } else {
          this.toastr.success(
            'Role is successfully created.',
            this.TOASTR_HEADER
          );
        }
      }
      this.dialogRef.close(isSuccess);
    }
  }

  goNextStep() {
    this.stepper.selected.editable = false;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  displayFn(selected: any) {
    return selected && selected.namespace ? selected.namespace : '';
  }

  removePreconditionRole(idx: number) {
    const conditions = [
      ...this.roleForm.get('data').get('enrolmentPreconditions').value[0]
        .conditions,
    ];
    conditions.splice(idx, 1);
    this.roleForm
      .get('data')
      .get('enrolmentPreconditions')
      .reset([{ type: PreconditionType.Role, conditions }]);
  }
}
