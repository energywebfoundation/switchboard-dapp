import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';

export const RoleType = {
  ORG: 'ORG',
  APP: 'APP',
  CUSTOM: 'CUSTOM'
};

const RoleTypeList = [{
    label: 'Organization',
    value: RoleType.ORG
  },
  {
    label: 'Application',
    value: RoleType.APP
  },
  {
    label: 'Custom',
    value: RoleType.CUSTOM
  }
];

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
  actions: string;
}

const FIELD_TYPES = [
  'text', 'number', 'date', 'boolean'
];

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent {
  @ViewChild('roleNameInput', {static: false}) roleNameInput: ElementRef;

  // Main Form Data
  RoleTypeList  = RoleTypeList;
  FieldTypes    = FIELD_TYPES;
  newRoleForm   : FormGroup;
  issuerGroup   : FormGroup;
  isSubmitting  = false;
  isEnsNameValid= undefined;
  tmpEnsName    = '';
  appList       = {
     items : [] 
  };
  isHidden      = {
    orgFieldCancelBtn: true,
    roleName: true,
    fields: true
  };
  isDisabled    = {
    roleType: false,
    orgField: false,
    appField: false,
    roleName: false
  };
  issuerList    : [string];
  IssuerType    = {
    DID: 'DID',
    Role: 'Role'
  };

  // Field Form Data
  fieldsForm      : FormGroup;
  showFieldsForm  = false;
  isEditFieldForm = false;
  displayedColumns: string[] = ['type', 'label', 'validation', 'actions'];
  dataSource = new MatTableDataSource([]);

  constructor(public dialogRef: MatDialogRef<NewRoleComponent>,
      private fb: FormBuilder,
      private changeDetectorRef: ChangeDetectorRef,
      private iamService: IamService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService) {
        
    this.issuerList = [this.iamService.iam.getDid()];

    this.newRoleForm = fb.group({
      roleType: [null, Validators.required],
      org: new FormControl({ value: null }),
      app: new FormControl({ value: null }),
      metadata: null,
      roleName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(256)
      ])],
      ensName: new FormControl({ value: '', disabled: true}),
      version: '1.0.0',
      issuer: fb.group({
        issuerType: new FormControl({ value: undefined })
      })
    });
    
    this.fieldsForm = fb.group({
      type: ['', Validators.required],
      label: ['', Validators.required],
      validation: ''
    });

    this.issuerGroup = fb.group({
      newIssuer: ['', Validators.required]
    });
  }

  confirmRoleType() {
    this.newRoleForm.get('roleType').disable();
    this.isDisabled.roleType = true;

    if (this.newRoleForm.get('roleType').value === RoleType.CUSTOM) {
      // Display Rolename
      this.isHidden.roleName = false;
    }
  }

  cancelRoleType() {
    this.newRoleForm.get('roleType').enable();
    this.isDisabled.roleType = false;
    this.newRoleForm.get('org').reset();
    
    if (this.newRoleForm.get('roleType').value === RoleType.CUSTOM) {
      // Hide Rolename
      this.isHidden.roleName = true;
    }
  }

  private async getAppList() {
    try {
      // retrieve the list of apps under this namespace
      console.log('retrieve the list of apps under this namespace', 'apps.' + this.newRoleForm.get('org').value);
      let appList = await this.iamService.iam.getSubdomains({
        domain: 'apps.' + this.newRoleForm.get('org').value
      });

      // reset
      this.appList.items.length = 0;
      if (appList && appList.length) {
        console.log('appList', appList);
        this.appList.items.push(...appList);
      }
      else {
        this.toastr.error('Application list is empty.');
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error('Please contact system administrator.', 'System Error');
    }
  }

  async confirmOrg() {
    this.loading(true);

    try {
      // check if org exists and if user is owner of the org
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: this.newRoleForm.get('org').value
      });

      if (exists) {
        // check if user is owner of the org namespace
        let isOwner = await this.iamService.iam.isOwner({
          domain: this.newRoleForm.get('org').value
        });

        if (isOwner) {
          let roleType = this.newRoleForm.get('roleType').value;
          
          if (roleType === RoleType.APP) {
            // retrieve the list of apps under this namespace
            await this.getAppList();
          }
          else if (roleType) {
            // display role name if role type is Organization instead of the Application field
            this.isHidden.roleName = false;
          }

          if (roleType === RoleType.CUSTOM || 
              (roleType === RoleType.ORG && this.isHidden.roleName) || 
              roleType === RoleType.APP && !this.newRoleForm.get('app').disabled) {
            // hide org field's cancel button
            this.isHidden.orgFieldCancelBtn = false;
          }
          this.newRoleForm.get('org').disable();
          this.isDisabled.orgField = true;
        }
        else {
          this.toastr.error('You are not an owner of this organization.');
        }
      }
      else {
        this.toastr.error('Organization namespace does not exist.');
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error('Please contact system administrator.', 'System Error');
    }
    finally {
      this.loading(false);
    }
  }

  cancelOrg() {
    this.newRoleForm.get('org').enable();
    this.isDisabled.orgField = false;
    this.isHidden.orgFieldCancelBtn = true;

    if (this.newRoleForm.get('roleType').value === RoleType.ORG) {
      this.isHidden.roleName = true;

      // Reset ENS Name Fields
      this.newRoleForm.get('roleName').reset();
      this.newRoleForm.get('ensName').reset();
    }
    else {
      // Reset App Field
      this.newRoleForm.get('app').reset();
    }
  }

  confirmApp() {
    this.newRoleForm.get('app').disable();
    this.isDisabled.appField = true;
    this.isHidden.roleName = false;
    this.isHidden.orgFieldCancelBtn = true;
  }

  cancelApp() {
    this.newRoleForm.get('app').enable();
    this.isDisabled.appField = false;
    this.isHidden.roleName = true;
    this.isHidden.orgFieldCancelBtn = false;
    this.appList.items.length = 0;
    
    // Reset ENS Name Fields
    this.newRoleForm.get('roleName').reset();
    this.newRoleForm.get('ensName').reset();
  }

  async confirmRoleName() {
    this.loading(true);

    try {
      // check if role exists
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: this.tmpEnsName
      });

      if (!exists) {
        this.newRoleForm.get('roleName').disable();
        this.isDisabled.roleName = true;
        this.isHidden.fields = false;
    
        this.isHidden.orgFieldCancelBtn = true;
        this.isEnsNameValid = true;
      }
      else {
        this.isEnsNameValid = false;
        this.toastr.error('This role name is taken.');
      }
    }
    catch (e) {
      console.error(e);
      this.toastr.error('Please contact system administrator.', 'System Error');
    }
    finally {
      this.loading(false);
    }
  }

  cancelRoleName() {
    this.newRoleForm.get('roleName').enable();
    this.isDisabled.roleName = false;
    this.isHidden.fields = true;
    this.isHidden.orgFieldCancelBtn = true;
    this.isEnsNameValid = undefined;

    let roleType = this.newRoleForm.get('roleType').value;
    if (roleType === RoleType.ORG) {
      this.isHidden.orgFieldCancelBtn = false;
    }
  }

  roleTypeChanged(data: any) {
    this.newRoleForm.patchValue({
      org: null,
      app: null,
      roleName: null
    });
  }

  private loading(show: boolean) {
    if (show) {
      this.spinner.show();
    }
    else {
      this.spinner.hide();
    }
  }

  updateEnsName(event: any) {
    let data = this.newRoleForm.getRawValue();
    let ensName = 'roles.';

    switch (data.roleType) {
      case RoleType.ORG:
        ensName += data.org;
        break;
      case RoleType.APP:
        ensName += data.app + '.apps.' + data.org;
        break;
      case RoleType.CUSTOM:
        ensName += 'iam.ewc';
        break;
    }

    this.tmpEnsName = '';
    if (data.roleName) {
      this.tmpEnsName = data.roleName + '.' + ensName;
    }

    this.newRoleForm.get('ensName').setValue(data.roleName ? ensName : '');
  }

  alphabetOnly(event: any, includePoint?: boolean): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // 96 = a, 122 = z
    if ((charCode > 96 && charCode < 123) || (charCode === 46 && (this.newRoleForm.get('roleType').value === 'CUSTOM' || includePoint))) {
      return true;
    }

    return false;
  }

  issuerTypeChanged(data: any) {

  }

  addDid() {
    let newIssuerDid = this.issuerGroup.get('newIssuer').value;

    // Check if duplicate
    let exists = false;
    for (let i = 0; i < this.issuerList.length; i++) {
      if (this.issuerList[i] === newIssuerDid) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      this.issuerList.push(newIssuerDid);
      this.issuerGroup.get('newIssuer').reset();
    }
    else {
      this.toastr.error('Item exists.', 'Issuer DID');
    }
  }

  removeDid(i: number) {
    // Make sure that [0] Default DID can never be removed
    if (this.issuerList.length > 1) {
      this.issuerList.splice(i, 1);
    }
  }

  showAddFieldForm() {
    if (this.isEditFieldForm) {
      this.fieldsForm.reset();
    }
    this.isEditFieldForm = false;
    this.showFieldsForm = true;
  }

  addField() {
    if (this.fieldsForm.valid) {
      this.dataSource.data = [...this.dataSource.data, this.fieldsForm.value];
      this.fieldsForm.reset();
      this.showFieldsForm = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  moveUp(i: number) {
    let list = this.dataSource.data;
    let tmp = list[i - 1];
    
    // Switch
    list[i - 1] = list[i];
    list[i] = tmp;

    this.dataSource.data = [...list];
  }

  moveDown(i: number) {
    let list = this.dataSource.data;
    let tmp = list[i + 1];
    
    // Switch
    list[i + 1] = list[i];
    list[i] = tmp;

    this.dataSource.data = [...list];
  }

  cancelAddField() {
    this.fieldsForm.reset();
    this.isEditFieldForm = false;
    this.showFieldsForm = false;
  }

  async save() {
    this.loading(true);
    this.toastr.info("Please make sure to confirm (3) transactions in Metamask.");
    let data = this.newRoleForm.getRawValue();
    data.issuer.did = this.issuerList;

    try {
      await this.iamService.iam.createRole({
        roleName: data.roleName,
        namespace: data.ensName,
        data: JSON.stringify(data)
      });
      this.toastr.success('New role is created.');
      this.dialogRef.close(true);
    }
    catch (e) {
      console.log(e);
      this.toastr.error("Error saving data.")
    }
    finally{
      this.loading(false);
    }
  }

  async createApp() {
    this.loading(true);
    try {
      await this.iamService.iam.createRole({
        roleName: 'monstax',
        namespace: 'apps.bigbang.iam.ewc',
        data: JSON.stringify({
          name: 'MonstaX App'
        })
      });
      this.toastr.success("App is created");
    }
    catch (e) {
      console.log(e);
      this.toastr.error("Error saving data.")
    }
    finally{
      this.loading(false);
    }
  }
}
