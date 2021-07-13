import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableDataSource } from '@angular/material/table';

import { RoleFieldComponent } from './role-field.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

fdescribe('RoleFieldComponent', () => {
  let component: RoleFieldComponent;
  let fixture: ComponentFixture<RoleFieldComponent>;
  let hostDebug: DebugElement;
  let host: HTMLElement;

  const dispatchEvent = (el) => {
    el.nativeElement.dispatchEvent(new Event('input'));
    el.nativeElement.dispatchEvent(new Event('blur'));
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RoleFieldComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule,
        MatCheckboxModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFieldComponent);

    const fb = new FormBuilder();
    const dataSource = new MatTableDataSource([]);

    component = fixture.componentInstance;
    component.fieldsForm = fb.group({
      fieldType: [''],
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
    component.dataSource = dataSource;
    hostDebug = fixture.debugElement;
    host = hostDebug.nativeElement;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add field button', () => {

    it('should open form to add field', () => {
      const { showField } = getSelectors(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();

      expect(component.showFieldsForm).toBeTruthy();
    });

    it('add button should be disabled', () => {
      const { showField } = getSelectors(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();

      const { addField } = getSelectors(hostDebug);

      expect(addField.nativeElement.disabled).toBeTruthy();
    });

    it('add button should be enabled when validation passes', () => {
      addFieldToRole();
      
      const { addField } = getSelectors(hostDebug);
      expect(addField.nativeElement.disabled).toBeFalsy();
    });

    it('add button adds user selected values to list of fields and form hidden', () => {
      addFieldToRole();
      
      let user: any;
      component.updateDataSourceEvent.subscribe(value => user = value);

      const { addField } = getSelectors(hostDebug);
      addField.nativeElement.click();
      fixture.detectChanges();
      
      expect(user[0].fieldType).toBe('text');      
      expect(user[0].label).toBe('Test');
      expect(component.showFieldsForm).toBeFalsy();     
    });

  });

  describe('edit field button', () => {

    it('edit button should open form to edit field with correct selected values', () => {
      addFieldToRole();
      editFieldAdded();
      
      const fieldsValue = component.fieldsForm.getRawValue();

      expect(component.showFieldsForm).toBeTruthy();
      expect(fieldsValue.fieldType).toBe('text');
      expect(fieldsValue.label).toBe('Test');
    });

    it('update button should replace old data and close form', () => {
      addFieldToRole();
      editFieldAdded();

      selectFieldTypeAndLabel(1, 'Edit Label');

      component.updateDataSourceEvent.subscribe(value => {
        component.dataSource.data = [...value];
        fixture.detectChanges();
      });
  
      const { updateField } = getSelectors(hostDebug);
      updateField.nativeElement.click();
      fixture.detectChanges();

      const field = component.dataSource.data;
      expect(field[0].fieldType).toBe('number');
      expect(field[0].label).toBe('Edit Label');
      expect(component.showFieldsForm).toBeFalsy();
    });

  })

  function addFieldToRole() {
    const { showField } = getSelectors(hostDebug);
    showField.nativeElement.click();
    fixture.detectChanges();

    selectFieldTypeAndLabel(0, 'Test');
  }

  function editFieldAdded() {

    component.updateDataSourceEvent.subscribe(value => {
      component.dataSource.data = [...value];
      fixture.detectChanges();
    });

    const { addField } = getSelectors(hostDebug);
    addField.nativeElement.click();
    fixture.detectChanges();

    const { editField } = getSelectors(hostDebug);
    editField.nativeElement.click();
    fixture.detectChanges();
  }

  function selectFieldTypeAndLabel(option: number, labelText: string) {

    const { fieldtype } = getSelectors(hostDebug);
    fieldtype.nativeElement.click();
    fixture.detectChanges();

    const { fieldTypeOptionAll } = getSelectors(hostDebug);
    const { fieldLabel } = getSelectors(hostDebug);
    fieldTypeOptionAll[option].nativeElement.click();
    fieldLabel.nativeElement.value = labelText;
    
    dispatchEvent(fieldLabel);
    fixture.detectChanges();
  }

});

const getSelectors = (hostDebug: DebugElement) => {
  return {
    showField: hostDebug.query(By.css('[data-qa-id=show-field]')),
    addField: hostDebug.query(By.css('[data-qa-id="add-field"]')),
    updateField: hostDebug.query(By.css('[data-qa-id="update-field"]')),
    fieldtypeSelect: hostDebug.query(By.css('[data-qa-id="field-type"]')),
    fieldtype: hostDebug.query(By.css('.mat-select-trigger')),
    fieldLabel: hostDebug.query(By.css('[data-qa-id="field-label"]')),
    fieldTypeOptionAll: hostDebug.queryAll(By.css('.mat-option')),
    fieldTypeOptionSelected: hostDebug.query(By.css('[data-qa-id=fieldType] .ng-star-inserted')),
    editField: hostDebug.query(By.css('[data-qa-id="edit-field"]')),
  };
};

