import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatStepper, MatTableDataSource } from '@angular/material';
import { ENSPrefixes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';

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
  }];

export interface RolesFields {
  type: string;
  label: string;
  validation: string;
  actions: string;
}

const FIELD_TYPES = [
  'text', 'number', 'date', 'boolean'
];

const TOASTR_HEADER = 'Create New Role';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  public roleForm     : FormGroup;
  public issuerGroup  : FormGroup;
  public environment  = environment;
  public isChecking   = false;
  public RoleType     = RoleType;
  public RoleTypeList = RoleTypeList;
  public ENSPrefixes  = ENSPrefixes;
  public issuerList   : string[];

  IssuerType    = {
    DID: 'DID',
    Role: 'Role'
  };

  // Fields
  public FieldTypes   = FIELD_TYPES;
  fieldsForm          : FormGroup;
  showFieldsForm      = false;
  isEditFieldForm     = false;
  displayedColumns    : string[] = ['type', 'label', 'validation', 'actions'];
  displayedColumnsView: string[] = ['type', 'label', 'validation'];
  dataSource          = new MatTableDataSource([]);

  constructor(private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewRoleComponent>,
    public dialog: MatDialog) { 
      this.roleForm = fb.group({
        roleType: [null, Validators.required],
        parentNamespace: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        roleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        namespace: '',
        data: fb.group({
          ensName: '',
          version: '1.0.0',
          issuer: fb.group({
            issuerType: this.IssuerType.DID,
            roleName: '',
            did: fb.array([])
          })
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

      this.issuerList = [];
      this.issuerList.push(this.iamService.iam.getDid());
    }

  ngOnInit() {
  }

  alphaNumericOnly(event: any, includeDot?: boolean) {
    let charCode = (event.which) ? event.which : event.keyCode;
    
    // Check if key is alphanumeric key
    if ((charCode > 96 && charCode < 123) || (charCode > 47 && charCode < 58) || (includeDot && charCode === 46)) {
      return true;
    }

    return false;
  }

  issuerTypeChanged(data: any) {
    this.issuerGroup.reset();

    // Reset DID List
    if (this.issuerList.length > 0) {
      this.issuerList.splice(0, this.issuerList.length);
    }

    // Clear Role
    this.roleForm.get('data').get('issuer').get('roleName').reset();

    if (this.IssuerType.DID === data.value) {
      // Set current user's DID
      this.issuerList.push(this.iamService.iam.getDid());
    }
  }

  back() {
    this.stepper.steps.toArray()[this.stepper.selectedIndex - 1].editable = true;
    this.stepper.previous();
    this.stepper.selected.completed = false;
  }

  addDid() {
    let newIssuerDid = this.issuerGroup.get('newIssuer').value.trim();

    if (!newIssuerDid) {
      this.toastr.error('Issuer DID is empty.', TOASTR_HEADER);
      return;
    }

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

  deleteField(i: number) {
    let list = this.dataSource.data;
    list.splice(i, 1);
    this.dataSource.data = [...list];
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

  async proceedSettingIssuer() {
    this.spinner.show();
    this.isChecking = true;

    if (this.roleForm.value.roleName) {
      // Check if namespace is taken
      let orgData = this.roleForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.roleName}.${ENSPrefixes.Roles}.${orgData.parentNamespace}`
      });

      if (exists) {
        // Do not allow to proceed if namespace already exists
        this.toastr.error('Role namespace already exists.', TOASTR_HEADER);
      }
      else {
        // Proceed
        this.roleForm.get('data').get('issuer').get('issuerType').setValue(this.IssuerType.DID);
        this.stepper.selected.editable = false;
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
    }
    else {
      this.toastr.error('Form is invalid.', TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  proceedAddingFields() {
    let issuerType = this.roleForm.value.data.issuer.issuerType;
    if (this.IssuerType.DID === issuerType && !this.issuerList.length) {
      this.toastr.error('Issuer list is empty.', TOASTR_HEADER);
    }
    else if (this.IssuerType.Role === issuerType && !this.roleForm.value.data.issuer.roleName) {
      this.toastr.error('Issuer Role is empty.', TOASTR_HEADER);
    }
    else {
      // Proceed to Adding Fields Step
      this.stepper.selected.editable = false;
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }

  proceedConfirmDetails() {
    this.stepper.selected.editable = false;
    this.stepper.selected.completed = true;
    this.stepper.next();
  }

  async confirmParentNamespace() {
    if (this.roleForm.value.parentNamespace) {
      try {
        this.spinner.show();
        this.isChecking = true;
        
        // Check if namespace exists
        let exists = await this.iamService.iam.checkExistenceOfDomain({
          domain: this.roleForm.value.parentNamespace
        });

        // TODO: check if namespace is a valid org or app namespace
        
        if (exists) {
          // Check if role sub-domain exists in this namespace
          exists = await this.iamService.iam.checkExistenceOfDomain({
            domain: `${ENSPrefixes.Roles}.${this.roleForm.value.parentNamespace}`
          });

          if (exists) {
            // check if user is authorized to create a role under this namespace
            let isOwner = await this.iamService.iam.isOwner({
              domain: this.roleForm.value.parentNamespace
            });

            if (isOwner) {
              this.roleForm.get('roleName').reset();
              this.stepper.selected.editable = false;
              this.stepper.selected.completed = true;
              this.stepper.next();
            }
            else {
              this.toastr.error('You are not authorized to create a role under this namespace.', TOASTR_HEADER);
            }
          }
          else {
            this.toastr.error('Role subdomain in this namespace does not exist.', TOASTR_HEADER);
          }
        }
        else {
          this.toastr.error('Namespace does not exist.', TOASTR_HEADER);
        }
      }
      catch (e) {
        this.toastr.error(e.message, 'System Error');
      } 
      finally {
        this.isChecking = false;
        this.spinner.hide();
      }
    }
  }

  async confirmRole() {
    let req = { ...this.roleForm.value, returnSteps: true };

    req.namespace = `${ENSPrefixes.Roles}.${req.parentNamespace}`;
    delete req.parentNamespace;

    req.data.roleType = req.roleType;
    delete req.roleType;

    req.data.issuer.did = this.issuerList;
    req.data.fields = this.dataSource.data;
    req.data = JSON.stringify(req.data);
    
    console.log('req', req);

    // Set the second step to non-editable
    let list = this.stepper.steps.toArray();
    list[1].editable = false;

    try {
      // Retrieve the steps to create an application
      let steps = await this.iamService.iam.createRole(req);
      for (let index = 0; index < steps.length; index++) {
        let step = steps[index];
        console.log('Processing', step.info);
        
        // Show the next step
        this.stepper.selected.completed = true;
        this.stepper.next();

        // Process the next steap
        await step.next();
        this.toastr.info(step.info, `Transaction Success (${index + 1}/${steps.length})`);
      }

      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
    catch (e) {
      console.error('New Role Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  closeDialog(isSuccess?: boolean) {
    if (this.roleForm.pristine) {
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          header: TOASTR_HEADER,
          message: 'There are unsaved changes. Do you wish to continue?'
        },
        maxWidth: '100%',
        disableClose: true
      }).afterClosed().subscribe((exit: any) => {
        if (exit) {
          this.dialogRef.close(false);
        }
      });
    }
    else {
      if (isSuccess) {
        this.toastr.success('Role is successfully created.', TOASTR_HEADER);
      }
      this.dialogRef.close(isSuccess);
    }
  }
}
