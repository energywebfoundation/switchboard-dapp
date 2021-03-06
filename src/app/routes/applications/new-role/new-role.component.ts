import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger, MatDialog, MatDialogRef, MatStepper, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { ENSNamespaceTypes, PreconditionTypes } from 'iam-client-lib';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { ListType } from 'src/app/shared/constants/shared-constants';
import { FieldValidationService } from 'src/app/shared/services/field-validation.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { IamService } from 'src/app/shared/services/iam.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../widgets/confirmation-dialog/confirmation-dialog.component';
import { ViewType } from '../new-organization/new-organization.component';
import { Observable } from 'rxjs';

export const RoleType = {
  ORG: 'org',
  APP: 'app',
  CUSTOM: 'custom'
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

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit, AfterViewInit {
  private stepper: MatStepper;
  @ViewChild('stepper', { static: false }) set content(content: MatStepper) {
    if (content) {
      this.stepper = content;
    }
  }
  @ViewChild(MatAutocompleteTrigger, { static: false}) autocompleteTrigger: MatAutocompleteTrigger;

  public roleForm     : FormGroup;
  public issuerGroup  : FormGroup;
  public roleControl  : FormControl;
  public environment  = environment;
  public isChecking   = false;
  public RoleType     = RoleType;
  public RoleTypeList = RoleTypeList;
  public ENSPrefixes  = ENSNamespaceTypes;
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
  isAutolistLoading   = false;
  hasSearchResult     = true;
  displayedColumnsView: string[] = ['type', 'label', 'required', 'minLength', 'maxLength', 'pattern', 'minValue', 'maxValue'];
  displayedColumns    : string[] = [...this.displayedColumnsView, 'actions'];
  dataSource          = new MatTableDataSource([]);
  rolenamespaceList   : Observable<any[]>;

  public ViewType = ViewType;
  viewType: string = ViewType.NEW;
  origData: any;

  private TOASTR_HEADER = 'Create New Role';

  public txs: any[];
  private _retryCount = 0;
  private _currentIdx = 0;
  private _requests = {};
  private _onSearchKeywordInput$ : any;

  constructor(private fb: FormBuilder,
    private iamService: IamService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fieldValidationService: FieldValidationService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<NewRoleComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configService: ConfigService) {
      this.roleForm = fb.group({
        roleType: [null, Validators.required],
        parentNamespace: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        roleName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(256)])],
        namespace: '',
        data: fb.group({
          version: '1.0.0',
          issuer: fb.group({
            issuerType: this.IssuerType.DID,
            roleName: '',
            did: fb.array([])
          }),
          enrolmentPreconditions: [[{ type: PreconditionTypes.Role, conditions: []}]]
        })
      });

      this.fieldsForm = fb.group({
        fieldType: ['', Validators.required],
        label: ['', Validators.required],
        validation: fb.group({
          required: undefined,
          minLength: [undefined, {
            validators: Validators.min(0),
            updateOn: 'blur'
          }],
          maxLength: [undefined, {
            validators: Validators.min(1),
            updateOn: 'blur'
          }],
          pattern: undefined,
          minValue: [undefined, {
            updateOn: 'blur'
          }],
          maxValue: [undefined, {
            updateOn: 'blur'
          }],
          minDate: undefined,
          maxDate: undefined
        })
      });
      this._induceInt();
      this._induceRanges();

      // Init Issuer Fields
      this.issuerGroup = fb.group({
        newIssuer: ['', this.iamService.isValidDid]
      });
      this.issuerList = [];
      this.issuerList.push(this.iamService.iam.getDid());

      // Init Restriction Fields
      this.roleControl = fb.control('');
      this.rolenamespaceList = this.roleControl.valueChanges.pipe(
        debounceTime(1200),
        startWith(''),
        switchMap(async (value) => await this._searchRoleNamespace(value))
      );
      this._onSearchKeywordInput$ = this.roleControl.valueChanges.pipe(
        switchMap(async (value) => await this._handleKeywordChanged(value))
      ).subscribe();

      this._init(data);
    }

  async ngAfterViewInit() {
    await this.confirmParentNamespace();
  }

  ngOnInit() {
  }

  private _init(data: any) {
    if (data && data.viewType) {
      this.viewType = data.viewType;

      if (this.viewType === ViewType.UPDATE && data.origData) {
        this.origData = data.origData;
        this.TOASTR_HEADER = 'Update Role';
      }
      else if (this.viewType === ViewType.NEW && data.namespace) {
        let tmp = {
          parentNamespace: data.namespace,
          roleType: undefined
        };

        if (data.listType === ListType.ORG) {
          tmp.roleType = RoleType.ORG;
        }
        else if (data.listType === ListType.APP) {
          tmp.roleType = RoleType.APP;
        }

        this.roleForm.patchValue(tmp);
      }

      this._initFormData();
    }
  }

  private _initFormData() {
    if (this.origData) {
      let def = this.origData.definition;

      // Construct Parent Namespace
      let arrParentNamespace = this.origData.namespace.split(ENSNamespaceTypes.Roles);
      let parentNamespace = arrParentNamespace[1].substring(1);

      // Construct Version
      let arrVersion = def.version.split('.');
      let version = `${parseInt(arrVersion[0]) + 1}.0.0`;

      // Construct Fields
      this.dataSource.data = def.fields ? [...def.fields] : [];
      this._initDates();

      this.roleForm.patchValue({
        roleType: def.roleType,
        parentNamespace: parentNamespace,
        roleName: def.roleName,
        namespace: `${this.ENSPrefixes.Roles}.${parentNamespace}`,
        data: {
          version: version,
          issuer: {
            issuerType: def.issuer.issuerType,
            roleName: def.issuer.roleName,
            did: def.issuer.did ? [...def.issuer.did] : []
          },
          enrolmentPreconditions: this._initPreconditions(def.enrolmentPreconditions)
        }
      });

      if (def.issuer.did && def.issuer.did.length) {
        this.issuerList = [...def.issuer.did];
      }
    }
  }

  private _initPreconditions(preconditionList: any[]) {
    let retVal = [];

    if (preconditionList) {
      for (let precondition of preconditionList) {
        if (precondition.conditions) {
          retVal.push(precondition);
        }
      }
    }
    
    return retVal;
  }

  private _initDates() {
    if (this.dataSource.data) {
      for (let data of this.dataSource.data) {
        if (data.fieldType === 'date') {
          if (data.maxDate) {
            data.maxDate = new Date(data.maxDate);
          }
          if (data.minDate) {
            data.minDate = new Date(data.minDate);
          }
        }
      }
    }
  }

  private _induceInt() {
    let minLength = this.fieldsForm.get('validation').get('minLength');
    let maxLength = this.fieldsForm.get('validation').get('maxLength');

    minLength.valueChanges.subscribe(data => {
      if (data) {
        minLength.setValue(parseInt(data), { emitEvent: false });
      }
    });

    maxLength.valueChanges.subscribe(data => {
      if (data) {
        maxLength.setValue(parseInt(data), { emitEvent: false });
      }
    });
  }

  private _induceRanges() {
    // Min & Max Length Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minLength'),
      this.fieldsForm.get('validation').get('maxLength')
    );

    // Min & Max Value Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minValue'),
      this.fieldsForm.get('validation').get('maxValue')
    );

    // Min & Max Date Range
    this.fieldValidationService.autoRangeControls(
      this.fieldsForm.get('validation').get('minDate'),
      this.fieldsForm.get('validation').get('maxDate')
    );
  }

  alphaNumericOnly(event: any, includeDot?: boolean) {
    return this.iamService.isAlphaNumericOnly(event, includeDot);
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
      this.toastr.error('Issuer DID is empty.', this.TOASTR_HEADER);
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
      this.dataSource.data = [...this.dataSource.data, this._extractValidationObject(this.fieldsForm.value)];
      this.fieldsForm.reset();
      this.showFieldsForm = false;
      this.changeDetectorRef.detectChanges();
    }
  }

  private _extractValidationObject(value: any) {
    let retVal: any = value;

    if (value && value.fieldType) {
      let validation = undefined;
      let { 
        required,
        minLength,
        maxLength,
        pattern,
        minValue,
        maxValue,
        minDate,
        maxDate
      } = value.validation;

      switch (this.fieldsForm.value.fieldType) {
        case 'text':
          validation = {
            required,
            minLength,
            maxLength,
            pattern
          };
          break;
        case 'number':
          validation = {
            required,
            minValue,
            maxValue
          };
          break;
        case 'date':
          minDate = minDate;// this._getDate(minDate);
          maxDate = maxDate;// this._getDate(maxDate);
          validation = {
            required,
            minDate,
            maxDate
          };
          break;
        case 'boolean':
          validation = {
            required
          };
          break;
        default: 
          validation = value.validation;
      }
      retVal = JSON.parse(JSON.stringify(Object.assign(retVal, validation)));
      delete retVal.validation;
    }

    return retVal;
  }

  private _getDate(origDate: any) {
    let retVal = origDate;

    if (origDate) {
      retVal = origDate.getTime();
    }

    return retVal;
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
      let allowToProceed = true;
      
      // Check if namespace is taken
      let orgData = this.roleForm.value;
      let exists = await this.iamService.iam.checkExistenceOfDomain({
        domain: `${orgData.roleName}.${this.ENSPrefixes.Roles}.${orgData.parentNamespace}`
      });

      if (exists) {
        // If exists check if current user is the owner of this namespace and allow him/her to overwrite
        let isOwner = await this.iamService.iam.isOwner({
          domain: `${orgData.roleName}.${this.ENSPrefixes.Roles}.${orgData.parentNamespace}`
        });

        if (!isOwner) {
          allowToProceed = false;

          // Do not allow to proceed if namespace already exists
          this.toastr.error('Role namespace already exists. You have no access rights to it.', this.TOASTR_HEADER);
        }
        else {
          this.spinner.hide();
          
          // Prompt if user wants to overwrite this namespace
          if (!await this.confirm('Role namespace already exists. Do you wish to continue?')) {
            allowToProceed = false;
          }
          else {
            this.spinner.show();
          }
        }
      }

      if (allowToProceed) {
        // Proceed
        this.roleForm.get('data').get('issuer').get('issuerType').setValue(this.IssuerType.DID);
        this.stepper.selected.editable = false;
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
    }
    else {
      this.toastr.error('Form is invalid.', this.TOASTR_HEADER);
    }

    this.isChecking = false;
    this.spinner.hide();
  }

  async proceedAddingFields() {
    let issuerType = this.roleForm.value.data.issuer.issuerType;
    if (this.IssuerType.DID === issuerType && !this.issuerList.length) {
      this.toastr.error('Issuer list is empty.', this.TOASTR_HEADER);
    }
    else if (this.IssuerType.Role === issuerType && !this.roleForm.value.data.issuer.roleName) {
      this.toastr.error('Issuer Role is empty.', this.TOASTR_HEADER);
    }
    else {
      let allowToProceed = true;
      if (this.IssuerType.Role === issuerType) {
        this.spinner.show();

        // Check if rolename exists or valid
        let exists = await this.iamService.iam.checkExistenceOfDomain({
          domain: this.roleForm.value.data.issuer.roleName
        });

        if (!exists || !this.roleForm.value.data.issuer.roleName.includes(`.${ENSNamespaceTypes.Roles}.`)) {
          this.toastr.error('Issuer Role Namespace does not exist or is invalid.', this.TOASTR_HEADER);
          allowToProceed = false;
        }
        else {
          // Check if there are approved users to issue the claim
          let did = await this.iamService.iam.getRoleDIDs({
            namespace: this.roleForm.value.data.issuer.roleName
          });

          if (!did || !did.length) {
            allowToProceed = false;
            this.toastr.error('Issuer Role has no approved users.', this.TOASTR_HEADER);
          }
        }

        this.spinner.hide();
      }
      
      if (allowToProceed) {
        // Proceed to Adding Fields Step
        this.stepper.selected.editable = false;
        this.stepper.selected.completed = true;
        this.stepper.next();
      }
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
        
        if (exists) {
          // Check if role sub-domain exists in this namespace
          exists = await this.iamService.iam.checkExistenceOfDomain({
            domain: `${this.ENSPrefixes.Roles}.${this.roleForm.value.parentNamespace}`
          });

          if (exists) {
            // check if user is authorized to create a role under this namespace
            let isOwner = await this.iamService.iam.isOwner({
              domain: this.roleForm.value.parentNamespace
            });

            if (!isOwner) {
              this.toastr.error('You are not authorized to create a role under this namespace.', this.TOASTR_HEADER);
              this.dialog.closeAll();
            }
          }
          else {
            this.toastr.error('Role subdomain in this namespace does not exist.', this.TOASTR_HEADER);
            this.dialog.closeAll();
          }
        }
        else {
          this.toastr.error('Namespace does not exist.', this.TOASTR_HEADER);
          this.dialog.closeAll();
        }
      }
      catch (e) {
        this.toastr.error(e.message, 'System Error');
        this.dialog.closeAll();
      } 
      finally {
        this.isChecking = false;
        this.spinner.hide();
      }
    }
    else {
      this.toastr.error('Parent Namespace is missing.', this.TOASTR_HEADER);
      this.dialog.closeAll();
    }
  }

  async confirmRole(skipNextStep?: boolean) {
    let req = JSON.parse(JSON.stringify({ ...this.roleForm.value, returnSteps: true }));

    req.namespace = `${this.ENSPrefixes.Roles}.${req.parentNamespace}`;
    delete req.parentNamespace;

    req.data.roleType = req.roleType;
    delete req.roleType;

    req.data.roleName = req.roleName;

    req.data.issuer.did = this.issuerList;
    req.data.fields = this.dataSource.data;
    req.data.metadata = {};

    if (!skipNextStep) {
      // Set the second step to non-editable
      let list = this.stepper.steps.toArray();
      list[1].editable = false;
    }

    console.log('req', req);

    if (this.viewType === ViewType.UPDATE) {
      this.proceedUpdateStep(req, skipNextStep);
    }
    else {
      this.proceedCreateSteps(req);
    }
  }

  private async next(requestIdx: number, skipNextStep?: boolean) {
    let steps = this._requests[`${requestIdx}`];

    if (steps && steps.length) {
      let step = steps[0];

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
        this.toastr.info(step.info, `Transaction Success (${this._currentIdx}/${this.txs.length})`);

        // Remove 1st element
        steps.shift();

        // Process
        await this.next(requestIdx);
      }
    }
    else if (this._requests['0']) {
      // Move to Complete Step
      this.stepper.selected.completed = true;
      this.stepper.next();
    }
  }

  private async proceedCreateSteps(req: any) {
    const returnSteps = this.data.owner === this.iamService.iam.address;
    req = { ...req, returnSteps };
    try {
      const call = this.iamService.iam.createRole(req);
      // Retrieve the steps to create an organization
      this.txs = returnSteps ?
        await call :
        [{
          info: 'Confirm transaction in your safe wallet',
          next: async () => await call
        }];
      // Retrieve the steps to create an application
      this._requests[`${this._retryCount}`] = [...this.txs];

      // Process
      await this.next(0);
    }
    catch (e) {
      console.error('New Role Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  async retry() {
    if (this.viewType !== ViewType.UPDATE) {
      // Copy pending steps
      this._requests[`${this._retryCount + 1}`] = [...this._requests[`${this._retryCount}`]];

      //Remove previous request
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
      }
      catch (e) {
        console.error('New Role Error', e);
        this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
      }
    }
    else {
      delete this._requests[`${this._retryCount++}`];
      await this.confirmRole(true);
    }
  }

  private async proceedUpdateStep(req: any, skipNextStep?: boolean) {
    try {
      let retryCount = this._retryCount;
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
          next: async () => await this.iamService.iam.setRoleDefinition({
            data: req.data,
            domain: newDomain
          })
        }
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
    }
    catch (e) {
      console.error('Update Role Error', e);
      this.toastr.error(e.message || 'Please contact system administrator.', 'System Error');
    }
  }

  private async confirm(confirmationMsg: string, isDiscardButton?: boolean) {
    return this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      maxHeight: '195px',
      data: {
        header: this.TOASTR_HEADER,
        message: confirmationMsg,
        isDiscardButton: isDiscardButton
      },
      maxWidth: '100%',
      disableClose: true
    }).afterClosed().toPromise();
  }

  async closeDialog(isSuccess?: boolean) {
    if (this.roleForm.touched && !isSuccess) {
      if (await this.confirm('There are unsaved changes.', true)) {
        this.dialogRef.close(false);
      }
    }
    else {
      if (isSuccess) {
        if (this.origData) {
          this.toastr.success('Role is successfully updated.', this.TOASTR_HEADER);
        }
        else {
          this.toastr.success('Role is successfully created.', this.TOASTR_HEADER);
        }
      }
      this.dialogRef.close(isSuccess);
    }
  }

  private async _searchRoleNamespace(keyword: any): Promise<any[]> {
    if (this.autocompleteTrigger) {
      this.autocompleteTrigger.closePanel();
    }
    
    this.isAutolistLoading = true;
    let retVal = [];

    if (keyword) {
      let word = undefined;
      if (!keyword.trim && keyword.name) {
        word = keyword.name;
      } else {
        word = keyword.trim();
      }

      if (word.length > 2) {
        word = word.toLowerCase();
        try {
          retVal = await this.iamService.iam.getENSTypesBySearchPhrase({
            search: word,
            types: ['Role']
          });

          if (retVal && retVal.length) {
            this.hasSearchResult = true;
            if (this.autocompleteTrigger) {
              this.autocompleteTrigger.openPanel();
            }
          }
        }
        catch (e) {
          this.toastr.error('Could not load search result.', 'Server Error');
        }
      }
    }
    this.isAutolistLoading = false;
    return retVal;
  }

  displayFn(selected: any) {
    return selected && selected.namespace ? selected.namespace : '';
  }

  onSelectedItem(event: any) {
    // Make sure that enrolmentPreconditions field exists
    let enrolmentPreconditions = this.roleForm.get('data').get('enrolmentPreconditions');
    if (!enrolmentPreconditions || !enrolmentPreconditions.value || !enrolmentPreconditions.value.length) {
      this.roleForm.get('data').get('enrolmentPreconditions').setValue([{ type: PreconditionTypes.Role, conditions: []}]);
      enrolmentPreconditions = this.roleForm.get('data').get('enrolmentPreconditions');
    }

    // Make sure that conditions field exists
    let conditions = enrolmentPreconditions.value[0].conditions;
    if (!enrolmentPreconditions) {
      conditions = this.roleForm.get('data').get('enrolmentPreconditions').value[0].conditions = [];
    }

    // Check if item is already added
    if (conditions.includes(event.option.value.namespace)) {
      this.toastr.warning('Role already exists in the list.');
    }
    else {
      conditions.push(event.option.value.namespace);
      this.clearSearchTxt();
    }
  }

  private _

  clearSearchTxt() {
    this.roleControl.setValue('');
  }

  removePreconditionRole(idx: number) {
    this.roleForm.get('data').get('enrolmentPreconditions').value[0].conditions.splice(idx, 1);
  }

  private async _handleKeywordChanged(keyword: any) {
    this.hasSearchResult = true;
    if (keyword) {
      let word = undefined;
      if (!keyword.trim && keyword.name) {
        word = keyword.name;
      } else {
        word = keyword.trim();
      }
      if (!this.isAutolistLoading && word.length > 2) {
        this.hasSearchResult = false;
      }
    }
  }
}
