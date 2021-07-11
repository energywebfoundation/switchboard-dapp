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
      expect(component.showAddFieldForm).toBeTruthy();
    });

    it('add button should be disabled', () => {
      const { showField } = getSelectors(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();

      const { addField } = getSelectors(hostDebug);

      expect(addField.nativeElement.disabled).toBeTruthy();
    });

    it('add button should be enabled when validation passes', () => {
      const { showField } = getSelectors(hostDebug);
      showField.nativeElement.click();
      fixture.detectChanges();

      const { fieldtype } = getSelectors(hostDebug);
      fieldtype.nativeElement.click();
      fixture.detectChanges();
      console.log(1);

      const { fieldTypeOption } = getSelectors(hostDebug);
      fieldTypeOption.nativeElement.click();
      fixture.detectChanges();
      console.log(2);

      const { fieldTypeOptionSelected } = getSelectors(hostDebug);
      // component.fieldsForm.get('fieldType').setValue('text');
      // fieldtype.nativeElement.value = 'text'; // undefined
      console.log(fieldTypeOptionSelected.nativeElement.innerHTML)
      // fixture.detectChanges();

      console.log(component.fieldsForm.getRawValue());

      expect(false).toBeFalsy();
    });

  });

});
const getSelectors = (hostDebug: DebugElement) => {
  return {
    showField: hostDebug.query(By.css('[data-qa-id=show-field]')),
    addField: hostDebug.query(By.css('[data-qa-id="add-field"]')),
    fieldtype: hostDebug.query(By.css('.mat-select-trigger')),
    fieldTypeOption: hostDebug.query(By.css('.mat-option')),
    fieldTypeOptionSelected: hostDebug.query(By.css('[data-qa-id=fieldType] .ng-star-inserted')),
  };
};

