import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog';

export const RoleType = {
  ORG: 'Organization',
  APP: 'Application',
  CUSTOM: 'Custom'
};

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
  RoleTypes     = RoleType;
  FieldTypes    = FIELD_TYPES;
  newRoleForm   : FormGroup;
  isSubmitting  = false;
  isCheckingEns = false;
  isLoading     = false;
  orgList       = [];
  appList       = [];
  isHidden      = {
    appField: false,
    orgField: false
  };

  // Field Form Data
  fieldsForm      : FormGroup;
  showFieldsForm  = false;
  isEditFieldForm = false;
  displayedColumns: string[] = ['type', 'label', 'validation', 'actions'];
  dataSource = new MatTableDataSource([]);

  constructor(public dialogRef: MatDialogRef<NewRoleComponent>,
      private fb: FormBuilder,
      private changeDetectorRef: ChangeDetectorRef) {
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

  private enableRoleName() {
    this.newRoleForm.get('roleName').enable();
    this.roleNameInput.nativeElement.focus();
  }

  private disableRoleName() {
    this.newRoleForm.get('roleName').reset();
    this.newRoleForm.get('ensName').reset();
    this.newRoleForm.get('roleName').disable();
  }

  roleTypeChanged(data: any) {
    // Reset values
    this.isHidden.orgField = false;
    this.isHidden.appField = false;
    this.newRoleForm.patchValue({
      org: null,
      app: null
    });

    if (['ORG', 'APP'].indexOf(data.value) >= 0) {
      // Reset Org List
      this.orgList.length = 0;
      this.orgList.push('Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan','B','The Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','C','Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo, Democratic Republic of the','Congo, Republic of the','Costa Rica','Côte d’Ivoire','Croatia','Cuba','Cyprus','Czech Republic','D','Denmark','Djibouti','Dominica','Dominican Republic','E','East Timor (Timor-Leste)','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','F','Fiji','Finland','France','G','Gabon','The Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','H','Haiti','Honduras','Hungary','I','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','J','Jamaica','Japan','Jordan','K','Kazakhstan','Kenya','Kiribati','Korea, North','Korea, South','Kosovo','Kuwait','Kyrgyzstan','L','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','M','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia, Federated States of','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar (Burma)','N','Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Macedonia','Norway','O','Oman','P','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Q','Qatar','R','Romania','Russia','Rwanda','S','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','Spain','Sri Lanka','Sudan','Sudan, South','Suriname','Sweden','Switzerland','Syria','T','Taiwan','Tajikistan','Tanzania','Thailand','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','U','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','V','Vanuatu','Vatican City','Venezuela','Vietnam','Y','Yemen','Z','Zambia','Zimbabwe');

      // Show organization field
      this.isHidden.orgField = true;
      
      // Disable Role Name
      this.disableRoleName();
    }
    else {
      // Enable Role Name
      this.enableRoleName();
    }
  }

  orgSelected(event: any) {
    let roleType = this.newRoleForm.get('roleType').value;

    // Disable Role Name
      this.disableRoleName();

    if (roleType === 'APP') {
      // Reset App Value
      this.newRoleForm.get('app').reset();

      // Show application field
      this.isHidden.appField = true;
    }
    else if ((roleType === 'ORG' && this.newRoleForm.get('org').value.trim()) || roleType === 'CUSTOM') {
      // Enable Role Name
      this.enableRoleName();
    }
  }

  appSelected() {
    // Enable Role Name
    this.enableRoleName();
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
        this.enableRoleName();
        this.isCheckingEns = false;
        clearTimeout($tmpTimeout);
      }, 5000);
    }
  }

  updateEnsName(event: any) {
    this.newRoleForm.get('ensName').setValue(this.newRoleForm.get('roleName').value + '.iam.ewc');
  }

  alphabetOnly(event: any): boolean {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // 96 = a, 122 = z
    if ((charCode > 96 && charCode < 123) || (charCode === 46 && this.newRoleForm.get('roleType').value === 'CUSTOM')) {
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
