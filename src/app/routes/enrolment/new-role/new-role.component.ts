import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';
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
  isSubmitting  = false;
  isCheckingEns = false;
  isLoading     = false;
  appList       = ['Item 1', 'Item 2', 'Item 3'];
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
      private toastr: ToastrService) {
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
      version: null,
      issuer: {
        issuerType: null,
        did: null
      }
    });
    
    this.fieldsForm = fb.group({
      type: ['', Validators.required],
      label: ['', Validators.required],
      validation: ''
    });
  }

  confirmRoleType() {
    this.newRoleForm.get('roleType').disable();
    this.isDisabled.roleType = true;
  }

  cancelRoleType() {
    this.newRoleForm.get('roleType').enable();
    this.isDisabled.roleType = false;
    this.newRoleForm.get('org').reset();
  }

  async confirmOrg() {
    // check if org exists and if user is owner of the org
    let exists = true;
    // let exists = await this.iamService.iam.checkExistenceOfDomain({
    //   domain: this.newRoleForm.get('org').value
    // });

    try {
      if (exists) {
        let isOwner = true
        // let isOwner = await this.iamService.iam.isOwner({
        //   domain: this.newRoleForm.get('org').value
        // });

        if (isOwner) {
          let roleType = this.newRoleForm.get('roleType').value;
          if (roleType === RoleType.CUSTOM || 
              (roleType === RoleType.ORG && this.isHidden.roleName) || 
              roleType === RoleType.APP && !this.newRoleForm.get('app').disabled) {
            this.isHidden.orgFieldCancelBtn = false;
          }
          this.newRoleForm.get('org').disable();
          this.isDisabled.orgField = true;

          if (roleType === RoleType.ORG) {
            this.isHidden.roleName = false;
          }
        }
        else {
          this.toastr.error('You do not have permission to this namespace.');
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
    
    // Reset ENS Name Fields
    this.newRoleForm.get('roleName').reset();
    this.newRoleForm.get('ensName').reset();
  }

  confirmRoleName() {
    this.newRoleForm.get('roleName').disable();
    this.isDisabled.roleName = true;
    this.isHidden.fields = false;

    this.isHidden.orgFieldCancelBtn = true;
  }

  cancelRoleName() {
    this.newRoleForm.get('roleName').enable();
    this.isDisabled.roleName = false;
    this.isHidden.fields = true;
    this.isHidden.orgFieldCancelBtn = true;

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

  checkRoleName() {
    let roleName: string = this.newRoleForm.get('roleName').value.trim();

    if (roleName && roleName.length >= 3) {
      if (roleName.charAt(roleName.length - 1) === '.') {
        roleName = roleName.substr(0, roleName.length - 1);
        this.newRoleForm.get('roleName').setValue(roleName);
      }

      // Temporarily disable role name input field to give way to checking the role
      this.newRoleForm.get('roleName').disable();


      // Enable Back
      this.isCheckingEns = true;
      let $tmpTimeout = setTimeout(() => {
        this.isCheckingEns = false;
        clearTimeout($tmpTimeout);
      }, 5000);
    }
  }

  updateEnsName(event: any) {
    let data = this.newRoleForm.getRawValue();
    let ensName = data.roleName + '.';

    switch (data.roleType) {
      case RoleType.ORG:
        ensName += data.org;
        break;
      case RoleType.APP:
        ensName += data.app;
        break;
      case RoleType.CUSTOM:
        ensName += 'roles.iam.ewc';
        break;
    }

    this.newRoleForm.get('ensName').setValue(ensName);
  }

  alphabetOnly(event: any, includePoint?: boolean): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // 96 = a, 122 = z
    if ((charCode > 96 && charCode < 123) || (charCode === 46 && (this.newRoleForm.get('roleType').value === 'CUSTOM' || includePoint))) {
      return true;
    }

    return false;
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

  save() {
    this.isLoading = true;
    let $tmpTimeout = setTimeout(() => {
      this.isLoading = false;

      this.dialogRef.close(true);
      clearTimeout($tmpTimeout);
    }, 5000);
  }
}
